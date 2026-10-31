# ML&O lecture-by-lecture curriculum audit

**Authoritative material available for comparison:** `MLO_Lecture_1_Handouts.pdf` (42 pages), `MLO_Lecture_2_Handouts.pdf` (30 pages), and `MLO_Lecture_3_Prelecture.pdf` (40 pages). The site's Gelato regression uses the authentic 13-observation dataset. Original private handouts, case PDFs and notebook solutions are **not reproduced in this public repository**.

**What “covered” means:** The academic learning objectives and substantive teaching topics visible in these three supplied handouts are mapped to explanatory lessons and checks. Source citations identify lecture handout page ranges; they do not imply all proprietary exercises, graphics, classroom polls or exercise notebook cells were republished verbatim. Administrative dates and grade logistics remain on the official learning platform.

## Recommended order

Begin with the [Start from Zero](/journey.html) prerequisites if you are new to Python (31 optional micro-lessons), then complete **Lecture 1 → Lecture 2 → Lecture 3** through [Learning Path](/#learn). You can jump directly to [Lecture 3 Regression Academy](/#regression), but revisit Lecture 1 Python and Lecture 2 preprocessing whenever you cannot explain a code input, transformation or error. End each subchapter with its micro-quizzes and the [Python Code Decoder](/#code), and use the [Video Academy](/video-library.html) to prepare one narrated overview per topic.

## Lecture 1 — Course introduction, ML/optimization and Python

**10 ordered topics in two sections.**

| Source topic | Lesson references | Source |
|---|---|---|
| Business use, course goals, learning-by-doing and ability to review AI-written code | `m14` | pp. 4–5, 23–26, 33–36 |
| Machine learning versus optimization; prediction versus decision | `m1`, `m2` | pp. 7–17 |
| Supervised learning (label) versus unsupervised learning (pattern discovery) | `m2` | pp. 7–17 |
| Definition-dependent AI labels and examples | `m9` | pp. 18–20 |
| Generative AI and large language models | `m10` | p. 21 |
| Running notebooks in Google Colab, imports, operators and basic Python types | `m3`, `m11` | pp. 31–38 |
| Lists, dictionaries, NumPy arrays and pandas DataFrames | `m4` and beginner `p02`, `p03`, `p09`, `p11` | p. 38 and supplementary code-first practice |
| Comparisons, conditionals and for loops | `m12` and beginner `p04`–`p06` | p. 39 |
| Matplotlib line/scatter/histograms, titles and axes | `m13` | p. 40 |

Administrative grading, office-hour arrangements and poll links were identified but are **not copied as evergreen academic lessons**; check the current official syllabus.

## Lecture 2 — Data preprocessing and feature engineering

**18 ordered topics in four sections.**

| Source topic | Lesson references | Source |
|---|---|---|
| Raw data → preprocessing → prepared data → feature engineering → modelling | `d201` | pp. 2–4 |
| Titanic: 893 observations, 11 fields, numerical versus categorical variables | `d202`, `m5` | pp. 5–7 |
| `df.head()`, `df.info()`, `df.describe()` and `.unique()` diagnostics | `d203` | pp. 5, 10, 13 |
| Data cleansing: malformed/invalid values, negative Fare and manual row removal | `d204` | pp. 9–11 |
| Outliers: boxplots, z-scores and anomaly detection; retain genuine extremes | `d204` | pp. 12–13 |
| Remove uninformative columns and identify/drop duplicates | `d205` | pp. 14–15 |
| Normalization (0–1) versus standard scaling (mean 0, SD 1) and use cases | `m7`, `d206` | pp. 16–17 |
| Missing-cell detection (`isna()`) and options for numerical values | `m6`, `d208` | pp. 18–19 |
| Missing-cell options for categorical values | `d209` | p. 20 |
| MCAR, MAR and MNAR missing-data mechanisms | `d207` | p. 21 |
| Titanic-specific Cabin drop, Age imputation, Embarked mode 'S' | `d209`, `d214` | p. 22 |
| Ordinal versus nominal categories; one-hot encoding and redundant column | `d210` | pp. 24–25 |
| Numeric → categorical binning/bucketization | `d211` | p. 26 |
| Feature selection versus dimension reduction preview (details later) | `d212` | p. 27 |
| Feature transformations (power, log, unit conversion), interactions (Parch and SibSp) | `m8`, `d213` | p. 28 |
| Integrated Titanic preprocessing practice and explanation | `d214` | pp. 3–29 synthesis |

The Titanic [Case Studio](/cases.html) accepts the student's authorised CSV locally. It is an applied supplement; it does **not** replace the restricted course handout.

## Lecture 3 — Supervised regression and the Gelato case

**33 topics in four sections; the fourth is explicitly optional/supplementary.** The order follows the handout rather than alphabetical order or increasing lesson ID.

| Source topic | Lesson references | Source |
|---|---|---|
| Supervised and unsupervised distinction; regression versus classification; choose a target | `r01`, `r33`, `r02` | pp. 3–5, 8–9 |
| Gelato 13-observation dataset, features and label; time vs sales scatterplot | `r02`, `r03` | pp. 8–10 |
| Linear model equation, slope and intercept; fit line and interpret predictions | `r04`, `r05`, `r08` | pp. 11–15 |
| Read the actual notebook line by line; Series/DataFrame shape, `fit`, coefficients and `score` | `r09`–`r11`, `r29`–`r31`, `r13` | exercise Part 2 and supplementary code-reading |
| Residuals and least squares mathematical background | `r06`, `r07` | supplementary mathematical explanations adjacent to linear regression |
| Polynomial feature expansion and regression workflow | `r16`, `r17` | pp. 16–22, exercise Part 3 |
| Why a model can underfit or overfit; complexity and seasonal Gelato intuition | `r18`, `r19`, `r20`, `r27` | pp. 23–25 with clearly marked extensions |
| Training, validation, testing and their different roles | `r14`, `r15` | pp. 26–33 |
| Target leakage, preprocessing order and generalization | `r22`, `r28` | pp. 34–39 |
| Extra advanced learning *not established as Lecture 3 content* | `r12`, `r21`, `r23`–`r26`, `r32` | clearly marked supplementary section |

The [Gelato Laboratory](/#lab) is an interactive illustration of ordinary least squares, not a guarantee of forecasting accuracy from 13 sparse time observations.

## Lectures 4–15 — Roadmap only

Lecture 1 provides the course agenda, but the lecture-specific handouts for the later sessions have **not been provided for content validation**. The site therefore keeps their tiles open to future personal lesson imports without inventing what the professor taught.

| Lecture | Official roadmap topic | Academic lesson coverage |
|---|---|---|
| 4 | Classification: logistic regression | Awaiting source materials |
| 5 | Tree-based methods | Awaiting source materials |
| 6 | Extensions of tree-based methods | Awaiting source materials |
| 7 | STC case | Awaiting source materials |
| 8 | Dimension reduction | Awaiting source materials |
| 9 | Clustering and segmentation | Awaiting source materials |
| 10 | Boats (A) case | Awaiting source materials |
| 11 | Linear programming | Awaiting source materials |
| 12 | Integer programming | Awaiting source materials |
| 13–15 | SFB integration planning, parts A–C | Awaiting source materials |

## Technical guardrails

- `lecture-plan.js` supplies the verified lecture sequence, content gaps and dedicated topic exercises. Existing lesson IDs remain stable so local notes, progress and saved video links are not invalidated.
- Each syllabus learning objective is represented and linked to the corresponding lesson IDs in this document.
- The 31 self-paced Python beginner micro-lessons are **prerequisite scaffolding**, not an invented extra INSEAD lecture.
- Lecture 3 advanced supplements (e.g. Ridge, Lasso, cross-validation) are kept after the lecture's original sequence and visibly labelled.
- The Video Academy and Video Studio use the same ordered curriculum, so there is one conceptual video source per course topic and one per beginner micro-lesson, with no generated-video claims.
- `node tests/lecture-coverage.mjs` and the existing lesson/video/browser tests enforce the ordering, 15-session roadmap, provenance and valid quizzes.

**Future coverage updates:** When lecture 4+ original material becomes available, review the source first, add only sourced topics to its own sections, and then update the coverage matrix and tests. Never treat the roadmap title as evidence the lesson has been taught.
