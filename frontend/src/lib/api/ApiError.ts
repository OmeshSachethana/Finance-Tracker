export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: Record<string, string[] | undefined>;

  constructor(status: number, code: string, message: string, details?: ApiError['details']) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
