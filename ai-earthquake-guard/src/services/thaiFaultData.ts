import { ActiveFault, SeismicStation } from '../types/seismic';

export const THAI_ACTIVE_FAULTS: ActiveFault[] = [
  {
    id: 'mae-chan',
    name: 'Mae Chan Fault',
    thaiName: 'กลุ่มรอยเลื่อนแม่จัน',
    zone: 'ภาคเหนือ',
    province: 'เชียงราย - เชียงใหม่',
    maxMagnitude: 7.0,
    slipRateMmYear: 1.5,
    riskLevel: 'high',
    description: 'รอยเลื่อนตามแนวระนาบเหลื่อมซ้าย พาดผ่าน อ.ฝาง จ.เชียงใหม่ จนถึง อ.แม่จัน อ.เชียงแสน จ.เชียงราย มีศักยภาพเกิดแผ่นดินไหวรุนแรงที่สุดในภาคเหนือ',
    coordinates: [
      [20.15, 99.20],
      [20.12, 99.45],
      [20.16, 99.75],
      [20.28, 100.08],
      [20.35, 100.30]
    ]
  },
  {
    id: 'mae-tha',
    name: 'Mae Tha Fault',
    thaiName: 'กลุ่มรอยเลื่อนแม่ทา',
    zone: 'ภาคเหนือ',
    province: 'เชียงใหม่ - ลำพูน - เชียงราย',
    maxMagnitude: 6.5,
    slipRateMmYear: 0.8,
    riskLevel: 'high',
    description: 'รอยเลื่อนรูปโค้งตามแนวเหนือ-ใต้ พาดผ่านหุบเขาเชียงใหม่-ลำพูน ใกล้เขตชุมชนเมืองเชียงใหม่ มีประวัติการไหวสะเทือนต่อเนื่อง',
    coordinates: [
      [19.25, 99.20],
      [18.90, 99.18],
      [18.60, 99.05],
      [18.35, 98.95],
      [18.10, 98.85]
    ]
  },
  {
    id: 'phayao',
    name: 'Phayao Fault',
    thaiName: 'กลุ่มรอยเลื่อนพะเยา',
    zone: 'ภาคเหนือ',
    province: 'พะเยา - เชียงราย - ลำปาง',
    maxMagnitude: 6.3,
    slipRateMmYear: 0.7,
    riskLevel: 'high',
    description: 'ศูนย์กลางแผ่นดินไหวขนาด 6.3 ริกเตอร์ เมื่อ 5 พ.ค. 2557 (อ.พาน จ.เชียงราย) สร้างความเสียหายรุนแรงต่อโครงสร้างพื้นฐาน',
    coordinates: [
      [19.75, 99.70],
      [19.55, 99.82],
      [19.25, 99.90],
      [18.95, 100.02]
    ]
  },
  {
    id: 'moei',
    name: 'Moei Fault',
    thaiName: 'กลุ่มรอยเลื่อนเมย',
    zone: 'ภาคเหนือ/ตะวันตก',
    province: 'ตาก - กำแพงเพชร',
    maxMagnitude: 6.8,
    slipRateMmYear: 0.6,
    riskLevel: 'moderate',
    description: 'แนวรอยเลื่อนขนาดใหญ่พาดจากชายแดนไทย-เมียนมา ผ่าน อ.แม่สอด อ.แม่ระมาด และต่อเนื่องถึง จ.กำแพงเพชร',
    coordinates: [
      [17.30, 98.20],
      [16.85, 98.60],
      [16.50, 98.95],
      [16.20, 99.30]
    ]
  },
  {
    id: 'si-sawat',
    name: 'Si Sawat Fault',
    thaiName: 'กลุ่มรอยเลื่อนศรีสวัสดิ์',
    zone: 'ภาคตะวันตก',
    province: 'กาญจนบุรี - สุพรรณบุรี - อุทัยธานี',
    maxMagnitude: 6.5,
    slipRateMmYear: 0.5,
    riskLevel: 'high',
    description: 'พาดผ่านตามแนวแม่น้ำแควใหญ่ ใกล้อ่างเก็บน้ำเขื่อนศรีนครินทร์ เคยก่อให้เกิดแผ่นดินไหวขนาด 5.9 ในปี พ.ศ. 2526',
    coordinates: [
      [15.30, 98.80],
      [14.90, 99.15],
      [14.50, 99.35],
      [14.15, 99.55]
    ]
  },
  {
    id: 'three-pagodas',
    name: 'Three Pagodas Fault',
    thaiName: 'กลุ่มรอยเลื่อนเจดีย์สามองค์',
    zone: 'ภาคตะวันตก',
    province: 'กาญจนบุรี',
    maxMagnitude: 6.5,
    slipRateMmYear: 0.6,
    riskLevel: 'moderate',
    description: 'พาดผ่านด่านเจดีย์สามองค์ อ.สังขละบุรี อ.ทองผาภูมิ และ อ.ไทรโยค ตามแนวร่องน้ำแควน้อย เชื่อมต่อกับรอยเลื่อนในเมียนมา',
    coordinates: [
      [15.35, 98.35],
      [14.95, 98.65],
      [14.45, 99.00],
      [13.95, 99.30]
    ]
  },
  {
    id: 'ranong',
    name: 'Ranong Fault',
    thaiName: 'กลุ่มรอยเลื่อนระนอง',
    zone: 'ภาคใต้',
    province: 'ระนอง - ชุมพร - ประจวบคีรีขันธ์ - พังงา',
    maxMagnitude: 6.0,
    slipRateMmYear: 0.4,
    riskLevel: 'moderate',
    description: 'วางตัวในแนวทิศตะวันออกเฉียงเหนือ-ตะวันตกเฉียงใต้ พาดผ่านทะเลอันดามันและชายฝั่งภาคใต้ตอนบน',
    coordinates: [
      [10.90, 99.10],
      [10.30, 98.85],
      [9.80, 98.60],
      [9.20, 98.40]
    ]
  },
  {
    id: 'khlong-marui',
    name: 'Khlong Marui Fault',
    thaiName: 'กลุ่มรอยเลื่อนคลองมะรุ่ย',
    zone: 'ภาคใต้',
    province: 'สุราษฎร์ธานี - พังงา - กระบี่ - ภูเก็ต',
    maxMagnitude: 6.2,
    slipRateMmYear: 0.5,
    riskLevel: 'high',
    description: 'พาดผ่านจากอ่าวบ้านดอน จ.สุราษฎร์ธานี ลงสู่อ่าวพังงาและใกล้เกาะภูเก็ต เคยก่อให้เกิดแผ่นดินไหวขนาด 4.3 ใน อ.ถลาง ภูเก็ต',
    coordinates: [
      [9.35, 99.30],
      [8.90, 98.95],
      [8.50, 98.60],
      [8.05, 98.30]
    ]
  },
  {
    id: 'sagaing-fault',
    name: 'Sagaing Fault (Regional Impact)',
    thaiName: 'แนวรอยเลื่อนสะกาย (เมียนมา - ส่งผลสะเทือนถึงไทย)',
    zone: 'ภูมิภาคข้างเคียง',
    province: 'เมียนมา (กระทบ กทม. และภาคเหนือ)',
    maxMagnitude: 7.9,
    slipRateMmYear: 18.0,
    riskLevel: 'high',
    description: 'รอยเลื่อนเปลี่ยนรูปขนาดใหญ่ของแผ่นเปลือกโลกเมียนมา เมื่อไหวสะเทือนระดับ M7.0+ สามารถส่งคลื่นความถี่ต่ำเขย่าอาคารสูงในแอ่งกรุงเทพฯ ให้แกว่งตัวรุนแรง',
    coordinates: [
      [23.50, 95.90],
      [21.90, 96.10],
      [19.80, 96.25],
      [17.30, 96.50],
      [15.80, 96.80]
    ]
  }
];

