export class Result<TValue, TError> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value: TValue | null,
    private readonly _error: TError | null,
  ) {}

  public get isSuccess(): boolean {
    return this._isSuccess;
  }

  public get value(): TValue {
    return this._value;
  }

  public get error(): TError {
    return this._error;
  }

  public static success<TValue, TError = never>(
    value?: TValue,
  ): Result<TValue, TError> {
    return new Result<TValue, TError>(true, value, null);
  }

  public static failure<TError, TValue = never>(
    error: TError,
  ): Result<TValue, TError> {
    return new Result<TValue, TError>(false, null, error);
  }
}
