# Contributing to GOV.UK OneLogin Frontend Monorepo
To ensure a smooth and consistent experience, please follow the guidelines below.

## Branch Protection Rules

We have a branch protection rule in place for the `main` branch to ensure the integrity of our codebase. The protection includes the following settings:

- **Require a pull request before merging**: All changes to the `main` branch must be made via a pull request (PR). Direct pushes to `main` are not allowed.
- **Require approvals**: Pull requests targeting `main` require at least **1 approval** and **no changes requested** before they can be merged.
- **Dismiss stale pull request approvals**: If new commits are pushed to a pull request, previous approvals will be dismissed, ensuring that reviewers approve the final code changes.
- **Review from Code Owners**: An approved review from a code owner is required before merging.
- **Restrict who can dismiss pull request reviews**: Only members of the digital-identity-frontend-capability team are allowed to dismiss pull request reviews.
- **Bypass required pull requests**: Currently only the following users are allowed to bypass the pull request requirements for merging directly into the `main` branch:
  - **di-holme**
  - **nickhealGDS**
- **Status checks required to pass before merging**: Before merging a pull request into `main`, certain status checks must pass. These include:
  - **Collect coverage**: Code coverage checks must pass before merging. Ensure that all tests are passing, and the coverage threshold is met.
- **Conversation resolution before merging**: All conversations related to code (comments, suggestions, etc.) must be resolved before a pull request can be merged into `main`. This ensures that all feedback is addressed and incorporated.
- **Require signed commits**: All commits pushed to branches that target `main` must have verified signatures to ensure the authenticity of the changes.

---

## Conventional Commits

We use **Conventional Commits** for our commit messages to help automate versioning, maintain a clear changelog, and provide better collaboration. The most common types are:

- **feat**: A new feature.
  - Example: `feat(ticket-number): add authentication page`
  
- **fix**: A bug fix.
  - Example: `fix(ticket-number): resolve issue with login form validation`
  
- **docs**: Documentation changes.
  - Example: `docs(ticket-number): update README with new setup instructions`
  
- **style**: Code style changes (e.g., formatting, missing semicolons).
  - Example: `style(ticket-number): fix indentation in auth.js`
  
- **refactor**: Code changes that neither fix a bug nor add a feature, but improve the code structure or readability.
  - Example: `refactor(ticket-number): simplify user authentication logic`
  
- **test**: Adding or modifying tests.
  - Example: `test(ticket-number): add unit tests for user model`

### Why Conventional Commits?

- **Automated Versioning**: The commit messages are used by tools (e.g., NX) to automatically determine version numbers for new releases based on the types of changes made.
- **Clear Changelog Generation**: A consistent format helps automatically generate a changelog, making it easy to track changes across releases.
- **Easy Collaboration**: Having a standard makes it easier for all contributors to follow the same practices.

Please ensure to follow this convention when committing changes to the repository.

For detailed information on Conventional Commits, see the [Automatically Version with Conventional Commits](https://nx.dev/recipes/nx-release/automatically-version-with-conventional-commits)

---

## Testing Changes: CRI vs Non-CRI Repositories

In our monorepo, the packages will be used by the frontend repositories across the OneLogin programme. These frontend repositories can be grouped into **CRI** and **Non-CRI**. It's important to ensure that changes are tested in both CRI and Non-CRI repos to verify compatibility and functionality.

### 1. **CRI (Credential Issuers) Repositories**

   - **Definition**: CRI repositories are those within the Identity Pod.
   - **Testing Requirements**:
     - When making changes to any shared package, you **must test** the affected functionality in the CRI repositories.
     - [Common Express](https://github.com/govuk-one-login/ipv-cri-common-express) is a package used by frontend repositories in the Identity Pod. It contains shared code, allowing the repositories to focus on the specific screens and interactions required for their use cases. When making changes to packages, be aware that you may also need to configure **Common Express** to ensure compatibility with CRI repositories.

   This package includes:
   - **Assets**: JavaScript used for progressive enhancement.
   - **Components**: Common Nunjucks templates.
   - **Lib**: Express middleware.
   - **Routes**: Express router to handle common OAuth functionality.
   - **Scripts**: `checkTranslations` script to ensure localisation files are synchronised.

   - **How to Test**:
     - Copy the affected package from your branch with your local changes into the `node_modules` folder of the consuming repository.
     - If changes are needed in `common-express`, clone the repository, create a branch, make the necessary updates, and then copy those changes into its `node_modules` folder as well.
     - This approach enables you to test updates in both the package and `common-express` without committing or publishing the code.


### 2. **Non-CRI Repositories**

   - **Definition**: Non-CRI repositories are part of the Mobile and Accounts Pods.
   - **Testing Requirements**:
     - When modifying any package, you **must test** the affected functionality within the Non-CRI repositories.
     
   - **How to Test**
     - Copy the affected package from your branch with your local changes into the `node_modules` folder of the consuming repository.