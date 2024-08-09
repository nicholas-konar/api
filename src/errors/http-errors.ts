export class HttpError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

export class InternalServerError extends HttpError {
  constructor(message = 'Internal Server Error') {
    super(message, 500)
  }
}

export class InvalidEmailError extends HttpError {
    constructor(message = 'Invalid Email') {
        super(message, 422)
    }
}