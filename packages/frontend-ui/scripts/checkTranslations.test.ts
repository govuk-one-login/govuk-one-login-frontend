import * as util from "util";
import * as child_process from "child_process";

const exec = util.promisify(child_process.exec);


describe("checkTranslation", () => {
  it("should read the translated files and output logs for what are missing", async () => {
    try {
      await exec("npx tsx ./scripts/checkTranslations.ts ./testFiles/fail");
      fail("CheckTranslations failed to fail");
    } catch (e:unknown) {
      const failOutput = e as Awaited<ReturnType<typeof exec>>;
      // extract logs from output.
      if (failOutput.stdout instanceof String)
      {
      const logs = failOutput.stdout.split("\n");
      const warnings = logs.filter((val) => val.includes("warning"));
      const errors = logs.filter(
        (val) => val.includes("error") || val.includes("Missing"),
      );
      // remove descriptive logs
      warnings.shift();
      errors.shift();

      expect(warnings.length).toEqual(2);

      for (const message of warnings) {
        expect(message).toContain("warning");
        expect(message).toContain("length do not match");
      }

      expect(errors.length).toEqual(4);

      for (const message of errors) {
        expect(
          message.includes("ENGLISH - Missing default.root.field3") ||
            message.includes(
              "ENGLISH - Missing default.root.nest.nest2.nestIsDifferent",
            ) ||
            message.includes("WELSH - Missing default.root.field2") ||
            message.includes("WELSH - Missing default.root.nest.nest2.nest3"),
        ).toEqual(true);
      }
      }
      
    }
  });

  it("should pass with no errors", async () => {
    const output = await exec(
      "npx tsx ./scripts/checkTranslations.ts ./testFiles/success",
    );
    const stout = output.stdout.split("/n");
    const successMessage = !!stout.filter((val) =>
      val.includes("Translation files look good"),
    );

    expect(successMessage).toEqual(true);
  });

  it("should pass plurals with no errors", async () => {
    const output = await exec(
      "npx tsx ./scripts/checkTranslations.ts ./testFiles/plurals",
    );
    const stout = output.stdout.split("/n");
    const successMessage = !!stout.filter((val) =>
      val.includes("Translation files look good"),
    );

    expect(successMessage).toEqual(true);
  });
});
