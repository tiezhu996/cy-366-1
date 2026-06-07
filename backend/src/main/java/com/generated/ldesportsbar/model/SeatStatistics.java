package com.generated.ldesportsbar.model;

public record SeatStatistics(
  long totalSeats,
  long availableSeats,
  long inUseSeats,
  long faultSeats,
  long reservedSeats,
  double occupancyRate
) {}
