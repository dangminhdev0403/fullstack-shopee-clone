// Lớp ErrorResponse kế thừa từ Error
class ErrorResponse extends Error {
  data: {
    status: number;
    error: string;
    message: string;
    data: null;
  };
  status: number;
  error: string;

  constructor(status: number, error: string, message: string | object) {
    const msg = typeof message === "string" ? message : JSON.stringify(message);
    super(msg);
    Object.setPrototypeOf(this, ErrorResponse.prototype);
    this.status = status;
    this.error = error;
    this.message = msg;
    this.data = { status, error, message: msg, data: null };

    this.name = "ErrorResponse";
  }
}

export default ErrorResponse;
