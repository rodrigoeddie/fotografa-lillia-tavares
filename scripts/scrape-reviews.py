"""
Scraper de reviews do Google Maps usando Playwright.
Usa a página pública do Google Maps (não precisa de login).

Uso:
  pip install playwright
  playwright install chromium
  python scripts/scrape-reviews.py

O resultado será salvo em content/depoimentos/index.json
"""

import json
import time
import re
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("Instale o playwright: pip install playwright && playwright install chromium")
    exit(1)

# ============================================================
# CONFIGURAÇÃO - Altere aqui se necessário
# ============================================================

# URL pública do Google Maps do seu negócio (aba de reviews)
# Para encontrar: pesquise seu negócio no Google Maps, clique em "Reviews"
# e copie a URL. Ela deve conter algo como /place/ na URL.
GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Fot%C3%B3grafa+Lillia+Tavares"

MAX_SCROLLS = 100  # Quantas vezes rolar pra carregar mais reviews
SCROLL_PAUSE = 1.5  # Segundos entre cada scroll

OUTPUT_PATH = Path(__file__).parent.parent / "content" / "depoimentos" / "index.json"

# ============================================================


def scrape_reviews():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # headless=False para debug
        context = browser.new_context(
            locale="pt-BR",
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        print(f"Abrindo {GOOGLE_MAPS_URL}...")
        page.goto(GOOGLE_MAPS_URL, wait_until="networkidle", timeout=30000)
        time.sleep(3)

        # Aceitar cookies se aparecer
        try:
            accept_btn = page.locator('button:has-text("Aceitar"), button:has-text("Accept")')
            if accept_btn.count() > 0:
                accept_btn.first.click()
                time.sleep(2)
        except Exception:
            pass

        # Clicar na aba de avaliações/reviews
        try:
            reviews_tab = page.locator('button[aria-label*="Avaliações"], button[aria-label*="Reviews"], button:has-text("Avaliações"), button:has-text("Reviews")')
            if reviews_tab.count() > 0:
                reviews_tab.first.click()
                time.sleep(3)
                print("Aba de avaliações aberta.")
        except Exception:
            print("Não encontrou aba de avaliações, tentando continuar...")

        # Encontrar o container scrollável das reviews
        scrollable = page.locator('div.m6QErb.DxyBCb')
        if scrollable.count() == 0:
            scrollable = page.locator('div.m6QErb')

        if scrollable.count() == 0:
            print("Não encontrou container de reviews. Verifique a URL.")
            browser.close()
            return

        # Rolar para carregar todas as reviews
        print("Carregando todas as reviews (rolando a página)...")
        last_count = 0
        same_count_times = 0

        for i in range(MAX_SCROLLS):
            scrollable.first.evaluate("el => el.scrollTop = el.scrollHeight")
            time.sleep(SCROLL_PAUSE)

            # Expandir textos "Mais" / "See more"
            try:
                more_buttons = page.locator('button.w8nwRe, button:has-text("Mais"), button:has-text("See more")')
                for j in range(more_buttons.count()):
                    try:
                        more_buttons.nth(j).click(timeout=500)
                    except Exception:
                        pass
            except Exception:
                pass

            # Verificar se novas reviews carregaram
            current_count = page.locator('div.jftiEf').count()
            if current_count == 0:
                current_count = page.locator('[data-review-id]').count()

            print(f"  Scroll {i+1}: {current_count} reviews carregadas", end="\r")

            if current_count == last_count:
                same_count_times += 1
                if same_count_times >= 5:
                    print(f"\nTodas as reviews carregadas: {current_count}")
                    break
            else:
                same_count_times = 0
                last_count = current_count

        # Extrair os dados das reviews
        print("\nExtraindo dados...")
        reviews = []
        review_elements = page.locator('div.jftiEf')

        if review_elements.count() == 0:
            review_elements = page.locator('[data-review-id]')

        for i in range(review_elements.count()):
            el = review_elements.nth(i)
            try:
                # Nome
                name_el = el.locator('div.d4r55, .WNxzHc a, a[aria-label]')
                name = name_el.first.text_content().strip() if name_el.count() > 0 else "Anônimo"

                # Texto do review
                text_el = el.locator('span.wiI7pd, .review-full-text, .MyEned span')
                text = text_el.first.text_content().strip() if text_el.count() > 0 else ""

                # Estrelas (aria-label "5 estrelas" ou similar)
                stars_el = el.locator('span.kvMYJc, span[aria-label*="estrela"], span[aria-label*="star"]')
                rating = 5  # default
                if stars_el.count() > 0:
                    aria = stars_el.first.get_attribute("aria-label") or ""
                    match = re.search(r'(\d)', aria)
                    if match:
                        rating = int(match.group(1))

                # Data
                date_el = el.locator('span.rsqaWe, .dehysf')
                date_text = date_el.first.text_content().strip() if date_el.count() > 0 else ""

                # Foto do reviewer
                photo_el = el.locator('img.NBa13b, a[aria-label] img')
                photo = ""
                if photo_el.count() > 0:
                    photo = photo_el.first.get_attribute("src") or ""

                if text:  # Só adicionar se tiver texto
                    reviews.append({
                        "id": len(reviews) + 1,
                        "name": name,
                        "photo": photo,
                        "rating": rating,
                        "date": date_text,
                        "text": text
                    })
            except Exception as e:
                print(f"  Erro no review {i}: {e}")
                continue

        browser.close()

        print(f"\nTotal: {len(reviews)} reviews extraídos!")

        # Salvar no formato do content
        output = {
            "title": "O que dizem sobre mim",
            "description": f"Mais de {len(reviews)} avaliações 5 estrelas no Google. Veja o que minhas clientes falam sobre a experiência de um ensaio fotográfico comigo.",
            "reviews": reviews
        }

        OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT_PATH.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Salvo em {OUTPUT_PATH}")

        # Também salvar uma cópia raw para backup
        raw_path = Path(__file__).parent / "reviews-raw.json"
        raw_path.write_text(json.dumps(reviews, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Backup raw salvo em {raw_path}")


if __name__ == "__main__":
    scrape_reviews()
