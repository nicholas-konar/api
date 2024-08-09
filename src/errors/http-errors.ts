export class HttpError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

export class InvalidEmailError extends HttpError {
    constructor(message = 'Invalid Email.') {
        super(message, 422)
    }
}