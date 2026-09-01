# Book Insight UI — Quick Start

Build the UI with **Next.js, TypeScript, and Tailwind CSS**. Focus only on making the design work with hard-coded book recommendations.

## 1. Install

1. Install the current Node.js LTS release: [nodejs.org/en/download](https://nodejs.org/en/download)
2. In a terminal, run:

```bash
npx create-next-app@latest book-insight-ui --yes
cd book-insight-ui
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 2. Use a coding agent

Open the `book-insight-ui` folder with Codex or Claude Code, attach the design image, and prompt:

> Build the attached Book Insight UI using Next.js App Router, TypeScript, and Tailwind. Create the goal form, reading-level choices, recommendation summary, and five hard-coded book cards. When the form is submitted, show the recommendation screen. Make it responsive and accessible. Do not add authentication, a database, an API, or ML logic. Run `npm run lint` and `npm run build` when finished.

## 3. What to build

- A learning-goal text box
- Beginner, intermediate, and advanced choices
- A button that shows the results screen
- Five hard-coded book recommendations
- A “Why this book?” section for each book
- “Start Over” and “Save Recommendations” buttons
- A layout that also works on mobile

The recommendations can be written directly in the code. The goal is to experiment with the UI and publish a working version to GitHub. No real recommendation system is needed yet.

## 4. Before handing back changes

```bash
npm run lint
npm run build
git status
git diff
```

Do not commit API keys or accept agent changes without reviewing the diff.

## Official documentation

- Next.js installation: [nextjs.org/docs/app/getting-started/installation](https://nextjs.org/docs/app/getting-started/installation)
- Next.js troubleshooting/errors: [nextjs.org/docs/messages](https://nextjs.org/docs/messages)
- Next.js CSS and Tailwind: [nextjs.org/docs/app/getting-started/css](https://nextjs.org/docs/app/getting-started/css)
- Codex CLI: [learn.chatgpt.com/docs/codex/cli](https://learn.chatgpt.com/docs/codex/cli)
- Claude Code setup: [docs.anthropic.com/en/docs/claude-code/getting-started](https://docs.anthropic.com/en/docs/claude-code/getting-started)
