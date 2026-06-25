import { logger } from "../utils/logger";
import type { Request, Response } from "express";

function validateServiceDescription(req: Request, res: Response) {
  try {
    const { serviceDescription } = req.body;
    const queryParams = req.query;
    const editMode = queryParams.edit;

    if (serviceDescription && serviceDescription.trim() !== "") {
      // Check if in edit mode and redirect accordingly
      if (editMode) {
        res.redirect("/summary-page");
      } else {
        res.redirect("/choose-location");
      }
    } else {
      res.render("serviceDescription.njk", {
        showError: true,
        // Add any other variables needed in your template
      });
    }
  } catch (error) {
    logger.error(error);
    throw error; // Rethrow the error for debugging purposes
  }
}

export { validateServiceDescription };
