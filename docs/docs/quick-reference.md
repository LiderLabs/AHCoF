# Documentation: Quick Reference

This project's documentation is built with [MkDocs](https://www.mkdocs.org/) (Material theme) and hosted on Vercel. This guide covers the day-to-day operations for updating it.

---

## Setup (one-time, per machine)

If you're working on the docs for the first time on a given machine:

```bash
cd microfinance-app
python3 -m venv .venv
source .venv/bin/activate
cd docs
pip install -r requirements.txt
```

If `requirements.txt` doesn't exist yet, install directly:
```bash
pip install mkdocs mkdocs-material
```

---

## Every time you sit down to work on docs

Activate the virtual environment first — this only lasts for your current terminal session, so you'll need to do this again in any new terminal tab/window:

```bash
cd microfinance-app
source .venv/bin/activate
cd docs
```

---

## Adding or editing a page

1. Create or edit a `.md` file inside `docs/docs/`. Nest it in a subfolder if it belongs to a section, e.g. `docs/docs/data-shapes/savings.md`.
2. Add it to the navigation sidebar by editing `docs/mkdocs.yml`:
   ```yaml
   nav:
     - Home: index.md
     - Data Shapes:
         - Savings Module: data-shapes/savings.md
   ```
   A page that exists in `docs/docs/` but isn't listed in `nav` will still build, but won't show up in the sidebar.

---

## Previewing changes locally

```bash
mkdocs serve
```

Opens a live-reloading local server, usually at `http://127.0.0.1:8000`. Every saved change to a `.md` file or `mkdocs.yml` refreshes the browser automatically. Stop it with `Ctrl + C`.

---

## Publishing changes

The site auto-deploys from Vercel on every push to the `dev` branch (our production branch for docs). To publish:

```bash
git add docs/
git commit -m "Update docs: <short description>"
git push
```

That's it — no manual build or deploy step needed. Vercel picks up the push, runs `mkdocs build`, and the live site updates within a minute or two.

**Do not commit `docs/site/`** — it's the generated build output and is gitignored on purpose. Vercel rebuilds it fresh on every deploy; a committed copy would just be stale, redundant, and bloat the repo.

---

## Checking a deployment

If a change doesn't appear live after pushing:

1. Go to the Vercel dashboard → this project → **Deployments** tab.
2. Check the latest deployment's status and build logs.
3. A healthy build takes several seconds (installing MkDocs + Material, then building) — if a deployment finishes in under a second, something didn't run correctly; check the Build Command and Framework Preset settings.

---

## Project structure

```
docs/
  mkdocs.yml       ← site config: title, theme, navigation
  requirements.txt ← Python dependencies (mkdocs, mkdocs-material)
  docs/            ← all markdown source files (edit these)
    index.md
    setup.md
    user-flow.md
    folder-structure.md
    tech-stack.md
    data-shapes/
      savings.md
  site/            ← generated build output (gitignored — never edit directly)
```

---

## Common gotchas

- **`mkdocs: command not found`** — your virtual environment isn't activated in this terminal. Run `source .venv/bin/activate` from the monorepo root.
- **New page not showing in sidebar** — it's missing from the `nav:` block in `mkdocs.yml`.
- **Live site not updating after push** — check that the push went to the correct branch (`dev`), and check Vercel's build logs for errors.
- **Broken internal links** — links between pages are relative markdown links using `.md` extensions (e.g. `[Savings Module](data-shapes/savings.md)`), not `.html`. MkDocs converts them automatically at build time.