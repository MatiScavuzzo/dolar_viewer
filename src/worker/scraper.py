import argparse
import os
import sys
from datetime import datetime
from zoneinfo import ZoneInfo

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from requests.adapters import HTTPAdapter
from supabase import Client, create_client
from urllib3.util.retry import Retry

URL = "https://www.bna.com.ar/Cotizador/HistoricoPrincipales"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
}
TIMEOUT_SECONDS = 30
ZONA_HORARIA = ZoneInfo("America/Argentina/Buenos_Aires")

# tipo_moneda -> parámetros del cotizador del BNA
CONSULTAS = {
    "divisa": {"id": "monedas", "idMoneda": "55"},
    "billete": {"id": "billetes", "idMoneda": "22"},
}


def convertir_fecha(fecha_bna: str) -> str:
    return datetime.strptime(fecha_bna, "%d/%m/%Y").strftime("%Y-%m-%d")


def validar_fecha(fecha: str) -> str:
    try:
        convertir_fecha(fecha)
    except ValueError as e:
        raise argparse.ArgumentTypeError(
            f"'{fecha}' no tiene el formato DD/MM/AAAA"
        ) from e
    return fecha


def parsear_importe(texto: str) -> float:
    """Convierte importes del BNA como '1510,0000' o '1.510,00' a float."""
    texto = texto.strip()
    if "," in texto:
        texto = texto.replace(".", "").replace(",", "."))
    return float(texto)


def parsear_cotizaciones(html: str, tipo_moneda: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    tabla = soup.find("div", id="tablaCotizaciones")

    if tabla is None or soup.find("div", class_="sinResultados") is not None:
        return []

    resultados = []
    for fila in tabla.find_all("tr"):
        valores = [c.get_text(strip=True) for c in fila.find_all("td")]
        if not valores:
            continue

        moneda, compra_texto, venta_texto, fecha = valores[:4]
        compra = parsear_importe(compra_texto)
        venta = parsear_importe(venta_texto)
        if compra <= 0 or venta <= 0:
            print(f"Valores inválidos para {fecha}, omitiendo.")
            continue

        resultados.append(
            {
                "moneda": moneda,
                "tipo_moneda": tipo_moneda,
                "compra": compra,
                "venta": venta,
                "fecha": convertir_fecha(fecha),
            }
        )
    return resultados


def crear_sesion() -> requests.Session:
    sesion = requests.Session()
    sesion.headers.update(HEADERS)
    reintentos = Retry(total=3, backoff_factor=2, status_forcelist=[500, 502, 503, 504])
    sesion.mount("https://", HTTPAdapter(max_retries=reintentos))
    return sesion


def obtener_cotizaciones(
    sesion: requests.Session, fecha: str, tipo_moneda: str
) -> list[dict]:
    params = {**CONSULTAS[tipo_moneda], "fecha": fecha}
    response = sesion.get(URL, params=params, timeout=TIMEOUT_SECONDS)
    response.raise_for_status()
    return parsear_cotizaciones(response.text, tipo_moneda)


def guardar_cotizacion(supabase: Client, cotizacion: dict) -> None:
    supabase.table("cotizaciones_bna").upsert(
        cotizacion, on_conflict="moneda,tipo_moneda,fecha"
    ).execute()
    print(
        f"Guardado: {cotizacion['fecha']} - {cotizacion['moneda']} ({cotizacion['tipo_moneda'].title()})"
    )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Scraper de cotizaciones de divisas y billetes BNA"
    )
    parser.add_argument(
        "--date", type=validar_fecha, help="Fecha a consultar en formato DD/MM/AAAA"
    )
    args = parser.parse_args()

    load_dotenv()
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    if not supabase_url or not supabase_key:
        print("Faltan SUPABASE_URL o SUPABASE_KEY (ver .env.example).", file=sys.stderr)
        return 1

    supabase = create_client(supabase_url, supabase_key)
    sesion = crear_sesion()
    fecha = args.date or datetime.now(ZONA_HORARIA).strftime("%d/%m/%Y")

    # Un día sin cotización (feriado) no es un error, pero una falla de red o de
    # guardado sí: el proceso termina en 1 para que GitHub Actions marque el run como fallido.
    errores = 0
    for tipo_moneda in CONSULTAS:
        try:
            for cotizacion in obtener_cotizaciones(sesion, fecha, tipo_moneda):
                guardar_cotizacion(supabase, cotizacion)
        except Exception as e:
            errores += 1
            print(f"Error con {tipo_moneda} para {fecha}: {e}", file=sys.stderr)

    return 1 if errores else 0


if __name__ == "__main__":
    sys.exit(main())
