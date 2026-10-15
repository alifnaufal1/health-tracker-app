export interface CodedError<TCode extends string = string> {
  code: TCode;
}

export function genericToUserMessage<TCode extends string>(
  isErrorFunc: (error: unknown) => error is CodedError<TCode>,
  messages: Record<TCode, string>,
  error: unknown,
  fallbackMessage: string = "An unexpected error occurred. Try again.",
): string {
  return isErrorFunc(error) ? messages[error.code] : fallbackMessage;
}
