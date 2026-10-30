# ML Playground — Beginner-First Implementation & Quality Report

**Date:** 30 October 2026  
**Repository:** https://github.com/codersamarth/Machine-Learning  
**Production website:** https://coding-five-woad.vercel.app  
**New guided path:** https://coding-five-woad.vercel.app/journey

## Objective

Enable a student with absolutely no programming background to understand what the core Python and regression code does, how data changes at each step, how objects and array shapes behave, and why the code works.

This release adds a structured starting experience **without replacing** the existing 40 university-aligned lessons, Gelato regression simulator, Python Dojo, case studies or content editor.

## Improvements implemented

| Area | Before | After |
|---|---|---|
| Getting started | Dashboard exposed relatively advanced ML topics quickly | New **Start from Zero** entry in both persistent sidebar and top navigation |
| Curriculum | Existing 40 topic lessons, strongest in regression | Added **31 new micro-lessons**: 10 absolute basics, 13 Python reading, 8 data foundations; original 32 regression lessons remain linked as the next stage |
| Understanding syntax | Code walkthroughs and separate decoder | Every new beginner lesson includes a line-selectable code example with an explanation of each line |
| Actual model state | Code explanations generally narrative | New canonical **Gelato notebook inspector** explains X, y, DataFrame/Series dimensions, fitted coefficients, predicted arrays and printed values |
| Navigating concepts | Existing curriculum and separate tool routes | Six-stage guide, previous/next, breadcrumbs, a resume point, recent lessons, bookmarks, a searchable glossary and course-wide search |
| Practice | Existing quizzes, Python Dojo | Additional predict-the-output and debugging challenges with feedback and links to prerequisites |
| Getting started with case data | Asked to upload original Titanic or Sarah CSV | **Synthetic educational demonstrations** now load automatically in both cases; uploading original files remains optional and private |
| Evidence provenance | Mixed source references | A machine-readable **data/source-manifest.json** identifies real and synthetic data and explains distribution decisions |
| Accessibility | Prior WCAG checks on main routes | Additional scans of the guided path, code inspector and search; fixed a detected low-contrast active-stage label |
| Tests | Existing Chromium, Pyodide and model maths checks | Expanded browser tests for navigation, search, bookmarks, refresh, true Gelato trace, mobile beginner sidebar and case auto-loading, plus invariants for all 31 new lessons |

## Detailed source alignment

The 31 new lessons are supplementary explanations designed to prepare students for **INSEAD Lecture 1's Python recap and exercise book**, **Lecture 2's preprocessing exercises**, and **Lecture 3's Gelato regression notebook**.

The original Lecture 1 notebook begins with printing, assignment and types, basic operations and lists, then progresses to more advanced work. The new stages follow that prerequisite order before explaining pandas, NumPy, data shapes, features, targets, preprocessing and regression.

The Gelato trace uses the 13 actual `Times,Sales` pairs in the uploaded course file. The model's complete-sample ordinary least-squares fit is approximately:

- **Intercept:** 205.318735
- **Slope:** −0.471281
- **In-sample R²:** 0.515654
- **Prediction at the first three observed times:** approximately 204.85, 191.65 and 177.04

These values are calculated in the browser as a faithful numerical explanation of a single-feature linear regression fit. The inspector **does not execute arbitrary Python**; actual editable Python execution remains in the separate Pyodide-based Python Dojo.

## Privacy and automatic data availability

- **Authentic Gelato observations:** Already bundled and loaded automatically.
- **Titanic original:** 893 rows × 11 columns; unavailable for public redistribution verification, so **not** committed to the public GitHub/Vercel site. Case Studio starts with a **13-row synthetic** dataset that includes deliberate cleaning problems.
- **Sarah diamond original:** 6,000 rows × 9 columns, linked to restricted case materials; **not** committed publicly. Case Studio starts with a **70-row synthetic** dataset for price comparison exercises.
- **FT rankings CSV:** Real third-party rankings data remain outside public assets.
- **Original lecture handouts, optional readings and paid cases:** Not redistributed.

The synthetic data are prominently labelled. Selecting an original case CSV remains optional and client-only. Avoiding a file-upload prompt is not permission to publish protected material publicly.

## Navigation and code-literacy features

The guided learning experience contains:

1. **Absolute zero:** Code, Python, execution order, values, variables, printing, arithmetic, strings, functions and errors.
2. **Read Python:** Assignment, lists, dictionaries, conditions, loops, functions, imports, objects, arrays, shapes, DataFrames, CSV reading and debugging.
3. **Understand data:** Rows, features and labels, missing data, categories, corrupt records, scaling, feature engineering and pipelines.
4. **Regression:** Links directly to all current university-aligned regression lessons.
5. **Real code trace:** A staged actual Gelato dataset walkthrough with state inspector and a shape challenge.
6. **Independent practice:** Ten mini-challenges plus a direct path to editable Python Dojo.

Every new micro-lesson provides an explanation, analogy, code example, per-line commentary, misconception question, answer feedback and source reference.

## Tests and evidence

The site has been committed to the existing `main` branch and the linked production Vercel deployment.

Validated via GitHub Actions:

- JavaScript syntax and existing numerical regression smoke checks.
- **31-lesson invariant test**: stage coverage, nonempty explanations, one explanation per code line and valid quiz keys.
- Desktop Chromium interaction tests covering new navigation, lesson refresh, bookmarks, global search, authentic Gelato trace and challenge feedback.
- Existing regression, case-upload/undo, notebook/PDF/PPTX source extraction and real Pyodide code execution tests.
- Mobile emulation checks for both the main site and guided learning path.
- Automated WCAG 2.1 A/AA checks for the main routes plus guided home, example lesson, code trace and search.

GitHub Actions history: https://github.com/codersamarth/Machine-Learning/actions

**Limit of test scope:** Automated axe/Chromium tests are not the equivalent of physical screen-reader, Safari, keyboard-only user studies or full pedagogical efficacy assessment. Line-level explanations have been structurally tested and spot-checked, not formally verified by an INSEAD instructor.

## Remaining functionality not represented as complete

- **Any-Python semantic interpreter:** The code decoder provides rule-based guidance, and the Gelato inspector uses a worked model trace; neither can definitively explain arbitrary third-party code. Full arbitrary-code assessment would require a constrained execution engine, static analysis and/or an optional evaluated AI service.
- **Automatic ingestion of restricted historical files without access controls:** Original paid case material cannot be safely served from a public static website without verifying rights and implementing authenticated delivery.
- **Cloud sync:** Notes and bookmarks are local to the browser; backup/import handles transfers.
- **Course-specific later lectures:** Lecture 4 onward needs original authorised instructional material for accurate syllabus-aligned content.
- **Formal learning-outcomes assessment:** Concept checks are not proof of comprehensive mastery; a structured diagnostic for every code skill and human evaluation would be stronger.
- **Physical device and screen-reader testing:** Not independently completed.

## Next educational quality target

Run a blind test: give a beginner an unfamiliar but correctly scoped scikit-learn notebook and ask them to state the inputs, objects, shapes, transformations, fitting state and outputs for every line, then modify it to test a new prediction. Compare their work against a published rubric. This directly tests the project's highest priority rather than counting lessons or clicks.
