export class SessionNotFoundError extends Error {
  constructor() {
    super("Session not found or expired");
    this.name = "SessionNotFoundError";
  }
}

