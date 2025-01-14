export class Result<TValue, TError> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value: TValue | undefined,
    private readonly _error: TError | undefined,
  ) {}

  public get isSuccess(): boolean {
    return this._isSuccess;
  }

  public get value(): TValue {
    if (!this._isSuccess || this._value === undefined) {
      throw new Error('Cannot access value of a failed result');
    }
    return this._value;
  }

  public get error(): TError {
    if (this._isSuccess || this._error === undefined) {
      throw new Error('Cannot access error of a successful result');
    }
    return this._error;
  }

  public static success<TValue, TError = never>(
    value?: TValue,
  ): Result<TValue, TError> {
    if (value === undefined) {
      return new Result<TValue, TError>(true, undefined, undefined);
    }
    return new Result<TValue, TError>(true, value, undefined);
  }

  public static failure<TError, TValue = never>(
    error: TError,
  ): Result<TValue, TError> {
    return new Result<TValue, TError>(false, undefined, error);
  }
}
