import argparse
import os
from datetime import datetime

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


url = "https://www.bna.com.ar/Cotizador/HistoricoPrincipales"


def convertir_fecha(fecha_bna: str) -> str:
    return datetime.strptime(fecha_bna, "%d/%m/%Y").strftime("%Y-%m-%d")


def guardar_cotizacion(cotizacion: dict) -> None:
    try:
        registro = {
            "moneda": cotizacion["moneda"],
            "tipo_moneda": cotizacion["tipo_moneda"],
            "compra": cotizacion["compra"],
            "venta": cotizacion["venta"],
            "fecha": convertir_fecha(cotizacion["fecha"]),
        }
        supabase.table("cotizaciones_bna").upsert(
            registro, on_conflict="moneda,tipo_moneda,fecha"
        ).execute()
        print(
            f"Guardado: {registro['fecha']} - {registro['moneda']} ({registro['tipo_moneda'].title()})"
        )
    except Exception as e:
        print(f"Error al guardar en la base de datos: {e}")


def obtener_cotizacion_divisa(fecha: str) -> list[dict]:
    try:
        params = {
            "id": "monedas",
            "fecha": fecha,
            "idMoneda": "55",
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        }

        response = requests.get(
            url, params=params, headers=headers, verify=False, timeout=10
        )
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        tabla = soup.find("div", id="tablaCotizaciones")
        sin_resultados = soup.find("div", class_="sinResultados")

        if tabla is None or sin_resultados is not None:
            return []

        resultados = []
        filas = tabla.find_all("tr")
        for fila in filas:
            celdas = fila.find_all("td")
            if celdas:
                valores = [c.get_text(strip=True) for c in celdas]
                resultados.append(
                    {
                        "moneda": valores[0],
                        "tipo_moneda": "divisa",
                        "compra": float(valores[1].replace(",", ".")),
                        "venta": float(valores[2].replace(",", ".")),
                        "fecha": valores[3],
                    }
                )
        return resultados
    except requests.exceptions.RequestException as e:
        print(f"Error al conectar con BNA para {fecha}: {e}")
        return []


def obtener_cotizacion_billete(fecha: str) -> list[dict]:
    try:
        params = {
            "id": "billetes",
            "fecha": fecha,
            "idMoneda": "22",
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        }

        response = requests.get(
            url, params=params, headers=headers, verify=False, timeout=10
        )
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        tabla = soup.find("div", id="tablaCotizaciones")
        sin_resultados = soup.find("div", class_="sinResultados")

        if tabla is None or sin_resultados is not None:
            return []

        resultados = []
        filas = tabla.find_all("tr")
        for fila in filas:
            celdas = fila.find_all("td")
            if celdas:
                valores = [c.get_text(strip=True) for c in celdas]
                resultados.append(
                    {
                        "moneda": valores[0],
                        "tipo_moneda": "billete",
                        "compra": float(valores[1].replace(",", ".")),
                        "venta": float(valores[2].replace(",", ".")),
                        "fecha": valores[3],
                    }
                )
        return resultados

    except requests.exceptions.RequestException as e:
        print(f"Error al conectar con BNA para {fecha}: {e}")
        return []


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Scraper de cotizaciones de divisas y billetes BNA"
    )
    parser.add_argument(
        "--date", type=str, help="Fecha a consultar en formato DD/MM/YYYY"
    )
    args = parser.parse_args()

    fecha = args.date if args.date else datetime.today().strftime("%d/%m/%Y")

    for cotizacion in obtener_cotizacion_divisa(fecha):
        guardar_cotizacion(cotizacion)
    for cotizacion in obtener_cotizacion_billete(fecha):
        guardar_cotizacion(cotizacion)
