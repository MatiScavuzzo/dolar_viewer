# Dólar Viewer

Visor de las cotizaciones oficiales del dólar del **Banco de la Nación Argentina** (divisa y billete), con historial, variación diaria y gráficos.

**Demo:** [dolar-viewer.vercel.app](https://dolar-viewer.vercel.app)

## Cómo funciona

```
BNA (Cotizador histórico)
        │  scraping (requests + BeautifulSoup)
        ▼
Scraper en Python ── GitHub Actions, lun a vie, 3 veces por día
        │  upsert (moneda, tipo, fecha)
        ▼
Supabase (PostgreSQL)
        │  supabase-js
        ▼
Web en Next.js (Vercel)
```

1. **Scraper** (`src/worker/scraper.py`): consulta el cotizador histórico del BNA, extrae compra y venta del dólar divisa y del dólar billete, descarta valores inválidos y guarda cada cotización en Supabase con un *upsert*, así una misma fecha no se duplica.
2. **Programación** (`.github/workflows/scraper.yml`): GitHub Actions corre el scraper de lunes a viernes a las 10, 13 y 16 h (hora argentina). También se puede disparar a mano.
3. **Web** (`src/app`): lee las cotizaciones de Supabase y muestra tarjetas con el último valor, un gráfico de evolución y una tabla con la variación diaria. Se puede consultar un rango de fechas o un día puntual. Los días sin cotización se muestran como "S/C".

## Stack

- **Scraper:** Python 3.12, requests, BeautifulSoup, supabase-py
- **Base de datos:** Supabase (PostgreSQL)
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Recharts
- **Infraestructura:** GitHub Actions (cron) y Vercel

## Correrlo localmente

### Web

```bash
bun install
cp .env.example .env.local   # completar con los datos de tu proyecto de Supabase
bun run dev
```

Variables necesarias:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Scraper

```bash
cd src/worker
python -m venv .venv && source .venv/bin/activate
pip install -e .
python scraper.py                    # cotización de hoy
python scraper.py --date 15/10/2026  # una fecha puntual (DD/MM/AAAA)
```

Variables necesarias (copiar `src/worker/.env.example` a `src/worker/.env`, o cargarlas como secrets del repositorio para GitHub Actions):

```
SUPABASE_URL=
SUPABASE_KEY=
```

## Autor

Matías Scavuzzo · [GitHub](https://github.com/MatiScavuzzo) · [LinkedIn](https://linkedin.com/in/matiscavuzzo)
