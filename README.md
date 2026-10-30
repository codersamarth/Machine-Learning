# ML Playground — INSEAD Machine Learning & Optimization

A colourful, interactive, **regression-first** learning application, built to help a beginner understand the maths, business intuition and code behind machine learning. Not an official INSEAD website.

## What's included

- **36 lessons** grounded in Lectures 1–3 (8 on Python/ML/data foundations, 28 on regression concepts), including source cues and labelled supplementary material.
- **Regression Academy:** features/labels, scatterplots, slope/intercept, residuals, least-squares loss, interpreting coefficients, DataFrame shapes, prediction, MAE/MSE/RMSE/R², train/validation/test, polynomial regression, bias/variance, regularization, cross-validation, time-series caveats, leakage and a complete workflow.
- **Real-data regression laboratory** using the complete 13-row `Gelato_Times_Sales.csv`. Change polynomial degree or manual slope/intercept; the curve, prediction and training/holdout errors update live. The chronological three-point holdout is illustrative and too small for a reliable forecasting benchmark.
- **Python Code Decoder:** eight annotated university-style snippets showing line-by-line behavior, input/output types and shapes, and common errors. A rule-based decoder also gives **heuristic, not guaranteed**, explanations of pasted Python.
- **Python Dojo:** ten progressive editable exercises with genuine optional Pyodide Python execution. The scikit-learn example opens Google Colab because the lightweight browser runtime does not promise scikit-learn.
- **CSV Explorer:** upload Titanic, Sarah/Diamond, FT rankings or future CSVs locally in the browser; inspect rows, missing values, duplicates and negative fares; export cleaned CSV. The other original uploaded CSV datasets are **not bundled into the Git repository**; users supply them through the uploader.
- Quizzes with explanations, progress/XP, personal notes, manual custom lessons, a 15-lecture roadmap and JSON backup/import.
- Responsive colourful design and light/dark mode.

The lectures' copyrighted cases, PDF articles, classroom notebooks and handouts are **not** published here. Original teaching summaries and code examples cite the lecture or optional-reading category.

## Deploy to Vercel (recommended)

1. Visit [vercel.com/new](https://vercel.com/new) and import [codersamarth/Machine-Learning](https://github.com/codersamarth/Machine-Learning).
2. Set **Framework Preset** to **Other** (static site).
3. Keep **Root Directory** as `./`, leave the **Build Command** empty, and set **Output Directory** to `.` (the repository root).
4. Deploy. No environment variables, API keys, backend or npm packages are required for the core website.
5. Further pushes to the default branch can automatically redeploy when Vercel Git integration is enabled.

The `index.html` entry point loads `styles.css`, `curriculum.js` and `app.js`. `vercel.json` defines static site options.

## Run locally

```bash
git clone https://github.com/codersamarth/Machine-Learning.git
cd Machine-Learning
python -m http.server 8000
```

Visit **http://localhost:8000**.

## Check the site

```bash
node --check app.js
node --check curriculum.js
node tests/smoke.mjs
```

GitHub Actions runs these checks on pushes and pull requests. The checks validate page rendering and reference Gelato regression calculations, not every browser-specific behavior.

## How to learn to read any regression notebook

For each line, ask: **What came in? What object or shape comes out? What was learned or transformed? What data were used? Why does it matter for the model or its evaluation?**

Use **Regression Academy → Code Decoder → Python Dojo → Live Lab → Exam Arena** as a progressive learning path. The generic code decoder is not an interpreter or semantic validator for arbitrary Python programs.

## Expand the course

The course roadmap contains 15 lecture slots from the provided syllabus. Lectures 4–15 deliberately have no invented official lecture content. Choose **My Notes → Content Studio** to add manual lessons as materials arrive. Notes, custom lessons and progress stay in your browser using `localStorage`; export backups to transfer them. There is no account sync or automated document ingestion yet.

## Limitations

- Browser Python is downloaded from Pyodide CDN; offline Python execution is unavailable until the runtime has been cached.
- Scikit-learn may be unavailable within the browser Python runtime; use Google Colab for those activities.
- There is no server-side account system, automated grading of arbitrary pasted code, automatic lecture PDF parsing, or persistent cloud storage.
- Held-out performance from three seasonal Gelato observations is a **teaching illustration** and must not be presented as a reliable production forecast.
