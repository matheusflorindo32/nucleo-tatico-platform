# Security Policy

## Secrets and credentials

Never commit API keys, passwords, private keys, service-role keys, database credentials, access tokens, or real `.env` files.

Use environment variables or the deployment platform's secret manager. Values exposed to browser bundles (for example `VITE_*`, `NEXT_PUBLIC_*`, and `REACT_APP_*`) must be treated as public and must never contain privileged credentials.

## Local protection

Install pre-commit and enable the repository hooks:

```bash
pip install pre-commit
pre-commit install
pre-commit run --all-files
```

Gitleaks also runs in GitHub Actions on pushes and pull requests.

## If a secret is exposed

1. Revoke or rotate it immediately.
2. Replace it with an environment variable or managed secret.
3. Remove it from the current tree and, when necessary, purge it from Git history.
4. Review logs, CI artifacts, releases, and deployed frontend bundles for copies.
