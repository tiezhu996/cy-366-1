package com.generated.ldesportsbar.model;

public enum SeatStatus {
  AVAILABLE("空闲"),
  IN_USE("使用中"),
  FAULT("故障"),
  RESERVED("预约");

  private final String label;

  SeatStatus(String label) {
    this.label = label;
  }

  public String getLabel() {
    return label;
  }
}
