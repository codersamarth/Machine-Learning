# ML Playground — Quality audit (30 October 2026)

## Scope and source authority
Audited the public GitHub project's HTML/CSS/JavaScript, its full 15-lecture navigation, **40 active lessons** (8 fundamentals and 32 regression), 8 annotated code walkthroughs, 10 Python practice missions, learning laboratory, quizzes, note editor, CSV explorer, progression and CI setup. Source checks include the provided INSEAD MLO Lecture 1–3 PDFs and original Jupyter exercise books, plus genuine Gelato (13 × 2), Titanic (893 × 11) and Sarah diamond (6,000 × 9) CSV structures. **Lectures 4–15 are roadmap entries only**; original class-specific lessons cannot be validated or filled until their source materials arrive.

## Verified and corrected findings

| Severity | Finding | Corrective change | Evidence |
|---|---|---|---|
| P1 | Polynomial chart claimed OLS but secretly added `1e-8` to a normal-equation matrix; high-degree fits differed from true least squares | Replaced with numerically stable Chebyshev-basis Householder QR OLS; no penalty | Independent NumPy reference comparisons for degrees 1–8, verified RMSE and day-100 prediction |
| P1 | Original CSV parser silently discarded rows with a different field count and accepted unclosed quotes | Now rejects malformed quote states and inconsistent rows with an explicit error; supports quoted commas, doubled quotes, BOM and CRLF | Parser assertions in CI |
| P1 | Code exercises granted success if expected output appeared **anywhere** in output; unrelated output could count as correct | Now compares normalized full output with expected output and describes result matching as partial evidence, not proof | Updated output-check condition and task 5 shape expectation |
| P1 | Cleaning discarded duplicate and negative-fare rows without a way to undo | Added one-level Undo for the last cleaning operation; retains explicit original-upload reset path | CSV explorer code and smoke check |
| P1 | Labelled lessons as “mastered” after a completion click, without proof of learning | Changed to “reviewed” and reframed progress as coverage instead of competence | Navigation and dashboard labels |
| P2 | Beginners could struggle with residuals, dataset splits, leakage and Series-vs-DataFrame shapes | Added interactive residual-error graphic, adjustable train/validation/test proportions and visual comparisons for leakage and dimensions | Lesson rendering checks |
| P2 | Common sklearn warning and reshaping semantics were under-explained | Added four focused lessons on feature-name consistency, reshape, estimator methods and debugging | Source-scoped curriculum inspection |
| P2 | File uploads could be arbitrarily large; spreadsheet export risk | Added 5 MB per-file CSV limit and a simple formula-prefix neutralization on exported CSV cells | Code review (not a security certification) |

## Quantitative benchmarks from original supplied Gelato CSV

- Whole-sample sklearn LinearRegression: intercept approximately **205.318735**, slope approximately **−0.471281**, in-sample R² approximately **0.515654**.
- The teaching lab uses the first 10 observations for fit and final 3 as a chronological holdout. These held-out errors are **illustrative only**, not a defensible future-forecast accuracy estimate with 13 sparse seasonal observations.
- Degrees 1 through 8 were compared against independently calculated NumPy OLS training RMSE and prediction at day 100; these numerical tests are in the GitHub CI smoke suite.

## Coursework and supplementary topics

- **Primary source:** Lecture 1 definitions/Python, Lecture 2 Titanic preprocessing, Lecture 3 Gelato regression and polynomial modeling, supervised splits, overfitting and target leakage.
- **Clearly supplementary:** MAE/RMSE/R² explanation beyond classroom shorthand, multiple regression, regularization, cross-validation, expanded debugging and feature schema warnings. Reference: the supplied scikit-learn optional material and public scikit-learn documentation.
- Python editor outputs run through Pyodide when an external runtime downloads successfully; the final scikit-learn task uses Google Colab instead. The rule-based decoder is a teaching guide and **cannot interpret arbitrary Python accurately**.

## Verification and outstanding limitations

**Tests performed:** Static JS syntax validation; every major page and all 40 lesson page renders in a mocked DOM; lesson quiz key validity; CSV corner cases; independent NumPy cross-check for polynomial degrees 1–8; actual sklearn whole-sample regression values. GitHub Actions runs smoke tests on pushes to `main`.

**Not verified end-to-end in this audit:** Full visual cross-browser screenshot comparisons, real physical mobile screenreader testing, a live Pyodide CDN execution session or deployment to a public Vercel URL. Do not imply these are validated. CI smoke tests exercise page generation and math, not a production browser engine.

**Still to build:** Automatic ingestion of PDF/notebook uploads, full source-verified lecture content for Lectures 4–15, dedicated real Titanic and Sarah case game interfaces (their CSVs can be imported through the explorer), cloud synchronisation and a general-purpose Python interpreter/code-semantic grader.

## Recommended future checks

1. Run Playwright or equivalent on the deployed Vercel preview, checking responsive layout, all interactive sliders, note persistence, editing, CSV undo/export and keyboard focus.
2. Test Pyodide on actual Chrome and Safari with the pinned CDN dependencies and validate all ten practice exercises.
3. Add one new source-aligned lecture at a time through a reviewed content PR, followed by examples and quizzes.
4. Add source-linked case-specific dashboards only when the data and rights permit.

