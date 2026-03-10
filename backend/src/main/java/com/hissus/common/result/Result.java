package com.hissus.common.result;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Result<T> {

  private final String code;
  private final String message;
  private final T data;
  private final Instant timestamp;

  private Result(String code, String message, T data) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.timestamp = Instant.now();
  }

  public static <T> Result<T> success(T data) {
    return new Result<>("SUCCESS", "Operation successful", data);
  }

  public static <T> Result<T> success() {
    return new Result<>("SUCCESS", "Operation successful", null);
  }

  public static <T> Result<T> error(String code, String message) {
    return new Result<>(code, message, null);
  }
}
