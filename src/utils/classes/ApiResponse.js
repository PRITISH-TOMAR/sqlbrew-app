export class ApiResponse {
  constructor(success, message, data = null, error = null) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Create a success response
   */
  static success(message, data = null) {
    return new ApiResponse(true, message, data, null);
  }

  /**
   * Create an error response
   */
  static error(message, error = null) {
    return new ApiResponse(false, message, null, error);
  }

  /**
   * Check if response is successful
   */
  isSuccess() {
    return this.success === true;
  }

  /**
   * Check if response is an error
   */
  isError() {
    return this.success === false;
  }

  /**
   * Get response data
   */
  getData() {
    return this.data;
  }

  /**
   * Get error details
   */
  getError() {
    return this.error;
  }

  /**
   * Convert to JSON
   */
  toJSON() {
    return {
      success: this.success,
      message: this.message,
      data: this.data,
      error: this.error,
      timestamp: this.timestamp
    };
  }
}
