# Dev Logs site

A static dev log site built with **TanStack Start** and React. Notes are synced from the [dev_logs](https://github.com/vinaybadgujar102/dev_logs) GitHub repository when new commits are available.

## Quick start

```bash
npm install
npm run content   # pull dev_logs (if new commits) → manifest + assets
npm run dev       # http://localhost:3000
```

Edit the site title in [`site.json`](site.json). Edit which notes are pulled in [`content-sources.json`](content-sources.json).

## Dev logs workflow

1. Write in your Obsidian vault; the vault syncs to `dev_logs` on GitHub (daily backup).
2. Push new commits to [vinaybadgujar102/dev_logs](https://github.com/vinaybadgujar102/dev_logs).
3. Run `npm run content` locally, or let CI sync automatically (see below).

`npm run content` compares the remote `master` SHA to `content/.github-sync-state.json` and only re-downloads when there is a new commit. Use `npm run content:force` to refresh regardless.

### Local Obsidian vault (optional)

To sync directly from your Second Brain vault instead of GitHub:

```json
// content-sources.json — add vaultPath and use content:vault
{
  "vaultPath": "/Users/you/Documents/Second Brain",
  ...
}
```

```bash
npm run content:vault
npm run watch:vault   # re-sync on vault file changes
```

## Build & deploy

```bash
npm run build
```

Output: `dist/client` (static files for GitHub Pages).

CI runs `npm run content` during build, so the latest `dev_logs` commit is pulled even without a local vault.

### GitHub Pages

1. Push to GitHub.
2. Enable Pages: **Settings → Pages → GitHub Actions**.
3. The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys on push to `main`.

For a project site (`username.github.io/repo-name`), set `base: '/repo-name/'` in `vite.config.ts`.

### Auto-sync when dev_logs updates

[`.github/workflows/sync-dev-logs.yml`](.github/workflows/sync-dev-logs.yml) runs daily (and on `workflow_dispatch`). It pulls new content, commits the manifest/assets if changed, and triggers a deploy via push to `main`.

To sync immediately after each `dev_logs` push, add this workflow to the **dev_logs** repo:

```yaml
# .github/workflows/notify-portfolio.yml (in dev_logs repo)
name: Notify portfolio
on:
  push:
    branches: [master]
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.PORTFOLIO_DISPATCH_TOKEN }}
          repository: vinaybadgujar102/personal-portfolio
          event-type: dev-logs-updated
```

Create a fine-grained PAT with `contents: write` on the portfolio repo and add it as `PORTFOLIO_DISPATCH_TOKEN` in dev_logs secrets.

## Project structure

| Path | Purpose |
|------|---------|
| `site.json` | Site name |
| `content-sources.json` | GitHub repo + allowlisted globs |
| `scripts/sync-github.ts` | Clone dev_logs when SHA changes |
| `scripts/sync-vault.ts` | Optional local Obsidian sync |
| `scripts/build-content.ts` | Obsidian transforms → manifest |
| `src/routes/dev-logs/` | Dev log index + note pages |
