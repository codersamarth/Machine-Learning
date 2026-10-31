# ML Playground — Quality Review

**Review date:** 31 October 2026  
**Public production project:** `coding` · [coding-five-woad.vercel.app](https://coding-five-woad.vercel.app/)  
**Repository:** `codersamarth/Machine-Learning`  
**Scope:** deployment duplication, documentation consistency, curriculum coverage, video publishing, responsive navigation, technical testing and source privacy.

## Findings and remediation

| Severity | Finding | Change or decision |
| --- | --- | --- |
| P1 | Two Vercel projects, `coding` and `machine-learning`, automatically deploy the same `main` commit | Preserve the publicly used `coding` project; configure `machine-learning` to ignore new builds and disable previews. Final deletion requires the Vercel owner's confirmation. |
| P1 | Several historical guides still say “71 video topics” or “40 course lessons”, conflicting with the source-verified current curriculum | Replace these with one current README, `LECTURE_COVERAGE.md` and `VIDEO_PUBLISHING.md`. Remove legacy and obsolete duplicated guides from the working tree. |
| P1 | Generated video versus source-pack count can be misunderstood | Production tracker distinguishes 92 planned videos from actually published MP4s; the public video catalog is the authority. |
| P1 | Duplicate project has a separate public domain with possible stale or protected content | Preserve `coding-five-woad.vercel.app` as the sole recommended public URL; delete duplicate project only after its owner reviews deletion. |
| P2 | The newer production tracker was missing from mobile and accessibility regression suites | Add its route to Playwright mobile and axe scans, plus functional coverage for filters and published-vs-queued counts. |
| P2 | A handful of light colors had insufficient contrast against white | Increase contrast on production queue labels/sequence markers; rerun accessibility verification. |
| P2 | Runtime Node.js project version (26.x) was not the same as test CI (22) | Set production project to Node.js 22 to match automated CI. |
| P2 | Missing static page/assets can slip past JavaScript unit checks | Add a site-integrity test that checks each HTML route, relative stylesheet/script/link asset, critical guidance file and deleted-doc references. |
| P3 | Historical audit prompts and dated implementation reports unnecessarily clutter the root | Keep only current operational guidance and source-to-lesson coverage in the main documentation. |

## Student-facing content quality

- **92 study topics:** 31 preparatory Python/data micro-lessons plus 61 source-mapped course topics.
- **Lecture 1:** 10 topics; **Lecture 2:** 18; **Lecture 3:** 33. Unconfirmed advanced extras are labelled separately. Lectures 4–15 are roadmap-only pending their authentic source handouts.
- All 61 lecture topics contain individual scenarios, three logical steps, plain-English/university explanation, misconceptions and a multiple-choice knowledge check.
- Authentic 13-row Gelato data is included; Titanic and diamond demonstration data is synthetic. Original private university handouts and restricted case files are not republished.
- Python execution, regression graphics and notebook imports are separate interactive learning mechanisms. Training-set estimates are not represented as guaranteed real-world predictions.

## Video publishing quality

- 92 topic-specific narration/source packs are present, but **a pack is not a rendered video**.
- One initial video was confirmed generated and archived as an MP4 in the site's public Vercel Blob store (`m14`).
- The second video (`m1`) was requested from HeyGen and must be evaluated by its actual status and whether the MP4 appears on the public /api/videos endpoint.
- Only verified available MP4 media should be labelled “Published”; free-tier service quotas may restrict further output. A separate scheduled production check handles retries when allowed.
- Media upload is authenticated server-side using encrypted Vercel credentials. Never expose credentials or personally restricted teaching content in source files.

## Verification approach

The `.github/workflows/ci.yml` pipeline runs: JavaScript syntax, syllabus and quiz audits, content/source/video packet validation, queue integrity, browser integration tests, responsive layouts at 320/360/390/430/768/1024 px, and WCAG 2.0/2.1 A/AA automated checks. Its updated suites cover the new production tracker alongside core learning views. Check the latest completed GitHub workflow before stating whether a new commit passes.

Live production should additionally be checked for its active domain, `/api/videos` and the published MP4's accessibility. These represent browser → API → Blob → playback boundaries.

## Scope not yet proven

A “10/10” aesthetic or educational rating is **not an objective test result**. The audit substantially improves consistency and quality but does not prove complete course coverage for Lectures 4–15, guarantee that AI-generated narration is error-free, or substitute for real-student usability testing. Automated axe checks do not replace manual keyboard and screen-reader testing; mobile Chromium does not establish Safari compatibility. Run an independent Lighthouse performance assessment and a real-student study session before declaring the experience perfect.

**Owner action required:** Confirm permanent removal of the redundant `machine-learning` Vercel project through its account-protected deletion page. The `coding` project must remain online.
