# Browser tests

This folder contains two folders; functional tests and snapshot tests.
The functional tests runs the frontend ui components against a browser using Playwright.
The snapshot tests are then captured from the functional tests. When the update test command is ran, playwright compares the new snapshot with the old snapshot.

## Functional tests

## Running Playwright tests
- Install playwright `npx playwright install`
- By default, headless mode is active which means a chromium browser window will open when runnning the tests. If you do not want this, it is optional and you can remove the --headless flags from the run commands or set headless to false in the playwright.config.ts
- To run the tests = `npm run test:visual` (Tests will fail first time if there are no snapshots as there is nothing to test against)

- Optionally, you can install the playwright VSCode Extension that will give you a UI to run the playwright tests.

## Snapshot folder
This folder contains all the snapshots that are taken for each of the frontend-ui components in order to verify the 
correct styling of the component. If the styling changes after the initial snapshot that is taken, the second time the 
test is ran, the snapshots will be compared. This visually tests the looks of the components. 
Be aware that when running the snapshot tests locally you will be using the browser on your
machine instead of the browser in the test container and so subtle differences could appear and the snapshot files
generated will be named differently.

### Updating snapshots
If you make a change that affects the appearance of a page then you will need to update the saved snapshot file.
- `npm run test:visual:update: "playwright test browser-tests/functional-tests --headed --update-snapshots"`

## Ports
3000 frontend ui components viewed from the testing alpha-app