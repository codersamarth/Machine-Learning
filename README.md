# ML Playground — INSEAD Machine Learning & Optimization

A colourful, interactive beginner-first course companion. This is an **independent study project**, not an official INSEAD website.

**Live website:** https://coding-five-woad.vercel.app

**New beginner-first path:** [Start from Zero →](https://coding-five-woad.vercel.app/journey)

The guided path teaches **31 additional micro-lessons** (10 absolute basics, 13 Python reading, 8 data foundations), then connects to the 33-topic Lecture 3 regression path, the real Gelato notebook inspector and independent code-reading challenges. It includes a searchable glossary and course search, breadcrumbs, previous/next, bookmarks, recent lessons and refresh-safe links. Step-through states and regression coefficients are calculated from genuine Gelato observations; they are explanatory traces, not claims of running arbitrary Python.

**No-upload start:** Authentic Gelato sales points are bundled. The Titanic and Diamond Case Studio launches with clearly labelled synthetic demonstration records, so students can practise immediately. Original class-specific CSVs remain optional and are processed locally when selected; restricted materials are not redistributed in this public site. See [source manifest](data/source-manifest.json) and [implementation report](IMPROVEMENT_REPORT.md).

- [Dashboard and Regression Academy](https://coding-five-woad.vercel.app/)
- [Titanic and Diamond Case Studio](https://coding-five-woad.vercel.app/cases)
- [Lecture Import Studio](https://coding-five-woad.vercel.app/ingest)

## Available teaching material

The site contains **61 lecture-ordered lessons** based on the materials supplied so far: 10 for Lecture 1 (ML, optimization, Python and AI terminology), 18 for Lecture 2 (Titanic data preparation and feature engineering), and 33 for Lecture 3 (supervised learning, Gelato, polynomial regression, validation and target leakage). It also has 8 annotated code walkthroughs and 10 progressive Python exercises. Lecture slots 4–15 are in the syllabus map, but are **not** populated with fabricated professor-specific material.

The regression academy covers observations, features, labels, shapes, plotting, slope, intercept, least squares, residuals, predictions, MAE/MSE/RMSE/R², validation and testing, polynomial regression, overfitting, leakage, regularization, pipelines and debugging. The live Gelato simulator uses the 13 records supplied in `Gelato_Times_Sales.csv`; numerical OLS fitting is checked against independent NumPy reference results.

### New: real-data case labs

Open **Case Studio**, then select one of two hands-on modules:

- **Titanic Data Detective:** A synthetic beginner practice file is preloaded; optionally upload your own `Titanic.csv`. Inspect invalid negative fares, missing Age, missing Embarked and Cabin, duplicates and basic engineered features. Apply reversible cleaning steps and answer interpretation questions. The actual course CSV has **893 rows and 11 columns, with no Survived target**; the site does not pretend it can train a survival classifier from that file alone.
- **Diamond Price Explorer:** A synthetic beginner practice file is preloaded; optionally upload your own `Sarah_dataset.csv`. Examine the relationship between carat weight and listing price, filter by cut, colour, clarity and grading report, and explore actual comparable-price ranges. These are descriptive comparisons, **not** guaranteed valuations or the copyrighted case narrative.

The full restricted course datasets, PDF handouts and copyrighted case materials are deliberately **not published** in this public repository. User-supplied CSV files are parsed locally in the browser.

### New: Lecture Import Studio

Upload a **PDF**, **PPTX**, **.ipynb**, Markdown or plain-text file and extract readable text client-side into page/slide/cell sections. Select a section, rewrite/check your explanation and save a custom lesson into the chosen lecture slot. **Human review is mandatory**; OCR, diagrams and equations may not be captured correctly. PDF extraction uses PDF.js and PowerPoint extraction uses JSZip from external CDNs.

Custom lessons, notes, progress and quiz results use browser `localStorage`. Export and import JSON backups from the main site. Cloud account synchronisation is not implemented; avoid storing sensitive private data in notes on shared devices.

### Mobile UX

The site includes a scrollable mobile menu, an accessible close backdrop, Escape-key dismissal and a five-button bottom dock for one-handed navigation. A dedicated Playwright suite checks 78 mobile/tablet route and viewport combinations; keyboard and WCAG scans run in CI. The optional horizontally swipeable topic chips are intentionally scrollable within their own row.

### Python learning

Python Dojo offers genuine interpreter execution through Pyodide (downloaded from CDN). The final sklearn exercise is intended for Google Colab. The rule-based Code Decoder is a teaching aid, **not** a semantic interpreter for arbitrary Python. Understanding unfamiliar code still requires tracing its input data, variables, object types, shapes and function definitions.

## Deploy and run

The GitHub repository is linked to the Vercel project **coding** under the **Bonjour** team. The production site above has been checked via HTTP and Chromium. Pushes to `main` automatically deploy; the core website is static and needs no production API keys.

To run locally:

```bash
git clone https://github.com/codersamarth/Machine-Learning.git
cd Machine-Learning
python3 -m http.server 8000
```

Visit http://localhost:8000.

## Test the website

Syntax and mathematical checks:

```bash
node --check app.js
node --check curriculum.js
node --check cases.js
node --check ingest.js
node tests/smoke.mjs
```

For full browser and accessibility checks, install testing dependencies **locally only**:

```bash
npm install --no-save --no-package-lock playwright@1.64.1 pdf-lib@1.17.1 jszip@3.10.1 @axe-core/playwright@4.11.1
npx playwright install --with-deps --only-shell chromium
node tests/browser.mjs
node tests/accessibility.mjs
node tests/mobile-deep.mjs
```

To test an already deployed version instead:

```bash
ML_BASE_URL=https://coding-five-woad.vercel.app node tests/browser.mjs
ML_BASE_URL=https://coding-five-woad.vercel.app node tests/accessibility.mjs
```

GitHub Actions runs syntax, numerical, real Chromium and automated WCAG checks on each push and pull request.

## Important boundaries

- Course-specific lectures 4–15 need their original slides/notebooks before comprehensive lessons can be authored accurately.
- Source import is text extraction and a review-first editor, **not** automatic production of complete academic lessons.
- This is a single-user local-first site; reliable private cross-device synchronisation requires authentication and a secure backend.
- The Python Dojo is not a general-purpose server-side Python execution service or a fully semantic code grader.
- Chromium desktop/mobile emulation and automatic WCAG checks do not replace physical-device, Safari or screen-reader testing.

See [QUALITY_AUDIT.md](QUALITY_AUDIT.md) for tested functionality and remaining limitations.


## Lecture-wise coverage and recommended teaching order

The [Learning Path](https://coding-five-woad.vercel.app/#learn) follows the **actual source handout sequence** for Lectures 1–3, not alphabetical topic order. The [Regression Academy](https://coding-five-woad.vercel.app/#regression), [Video Academy](https://coding-five-woad.vercel.app/video-library.html) and [Video Studio](https://coding-five-woad.vercel.app/video-studio.html) use that same sequence. The course-specific content is divided into chapters and labels supplementary extensions separately.

| Lecture | Available lecture-aligned topics | Source-supported learning sequence |
|---|---:|---|
| 1 — ML/optimization, Python | 10 | Business goals → supervised/unsupervised/optimization → AI & GenAI definitions → Colab/Python syntax → loops → plotting |
| 2 — Data preprocessing | 18 | Raw-data/Titanic inspection → corruption/outliers/duplicates → missingness/imputation → scaling/encoding → binning → transformations/interactions |
| 3 — Regression | 33 | Target and Gelato data → fitted line & code → polynomial curves/overfitting → train/validation/test → leakage → clearly separate advanced extras |
| 4–15 | No source-verified lessons yet | The lecture names follow the original course roadmap; original handouts are still needed to establish complete content |

See [LECTURE_COVERAGE.md](LECTURE_COVERAGE.md) for the full slide-topic-to-lesson mapping, provenance, teaching caveats and missing-content policy. Administrative dates/grade logistics remain on the official LMS, not in an evergreen student study aid.

## Video Overview preparation for every topic

A [mobile-friendly Video Studio](video-studio.html) now prepares **92 separate topic source packets** (31 beginning/Python/data micro-lessons and 61 course lessons). Each packet uses only existing public ML Playground explanations and the source labels already attached to that lesson. Per-topic steering prompts are available in both full Explainer and short revision formats. Use **Download all topic packets** to obtain a ZIP with Markdown source files and prompts, or download/copy any individual topic packet.

**Videos are not generated or hosted in this repo.** Open [NotebookLM](https://notebooklm.google.com/), add one topic's Markdown file as a source, choose Studio → Video Overview → Explainer, and paste the provided prompt. After human review, save a permitted HTTPS share link in Video Studio. Links saved in the website are browser-local; to publish video links for all visitors, add verified share URLs to `video-map.js` and commit them. Check notebook sharing permissions and rights to source material first.

`tests/video-packets.mjs` checks all 92 topic packs. AI video narration may contain inaccuracies; it is not a substitute for official lecture materials.
