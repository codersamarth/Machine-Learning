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
