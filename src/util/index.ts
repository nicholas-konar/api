export function assert(condition: any, error: new () => Error) {
  if (!Boolean(condition)) {
    throw new error()
  }
}
