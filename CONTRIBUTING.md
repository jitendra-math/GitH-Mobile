# Contributing to GitH Mobile

First off — **thank you** for considering contributing to GitH Mobile! ❤️

Whether you're fixing a typo, reporting a bug, suggesting a feature, or writing code — every contribution matters. This document explains how to get involved.

---

## 📜 Code of Conduct

By participating in this project, you agree to:

- **Be respectful** — disagree with ideas, not people
- **Be constructive** — feedback should help, not hurt
- **Be patient** — maintainers are volunteers
- **Be welcoming** — new contributors are always welcome

We will not tolerate harassment, discrimination, or toxic behavior of any kind.

---

## 🐛 Reporting Bugs

Found a bug? Please help us fix it faster by opening an issue:

👉 [**Open a Bug Report**](https://github.com/jitendra-math/GitH-Mobile/issues/new)

### Before You Open an Issue

1. **Search existing issues** — someone may have already reported it
2. **Try the latest version** — it might already be fixed
3. **Check the [README](./README.md)** — your question may be answered there

### What to Include

A great bug report has:

- **Clear title** — "Delete button doesn't work on iOS Safari" (not "it's broken")
- **Description** — what happened vs. what you expected
- **Steps to reproduce** — numbered, so we can follow along
- **Environment** — browser, OS, device (e.g., "Chrome 121, Android 14, Pixel 7")
- **Screenshots or video** — if it's a visual bug
- **Console errors** — open DevTools → Console, paste any red errors

---

## ✨ Suggesting Features

Have an idea? We'd love to hear it!

👉 [**Open a Feature Request**](https://github.com/jitendra-math/GitH-Mobile/issues/new)

### A Good Feature Request Includes

- **The problem** — what pain point does this solve?
- **Your proposed solution** — how would it work?
- **Alternatives considered** — what else did you think about?
- **Screenshots/mockups** — if you have a design in mind

> 💡 **Tip:** For big features, open an issue **before** writing code. This avoids wasted work if the idea doesn't fit the project direction.

---

## 💻 Contributing Code

### Prerequisites

- **Node.js** 18.17 or later
- **npm** (comes with Node) — or `pnpm` / `yarn` if you prefer
- **Git** — obviously 😄
- A **GitHub Personal Access Token (Classic)** with `repo` scope — [create one here](https://github.com/settings/tokens/new?scopes=repo)

### Setup

```bash
# 1. Fork the repo on GitHub (click the "Fork" button)

# 2. Clone YOUR fork
git clone https://github.com/YOUR-USERNAME/GitH-Mobile.git
cd GitH-Mobile

# 3. Add the original repo as "upstream"
git remote add upstream https://github.com/jitendra-math/GitH-Mobile.git

# 4. Install dependencies
npm install

# 5. Start the dev server
npm run dev
```

Open http://localhost:3000 and you're good to go.

Development Workflow

```bash
# 1. Make sure your main branch is up to date
git checkout main
git pull upstream main

# 2. Create a new branch (use a descriptive name)
git checkout -b fix/delete-button-ios
# or
git checkout -b feature/dark-mode
# or
git checkout -b docs/improve-readme

# 3. Make your changes, then commit
git add .
git commit -m "fix: delete button not working on iOS Safari"

# 4. Push to your fork
git push origin fix/delete-button-ios

# 5. Open a Pull Request on GitHub
```

Branch Naming

Prefix Use for
feature/ New features
fix/ Bug fixes
docs/ Documentation only
refactor/ Code cleanup (no behavior change)
style/ Formatting, spacing, semicolons
perf/ Performance improvements
test/ Adding or fixing tests

Commit Messages

We follow Conventional Commits:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

Types:

· feat — new feature
· fix — bug fix
· docs — documentation
· style — formatting (not code logic)
· refactor — code restructuring
· perf — performance
· test — tests
· chore — build/config/tooling

Examples:

```
feat(editor): add syntax highlighting for Rust
fix(navbar): logout button not responding on iOS
docs(readme): add install instructions
refactor(tree): simplify recursive rendering logic
```

Keep commits atomic — one logical change per commit.

---

🎨 Code Style

General

· TypeScript everywhere — no plain .js in app/ or components/
· Functional components — no class components
· Named exports — except for pages (app/**/page.tsx)
· Server components by default — add "use client" only when needed

Naming

Type Convention Example
Components PascalCase RepoCard.tsx
Functions camelCase handleCommit()
Constants UPPER_SNAKE_CASE SITE_URL
Folders kebab-case app/privacy/

Formatting

· 2 spaces for indentation
· Semicolons — yes
· Double quotes — for strings in JSX/TSX
· Trailing commas — yes (in multi-line)

We don't have ESLint/Prettier fully configured yet — but if you add it, that's a valid contribution! 🎉

Tailwind CSS

· Use Tailwind utilities — no custom CSS files unless necessary
· Follow iOS design tokens from app/globals.css (--ios-blue, #F2F2F7, etc.)
· Prefer inline styles only for dynamic values (e.g., style={{ backgroundColor: langColor }})

---

🧪 Testing Your Changes

Before opening a PR, please:

· ✅ Test on mobile — this is a mobile-first PWA. Use Chrome DevTools device emulation or a real device.
· ✅ Test on iOS Safari — different rendering engine
· ✅ Check both light backgrounds — currently only light mode, but structure should support future dark mode
· ✅ Run the production build:

```bash
npm run build
```

Fix any errors before pushing.

· ✅ Verify the PWA still works — check the service worker registers (production build only)
· ✅ Test your specific change — if you fixed a bug, verify the bug is gone

---

🚀 Pull Request Process

Before Submitting

☐ Your branch is up to date with main
☐ npm run build passes without errors
☐ Your commit messages follow the convention
☐ You've tested on mobile (or DevTools mobile emulation)
☐ You've described what and why in the PR

PR Title

Use the same convention as commits:

```
fix: delete button not working on iOS Safari
feat: add dark mode toggle in navbar
docs: improve installation instructions
```

PR Description Template

```markdown
## What does this PR do?
<!-- Brief description of the change -->

## Why?
<!-- What problem does it solve? Link the related issue -->

Fixes #123

## How was it tested?
<!-- Describe your testing approach -->

## Screenshots (if applicable)
<!-- Before / after screenshots for UI changes -->

## Checklist
- [ ] Build passes
- [ ] Tested on mobile
- [ ] No breaking changes (or documented)
```

Review Process

1. Maintainer review — usually within 48–72 hours
2. Feedback loop — make requested changes if needed
3. Approval — once approved, we merge
4. Credit — you'll be added to THANKS.md (if you want)

Be patient — this is a side project maintained by one person. Reviews may take a bit longer on busy weeks.

---

🌍 Other Ways to Contribute

Not a coder? That's fine — there's plenty you can do:

Way How
🐛 Report bugs Open an issue
💡 Suggest features Open an issue
📝 Improve docs Fix typos, add examples in README
🌐 Translate Help localize the app (future feature)
⭐ Star the repo Helps others discover it
📣 Share it Tweet, post on Reddit, tell friends
🧪 Beta test Try it on your device, report issues
💬 Answer questions Help others in GitHub Discussions
🎨 Design Share UI/UX improvement mockups

---

📚 Project Structure

```
GitH-Mobile/
├── actions/          # Server actions (GitHub API)
├── app/              # Next.js App Router pages
│   ├── dashboard/    # Authenticated dashboard
│   ├── privacy/      # Privacy policy
│   ├── terms/        # Terms of service
│   ├── not-found.tsx # 404 page
│   └── error.tsx     # Error boundary
├── components/       # React components
│   ├── landing/      # Landing page sections
│   └── *.tsx         # App modals & UI
├── lib/              # Utility functions
├── public/           # Static assets
├── store/            # Zustand state
└── ...
```

For deeper details, see the README.

---

🎯 Areas That Need Help

Looking for something to work on? Here are areas where contributions are especially welcome:

High Priority

· 🐛 Bug fixes — especially iOS Safari quirks
· ♿ Accessibility — screen reader support, keyboard nav
· 📱 Mobile testing — try on different devices/OS versions
· 🌙 Dark mode — the design tokens are ready, just needs wiring

Medium Priority

· 🧪 Tests — unit, integration, or E2E
· 📝 Docs — README, code comments, guides
· 🌐 i18n — multi-language support
· ⚡ Performance — bundle size, lazy loading

Nice to Have

· 🎨 New features — file search, multi-repo ops, etc.
· 🔔 Push notifications — for commits
· 📊 Analytics — privacy-first only

See the Roadmap for the full picture.

---

❓ Questions?

· 💬 Open a Discussion
· 🐛 Open an Issue
· 📧 Email: i.jitendra.singh0@gmail.com

---

📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

<div align="center">

Thank you for being awesome! ❤️

Every line of code, every bug report, every kind word makes this project better.

</div>