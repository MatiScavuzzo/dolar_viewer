import unittest

from scraper import parsear_cotizaciones, parsear_importe

FILA = "<tr><td>Dolar U.S.A</td><td>{compra}</td><td>{venta}</td><td>29/10/2026</td></tr>"
TABLA = """
<div id="tablaCotizaciones"><table>
  <thead><tr><th>Monedas</th><th>Compra</th><th>Venta</th><th>Fecha</th></tr></thead>
  <tbody>{filas}</tbody>
</table></div>
"""


class ParsearCotizacionesTest(unittest.TestCase):
    def test_lee_la_fila_del_bna(self):
        html = TABLA.format(filas=FILA.format(compra="1510,0000", venta="1560,0000"))
        self.assertEqual(
            parsear_cotizaciones(html, "billete"),
            [
                {
                    "moneda": "Dolar U.S.A",
                    "tipo_moneda": "billete",
                    "compra": 1510.0,
                    "venta": 1560.0,
                    "fecha": "2026-10-29",
                }
            ],
        )

    def test_omite_valores_en_cero(self):
        html = TABLA.format(filas=FILA.format(compra="0,0000", venta="1560,0000"))
        self.assertEqual(parsear_cotizaciones(html, "divisa"), [])

    def test_sin_resultados_devuelve_lista_vacia(self):
        html = '<div id="tablaCotizaciones"></div><div class="sinResultados"></div>'
        self.assertEqual(parsear_cotizaciones(html, "divisa"), [])

    def test_importe_con_separador_de_miles(self):
        self.assertEqual(parsear_importe("1.510,50"), 1510.5)


if __name__ == "__main__":
    unittest.main()
