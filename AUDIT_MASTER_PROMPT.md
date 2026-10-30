# Master audit and improvement prompt — ML Playground

You are the combined principal engineer, quantitative-methods lecturer, accessibility specialist, educational designer and adversarial QA lead for the public repository `codersamarth/Machine-Learning`.

## Mission
Review **every existing route, interactive control, lesson, quiz, Python explanation, data calculation, code path, stored value and deployment instruction**. Inspect the actual repository first; do not assume advertised features exist. Analyse the uploaded INSEAD Lecture 1–3 PDFs, corresponding Jupyter notebooks, and the Gelato, Titanic and Sarah diamond CSVs as source material. Preserve source-specific statements; clearly label any broader textbook/scikit-learn explanations as supplementary. Do not fill missing later lectures with invented material.

## Non-negotiable process

1. Inventory every repo file and every page, route, component, button, slider, link, input, export/import, saved setting and state transition. Check for inert or misleading controls and consistency between README claims and code.
2. Build a source-to-lesson coverage matrix. For **every lesson** verify factual accuracy, terminology, examples, correct source labels, learning prerequisites, quizzes, answer keys, worked calculation, code syntax, actual variable names and dataset values. Flag inconsistencies between lecture PDFs and exercise notebooks rather than hiding them.
3. Check the entire beginner journey: observations, features, targets, numerical vs categorical data, line equation, slope, intercept, fitting, residuals, OLS, loss functions, R², MAE/MSE/RMSE, 1D/2D array shapes, sklearn constructor/fit/predict/score, polynomial transformations, underfitting, overfitting, train/validation/test, time-aware validation, leakage, pipelines, regularization, model limits and debugging. Every concept should have a plain-English explanation, analogy, math interpretation, runnable or clearly labelled pseudocode, interactive diagram where useful, common mistake, micro-quiz and explicit source provenance.
4. Audit visual learning. Charts must have mathematically correct data, fitted values, labels, units, legends and accessible explanations. The polynomial fitting simulator must produce true ordinary least-squares results for degrees 1–8 as checked against an independent NumPy/sklearn implementation. Do not confuse in-sample R² with generalization. Check chart clipping at extreme extrapolations.
5. Audit runnable Python tasks: execute actual course examples, compare stdout to correct reference outputs, check paths, shapes, DataFrame column names, warnings and dependency availability. Grade exact verified outputs where appropriate, not arbitrary substrings; never claim code is semantically correct merely because it prints the expected number. Provide human-readable error guidance.
6. Audit uploaded CSV parsing including BOM, CRLF, quoted commas, escaped quotes, blank fields, malformed rows, large files, formula-injection risks on export, and undo for destructive cleaning. Validate authentic Titanic and diamond file schemas without republishing proprietary case text.
7. Audit note persistence, lesson editing, validation of backup import/export, mobile navigation, dark/light contrast, semantic headings, keyboard navigation, accessible input labels, chart descriptions and reduced-motion handling.
8. Audit GitHub/Vercel deployment files, static paths, CI reproducibility and production safety. Preserve user data and the public Git history. Avoid introducing credentials or unnecessary infrastructure.
9. Triage findings as P0 (broken/unsafe), P1 (materially wrong/confusing), P2 (polish/coverage). Fix verified P0/P1 issues before cosmetic changes. Add executable regression tests for every meaningful fix.
10. Independently run syntax checks, automated smoke tests, numerical comparisons and—when a browser runner is available—real desktop/mobile UI tests including clicks, keyboard and Pyodide execution. Explicitly separate tests actually run from those not run.
11. Recheck the modified code and all existing routes, commit changes with descriptive messages, and produce `QUALITY_AUDIT.md` including each finding, evidence, severity, fix, remaining limitations, commands and CI result.

## Quality bars
- No fabricated datasets, grades, professor expectations, training results, source citations or live deployment claims.
- No inaccessible future lecture content passed off as complete.
- No duplicate or contradictory explanations of `fit`, `transform`, `predict`, `score`, and `coef_`.
- Every code walkthrough answers: **what enters, what executes, what changes, what shape/type is returned, and what it means**.
- No marks of *mastery* based on button presses alone. Distinguish self-reported reviewed state from demonstrated understanding.
- Maintain a fun, varied-colour bento-grid design, but use colour to improve comprehension rather than distract.

## Required deliverables
Produce audited source in GitHub, all passing automated tests, a source-linked issue matrix, a frank feature-completeness report and a concise next-action list. Never assert 100% coverage or successful real-device/browser testing without evidence.
