
export function assert(condition: any, error: Error) {
    if (!Boolean(condition)) {
      throw error
    }
}