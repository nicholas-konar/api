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

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request') {
    super(message, 400)
  }
}

export class InvalidEmailError extends HttpError {
  constructor(message = 'Invalid Email') {
    super(message, 422)
  }
}

export class EmailAlreadyInUseError extends HttpError {
  constructor(message = 'Email Already In Use') {
    super(message, 422)
  }
}

export class UserNotFoundError extends HttpError {
  constructor(message = 'User Not Found') {
    super(message, 404)
  }
}
export class UsernameTakenError extends HttpError {
  constructor(message = 'Username Taken') {
    super(message, 422)
  }
}

export class GroupNameTakenError extends HttpError {
  constructor(message = 'Group Name Taken') {
    super(message, 422)
  }
}

export class MissingJwtError extends HttpError {
  constructor(message = 'Missing JWT') {
    super(message, 422)
  }
}

export class ExpiredLinkError extends HttpError {
  constructor(message = 'This Link Has Expired') {
    super(message, 422)
  }
}

export class DeadLinkError extends HttpError {
  constructor(message = 'This Link Is Dead') {
    super(message, 422)
  }
}
