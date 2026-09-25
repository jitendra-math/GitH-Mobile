# Security Policy

## Reporting a Vulnerability

We take the security of **GitH Mobile** seriously. If you discover a security vulnerability, please report it responsibly.

### 📧 How to Report

**Preferred:** Send an email to **i.jitendra.singh0@gmail.com**

**Alternative:** Open a private security advisory on GitHub:
[https://github.com/jitendra-math/GitH-Mobile/security/advisories/new](https://github.com/jitendra-math/GitH-Mobile/security/advisories/new)

Please **do not** open a public GitHub issue for security vulnerabilities.

### 📝 What to Include

To help us triage and fix the issue quickly, please include:

- **Description** — A clear explanation of the vulnerability
- **Steps to reproduce** — Numbered steps to trigger the issue
- **Impact** — What an attacker could potentially do
- **Proof of concept** — Screenshots, code, or a video if possible
- **Your environment** — Browser, OS, version of the app
- **Suggested fix** — If you have one (optional)

### ⏱️ Response Timeline

| Stage | Timeframe |
|---|---|
| **Acknowledgement** | Within **48 hours** |
| **Initial assessment** | Within **5 business days** |
| **Fix or mitigation** | Depends on severity (typically **1–4 weeks**) |
| **Public disclosure** | After the fix is released |

We'll keep you informed throughout the process.

### 🏆 Recognition

With your permission, we'll credit you in:

- The release notes of the fix
- The [`THANKS.md`](./THANKS.md) file
- The GitHub Security Advisory

If you prefer to remain anonymous, that's totally fine — just let us know.

### 🔒 Our Commitment

- We will **never** take legal action against security researchers who follow this policy
- We will investigate every report thoroughly and in good faith
- We will credit your work if you wish
- We will treat your report as confidential until a fix is available

## Scope

### In Scope

- The web application at **https://github.jssoriginals.com**
- The source code in this repository
- Authentication and session handling
- Token storage and transmission
- Cross-site scripting (XSS), cross-site request forgery (CSRF)
- Privacy and data handling issues

### Out of Scope

- Vulnerabilities in **GitHub's API** (report those to GitHub directly)
- Vulnerabilities in **third-party dependencies** (report upstream)
- Issues requiring physical access to the user's device
- Self-XSS or social engineering attacks
- Denial of Service (DoS) attacks
- Missing HTTP security headers that have no practical impact
- Browser-specific quirks that are not exploitable

## Security Best Practices for Users

If you are a user of GitH Mobile, please follow these guidelines:

- ✅ **Never share your Personal Access Token** with anyone
- ✅ Use a token with the **minimum required scope** (`repo` scope only)
- ✅ **Log out** when using a shared or public device
- ✅ **Revoke** your token on GitHub if you suspect it's compromised: [github.com/settings/tokens](https://github.com/settings/tokens)
- ✅ Keep your **browser and OS up to date**
- ✅ Only use the app on **trusted devices**
- ❌ Don't paste your token into untrusted sites or extensions
- ❌ Don't install modified or unofficial versions of GitH Mobile

## How the App Handles Your Data

GitH Mobile is designed with a **privacy-first** approach:

- **No backend server** — all API calls go directly from your browser to GitHub
- **No analytics or tracking** — nothing is logged
- **Token stored locally** — in an `httpOnly`, `secure`, `sameSite=lax` cookie
- **30-day expiry** — session ends automatically
- **Open source** — you can inspect every line of code

For full details, see our [Privacy Policy](https://github.jssoriginals.com/privacy).

## Known Limitations

- The app is a **client-side PWA** — it depends entirely on the security of your device and browser
- Personal Access Tokens do not support multi-factor authentication at the API level (only at login)
- Users are responsible for choosing a **strong token scope** and **rotating tokens** periodically

## Contact

For non-security issues:
- 🐛 [Report a bug](https://github.com/jitendra-math/GitH-Mobile/issues)
- 💡 [Request a feature](https://github.com/jitendra-math/GitH-Mobile/issues)
- 💬 [Start a discussion](https://github.com/jitendra-math/GitH-Mobile/discussions)

For security issues:
- 📧 **i.jitendra.singh0@gmail.com**

---

**Thank you for helping keep GitH Mobile and its users safe.** ❤️