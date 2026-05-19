# Bistro Hokej Polička - premium asian demo web

Statický demo web pro **moderní asijské Bistro Hokej** v Poličce. Návrh je postavený jako prémiový cinematic restaurant web inspirovaný sushi bary, ramen bistry, Tokyo nightlife estetikou a moderním Webflow/BentoBox UX.

Demo zachovává hlavní byznysovou funkci: **online objednávku jídla k vyzvednutí na místě**.

## Veřejně ověřené údaje

- Název: Bistro Hokej
- Lokalita: Polička, Dolní Předměstí
- Adresa: Vrchlického 19, 572 01 Polička
- Telefon: +420 773 685 507
- Otevírací doba: Po-Pá 9:30-22:00, So 10:00-22:00, Ne 10:00-21:00
- Zdroj: veřejné katalogové profily včetně Firmy.cz

Menu, recenze, rezervace a online platba jsou demo prvky. Reálná nabídka, ceny, alergeny, sociální sítě a platební brána se doplní před ostrým spuštěním.

## Technologie

- HTML5
- Moderní CSS bez buildu
- Vanilla JavaScript
- GSAP + ScrollTrigger přes CDN
- Lenis smooth scrolling přes CDN
- JSON menu data
- GitHub Pages ready
- Bez WordPressu
- Bez Reactu
- Bez databáze

## Struktura

```text
.
├── index.html
├── style.css
├── script.js
├── data/
│   └── menu.json
├── robots.txt
├── sitemap.xml
└── README.md
```

## Co web obsahuje

- Fullscreen cinematic hero
- Ambient smoke, particles, cursor glow a chopstick cursor efekt
- Video hero variantu přes animovanou CSS scénu
- Dark/light mode toggle
- Luxury featured specialities
- Storytelling sekci o podniku
- Interaktivní menu načítané z `data/menu.json`
- Kategorie Sushi, Ramen, Wok, Bao, Bubble Tea, Dezerty
- Funkční košík
- Přidání do košíku, změna množství a odebrání položky
- Objednávkový formulář
- Validace jména, telefonu a času vyzvednutí
- Demo platební modal
- Simulace úspěšné platby
- Gallery masonry grid
- Testimonial carousel
- Rezervační demo formulář
- Kontaktní blok s telefonem, mapou a otevírací dobou
- Sticky floating mobile order bar
- SEO metadata, Open Graph, Schema.org Restaurant
- `robots.txt` a `sitemap.xml`

## Jak upravit menu

Menu je oddělené v souboru:

```text
data/menu.json
```

Každá položka má:

- `id`
- `category`
- `categoryLabel`
- `name`
- `description`
- `price`
- `image`
- `badge`

Provozovatel tak může měnit ceny, názvy jídel, obrázky i kategorie bez zásahu do HTML.

## Jak spustit lokálně

Kvůli načítání JSON souboru doporučuji spustit jednoduchý lokální server:

```bash
python3 -m http.server 8080
```

Poté otevřít:

```text
http://127.0.0.1:8080/
```

## Nasazení na GitHub Pages

GitHub Pages:

- Source: Deploy from branch
- Branch: `main`
- Folder: `/root`

Demo URL:

```text
https://teapackczech.github.io/bistro.hokej.web/
```

## Online platba v ostré verzi

GitHub Pages neumí bezpečně vytvářet platební session. Pro ostrý provoz je potřeba backend.

Doporučený tok:

1. Frontend odešle objednávku na backend endpoint `POST /api/create-payment`.
2. Backend vytvoří platební session u Stripe Checkout, GoPay nebo Comgate.
3. Backend vrátí `checkoutUrl`.
4. Frontend přesměruje zákazníka na platební bránu.
5. Platební brána po zaplacení zavolá webhook.
6. Backend odešle potvrzení provozovateli a zákazníkovi.

V `script.js` je připravená funkce:

```js
createPaymentSession()
```

Obsahuje místo pro budoucí napojení `/api/create-payment` a ukázkový payload objednávky.

## Co je potřeba doplnit před ostrým spuštěním

- Reálné menu
- Ceny
- Alergeny
- Skutečné fotografie podniku a jídel
- Instagram a Facebook odkazy
- Rezervační backend
- Objednávkový backend
- Platební brána
- E-mailové potvrzení objednávek
- Právní texty podle ostrého provozu

## Doporučený další krok

Schválit vizuální směr, dodat reálné menu a fotky, zvolit platební bránu a připravit backend pro objednávky a notifikace provozovně.
