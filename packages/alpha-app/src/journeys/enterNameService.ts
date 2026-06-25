import { logger } from "../utils/logger";
import type { Request, Response } from "express";

function validateEnterName(req: Request, res: Response) {
  try {
    const { firstName, lastName } = req.body;

    const showFirstNameError = !firstName || firstName === "";
    const showLastNameError = !lastName || lastName === "";

    if (!showFirstNameError && !showLastNameError) {
      res.redirect("/welcome");
    } else {
      res.render("enterName.njk", {
        showFirstNameError,
        showLastNameError,
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export { validateEnterName };
