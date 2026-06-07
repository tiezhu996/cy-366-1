CREATE TABLE IF NOT EXISTS operation_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_name VARCHAR(120) NOT NULL,
  owner_name VARCHAR(80) NOT NULL,
  status VARCHAR(40) NOT NULL,
  metric VARCHAR(40) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO operation_records (module_name, owner_name, status, metric)
VALUES ('机位/包厢实时状态看板', '运营组', 'ready', '100%');

CREATE TABLE IF NOT EXISTS seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seat_code VARCHAR(20) NOT NULL UNIQUE,
  zone VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  member_name VARCHAR(80),
  member_level VARCHAR(20),
  remaining_minutes INT DEFAULT 0,
  start_time TIMESTAMP NULL,
  end_time TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_zone (zone),
  INDEX idx_status (status)
);

INSERT INTO seats (seat_code, zone, status, member_name, member_level, remaining_minutes, start_time) VALUES
('A01', 'HALL', 'AVAILABLE', NULL, NULL, 0, NULL),
('A02', 'HALL', 'IN_USE', '张三', '黄金会员', 125, NOW() - INTERVAL 55 MINUTE),
('A03', 'HALL', 'AVAILABLE', NULL, NULL, 0, NULL),
('A04', 'HALL', 'IN_USE', '李四', '普通会员', 45, NOW() - INTERVAL 75 MINUTE),
('A05', 'HALL', 'FAULT', NULL, NULL, 0, NULL),
('A06', 'HALL', 'RESERVED', '王五', '钻石会员', 0, NULL),
('A07', 'HALL', 'AVAILABLE', NULL, NULL, 0, NULL),
('A08', 'HALL', 'IN_USE', '赵六', '普通会员', 180, NOW() - INTERVAL 30 MINUTE),
('B01', 'BOX', 'IN_USE', '陈七', '钻石会员', 90, NOW() - INTERVAL 90 MINUTE),
('B02', 'BOX', 'AVAILABLE', NULL, NULL, 0, NULL),
('B03', 'BOX', 'IN_USE', '周八', '黄金会员', 60, NOW() - INTERVAL 120 MINUTE),
('B04', 'BOX', 'RESERVED', '吴九', '黄金会员', 0, NULL),
('B05', 'BOX', 'AVAILABLE', NULL, NULL, 0, NULL),
('B06', 'BOX', 'FAULT', NULL, NULL, 0, NULL),
('V01', 'VIP', 'IN_USE', '郑十', '钻石会员', 240, NOW() - INTERVAL 60 MINUTE),
('V02', 'VIP', 'AVAILABLE', NULL, NULL, 0, NULL),
('V03', 'VIP', 'IN_USE', '冯十一', '钻石会员', 150, NOW() - INTERVAL 45 MINUTE),
('V04', 'VIP', 'RESERVED', '钱十二', '钻石会员', 0, NULL),
('V05', 'VIP', 'AVAILABLE', NULL, NULL, 0, NULL);
