package com.generated.ldesportsbar.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.generated.ldesportsbar.model.Seat;
import com.generated.ldesportsbar.model.SeatStatistics;
import com.generated.ldesportsbar.model.SeatStatus;
import com.generated.ldesportsbar.model.SeatZone;
import com.generated.ldesportsbar.model.ZoneSeatStatistics;

import jakarta.annotation.PostConstruct;

@Service
public class SeatService {

  private final Map<Long, Seat> seatStore = new ConcurrentHashMap<>();
  private long idSequence = 1;

  @PostConstruct
  public void init() {
    addSeat("A01", SeatZone.HALL, SeatStatus.AVAILABLE, null, null, 0, null);
    addSeat("A02", SeatZone.HALL, SeatStatus.IN_USE, "张三", "黄金会员", 125, LocalDateTime.now().minusMinutes(55));
    addSeat("A03", SeatZone.HALL, SeatStatus.AVAILABLE, null, null, 0, null);
    addSeat("A04", SeatZone.HALL, SeatStatus.IN_USE, "李四", "普通会员", 45, LocalDateTime.now().minusMinutes(75));
    addSeat("A05", SeatZone.HALL, SeatStatus.FAULT, null, null, 0, null);
    addSeat("A06", SeatZone.HALL, SeatStatus.RESERVED, "王五", "钻石会员", 0, null);
    addSeat("A07", SeatZone.HALL, SeatStatus.AVAILABLE, null, null, 0, null);
    addSeat("A08", SeatZone.HALL, SeatStatus.IN_USE, "赵六", "普通会员", 180, LocalDateTime.now().minusMinutes(30));
    addSeat("B01", SeatZone.BOX, SeatStatus.IN_USE, "陈七", "钻石会员", 90, LocalDateTime.now().minusMinutes(90));
    addSeat("B02", SeatZone.BOX, SeatStatus.AVAILABLE, null, null, 0, null);
    addSeat("B03", SeatZone.BOX, SeatStatus.IN_USE, "周八", "黄金会员", 60, LocalDateTime.now().minusMinutes(120));
    addSeat("B04", SeatZone.BOX, SeatStatus.RESERVED, "吴九", "黄金会员", 0, null);
    addSeat("B05", SeatZone.BOX, SeatStatus.AVAILABLE, null, null, 0, null);
    addSeat("B06", SeatZone.BOX, SeatStatus.FAULT, null, null, 0, null);
    addSeat("V01", SeatZone.VIP, SeatStatus.IN_USE, "郑十", "钻石会员", 240, LocalDateTime.now().minusMinutes(60));
    addSeat("V02", SeatZone.VIP, SeatStatus.AVAILABLE, null, null, 0, null);
    addSeat("V03", SeatZone.VIP, SeatStatus.IN_USE, "冯十一", "钻石会员", 150, LocalDateTime.now().minusMinutes(45));
    addSeat("V04", SeatZone.VIP, SeatStatus.RESERVED, "钱十二", "钻石会员", 0, null);
    addSeat("V05", SeatZone.VIP, SeatStatus.AVAILABLE, null, null, 0, null);
  }

  private void addSeat(String seatCode, SeatZone zone, SeatStatus status,
      String memberName, String memberLevel, Integer remainingMinutes, LocalDateTime startTime) {
    long id = idSequence++;
    LocalDateTime now = LocalDateTime.now();
    seatStore.put(id, new Seat(id, seatCode, zone, status, memberName, memberLevel,
        remainingMinutes, startTime, null, now, now));
  }

  public List<Seat> getAllSeats() {
    return seatStore.values().stream()
        .sorted(Comparator.comparing(Seat::seatCode))
        .collect(Collectors.toList());
  }

  public List<Seat> getSeatsByZone(SeatZone zone) {
    return seatStore.values().stream()
        .filter(seat -> seat.zone() == zone)
        .sorted(Comparator.comparing(Seat::seatCode))
        .collect(Collectors.toList());
  }

  public Optional<Seat> getSeatById(Long id) {
    return Optional.ofNullable(seatStore.get(id));
  }

  public Optional<Seat> getSeatByCode(String seatCode) {
    return seatStore.values().stream()
        .filter(seat -> seat.seatCode().equals(seatCode))
        .findFirst();
  }

  public Seat updateSeatStatus(Long id, SeatStatus status) {
    Seat existing = seatStore.get(id);
    if (existing == null) {
      throw new IllegalArgumentException("Seat not found: " + id);
    }
    LocalDateTime startTime = status == SeatStatus.IN_USE ? LocalDateTime.now() : existing.startTime();
    Seat updated = new Seat(
        existing.id(), existing.seatCode(), existing.zone(), status,
        existing.memberName(), existing.memberLevel(), existing.remainingMinutes(),
        startTime, existing.endTime(), existing.createdAt(), LocalDateTime.now());
    seatStore.put(id, updated);
    return updated;
  }

  public Seat updateSeatMember(Long id, String memberName, String memberLevel, Integer remainingMinutes) {
    Seat existing = seatStore.get(id);
    if (existing == null) {
      throw new IllegalArgumentException("Seat not found: " + id);
    }
    Seat updated = new Seat(
        existing.id(), existing.seatCode(), existing.zone(), existing.status(),
        memberName, memberLevel, remainingMinutes,
        existing.startTime(), existing.endTime(), existing.createdAt(), LocalDateTime.now());
    seatStore.put(id, updated);
    return updated;
  }

  public SeatStatistics getStatistics() {
    List<Seat> seats = new ArrayList<>(seatStore.values());
    long total = seats.size();
    long available = seats.stream().filter(s -> s.status() == SeatStatus.AVAILABLE).count();
    long inUse = seats.stream().filter(s -> s.status() == SeatStatus.IN_USE).count();
    long fault = seats.stream().filter(s -> s.status() == SeatStatus.FAULT).count();
    long reserved = seats.stream().filter(s -> s.status() == SeatStatus.RESERVED).count();
    double occupancyRate = total > 0 ? (double) inUse / total * 100 : 0;
    return new SeatStatistics(total, available, inUse, fault, reserved, occupancyRate);
  }

  public List<ZoneSeatStatistics> getZoneStatistics() {
    List<ZoneSeatStatistics> result = new ArrayList<>();
    for (SeatZone zone : SeatZone.values()) {
      List<Seat> seats = getSeatsByZone(zone);
      long total = seats.size();
      long available = seats.stream().filter(s -> s.status() == SeatStatus.AVAILABLE).count();
      long inUse = seats.stream().filter(s -> s.status() == SeatStatus.IN_USE).count();
      long fault = seats.stream().filter(s -> s.status() == SeatStatus.FAULT).count();
      long reserved = seats.stream().filter(s -> s.status() == SeatStatus.RESERVED).count();
      result.add(new ZoneSeatStatistics(zone, zone.getLabel(), total, available, inUse, fault, reserved));
    }
    return result;
  }
}
