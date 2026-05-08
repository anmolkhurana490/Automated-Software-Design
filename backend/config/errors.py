from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from typing import Any

class BadRequestException(Exception):
  def __init__(self, message: str):
    self.message = message
    self.status_code = 400
    super().__init__(self.message)

class UnauthorizedException(Exception):
  def __init__(self, message: str):
    self.message = message
    self.status_code = 401
    super().__init__(self.message)

class NotFoundException(Exception):
  def __init__(self, message: str):
    self.message = message
    self.status_code = 404
    super().__init__(self.message)

class ConflictException(Exception):
  def __init__(self, message: str):
    self.message = message
    self.status_code = 409
    super().__init__(self.message)

class UnprocessableEntityException(Exception):
  def __init__(self, message: str):
    self.message = message
    self.status_code = 422
    super().__init__(self.message)


def make_payload(status: str, message: str, data: Any = None):
  return {
    "status": status,
    "message": message,
    "data": data
  }

def register_exception_handlers(app):
  @app.exception_handler(BadRequestException)
  async def bad_request_exception_handler(request, exc: BadRequestException):
    return JSONResponse(status_code=exc.status_code, content=make_payload("error", exc.message))

  @app.exception_handler(UnauthorizedException)
  async def unauthorized_exception_handler(request, exc: UnauthorizedException):
    return  JSONResponse(status_code=exc.status_code, content=make_payload("error", exc.message))

  @app.exception_handler(NotFoundException)
  async def not_found_exception_handler(request, exc: NotFoundException):
    return  JSONResponse(status_code=exc.status_code, content=make_payload("error", exc.message))

  @app.exception_handler(ConflictException)
  async def conflict_exception_handler(request, exc: ConflictException):
    return  JSONResponse(status_code=exc.status_code, content=make_payload("error", exc.message))

  @app.exception_handler(UnprocessableEntityException)
  async def unprocessable_entity_exception_handler(request, exc: UnprocessableEntityException):
    return  JSONResponse(status_code=exc.status_code, content=make_payload("error", exc.message))
  
  @app.exception_handler(RequestValidationError)
  async def validation_exception_handler(request, exc: RequestValidationError):
    return  JSONResponse(status_code=422, content=make_payload("error", "Validation Error", data=exc.errors()))

  @app.exception_handler(Exception)
  async def generic_exception_handler(request, exc: Exception):
    return  JSONResponse(status_code=500, content=make_payload("error", f"Internal Server Error - {str(exc)}"))