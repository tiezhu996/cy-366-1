package com.generated.ldesportsbar.model;

import java.time.LocalDateTime;

public record Seat(
  Long id,
  String seatCode,
  SeatZone zone,
  SeatStatus status,
  String memberName,
  String memberLevel,
  Integer remainingMinutes,
  LocalDateTime startTime,
  LocalDateTime endTime,
  LocalDateTime createdAt,
  LocalDateTime updatedAt
) {}
