<div align="center">
  <a href="https://opspresso.com" target="_blank">
    <img src="docs/images/opspresso.png" alt="OpsPresso Logo" width="150"/>
  </a>
  <h1>OpsPresso Website</h1>
</div>

<p align="center">
  Platforms and tools for AI agents.
</p>

OpsPresso builds services for operating AI agents and tools for the people building them. This repository contains the static website published at [opspresso.com](https://opspresso.com/).

## Products

### Agent Platform

| Service | Purpose |
| --- | --- |
| [Agent Studio](https://studio.agrt.dev) | Configure and run agents; manage access, approvals, traces, and daily or monthly spending limits. |
| [Agent Memory](https://memory.agrt.dev) | Store durable context, recall it across coding clients, and hand off work between sessions. |
| [Agent Librio](https://librio.agrt.dev) | Collect documents and audio; provide transcription, meeting notes, evidence search, and knowledge graphs. |
| [Agent Forge](https://forge.agrt.dev) | Run coding agents and commands in isolated sandboxes with persistent workspaces and sessions. |

### Developer Tools

| Tool | Purpose |
| --- | --- |
| [VibeMon](https://vibemon.io) | Monitor coding-agent activity, multiple accounts, infrastructure metrics, and recent trends. |
| [romty](https://romty.dev) | Keep terminal sessions running across TUI exits and SSH disconnects. |
| [Toast](https://toastapp.dev) | Launch apps, commands, files, URLs, scripts, and text snippets from custom button pages. |

## Preview locally

No build or package installation is required. With Python 3 installed, run this from the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory docs
```

Open <http://127.0.0.1:8000/>. Stop the server with `Ctrl+C`.

## Content and deployment

- `docs/index.html`: Homepage, product sections, and social preview metadata.
- `docs/policy.html`: Privacy policy, with the same navigation and product links.
- `docs/css/style.css`: Shared layout, product accents, responsive styles, and themes.
- `docs/js/theme.js`: Theme selection and persistence.
- `docs/images/`: Product marks. Use the corresponding service's `public/icon-192.png` when updating an Agent product mark.
- `docs/CNAME`: Custom domain for GitHub Pages.

GitHub Pages publishes the `docs/` directory from `main`. A merged change is complete when the Pages workflow succeeds and the updated site is visible at the public domain.

When changing a product, check its current documentation and update the homepage, both page footers, and this list together. Keep descriptions about user-visible capabilities and their limits. Do not add analytics scripts without a verified source and a matching privacy disclosure.

## Validation

This repository has no configured lint, type-check, or automated test suite. Before merging:

- Run `git diff --check` and, when Node.js is available, `node --check docs/js/theme.js`.
- Check local assets, internal anchors, and product destinations.
- Preview both pages on desktop and narrow mobile screens, including light and dark themes.
- Verify the published pages and assets after deployment.
