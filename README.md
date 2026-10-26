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
styles.css    # Academic stylesheet (light, print-friendly)
scripts.js    # Nav highlight + footer year (minimal JS)
assets/       # Profile photo, CV (PDF), icons
```

## Updating content

Everything lives in `index.html` — edit the section you need and push. Drop a new CV into `assets/documents/cv/` and update the filename in the CV link.

## Development

```bash
python3 -m http.server 8000
```

then open <http://localhost:8000>.

---

© K.M. Tousif Bin Parves
