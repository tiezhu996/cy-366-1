package com.generated.ldesportsbar.model;

public enum SeatZone {
  HALL("大厅"),
  BOX("包厢"),
  VIP("VIP区");

  private final String label;

  SeatZone(String label) {
    this.label = label;
  }

  public String getLabel() {
    return label;
  }
}
