export default class ApiError extends Error {
  statusCode: number | undefined;

  constructor(statusCode: number | undefined, message: string) {
    super(message);
    this.statusCode = statusCode;
  }

  static unauthorizedError() {
    return new ApiError(401, 'User is not authorized');
  }

  static badRequest(message: string) {
    return new ApiError(400, message);
  }

  static serverError(message: string) {
    return new ApiError(500, message);
  }
}
