export class ResultError {
  public constructor(
    public readonly code: string,
    public readonly statusCode: number,
    public readonly description: string,
  ) {}
}
