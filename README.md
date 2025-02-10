# Corporate Jargon Translator

A demonstration repository for building a corporate jargon translator using large language models. This is a deliberately simple project to make it easier to read and comprehend what's going on.

In the hopes that this will be useful for others, I'm doing the work in steps, and using branches to separate the steps so tha you can follow along.

## Branches
If you want to start at the beginning, start with the [main branch]
 (https://github.com/codiform/jargon-translator/).

This branch is layered on top of a simple Next.js UI, which you can find in the [nextjs](https://github.com/codiform/jargon-translator/tree/nextjs) branch.

There are still further enhancements that could be made:
- Streaming
- Converse / Chat
- Read from Web

I may come back to add these, but if you'd like to contribute, feel free to open a PR.

## This Branch: NextJS + GitHub Models

This branch builds on the [nextjs](https://github.com/codiform/jargon-translator/tree/nextjs) branch by integrating with an LLM using GPT 4o-mini via GitHub Models. This should let me deploy a test (with quota limits) that won't require me to worry about whether or not I'm going to wake up one morning to discover that someone's run up a huge bill by translating way too much content.

Here's an example of it running locally using a recent Meta layoff leak:
![Example Translation using GitHub Models](docs/form-translate.png)

The API code for this can be seen in [pages/api/chatbot/route.ts](pages/api/chatbot/route.ts), or you can compare this branch to the nextjs branch to see all of the changes that were made.

## Running Locally

You may need to install dependencies (npm install / yarn install / pnpm install) before running.

Once the packages are installed, you can run it in dev mode (npm run dev / yarn dev / pnpm dev) and then open your browser to http://localhost:3000.

You'll need a GitHub personal access token, which this code expects to find in an environment variable named `GITHUB_TOKEN`.
