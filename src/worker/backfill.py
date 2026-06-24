import time
from datetime import datetime, timedelta

from scraper import (
    guardar_cotizacion,
    obtener_cotizacion_billete,
    obtener_cotizacion_divisa,
)


def backfill(fecha_inicio: str, fecha_fin: str) -> None:
    inicio = datetime.strptime(fecha_inicio, "%d/%m/%Y")
    fin = datetime.strptime(fecha_fin, "%d/%m/%Y")

    fecha_actual = inicio
    while fecha_actual <= fin:
        fecha_str = fecha_actual.strftime("%d/%m/%Y")
        print(f"\n--- {fecha_str} ---")

        for cotizacion in obtener_cotizacion_divisa(fecha_str):
            guardar_cotizacion(cotizacion)

        for cotizacion in obtener_cotizacion_billete(fecha_str):
            guardar_cotizacion(cotizacion)

        time.sleep(0.5)
        fecha_actual += timedelta(days=1)


if __name__ == "__main__":
    backfill("23/08/2022", "22/06/2026")
