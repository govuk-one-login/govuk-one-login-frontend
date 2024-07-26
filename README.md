# GovUK Frontend Monorepo

This monorepo is designed to house packages and UI components based on the GovUK Frontend design system. It utilises the Nx workspace for managing multiple projects within a single repository.

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

# Create a new component

To create a new component, follow these steps:

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
