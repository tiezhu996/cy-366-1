package com.generated.ldesportsbar.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.generated.ldesportsbar.model.Seat;
import com.generated.ldesportsbar.model.SeatStatistics;
import com.generated.ldesportsbar.model.SeatStatus;
import com.generated.ldesportsbar.model.SeatZone;
import com.generated.ldesportsbar.model.ZoneSeatStatistics;
import com.generated.ldesportsbar.service.SeatService;

@RestController
@RequestMapping({ "/seats", "/api/seats" })
public class SeatController {

  private final SeatService seatService;

  public SeatController(SeatService seatService) {
    this.seatService = seatService;
  }

  @GetMapping
  public List<Seat> getAllSeats(@RequestParam(required = false) SeatZone zone) {
    if (zone != null) {
      return seatService.getSeatsByZone(zone);
    }
    return seatService.getAllSeats();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Seat> getSeatById(@PathVariable Long id) {
    return seatService.getSeatById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/code/{seatCode}")
  public ResponseEntity<Seat> getSeatByCode(@PathVariable String seatCode) {
    return seatService.getSeatByCode(seatCode)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/{id}/status")
  public ResponseEntity<Seat> updateSeatStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
    try {
      SeatStatus status = SeatStatus.valueOf(body.get("status"));
      Seat updated = seatService.updateSeatStatus(id, status);
      return ResponseEntity.ok(updated);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @PutMapping("/{id}/member")
  public ResponseEntity<Seat> updateSeatMember(@PathVariable Long id, @RequestBody Map<String, Object> body) {
    try {
      String memberName = (String) body.get("memberName");
      String memberLevel = (String) body.get("memberLevel");
      Integer remainingMinutes = body.get("remainingMinutes") != null
          ? ((Number) body.get("remainingMinutes")).intValue()
          : 0;
      Seat updated = seatService.updateSeatMember(id, memberName, memberLevel, remainingMinutes);
      return ResponseEntity.ok(updated);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  @GetMapping("/statistics")
  public SeatStatistics getStatistics() {
    return seatService.getStatistics();
  }

  @GetMapping("/statistics/zones")
  public List<ZoneSeatStatistics> getZoneStatistics() {
    return seatService.getZoneStatistics();
  }
}
