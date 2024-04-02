class Error {
  constructor(request, response) {
    this.request = request;
    this.response = response;
  }

  unAuthorize() {}

  notFound() {}

  internalServerError() {}
}

class UnAuthorize extends Error {
  constructor(response, request) {
    super(request);
    super(response);
  }
}