export const THAI_SEISMIC_STATIONS: SeismicStation[] = [
  {
    id: 'STA-CNX',
    code: 'CHM',
    name: 'สถานีตรวจวัดคลื่นไหวสะเทือนเชียงใหม่',
    province: 'เชียงใหม่',
    lat: 18.7953,
    lng: 98.9817,
    elevationM: 312,
    status: 'online',
    pga: 0.002,
    snr: 45.2,
    lastPing: Date.now(),
    network: 'TMD_NATIONAL'
  },
  {
    id: 'STA-CRI',
    code: 'CRI',
    name: 'สถานีเฝ้าระวังรอยเลื่อนแม่จัน-เชียงราย',
    province: 'เชียงราย',
    lat: 19.9105,
    lng: 99.8406,
    elevationM: 390,
    status: 'online',
    pga: 0.003,
    snr: 48.0,
    lastPing: Date.now(),
    network: 'DMR_FAULT'
  },
  {
    id: 'STA-MSH',
    code: 'MSH',
    name: 'สถานีตรวจวัดแม่ฮ่องสอน',
    province: 'แม่ฮ่องสอน',
    lat: 19.3021,
    lng: 97.9654,
    elevationM: 270,
    status: 'online',
    pga: 0.001,
    snr: 42.1,
    lastPing: Date.now(),
    network: 'TMD_NATIONAL'
  },
  {
    id: 'STA-LPG',
    code: 'LPG',
    name: 'สถานีตรวจวัดคลื่นลำปาง',
    province: 'ลำปาง',
    lat: 18.2888,
    lng: 99.4928,
    elevationM: 240,
    status: 'online',
    pga: 0.001,
    snr: 40.5,
    lastPing: Date.now(),
    network: 'TMD_NATIONAL'
  },
  {
    id: 'STA-TAK',
    code: 'TAK',
    name: 'สถานีเฝ้าระวังรอยเลื่อนเมย-ตาก',
    province: 'ตาก',
    lat: 16.8839,
    lng: 99.1258,
    elevationM: 115,
    status: 'online',
    pga: 0.002,
    snr: 39.8,
    lastPing: Date.now(),
    network: 'DMR_FAULT'
  },
  {
    id: 'STA-KRI',
    code: 'KRI',
    name: 'สถานีเฝ้าระวังเขื่อนศรีนครินทร์-กาญจนบุรี',
    province: 'กาญจนบุรี',
    lat: 14.4022,
    lng: 99.1301,
    elevationM: 210,
    status: 'online',
    pga: 0.001,
    snr: 46.5,
    lastPing: Date.now(),
    network: 'DMR_FAULT'
  },
  {
    id: 'STA-BKK',
    code: 'BKK',
    name: 'สถานีศูนย์กลางบัญชาการเฝ้าระวัง กทม.',
    province: 'กรุงเทพมหานคร',
    lat: 13.7563,
    lng: 100.5018,
    elevationM: 4,
    status: 'online',
    pga: 0.004,
    snr: 35.0,
    lastPing: Date.now(),
    network: 'TMD_NATIONAL'
  },
  {
    id: 'STA-PKT',
    code: 'PKT',
    name: 'สถานีเตือนภัยคลื่นสึนามิและแผ่นดินไหวภูเก็ต',
    province: 'ภูเก็ต',
    lat: 7.8804,
    lng: 98.3923,
    elevationM: 15,
    status: 'online',
    pga: 0.002,
    snr: 47.3,
    lastPing: Date.now(),
    network: 'TMD_NATIONAL'
  },
  {
    id: 'STA-SKA',
    code: 'SKA',
    name: 'สถานีเครือข่ายอ่าวไทย-สงขลา',
    province: 'สงขลา',
    lat: 7.1756,
    lng: 100.6143,
    elevationM: 12,
    status: 'online',
    pga: 0.001,
    snr: 44.0,
    lastPing: Date.now(),
    network: 'TMD_NATIONAL'
  },
  {
    id: 'STA-NRR',
    code: 'NRR',
    name: 'สถานีตรวจวัดภาคตะวันออกเฉียงเหนือ-นครราชสีมา',
    province: 'นครราชสีมา',
    lat: 14.9799,
    lng: 102.0978,
    elevationM: 185,
    status: 'online',
    pga: 0.001,
    snr: 41.2,
    lastPing: Date.now(),
    network: 'TMD_NATIONAL'
  }
];
