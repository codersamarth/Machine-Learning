# ML Playground — Machine Learning & Optimization

An independent, beginner-first companion for the INSEAD MiM ML & Optimization course. **Not an official INSEAD website.** The primary public deployment is **[ML Playground](https://coding-five-woad.vercel.app/)**; the canonical Vercel project is **`coding`**. Use one production project, not multiple deployments of the same repository.

## Start learning

| Area | What you can do |
| --- | --- |
| [Learning Path](https://coding-five-woad.vercel.app/#learn) | Study sourced Lectures 1–3 in the order of the handouts; complete quizzes and keep private browser notes |
| [Start from Zero](https://coding-five-woad.vercel.app/journey.html) | 31 additional Python/data prerequisites with click-to-explain code and exercises |
| [Regression Academy](https://coding-five-woad.vercel.app/#regression) | Gelato linear and polynomial regression, model selection, evaluation and leakage |
| [ML Laboratory](https://coding-five-woad.vercel.app/#lab) | Interactive fitting/degree experiments against the authentic 13-point Gelato data |
| [Case Studio](https://coding-five-woad.vercel.app/cases.html) | Titanic data cleaning and diamond exploratory analysis; synthetic starter data or local CSV |
| [Video Academy](https://coding-five-woad.vercel.app/video-library.html) | Watch generated videos in the site and prepare independent topic-specific video sources |
| [Video Studio](https://coding-five-woad.vercel.app/video-studio.html) | Export one or all source packs and generation prompts, inspect script and save optional local video links |
| [Production tracker](https://coding-five-woad.vercel.app/video-production.html) | View the public 92-topic production queue and actual hosted-video publication status |
| [Lecture importer](https://coding-five-woad.vercel.app/ingest.html) | Read your own PDFs, slides and Jupyter notebooks in your browser |

## Lecture coverage and provenance

The current **61 course topic lessons** are grouped and sequenced as follows:

| Lecture | Topics | Coverage |
| --- | ---: | --- |
| **1** | 10 | ML vs. optimization, supervised/unsupervised learning, AI/LLMs, Google Colab, Python and plotting |
| **2** | 18 | Titanic variable types, invalid data/outliers, duplicate/missing values, MCAR/MAR/MNAR, scaling, encoding, feature engineering |
| **3** | 33 | Regression vs. classification, Gelato, fitted lines, polynomial regression, over/underfitting, train/validation/test and target leakage; extras labelled supplementary |
| **4–15** | — | Official roadmap titles exist, but source-specific teaching content has not been supplied or invented |

Each lecture lesson has an original scenario, **three separate worked reasoning steps**, plain-English and university-level explanations, optional Python/math context, a misconception check and a quiz. Some underlying university explanations and later supplementary topics extend beyond what the source handouts explicitly teach. See **[lecture-to-topic coverage](LECTURE_COVERAGE.md)** and [distribution/source manifest](data/source-manifest.json) for attribution and limits.

The site includes **31 additional beginner lessons**, making **92 learning topics total**. These are preparation, not 31 invented INSEAD lectures. Original restricted course handouts, case solutions and full class datasets are **not** distributed here. Original Gelato values are bundled; Titanic/Diamond demonstrators use explicitly synthetic data until the student imports an authorised dataset locally.

## Videos: generation versus publication

The public production queue contains **92 topic-specific source/narration packs**. At the latest verified integration milestone, **Lecture 1.1 (`m14`) was generated and uploaded** into this project's Vercel Blob video storage. A further HeyGen generation was requested; whether it is ready should be verified from the live [video catalog](https://coding-five-woad.vercel.app/api/videos), not inferred from the queue text. **A prepared video script does not mean the video exists.**

A published MP4 plays directly on the lesson page and in Video Academy/Studio. The first-party `/api/videos` endpoint lists verified Blob-hosted videos; `/api/heygen-webhook` supports secure archival of future completed HeyGen jobs that provide callback URLs. The connected HeyGen Free plan has limited monthly generation capacity, so a separately configured recurring automation handles retries rather than pretending all videos can be rendered immediately.

See **[video publishing and quota caveats](VIDEO_PUBLISHING.md)**. Never put video-service credentials or the Vercel Blob token in browser code or GitHub.

## Local development and validation

The public frontend is lightweight static HTML/CSS/vanilla JavaScript, with two authenticated Vercel serverless routes and one production dependency (`@vercel/blob`).

```bash
# Serve the site locally (no build required)
python3 -m http.server 8000

# Source/content/shape checks (Node.js 22)
node tests/smoke.mjs
node tests/lecture-coverage.mjs
node tests/journey-smoke.mjs
node tests/video-smoke.mjs
node tests/video-packets.mjs
node tests/publishing-smoke.mjs
node tests/production-queue.mjs
node tests/site-integrity.mjs

# In CI, Playwright, Chromium, PDF and axe packages are installed for:
# tests/browser.mjs, tests/video-studio-browser.mjs,
# tests/accessibility.mjs and tests/mobile-deep.mjs.
```

GitHub Actions runs syntax, study-content, data-flow, page interaction, mobile-layout and accessibility regression checks. The latest code should only be represented as verified when the **[GitHub Actions workflow](https://github.com/codersamarth/Machine-Learning/actions)** is green and the [public Vercel deployment](https://coding-five-woad.vercel.app/) is Ready.

## Operating rules

- **One public deployment:** `coding` → [coding-five-woad.vercel.app](https://coding-five-woad.vercel.app/). A second Vercel project named `machine-learning` was identified as a duplicate and its automatic builds were disabled; permanent deletion requires an account owner to confirm in Vercel.
- **No fabricated source coverage:** later lectures require their real slides/notebooks.
- **No disguised results:** clearly separate synthetic examples, actual computations, and a model's untested estimates.
- **Privacy:** browser-uploaded source files and personal notes remain local unless a feature explicitly says otherwise. Review a third-party video generation service's privacy settings before sharing sources.
- **Do not claim production completion:** video cards and the queue reflect actual hosted files, not scripts or pending jobs.

Last content/deployment audit: 31 October 2026.
