package com.generated.ldesportsbar.model;

public record ZoneSeatStatistics(
  SeatZone zone,
  String zoneLabel,
  long totalSeats,
  long availableSeats,
  long inUseSeats,
  long faultSeats,
  long reservedSeats
) {}