The project is an independent educational aid, not an official INSEAD publication or an accredited assessment.

## Follow-up implementation and validation — 30 October 2026

The original outstanding feature list above describes the **earlier audit state**. The following work has now been implemented.

| Previously outstanding | Current state | Verification |
|---|---|---|
| Public production deployment | **Done:** [coding-five-woad.vercel.app](https://coding-five-woad.vercel.app), Vercel project `coding`, public HTTP 200 on homepage and the two extension pages | Vercel deployment status READY and HTTP checks |
| Titanic case lab | **Done:** reversible invalid-fare cleaning, imputation demonstrations, feature engineering, and conceptual questions using user-supplied CSV | Chromium upload/undo/quiz exercise passed |
| Diamond case lab | **Done:** interactive filtering, carat/price plot, comparable prices from uploaded listings, explanation of limits | Chromium upload/filter exercise passed |
| PDF and PowerPoint text import | **Done:** browser-based extraction into human-reviewed, editable drafts; diagram/OCR limitations disclosed | Chromium synthetic PDF and PPTX extraction tests passed |
| Jupyter notebook import | **Done:** Markdown/code cell extraction, preview and custom lesson saving | Chromium notebook-import and saved-lesson test passed |
| Lesson refresh and deep links | **Done:** URL hash restores the selected lesson; notes persist in browser | Chromium reload and persistence test passed |
| Python runtime validation | **Done for an actual exercise:** Pyodide executed and printed 12 on Chrome in the testing environment | Chromium test passed on both local and production origin |
| Mobile browser testing | **Done for Chromium mobile emulation:** navigation and responsive regression layout, horizontal-overflow check | Chromium end-to-end test passed |
| Accessibility | **Improved:** fixed muted text, small labels and diagram statistics after automated WCAG contrast scans | axe-core scans on static routes returned 0 WCAG 2.1 A/AA findings; dynamic-route fixes were committed and an ongoing CI scan added |
| Automated end-to-end regression | **Done:** `tests/browser.mjs` and `tests/accessibility.mjs` added to GitHub Actions alongside numerical smoke checks | Nine browser workflows passed manually against production; GitHub CI added |

**Still not complete (cannot be represented as finished):** exact course content for Lectures 4–15 without those lecture sources; a private cross-device account/database sync system; genuinely semantic grading of arbitrary Python code; production-grade valuation or survival models; real Safari/physical device/screen-reader coverage. Full actual source CSVs were checked locally for structure, but Chromium case-upload tests used small representative fixtures to avoid publishing restricted raw data.

**Educational and privacy guardrail:** Uploaded source files are processed locally. A PDF/PPTX import is text extraction, not an AI-generated fact-checked course; users must rewrite, validate and save a draft themselves. Real course datasets are not placed in the public repository.


## Final mobile release verification — 30 October 2026

This follow-up completed additional real Chromium and accessibility testing. It supersedes outdated "not tested" entries above.

- **Mobile UX fixes:** The main and guided learning drawers are scrollable at short phone heights, with backdrop dismissal, Escape-key close, keyboard-safe focus control, accessible expanded/collapsed state and scroll locking. The main site also has a five-action mobile bottom dock, with larger touch targets and safe-area padding.
- **Responsive regression suite:** \`tests/mobile-deep.mjs\` tested **78 route/viewport combinations** at 320, 360, 390, 430, 768 and 1024 CSS pixels, covering dashboard, lessons, regression lab, data, code, Python, quizzes, notes, case studio, source importer and guided journey. It found **zero unintentional page-width overflow** after the fixes. Horizontally scrollable tab strips remain intentional.
- **Mobile menu behaviour:** The test also checked scrollable main/academy drawers, the main mobile quick dock, Escape-key dismissal and menu expanded-state controls.
- **Accessibility regression:** 18 axe-core WCAG 2.1 A/AA scans now run across desktop and 320-pixel mobile routes. An initial mobile run found low-contrast active navigation text, an unlabeled pasted-code editor and a keyboard-inaccessible scrollable table; these were corrected. The subsequent GitHub Actions browser/accessibility run passed.
- **Production:** The existing linked public production alias [coding-five-woad.vercel.app](https://coding-five-woad.vercel.app/) returned HTTP 200 after this work and tracks the latest GitHub \`main\` commit. A separate protected Vercel project was also created, but the public alias is the recommended end-user URL.
- **Tests executed in Chrome:** Playwright validated actual Pyodide Python output, Titanic and diamond workflows, notebook/PDF/PPTX imports and note persistence. The source-less later lecture slots remain appropriately labelled.
- **Outstanding limitations:** Physical iOS/Safari and Android devices, manual screen-reader usability, backend/cloud user-account sync, general-purpose semantic interpretation of arbitrary Python, and authorised course-specific content for lectures 4–15 are **not** represented as completed.

GitHub Actions records and rerunnable tests are the source of truth for test status. No automated scan guarantees universal accessibility or usability.
