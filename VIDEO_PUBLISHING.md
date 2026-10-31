# Video publishing on ML Playground

## What is implemented

The website has 92 video topic slots. A video is marked ready only after it has actually been generated. The first video belongs to Lecture 1.1 (topic m14).

Every course topic now has its own three-step worked teaching example, its own beginner explanation, a separate university explanation and a knowledge check. The 31 beginner prerequisites continue to include line-by-line Python explanations.

Videos with MP4/WebM addresses play directly on the website in an HTML5 player, rather than redirecting students to an external video page. The initial completed video is referenced from HeyGen media delivery; the website has also been provisioned with its own Vercel Blob public video storage.

## Publishing pipeline

The repository contains a server-side video webhook at /api/heygen-webhook and an inventory endpoint at /api/videos.

For HeyGen video jobs that support callback URLs, configure the job to notify the authenticated webhook on completion. Supply the matching topic ID as the callback ID and include the securely stored webhook token in the callback URL. The webhook validates the request and the media host, streams the completed MP4 into Vercel Blob, and makes it discoverable through /api/videos. The browser refreshes its video catalog automatically.

The Vercel project has BLOB_READ_WRITE_TOKEN and ML_VIDEO_WEBHOOK_TOKEN configured as encrypted server-side values. Neither credential belongs in the public repository or front-end JavaScript.

Important: The first HeyGen Video Agent video was generated before the webhook was configured. Its current player is therefore linked to the direct HeyGen media source. Fully automatic delivery requires each future generation job to use the webhook-compatible HeyGen API method with the callback URL supplied. The ChatGPT HeyGen Video Agent tool itself does not expose a callback setting.

## Bulk production limits

The connected HeyGen account is currently on the Free plan. Producing 91 additional narrations/videos may exceed its included quota. A producer running outside ChatGPT also needs its own HeyGen API credentials and an authorised scheduler. The source packs do not represent already-rendered videos. Video storage and delivery may incur Vercel usage charges.

## Quality assurance

Always fact-check generated videos for maths, Python syntax, numerical predictions, permissions and source attribution before public sharing. The website's lesson text is original study material rather than a copy of protected university slides. Never publish restricted class handouts as public media.
