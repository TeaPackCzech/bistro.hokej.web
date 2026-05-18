# Bistro Hokej Polička - demo web

Statický demo web pro podnik **Bistro Hokej** v lokalitě Polička, Dolní Předměstí. Web je připravený jako prezentační návrh nové stránky s hlavní přidanou hodnotou: online objednávka jídla k vyzvednutí na místě.

Veřejně ověřené údaje použité v demu:

- Název: Bistro Hokej
- Kategorie: bistro / restaurace
- Adresa: Vrchlického 19, 572 01 Polička, Dolní Předměstí
- Telefon: +420 773 685 507
- Otevírací doba: Po-Pá 9:30-22:00, So 10:00-22:00, Ne 10:00-21:00
- Zdroj: Firmy.cz a další veřejné katalogové profily

Menu v tomto repozitáři je **ukázkové demo menu**. Není prezentované jako skutečná aktuální nabídka podniku.

## Technologie

- HTML
- CSS
- JavaScript
- Bez Reactu
- Bez Node.js
- Bez buildu
- Bez databáze
- Připraveno pro GitHub Pages

## Jak spustit lokálně

Stačí otevřít soubor `index.html` v prohlížeči.

Volitelně lze spustit jednoduchý lokální server:

```bash
python3 -m http.server 8080
```

Poté otevřít:

```text
http://127.0.0.1:8080/
```

## Jak nasadit na GitHub Pages

V repozitáři na GitHubu:

1. Otevřít `Settings`.
2. Přejít do `Pages`.
3. Nastavit `Source` na `Deploy from a branch`.
4. Nastavit `Branch` na `main`.
5. Nastavit složku na `/root`.
6. Uložit.

Předpokládaná demo URL:

```text
https://teapackczech.github.io/bistro.hokej.web/
```

## Co je hotové

- Moderní responzivní landing page pro Bistro Hokej Polička
- Sticky header s navigací a mobilním hamburger menu
- Hero sekce s jasnou výzvou k objednávce
- Ukázkové menu v kategoriích
- Funkční košík
- Přidání položek do košíku
- Zvýšení a snížení počtu kusů
- Odebrání položky z košíku
- Automatický výpočet celkové ceny
- Objednávkový formulář
- Validace jména, telefonu a času vyzvednutí
- Volby vyzvednutí včetně vlastního času
- Demo platební modal
- Simulace úspěšné platby
- Potvrzení přijetí objednávky
- Sticky košík na desktopu
- Mobilní spodní lišta s tlačítkem Košík
- SEO title, meta description, Open Graph a lokální SEO text
- Schema.org Restaurant JSON-LD
- Kontaktní sekce s mapou a telefonním tlačítkem

## Co je demo

- Položky menu
- Ceny
- Online platba
- Přijetí objednávky
- Odesílání objednávky provozovateli
- Potvrzení e-mailem
- Administrace objednávek

Tyto části jsou připravené jako frontendový návrh, aby bylo možné web ukázat provozovateli. Pro ostrý provoz je potřeba doplnit reálné menu a backend.

## Jak napojit reálnou online platbu

GitHub Pages je statický hosting a neumí bezpečně vytvářet platební session přímo z frontendového JavaScriptu. Pro ostrou platbu je potřeba backend.

Doporučený postup:

1. Zvolit platební bránu: Stripe Checkout, GoPay nebo Comgate.
2. Založit merchant účet u poskytovatele platby.
3. Vytvořit backend endpoint, například:

```text
POST /api/create-payment
```

4. Frontend odešle objednávku na backend.
5. Backend vytvoří platební session u Stripe / GoPay / Comgate.
6. Backend vrátí `checkoutUrl`.
7. Frontend zákazníka přesměruje na platební bránu.
8. Po zaplacení platební brána zavolá webhook na backend.
9. Backend označí objednávku jako zaplacenou a pošle potvrzení.

V souboru `script.js` je pro budoucí napojení připravená funkce:

```js
createPaymentSession()
```

Uvnitř je komentář s místem, kde se později zavolá backend endpoint `/api/create-payment`, a ukázkový JSON payload objednávky.

## Jak napojit reálné odesílání objednávek

Pro ostré spuštění je potřeba doplnit jednu z těchto variant:

- Odeslání objednávky e-mailem provozovateli
- Uložení objednávky do administrace
- Notifikace do mobilu nebo tabletu na provozovně
- Tisk objednávky na kuchyňské tiskárně
- Napojení na pokladní systém, pokud ho podnik používá

Minimální ostrá varianta:

1. Backend přijme objednávku.
2. Backend ověří platbu.
3. Backend odešle e-mail provozovateli.
4. Backend odešle potvrzení zákazníkovi.

## Doporučený další krok pro klienta

Nejdříve doplnit reálné menu, ceny, alergeny, aktuální otevírací dobu a potvrdit preferovanou platební bránu. Poté se může připravit ostrá verze s backendem pro platby, příjem objednávek a potvrzovací e-maily.
