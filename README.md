# Academic Portfolio

Personal academic website of **K.M. Tousif Bin Parves** — Lecturer, Department of Computer Science and Engineering, Port City International University.

🔗 **Live site:** [tousifo.github.io](https://tousifo.github.io)

A clean, single-column academic homepage in plain HTML/CSS — no framework, no build step. Built for readability and print-friendliness.

## Sections

About (with CV & profiles) · Updates · **Publications** (journals, conferences, under review, thesis) · Selected Projects · Experience · Education · Teaching & Training · Skills · Achievements & Leadership · Contact

Research profiles: [Google Scholar](https://scholar.google.com/citations?user=N545a-3c6VUC&hl=en) · [ORCID](https://orcid.org/0009-0006-9309-879X)

## Structure

```
index.html    # The whole site (single page)
styles.css    # Academic stylesheet (light & dark themes)
scripts.js    # Theme toggle, nav highlight + footer year (minimal JS)
assets/       # Profile photo, public CV (PDF + LaTeX source), icons
```

## About the CV

The site links a **web-friendly, redacted CV** (`Curriculum_Vitae_KM_Tousif_Bin_Parves_Public.pdf`):
no phone number, no home address (city only), no personal-information block,
references listed as "available upon request", and no declaration/signature.
The LaTeX source of the redacted version is included
(`Curriculum_Vitae_Public_source.tex`). The full private CV is distributed
on request only — it is not hosted in this repository.

## Updating content

Everything lives in `index.html` — edit the section you need and push. Drop a new CV into `assets/documents/cv/` and update the filename in the CV link.

## Development

```bash
python3 -m http.server 8000
```

then open <http://localhost:8000>.

---

© K.M. Tousif Bin Parves
