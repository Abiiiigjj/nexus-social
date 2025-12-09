# Nexus Social

> Digitale Werkzeuge für echte Bedürfnisse – Ein Ökosystem für Gesundheit, Bildung und Teilhabe.

![Nexus Social](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Accessibility](https://img.shields.io/badge/WCAG-AAA-success)

## 🌟 Über das Projekt

Nexus Social ist eine zentrale Hub-Plattform für gemeinwohlorientierte digitale Anwendungen. Die Plattform verbindet Menschen mit Tools für Pflege, Bildung, Inklusion und Nachhaltigkeit.

### Design-Philosophie

- **Soft Bento Grids**: Modulares Kartensystem für übersichtliche Darstellung
- **Eco-Brutalism**: Klare Strukturen mit weichen, organischen Elementen
- **WCAG AAA**: Vollständige Barrierefreiheit

## 🎨 Farbsystem

| Kategorie | Farbe | Hex-Code |
|-----------|-------|----------|
| Gesundheit | Korallenrot | `#E07A5F` |
| Bildung | Indigo | `#5C6BC0` |
| Nachhaltigkeit | Salbeigrün | `#8CB369` |
| Arbeit | Violett | `#9575CD` |

## 🚀 Installation

```bash
# Repository klonen
git clone https://github.com/[username]/nexus-social.git

# In das Verzeichnis wechseln
cd nexus-social

# Mit einem lokalen Server starten (z.B. mit Python)
python -m http.server 8000

# Oder mit Node.js http-server
npx http-server
```

## 📁 Projektstruktur

```
nexus-social/
├── index.html          # Hauptseite
├── styles/
│   └── main.css        # Haupt-Stylesheet mit Design-System
├── scripts/
│   └── main.js         # JavaScript für Interaktivität
├── README.md           # Projektdokumentation
└── .gitignore          # Git-Ignore Datei
```

## 🌐 Deployment

### GitHub Pages

1. Repository auf GitHub pushen
2. Settings → Pages öffnen
3. Source: "Deploy from a branch" wählen
4. Branch: `main` und Ordner `/` (root) auswählen
5. Save klicken

Die Seite ist dann unter `https://[username].github.io/nexus-social/` erreichbar.

### Netlify

1. Repository mit Netlify verbinden
2. Build-Einstellungen:
   - Build command: (leer lassen)
   - Publish directory: `.`

### Vercel

1. Repository importieren
2. Framework Preset: "Other"
3. Deploy klicken

## ♿ Barrierefreiheit

Diese Plattform erfüllt WCAG AAA Standards:

- ✅ Hohe Farbkontraste (min. 7:1)
- ✅ Große Klickflächen (min. 44x44px)
- ✅ Tastaturnavigation
- ✅ Screen-Reader-Unterstützung
- ✅ Skip-Links
- ✅ Reduzierte Bewegung respektiert

## 🛠️ Technologie-Stack

- **HTML5** – Semantische Struktur
- **CSS3** – Custom Properties, Grid, Flexbox
- **Vanilla JavaScript** – Keine Abhängigkeiten
- **Google Fonts** – Inter Typeface

## 📝 Lizenz

MIT License – Siehe [LICENSE](LICENSE) für Details.

## 🤝 Mitwirken

Beiträge sind willkommen! Bitte lies unsere [Contribution Guidelines](CONTRIBUTING.md) bevor du einen Pull Request erstellst.

---

Made with ❤️ for a better world.
