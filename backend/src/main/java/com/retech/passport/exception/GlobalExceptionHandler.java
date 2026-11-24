package com.retech.passport.exception;
import com.retech.passport.dto.ErrorResponse;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> notFound(NotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("NOT_FOUND", ex.getMessage())); }
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorResponse> conflict(ConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse("CONFLICT", ex.getMessage())); }
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponse> forbidden(ForbiddenException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse("FORBIDDEN", ex.getMessage())); }
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> unauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("UNAUTHORIZED", ex.getMessage())); }
    @ExceptionHandler(UnsupportedMediaTypeException.class)
    public ResponseEntity<ErrorResponse> unsupportedMedia(UnsupportedMediaTypeException ex) {
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(new ErrorResponse("UNSUPPORTED_MEDIA_TYPE", ex.getMessage())); }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> validation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .reduce("", (a, b) -> a.isEmpty() ? b : a + "; " + b);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("VALIDATION_ERROR", msg)); }
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> fileTooLarge(MaxUploadSizeExceededException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("FILE_TOO_LARGE", "File exceeds 5MB limit")); }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> general(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("INTERNAL_ERROR", "An unexpected error occurred")); }
}