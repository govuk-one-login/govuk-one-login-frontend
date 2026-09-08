# Version Branch Ruleset Setup

This document describes how the repository ruleset is configured to protect version branches alongside `main`.

## Overview

Version branches (e.g., `frontend-ui@v5`, `frontend-analytics@v2`) are used to maintain older major versions of packages after a new major version has been released from `main`. These branches have the same protections as `main` to ensure release integrity.

## Ruleset Configuration

The repository uses a GitHub branch ruleset that targets version branches using the inclusion pattern:

```
*@v*
```

This matches any branch containing `@v` in its name, which aligns with the naming convention `{package-name}@v{major-version}`.

### Rules Applied

| Rule | Setting |
|------|---------|
| Require pull request before merging | ✅ Enabled |
| Required approvals | 1 |
| Dismiss stale pull request approvals | ✅ Enabled |
| Require status checks to pass | ✅ Enabled |
| Block force pushes | ✅ Enabled |
| Block branch deletion | ✅ Enabled |

### Required Status Checks

The following status checks must pass before a PR can be merged into a version branch:

- Format check (Biome)
- Lint check (Biome)
- Unit tests (Vitest)
- Build

These are the same checks required for merging into `main`.

## Setting Up the Ruleset

To configure or modify the ruleset:

1. Go to **Settings** → **Rules** → **Rulesets** in the GitHub repository.
2. Create a new ruleset or edit the existing version branch ruleset.
3. Under **Target branches**, add the inclusion pattern `*@v*`.
4. Enable the rules listed above.
5. Save the ruleset.

## Release Workflow Compatibility

The release workflow (`.github/workflows/release.yml`) already supports publishing from version branches via the condition:

```yaml
if: ${{ github.ref == 'refs/heads/main' || contains(github.ref, '@v') }}
```

This means the Release workflow can be triggered from any version branch to publish patch releases for older major versions.

## Creating a New Version Branch

When preparing a major version release for any package:

1. Ensure you are on the latest `main`:
   ```bash
   git checkout main
   git pull origin main
   ```

2. Create the version branch:
   ```bash
   git checkout -b {package-name}@v{current-major-version}
   git push -u origin {package-name}@v{current-major-version}
   ```

3. The ruleset will automatically apply to the new branch (no manual configuration needed) because it matches the `*@v*` pattern.

4. Proceed with the major version release from `main`.

## Examples

| Scenario | Branch Name | Purpose |
|----------|-------------|---------|
| Releasing `frontend-ui` v6 | `frontend-ui@v5` | Maintains v5.x.x patches |
| Releasing `frontend-analytics` v5 | `frontend-analytics@v4` | Maintains v4.x.x patches |
| Releasing `frontend-language-toggle` v3 | `frontend-language-toggle@v2` | Maintains v2.x.x patches |
