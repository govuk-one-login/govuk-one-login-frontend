// Extends request with custom properties

declare namespace Express {
  export interface Request {
    session: {
      userSession?: {
        startedJourney?: boolean;
      };
    };
  }
}
