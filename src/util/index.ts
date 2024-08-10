
export function assert(condition: unknown, error: Error) {
    if (!Boolean(condition)) {
      throw error
    }
}