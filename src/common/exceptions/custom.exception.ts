export class CustomException extends Error {
  public constructor(
    public readonly code: string,
    public readonly metadata: Record<string, unknown>,
    message: string,
  ) {
    super(message);
  }
}
