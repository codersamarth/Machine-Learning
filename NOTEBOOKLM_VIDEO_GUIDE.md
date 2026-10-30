# Producing one Gemini Notebook / NotebookLM Video Overview per topic

## Ready-to-use materials

The [ML Playground Video Studio](video-studio.html) assembles source packets and video-generation prompts for **all 71 existing topics**: 31 absolute-beginner/Python/data micro-lessons and 40 university-related lessons. All content is built from the public learning explanations in `journey-data.js` and `curriculum.js`, not from reuploading private PDF handouts or copyrighted third-party cases.

**The video files do not exist yet.** Rendering them requires a NotebookLM account with sufficient usage allowance. This repository does not have access to the user's Google login or a supported NotebookLM video-generation API.

## Step-by-step production

1. Go to [Video Studio](https://coding-five-woad.vercel.app/video-studio.html) from your phone or computer.
2. Select a topic, for example **What exactly is code?** (`z01`), **Linear regression** (the appropriate `r...` topic), or **Overfitting**. Select **Explainer** for a full educational video.
3. Download its **Markdown source**. Optionally use **Download all 71 topic packets (.zip)** to save every source and its customised steering prompt. The ZIP requires the JSZip CDN to be reachable; individual Markdown downloads do not.
4. Visit [NotebookLM](https://notebooklm.google.com/), sign in to your Google account and create a notebook with only that relevant topic source. You can also select only the relevant sources within an existing notebook; keep unrelated material unchecked.
5. In **Studio**, choose **Video Overview**, **Explainer**, **English**, and **Whiteboard** if available; paste the copied **custom steering prompt**. Generate. For quick exam revision, choose **Short**, and copy the Short-specific prompt instead. Certain formats and customization options depend on Google's current availability and account access.
6. Verify every depicted formula, variable, Python output, example, and conclusion against the source. AI narration and diagrams can make errors. Request a corrected video when errors are material.
7. Share the Video Overview from NotebookLM. **If the intended audience is public**, verify you may legally share the source material; Google may require the full notebook to be accessible as part of video sharing. The university's restricted class material should not be republished publicly without permission.
8. Paste its valid HTTPS share URL into ML Playground Video Studio and click Save. This saves only in that browser. If it needs to appear for everyone and on multiple devices, a repository maintainer should add reviewed URLs to `window.ML_VIDEO_LINKS` in `video-map.js`, then commit the change.

## Producer's rubric

- Teach one concept per video rather than summarising the entire lecture.
- Assume absolutely no prior understanding of Python, equations, arrays or models.
- Explain the problem first, then intuition, then visual example, then syntax and interpretation.
- For any Python line, state **what it receives, what it does, what type/shape it produces, whether it changes an object, and whether it fits a model**.
- When possible, contrast a common mistake with the correct approach.
- Do not invent an exact numerical result or dataset value not supported by the source.
- Do not falsely describe supplementary scaffolding as official lecture content.
- Check readability at 320 px and provide captions for accessibility if your video host supports them.
- End with a brief checkpoint question.

## Coverage and limitations

- 31 beginner lessons and 40 core lessons are covered with dedicated sources, including 32 regression lessons.
- Future official lectures (4–15) cannot have trustworthy source-grounded videos until the authorised lecture material is available and lessons have been reviewed.
- Video downloads, notebook creation, paid quotas and sharing permissions remain controlled by Google NotebookLM.
- Local video links are not cross-device or public until committed into the site's video map; **no videos have been rendered by this repository**.

References: [Google's official Video Overview instructions](https://support.google.com/gemininotebook/answer/16454555?hl=en) and [supported source types](https://support.google.com/gemininotebook/answer/16215270?hl=en).
