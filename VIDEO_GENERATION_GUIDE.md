# Video Academy — Gemini Notebook video production guide

**Website:** https://coding-five-woad.vercel.app/video-library.html

## What is actually available

The website now offers **71 independent, source-based video-production packets**, representing **31 foundational micro-lessons** and **40 ML/Regression lessons** from the project's available course content. Each slot has a distinct Markdown source, a customised steering prompt, optional video link, search/filter controls and link backup/import. You can download all source Markdown files in a ZIP from the Video Academy.

**The videos themselves have NOT been rendered in Gemini Notebook automatically.** The public Gemini Notebook consumer product does not expose a direct video-generation connector to this ChatGPT session. Generation requires a Google account and may have per-day quotas and account/plan limits. Any saved video link is user-provided, not AI-certified as generated or accurate.

## Generate one video

1. Open the [Video Academy](https://coding-five-woad.vercel.app/video-library.html), find the topic you want, and choose **Prepare video**.
2. Choose **Download lesson source**. A focused Markdown file is downloaded to your device. Alternatively, download the full ZIP of 71 sources and extract the desired file.
3. Open [Gemini Notebook / NotebookLM](https://notebooklm.google.com/). Create a new notebook for this topic and upload the single Markdown source. This avoids confusing one topic with another.
4. In **Studio → Video Overview**, choose **Explainer** for a meaningful teaching segment, or **Short** for a rapid summary. Choose English, then select a clear visual style such as **Whiteboard**.
5. In the Video Academy, click **Copy generation prompt** and paste it into the custom steering instructions. Generate the video in Gemini Notebook.
6. Review the video: every equation and example must match the source. If a claim is not supported, correct the source/prompt and regenerate.
7. In Gemini Notebook, share the video's actual link **only with an appropriate access setting**, or download the video and host it privately/publicly according to your rights. Paste the link in the corresponding Video Academy slot and save it.
8. If the link is to a reachable MP4/WebM file, the website can play it inline. For Gemini Notebook links and other URLs, it opens the provider's player in another tab.

## Suggested learning-video style

Each video should explain a concept to a complete beginner through a single real-world analogy, a labelled diagram, an equation with every symbol explained, a worked example and—where the topic includes Python—a true line-by-line walkthrough. Finish with the lesson's check question, a short pause and the correct answer. The provided prompt handles this and instructs Gemini to avoid invented training results or execution claims.

## Source rights and privacy

- The topic files are **independently written study notes already available in ML Playground**, not the original restricted INSEAD slides or paid case narratives. The official PDFs and raw datasets are not embedded in this public video-source pack.
- Verify that you are allowed to publish any source, notebook or video before changing sharing to public. Sharing an entire Google notebook can grant recipients access to its sources.
- Videos are AI-generated and can be wrong, especially with formulas, data or code. Treat every video as a revision companion, not an academic authority.
- Saved links use browser localStorage. Use **Export video links** before switching devices or clearing browser data; import them later.
- The Gemini Notebook mobile app may differ from its web interface; the desktop web interface is better for creating many videos.

## Scope and limitations

No videos for course-specific Lectures 4–15 have been fabricated because those lesson sources have not been supplied and reviewed yet. When verified future lessons are added to the project curriculum, the Video Academy should be expanded to cover them.

Google's product help documents three video formats—Cinematic, Explainer and Short—as well as language/style controls, generation, downloading, sharing and access restrictions:

- https://support.google.com/gemininotebook/answer/16454555
- https://knowledge.workspace.google.com/admin/generative-ai/gemini-notebook/turn-gemini-notebook-on-or-off-for-users

The separate Gemini Notebook **Enterprise** API is not the same as consumer notebook access; this website does not use the Enterprise API or claim to generate Notebook Video Overviews automatically.

## Quality assurance

- `node tests/video-smoke.mjs`: validates 71 distinct topic packets and video prompts.
- `node tests/browser.mjs`: exercises the Video Academy source download, link save/reload workflow, filter and persistence.
- `node tests/accessibility.mjs` and `node tests/mobile-deep.mjs`: mobile/desktop layout, keyboard and automated WCAG checks.

The scripts are run through GitHub Actions on changes to the repository.
