# Sermon Prep Assistant

A private, offline workspace for pastors. Start with a Bible passage or a sermon theme, get a three-point draft with King James Version (KJV) citations, and revise it for your congregation.

**AI-assisted draft — review, pray over, and edit before preaching.** The label describes writing assistance, not a remote model: the app matches references and topics against a local verse library, then builds an outline using deterministic rules and editorial templates.

## Run locally

Open `index.html` in a modern browser. No installation, build step, API key, or network connection is needed. To serve the same files over localhost instead:

```sh
python3 -m http.server 8000
```

Visit `http://localhost:8000`. For tests, use Node.js 22 or later and run `npm test` from the repo root. There are no npm dependencies to install.

## Prepare an outline

1. Enter a passage such as **Romans 8:28**, or a topic such as **hope in suffering**, and choose **Generate**. The **John 3:16**, **Psalm 23**, and **Forgiveness** buttons generate sample drafts in one click.
2. Review the title, Scripture focus, introduction, three main points (with quotations, explanations, illustrations, and application questions), closing response, and prayer. Use **Verse lookup** independently to search by a reference, such as **John 3:16–17**, or a topic, such as **hope**.
3. Click or tab into any outline field to edit it. **Copy Outline** includes your edits and the draft disclosure. **Print / Save as PDF** opens the browser’s print dialog with a draft-only layout. Choose **Clear** to discard the current outline. New generation also replaces it; copy or print before switching if you want to keep it.

## Faithfulness and privacy

- You remain responsible for the message. Read each passage in its wider context, verify quotations in your own Bible (especially after editing), and adapt applications to the people you serve. The app does not speak with divine authority.
- The built-in library contains 51 public-domain KJV verses (including all of Psalm 23), transcribed from the [Bible-kjv dataset](https://github.com/aruljohn/Bible-kjv). It is not a full Bible. Unavailable passages are not invented; the app discloses when it uses a general fallback on grace, hope, and love or when only some requested verses are available.
- Inputs, results, and edits stay in the browser. The app makes no data requests, uses no remote AI service or analytics, requires no account, and does not save drafts across reloads. Copy and print are actions you control.

## AI for Church Hackathon 2026

**Track: Discipleship & Spiritual Growth.** The tool supports pastors in preparing Bible-centered teaching and concrete, pastoral questions that help their congregations put what they hear into practice.

| Judging criterion | What to look for |
| --- | --- |
| Ministry Impact (30%) | A practical starting point for weekly sermon preparation without displacing pastoral judgment. |
| Execution & Quality (25%) | A responsive, keyboard-usable workflow that runs offline and has automated tests for matching and draft generation. |
| Innovation (20%) | Combines a portable verse library, deterministic drafting, and editable study notes without sending sermon content to an AI service. |
| Faithfulness & Responsible AI (15%) | Dataset-backed citations, honest draft labeling, disclosed coverage limits, and private local processing. |
| Presentation (10%) | Three one-click examples and a timed walkthrough in [DEMO_SCRIPT.md](DEMO_SCRIPT.md). |

**Built from scratch in the hackathon window (Nov 24, 2026):** verse selection and topic tags, reference parsing and topic lookup, draft generation, the editable workspace and export controls, automated tests, and the demo script.
