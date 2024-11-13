# GovUK Frontend Monorepo

This monorepo is designed to house packages and UI components based on the GOV.UK Frontend design system. It utilises the Nx workspace for managing multiple projects within a single repository.

## Features

- Nx workspace setup for efficient development and collaboration.
- Integration of GovUK Frontend packages and UI components.
- Simplified build and deployment processes.
- Consistent coding standards and best practices set out in the GDS way https://gds-way.digital.cabinet-office.gov.uk/standards

## Project Structure

The monorepo is organised using Nx workspace conventions

## Continuous Deployment (CD) Workflow

To trigger the CD workflow manually, follow these steps:

- Go to the Actions tab in this repository.
- Click on the "CD" workflow.
- Click the "Run workflow" button.
- Select the target package and the desired increment type.
- Click the "Run workflow" button to start the deployment process.

# Create A New Package

To create a new package, follow these steps:

- Run the following command:

  ```bash
  nx g automation:generate-component
  ```

  Or, if you want to specify the package name, run:

  ```bash
  nx g automation:generate-component package-name
  ```

- The NX prompt will ask you the following questions:

  - **Name**: What name would you like to use? (required)
  - **Description**: What is the package about? (optional)

- Answer the prompts accordingly. If you provided the package name in the command, you won't be asked for it.

- After answering the questions, the command will generate the package with the necessary files.



-

## Lint the code with eslint+prettier:

### To Run All Packages

To check ESLint issues in all packages:
`nx run-many --target=lint --all`

To check code formatting in all packages:
`nx run-many --target=format:check --all`

To fix formatting issues that can be resolved automatically:
`nx run-many --target=format --all`

To run the above commands on just affected packages, replace `run-many` with `affected`

### To Run a Singular Package

To check ESLint issues in a specific package:
`nx run [package-name]:lint`

To check and fix code formatting issues in a specific package:
`nx run [package-name]:format`

### Configuration Files

The rules for linting and formatting are defined in .eslintrc and can be customized as needed. The configuration includes recommended rulesets from ESLint, TypeScript, and Prettier.

### Setup Instructions

To ensure that NX is running the latest versions of all packages within the monorepository, follow these steps:

#### At the Root Level:
1. Install dependencies by running `npm install`.
2. Build the entire project by running `npm run build`.

#### At the `alpha-app` Level:
1. Start the development server by running `npm run dev`.
   This will automatically refresh the symlink as part of the watch command, ensuring that changes to linked packages are up-to-date.

#### At the `frontend-language-toggle` Level:
1. Start the development process by running `npm run dev`.
2. Ensure that this package is running alongside the `dev` command to reflect updates properly.

## Publishing Packages

To release a package from the monorepo, use the **GitHub Actions CD workflow**. This workflow automates versioning and package publishing to NPM. Follow these steps to initiate a release:

1. **Trigger the Workflow**  
   Go to the **Actions** tab in the GitHub repository, select the **CD** workflow, and click **Run workflow**.

2. **Fill in the Required Inputs**:
   - **Target**: Choose the package you want to release from the list of options:
     - `@govuk-one-login/alpha-component`
     - `@govuk-one-login/frontend-analytics`
     - `@govuk-one-login/frontend-language-toggle`
     - `@govuk-one-login/frontend-passthrough-headers`
     - `@govuk-one-login/frontend-vital-signs`
     - `@govuk-one-login/frontend-asset-loader`
   - **Increment**: Select the version increment for this release (`patch`, `minor`, or `major`) based on [Semantic Versioning](https://semver.org/).
   - **First Release**: Specify if this is the first release of the package from this repository. If set to `true`, the workflow will treat it as an initial release.
   - **Dry Run**: Set this to `true` for a dry run, which will simulate the release process without publishing.

3. **Publishing Process**  
   The workflow will:
   - Run format, lint, test, and build checks on the specified package.
   - Automatically version and publish the package to NPM if the `dry_run` is set to `false`.

4. **Verify the Release**  
   Once the workflow completes, confirm the package has been published on the NPM registry.

## Contributing Code

We welcome contributions from other teams to the **govuk-one-login-frontend** monorepo! Follow these guidelines to ensure consistency and quality across the repository.

### Steps to Contribute

1. **Clone The Repo**  

   Clone the repository locally and navigate into the project directory:
   ```bash
   git clone git@github.com:govuk-one-login/govuk-one-login-frontend.git ./your_folder_name

  Replace your_folder_name with your desired directory name. If you omit this part, it will clone into a folder named govuk-one-login-frontend.

2. **Creating A Branch**

After cloning, create a new branch with a descriptive name that reflects the changes you’re making. For example:

 `git checkout -b ticket-number/your-feature-name`

3. **Install Dependencies**

Ensure all dependencies are installed, by running:

  `npm install`

4. **Make Your Changes**

Add your code changes, ensuring that they align with GOV.UK OneLogin coding standards and best practices.

5. **Run Tests and Linting**

Before pushing your changes, run all tests and linting to make sure your code adheres to the monorepo's requirements:

- If you only want to run tests in the affected package, `cd` into the package folder and run `npm test` or just `npm test` at the root level to run all test suites.
- If there are any uncommitted changes, you will need to run `npx nx run-many -t test` as the tests and linters cache the results, so they will only run for changed cases.

- [Lint the code with eslint+prettier:](#lint-the-code-with-eslintprettier)

6. **Commit and Push Changes**

Use **Conventional Commits** for your commit messages to ensure automatic versioning and changelog updates. This allows NX to automatically generate a changelog with merged PRs for each release, helping users track the latest changes when they update their packages.

For example:

- `feat(ticket-number): add new component for user authentication`
- `fix(ticket-number): correct header alignment issue`
- `docs(ticket-number): update README with contribution guidelines`

7. **Open a Pull Request**

We use a PR template to ensure all necessary details are captured. Simply fill in the details and check the relevant checkboxes. 

8. **Review and Approval**

Your PR needs to be reviewed by a member of the code owners, the digital-identity-frontend-capability team.Once approved can be merged into main.