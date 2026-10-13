/**
 * D-MIND Business & Financial Data Service
 * Realtime Database Integration: https://d-mind-e11fc-default-rtdb.asia-southeast1.firebasedatabase.app/
 */

export interface FounderMember {
  id: string;
  nameTh: string;
  nameEn: string;
  university: string;
  roleTh: string;
  roleEn: string;
  bioTh: string;
  investedAmount: number; // THB
  investDate: string;
  shares: number;
  percentage: number; // %
  isMentor?: boolean;
  avatarUrl?: string;
  skills: string[];
  track?: string;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  type: 'deposit' | 'withdraw' | 'expense' | 'grant';
  amount: number;
  title: string;
  description: string;
  investorOrParty: string;
  balanceAfter: number;
  sharesImpact?: number;
}

export interface ExpenseItem {
  id: string;
  date: string;
  title: string;
  category: 'hardware' | 'iot_cellular' | 'cloud_infrastructure' | 'patents_legal' | 'field_testing' | 'other';
  amount: number;
  recipient: string;
  proofNote: string;
}

export interface GrantProgram {
  id: string;
  nameTh: string;
  nameEn: string;
  agency: string;
  maxGrantThb: number;
  status: 'planned' | 'drafting' | 'submitted' | 'pitching' | 'approved' | 'disbursed';
  category: string;
  matchRatio: string; // e.g. "100% Grant (Non-Dilutive)"
  deliverableTarget: string;
  expectedDate: string;
}

export interface HardwareSpec {
  id: string;
  category: 'enclosure' | 'power_solar' | 'cellular_telemetry' | 'sensors' | 'compute';
  item: string;
  specDetail: string;
  industrialStandard: string;
  purpose: string;
  costPerUnitThb: number;
  status: 'prototype' | 'testing' | 'pre_production' | 'ready';
}

export interface PatentItem {
  id: string;
  type: 'petty_patent' | 'invention_patent' | 'copyright';
  titleTh: string;
  titleEn: string;
  targetAgency: string; // e.g. "กรมทรัพย์สินทางปัญญา (DIP)"
  protectionYears: number;
  coreClaims: string[];
  status: 'prior_art_search' | 'drafting_claims' | 'university_review' | 'filing_ready' | 'submitted';
  filingTargetDate: string;
}

export interface CandlestickPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  event: string;
}

export interface BusinessData {
  projectName: string;
  projectThName: string;
  valuationPreMoney: number;
  valuationPostMoney: number;
  totalShares: number;
  cashBalance: number;
  parValuePerShare: number;
  founders: FounderMember[];
  transactions: FinancialTransaction[];
  expenses: ExpenseItem[];
  grants: GrantProgram[];
  hardwareSpecs: HardwareSpec[];
  patents: PatentItem[];
  lastUpdated: string;
}

const RTDB_BASE_URL = 'https://d-mind-e11fc-default-rtdb.asia-southeast1.firebasedatabase.app';
const RTDB_BUSINESS_PATH = '/business_data.json';

// Initial verified founding data
export const INITIAL_BUSINESS_DATA: BusinessData = {
  projectName: 'Disaster Monitoring and Intelligent Notification Device (D-MIND)',
  projectThName: 'ระบบเฝ้าระวังและแจ้งเตือนภัยพิบัติอัจฉริยะ',
  valuationPreMoney: 300000, // Initial pre-money valuation (300,000 THB)
  valuationPostMoney: 303000,
  totalShares: 30000,
  cashBalance: 2150, // 3,000 initial - 850 seed R&D prototyping expenses
  parValuePerShare: 10,
  founders: [
    {
      id: 'founder-1',
      nameTh: 'กิตติ ชัยตา',
      nameEn: 'Kitti Chaita',
      university: 'วิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยราชภัฏสวนสุนันทา',
      roleTh: 'Project Lead & Software Engineer',
      roleEn: 'Project Lead & AI/Software Engineer',
      bioTh: 'ผู้ริเริ่มระบบ Disaster Monitoring and Intelligent Notification Device (D-MIND) ในการแข่งขัน Super AI Engineer Season 5 (Track: AI INNOVATOR) รับผิดชอบสถาปัตยกรรมคลาวด์, AI Decision Models, Mobile/Web Interface และการสื่อสารข้อมูลแบบเรียลไทม์',
      investedAmount: 1000,
      investDate: '2569-10-11',
      shares: 10000,
      percentage: 33.33,
      skills: ['Full-Stack Dev', 'AI / Deep Learning', 'Cloud Architecture', 'Realtime Systems', 'Mobile App'],
      track: 'Super AI Engineer Season 5 (AI INNOVATOR)'
    },
    {
      id: 'founder-2',
      nameTh: 'ศตวรรษ อินทรักษ์',
      nameEn: 'Satawat Intarak',
      university: 'วิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยราชภัฏสวนสุนันทา',
      roleTh: 'ผู้วิจัยร่วม สถาปัตยกรรมระบบฮาร์ดแวร์ และผู้ออกแบบสถานีตรวจวัดต้นแบบ',
      roleEn: 'Co-Researcher & Hardware Architecture Lead',
      bioTh: 'ผู้ออกแบบสถานีตรวจวัดต้นแบบ ผู้วิจัยร่วมโครงสร้างสถานีตรวจวัดเซนเซอร์และระบบโทรมาตรภาคสนาม ออกแบบวงจรกึ่งอุตสาหกรรม และการจัดวางระบบกันน้ำกันฝุ่น',
      investedAmount: 1000,
      investDate: '2569-10-07',
      shares: 10000,
      percentage: 33.33,
      skills: ['Embedded Circuit', 'Station CAD Design', 'Sensor Calibration', 'Industrial Enclosure'],
      track: 'Hardware & IoT Architecture'
    },
    {
      id: 'founder-3',
      nameTh: 'ธนกฤษ วรรณรังษี',
      nameEn: 'Thanakrit Wannarungsee',
      university: 'วิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยราชภัฏสวนสุนันทา',
      roleTh: 'ผู้วิจัยร่วม และสถาปัตยกรรมระบบฮาร์ดแวร์',
      roleEn: 'Co-Researcher & Hardware Systems Engineer',
      bioTh: 'ผู้วิจัยร่วมสถาปัตยกรรมระบบฮาร์ดแวร์ ดูแลระบบพลังงานสำรอง แบตเตอรี่ LiFePO4 วงจรจัดการพลังงาน และการเชื่อมต่อเครือข่ายโทรคมนาคมไร้สายเพื่อความเสถียร 24/7',
      investedAmount: 1000,
      investDate: '2569-10-09',
      shares: 10000,
      percentage: 33.33,
      skills: ['Power Management', 'Battery LiFePO4 BMS', '4G LTE-M / NB-IoT', 'Firmware RTOS'],
      track: 'Hardware & Telemetry'
    },
    {
      id: 'mentor-1',
      nameTh: 'อ.กานต์ เจริญจิตร',
      nameEn: 'Karn Charoenjit',
      university: 'อาจารย์ประจำสาขาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยราชภัฏสวนสุนันทา',
      roleTh: 'Project Mentor & Academic Advisor',
      roleEn: 'Project Mentor & Senior Thesis Advisor',
      bioTh: 'อาจารย์ที่ปรึกษาโครงการวิจัยตั้งแต่การแข่งขันปี 2567 ไปจนถึงการทำวิทยานิพนธ์ระดับปริญญาตรี (Capstone Senior Project) ให้คำปรึกษาด้านระเบียบวิธีวิจัย การทดสอบเชิงวิทยาศาสตร์ และการคุ้มครองทรัพย์สินทางปัญญา',
      investedAmount: 0,
      investDate: '2567-08-01',
      shares: 0,
      percentage: 0,
      isMentor: true,
      skills: ['Academic Research', 'Systems Mentorship', 'Intellectual Property', 'Project Supervision'],
      track: 'Faculty Mentor & Academic Advisor'
    }
  ],
  transactions: [
    {
      id: 'tx-001',
      date: '2569-10-07',
      type: 'deposit',
      amount: 1000,
      title: 'เงินลงทุนเริ่มต้น (Initial Seed) - ศตวรรษ อินทรักษ์',
      description: 'ทุนตั้งต้นสำหรับสถาปัตยกรรมระบบฮาร์ดแวร์และสถานีต้นแบบ',
      investorOrParty: 'ศตวรรษ อินทรักษ์',
      balanceAfter: 1000,
      sharesImpact: 10000
    },
    {
      id: 'tx-002',
      date: '2569-10-09',
      type: 'deposit',
      amount: 1000,
      title: 'เงินลงทุนเริ่มต้น (Initial Seed) - ธนกฤษ วรรณรังษี',
      description: 'ทุนตั้งต้นสำหรับระบบพลังงานสำรองและโมดูลสื่อสารโทรมาตร',
      investorOrParty: 'ธนกฤษ วรรณรังษี',
      balanceAfter: 2000,
      sharesImpact: 10000
    },
    {
      id: 'tx-003',
      date: '2569-10-11',
      type: 'deposit',
      amount: 1000,
      title: 'เงินลงทุนเริ่มต้น (Initial Seed) - กิตติ ชัยตา',
      description: 'ทุนตั้งต้นสำหรับระบบซอฟต์แวร์ คลาวด์ และโมเดล AI ตัดสินใจเตือนภัย',
      investorOrParty: 'กิตติ ชัยตา',
      balanceAfter: 3000,
      sharesImpact: 10000
    },
    {
      id: 'tx-004',
      date: '2569-10-12',
      type: 'expense',
      amount: 850,
      title: 'จัดซื้อกล่อง Enclosure กันน้ำ IP67 + เคเบิลแกลนด์ PG9/PG11 สำหรับทดสอบ',
      description: 'ทดสอบการประกอบฮาร์ดแวร์กึ่งอุตสาหกรรมสำหรับสถานีตรวจวัดน้ำท่วม',
      investorOrParty: 'ร้านจำหน่ายอุปกรณ์ตู้คอนโทรลอุตสาหกรรม',
      balanceAfter: 2150
    }
  ],
  expenses: [
    {
      id: 'exp-001',
      date: '2569-10-12',
      title: 'กล่อง Enclosure โพลีคาร์บอเนตกันน้ำมาตรฐาน IP67 พร้อมยางซิลิโคนคู่',
      category: 'hardware',
      amount: 450,
      recipient: 'ผู้นำเข้าอุปกรณ์ Enclosure อุตสาหกรรม',
      proofNote: 'ใบเสร็จจัดซื้อกล่องทดสอบรุ่นต้นแบบ Pre-Production'
    },
    {
      id: 'exp-002',
      date: '2569-10-12',
      title: 'เคเบิลแกลนด์กันน้ำ IP68 ขนาด PG9 และ PG11 พร้อมซีลยางกันซึม',
      category: 'hardware',
      amount: 220,
      recipient: 'ร้านค้าชิ้นส่วนไฟฟ้าอุตสาหกรรม',
      proofNote: 'ชุดร้อยสายเซนเซอร์วัดระดับน้ำและสายไฟโซลาร์เซลล์'
    },
    {
      id: 'exp-003',
      date: '2569-10-13',
      title: 'ซิมการ์ด IoT 4G LTE-M / NB-IoT เพื่อทดสอบสัญญาณภาคสนาม',
      category: 'iot_cellular',
      amount: 180,
      recipient: 'ผู้ให้บริการเครือข่ายโทรคมนาคม (IoT Data Package)',
      proofNote: 'แพ็กเกจส่งข้อมูลโทรมาตรแบบความหน่วงต่ำ'
    }
  ],
  grants: [
    {
      id: 'grant-001',
      nameTh: 'กองทุนพัฒนาผู้ประกอบการเทคโนโลยีและนวัตกรรม (TED Fund) - Youth Startup Fund',
      nameEn: 'TED Fund - Youth Startup Fund (Idea & Proof of Concept)',
      agency: 'กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม (อว.)',
      maxGrantThb: 1500000,
      status: 'drafting',
      category: 'ทุนสนับสนุนการพัฒนานวัตกรรมระยะเริ่มต้นสำหรับนิสิตนักศึกษา',
      matchRatio: '100% Grant (Non-Dilutive - ไม่เสียสัดส่วนหุ้น)',
      deliverableTarget: 'สถานีตรวจวัดภัยพิบัติ D-MIND กึ่งอุตสาหกรรม 10 สถานี พร้อมระบบแจ้งเตือนภาคประชาชน',
      expectedDate: 'ธันวาคม 2569'
    },
    {
      id: 'grant-002',
      nameTh: 'สำนักงานนวัตกรรมแห่งชาติ (NIA) - กลไกนวัตกรรมแบบเปิด (Open Innovation)',
      nameEn: 'National Innovation Agency (NIA) - Open Innovation Grant',
      agency: 'สำนักงานนวัตกรรมแห่งชาติ (องค์การมหาชน)',
      maxGrantThb: 1500000,
      status: 'planned',
      category: 'นวัตกรรมด้านการจัดการสิ่งแวดล้อมและภัยพิบัติ (ClimateTech & Smart City)',
      matchRatio: '75% Non-Dilutive Grant (ให้เปล่าสูงสุด 1.5 ล้านบาท)',
      deliverableTarget: 'การทดสอบเชิงพาณิชย์ร่วมกับองค์กรปกครองส่วนท้องถิ่น (อปท.) และ ปภ.',
      expectedDate: 'มกราคม 2570'
    },
    {
      id: 'grant-003',
      nameTh: 'สำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa) - depa Digital Startup Fund (Early Stage)',
      nameEn: 'depa Digital Startup Fund (Seed/Early Stage S2)',
      agency: 'สำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa)',
      maxGrantThb: 1000000,
      status: 'planned',
      category: 'การประยุกต์ใช้ดิจิทัลและ AI ในการเตือนภัยสาธารณะ',
      matchRatio: '100% Non-Dilutive Co-funding',
      deliverableTarget: 'แพลตฟอร์มคลาวด์และโมบายล์แอปพลิเคชันระบบเตือนภัย D-MIND สำหรับเมืองอัจฉริยะ',
      expectedDate: 'กุมภาพันธ์ 2570'
    },
    {
      id: 'grant-004',
      nameTh: 'โครงการ Super AI Engineer Season 5 (Track: AI INNOVATOR) - Seed & Commercialization Prize',
      nameEn: 'Super AI Engineer S5 - AI Innovation Grant',
      agency: 'สมาคมปัญญาประดิษฐ์ประเทศไทย (AIAT) & สวทช.',
      maxGrantThb: 250000,
      status: 'pitching',
      category: 'รางวัลพัฒนาผลงาน AI ต้นแบบสู่การใช้งานจริงในระดับประเทศ',
      matchRatio: '100% Prize & Non-Dilutive Award',
      deliverableTarget: 'AI Multi-modal Disaster Risk Engine พร้อมสาธิตในรอบตัดสิน Final Demo Day',
      expectedDate: 'พฤศจิกายน 2569'
    },
    {
      id: 'grant-005',
      nameTh: 'สำนักงานการวิจัยแห่งชาติ (วช. / NRCT) - ทุนวิจัยนวัตกรรมรับมือภัยพิบัติ',
      nameEn: 'National Research Council of Thailand (NRCT) - Disaster Innovation',
      agency: 'สำนักงานการวิจัยแห่งชาติ (วช.)',
      maxGrantThb: 1000000,
      status: 'planned',
      category: 'ทุนวิจัยและถ่ายทอดเทคโนโลยีสู่ชุมชนเสี่ยงภัย',
      matchRatio: '100% Research Grant',
      deliverableTarget: 'โครงการติดตั้งสถานีต้นแบบนำร่องในพื้นที่เสี่ยงดินโคลนถล่มและน้ำท่วมฉับพลัน',
      expectedDate: 'มีนาคม 2570'
    }
  ],
  hardwareSpecs: [
    {
      id: 'hw-001',
      category: 'enclosure',
      item: 'Industrial Weatherproof Enclosure (กล่องควบคุมมาตรฐานอุตสาหกรรม)',
      specDetail: 'Polycarbonate / High-Impact ABS กันรังสี UV พร้อมขอบยาง Silicone Seal สองชั้น, ป้องกันน้ำและฝุ่น IP66/IP67, มี Vent Membrane ระบายแรงดันอากาศและป้องกันความชื้นสะสมภายใน',
      industrialStandard: 'IP66 / IP67 / NEMA 4X (IEC 60529)',
      purpose: 'ปกป้องแผงวงจรหลัก แบตเตอรี่ และโมดูลสื่อสารจากพายุฝน ลมกระโชก และแสงแดดกลางแจ้งตลอด 24 ชั่วโมง',
      costPerUnitThb: 850,
      status: 'pre_production'
    },
    {
      id: 'hw-002',
      category: 'enclosure',
      item: 'Waterproof Cable Gland Kit (ชุดเคเบิลแกลนด์กันน้ำสำหรับร้อยสายเซนเซอร์)',
      specDetail: 'เคเบิลแกลนด์ไนลอนเกรดวิศวกรรม มาตรฐาน IP68 ขนาด PG7, PG9 และ PG11 พร้อมโอริงยาง EPDM กันน้ำซึม',
      industrialStandard: 'IP68 (กันน้ำลึก 1.5 เมตรต่อเนื่อง)',
      purpose: 'ซีลสายเซนเซอร์วัดระดับน้ำ (Ultrasonic / Hydrostatic), สายแผงโซลาร์ และสายเสาอากาศภายนอกอย่างแน่นหนา',
      costPerUnitThb: 180,
      status: 'ready'
    },
    {
      id: 'hw-003',
      category: 'power_solar',
      item: 'Monocrystalline Solar Panel & MPPT Controller (แผงโซลาร์เซลล์ประสิทธิภาพสูง)',
      specDetail: 'แผงโซลาร์เซลล์ชนิดโมโนคริสตัลไลน์ขนาด 30W – 50W (Efficiency > 21%) พร้อมวงจรชาร์จ MPPT ประสิทธิภาพแปลงพลังงาน 96%',
      industrialStandard: 'IEC 61215 / CE / RoHS',
      purpose: 'ผลิตพลังงานไฟฟ้าจากแสงอาทิตย์ได้แม้ในวันที่มีเมฆครึ้มหรือฝนตกปรอยๆ',
      costPerUnitThb: 1100,
      status: 'pre_production'
    },
    {
      id: 'hw-004',
      category: 'power_solar',
      item: 'LiFePO4 Backup Battery Subsystem (ชุดแบตเตอรี่สำรองไฟความปลอดภัยสูง)',
      specDetail: 'แบตเตอรี่ลิเธียมไอเอิร์นฟอสเฟต (LiFePO4) 12.8V 6Ah – 12Ah พร้อมวงจร BMS อัจฉริยะ (Over-charge, Over-discharge, Thermal protection) อายุใช้งาน > 2,500 รอบชาร์จ',
      industrialStandard: 'UN38.3 / IEC 62133 (ทนความร้อนสูง ไม่ติดไฟ ไม่ระเบิด)',
      purpose: 'สำรองพลังงานให้สถานีตรวจวัดทำงานต่อเนื่องได้ไม่ต่ำกว่า 72 ชั่วโมง (3 วันเต็ม) แม้ไม่มีแสงแดดส่องถึง',
      costPerUnitThb: 1450,
      status: 'pre_production'
    },
    {
      id: 'hw-005',
      category: 'cellular_telemetry',
      item: 'Industrial Cellular Telemetry Module (โมดูลสื่อสารเครือข่ายมือถือ 4G LTE-M / NB-IoT)',
      specDetail: 'Quectel BG95-M3 หรือ SIMCom SIM7080G รองรับ Multi-band LTE Cat M1 / NB-IoT / EGPRS พร้อมเสาอากาศ Waterproof High-Gain 4G Omnidirectional เกลียว SMA ภายนอก',
      industrialStandard: '3GPP Release 14 / CE / FCC / NB-IoT Standard',
      purpose: 'ส่งข้อมูลโทรมาตรระดับน้ำและสภาพอากาศตรงสู่ Firebase คลาวด์ ไม่ต้องพึ่งพา Wi-Fi บ้าน สามารถติดตั้งได้ทุกจุดเสี่ยงภัยทั่วประเทศ',
      costPerUnitThb: 1250,
      status: 'pre_production'
    },
    {
      id: 'hw-006',
      category: 'sensors',
      item: 'Dual Sensor Suite (ชุดเซนเซอร์วัดระดับน้ำและสภาพอากาศ)',
      specDetail: 'เซนเซอร์อัลตราโซนิกกันน้ำ JSN-SR04T v3.0 / Hydrostatic Pressure Transducer + เซนเซอร์ความดัน บารอมิเตอร์ อุณหภูมิ และความชื้นสัมพัทธ์ BME280',
      industrialStandard: 'IP67 Sensor Probe, RS-485 / Modbus RTU / I2C',
      purpose: 'ตรวจวัดการเปลี่ยนแปลงระดับน้ำแบบเรียลไทม์ และคำนวณอัตราความเสี่ยงน้ำท่วมฉับพลันด้วย AI',
      costPerUnitThb: 950,
      status: 'testing'
    }
  ],
  patents: [
    {
      id: 'pat-001',
      type: 'petty_patent',
      titleTh: 'โครงสร้างสถานีตรวจวัดและส่งข้อมูลโทรมาตรเตือนภัยพิบัติอัจฉริยะแบบพึ่งพาพลังงานตนเองและป้องกันสิ่งแวดล้อมรุนแรง',
      titleEn: 'Autonomous Self-Powered Disaster Monitoring and Telemetry Station Structure for Harsh Environments',
      targetAgency: 'กรมทรัพย์สินทางปัญญา (DIP)',
      protectionYears: 10,
      coreClaims: [
        'โครงสร้างการจัดวางโมดูลภายในกล่องกันน้ำ IP66/IP67 ร่วมกับช่องระบายอากาศปรับสมดุลความดันภายใน (Pressure Equalization Vent)',
        'ชุดแคลมป์ยึดเซนเซอร์ตรวจวัดระดับน้ำแบบปรับมุมอิสระพร้อมตะแกรงป้องกันเศษขยะและคราบตะกอนอุดตัน',
        'การประสานวงจรจัดการพลังงานไฮบริดระหว่างแผงโซลาร์เซลล์และแบตเตอรี่ LiFePO4 ที่ตัดการทำงานแบบ Multi-stage Deep Sleep'
      ],
      status: 'drafting_claims',
      filingTargetDate: 'พฤศจิกายน 2569'
    },
    {
      id: 'pat-002',
      type: 'invention_patent',
      titleTh: 'กรรมวิธีการประเมินความเสี่ยงและแจ้งเตือนภัยพิบัติน้ำท่วมและดินถล่มล่วงหน้าด้วยปัญญาประดิษฐ์ประมวลผลร่วมแบบหลายตัวแปรระหว่างอุปกรณ์ปลายทางและคลาวด์',
      titleEn: 'Multi-modal Edge-Cloud Collaborative Artificial Intelligence Method for Early Disaster Risk Scoring and Geofenced Notification',
      targetAgency: 'กรมทรัพย์สินทางปัญญา (DIP)',
      protectionYears: 20,
      coreClaims: [
        'อัลกอริทึมการคำนวณดัชนีความเสี่ยงภัยพิบัติแบบผสมผสาน (Composite Disaster Risk Index) จากข้อมูลระดับน้ำ ข้อมูลดาวเทียม GISTDA ปริมาณฝนสะสม TMD และพยากรณ์อากาศล่วงหน้า',
        'ระบบกระจายน้ำหนักการคำนวณระหว่าง Edge AI บนสถานีตรวจวัดและ Large Language Model / Decision Model บนคลาวด์',
        'กลไกการกระจายข้อความเตือนภัยฉุกเฉินความเร็วสูงผ่าน Firebase Cloud Messaging ร่วมกับ Dynamic Geofence Polygon ไปยังประชาชนในรัศมีอันตราย'
      ],
      status: 'prior_art_search',
      filingTargetDate: 'มกราคม 2570'
    },
    {
      id: 'pat-003',
      type: 'copyright',
      titleTh: 'โปรแกรมคอมพิวเตอร์: ระบบเฝ้าระวังและแจ้งเตือนภัยพิบัติอัจฉริยะ D-MIND (Web Engine & Edge Firmware)',
      titleEn: 'Computer Software: D-MIND Disaster Monitoring Web Engine & IoT Edge Telemetry Firmware',
      targetAgency: 'กรมทรัพย์สินทางปัญญา (DIP)',
      protectionYears: 50,
      coreClaims: [
        'ซอร์สโค้ดระบบประมวลผลและแสดงผลข้อมูลแผนที่ภัยพิบัติ D-MIND Web',
        'เฟิร์มแวร์ระบบโทรมาตรและการสื่อสารข้อมูลแบบทนทานต่อการตัดการเชื่อมต่อ (D-MIND Edge Firmware)'
      ],
      status: 'filing_ready',
      filingTargetDate: 'ตุลาคม 2569'
    }
  ],
  lastUpdated: new Date().toISOString()
};

/**
 * Generate historical financial candlesticks for capital flows & valuation
 */
export const getCandlestickData = (businessData: BusinessData): CandlestickPoint[] => {
  return [
    {
      date: '07 ต.ค. 2569',
      open: 300000,
      high: 301000,
      low: 300000,
      close: 301000,
      volume: 1000,
      event: 'ศตวรรษ อินทรักษ์ ลงทุน Seed 1,000 บ.'
    },
    {
      date: '09 ต.ค. 2569',
      open: 301000,
      high: 302000,
      low: 301000,
      close: 302000,
      volume: 1000,
      event: 'ธนกฤษ วรรณรังษี ลงทุน Seed 1,000 บ.'
    },
    {
      date: '11 ต.ค. 2569',
      open: 302000,
      high: 303000,
      low: 302000,
      close: 303000,
      volume: 1000,
      event: 'กิตติ ชัยตา ลงทุน Seed 1,000 บ. (Super AI S5)'
    },
    {
      date: '12 ต.ค. 2569',
      open: 303000,
      high: 303000,
      low: 302150,
      close: 302150,
      volume: 850,
      event: 'จัดซื้อกล่อง Enclosure IP67 & เคเบิลแกลนด์ (-850 บ.)'
    },
    {
      date: '13 ต.ค. 2569',
      open: 302150,
      high: 305000,
      low: 302150,
      close: 305000,
      volume: 2850,
      event: 'ประเมินมูลค่าสินทรัพย์ทรัพย์สินทางปัญญาและซอฟต์แวร์ต้นแบบ (+2,850 บ.)'
    }
  ];
};

/**
 * Fetches current business data from Firebase Realtime Database.
 * If not found, initializes default verified data to RTDB.
 */
export async function getBusinessData(): Promise<BusinessData> {
  try {
    const res = await fetch(`${RTDB_BASE_URL}${RTDB_BUSINESS_PATH}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data && data.founders && Array.isArray(data.founders) && data.founders.length > 0) {
        return data as BusinessData;
      }
    }
  } catch (err) {
    console.warn('[Firebase RTDB] Could not load remote business data, falling back to seed data:', err);
  }

  // Remote data is empty or unavailable -> Initialize with seed data
  try {
    await saveBusinessData(INITIAL_BUSINESS_DATA);
  } catch (saveErr) {
    console.warn('[Firebase RTDB] Could not auto-seed data:', saveErr);
  }

  return INITIAL_BUSINESS_DATA;
}

/**
 * Saves or updates business data on Firebase Realtime Database
 */
export async function saveBusinessData(data: BusinessData): Promise<boolean> {
  try {
    const payload = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    const res = await fetch(`${RTDB_BASE_URL}${RTDB_BUSINESS_PATH}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.error('[Firebase RTDB] Failed to save business data:', err);
    return false;
  }
}

/**
 * Mathematical Calculation for Investor Deposit (New Investment / Capital Increase)
 * Follows venture capital pre-money vs post-money standard dilution:
 * Post-money = Pre-money + Deposit
 * New Investor Share % = Deposit / Post-money
 * New Shares = Old Shares * (Deposit / Pre-money)
 */
export function calculateDepositMath(
  currentData: BusinessData,
  depositAmount: number,
  investorName: string
) {
  const preMoney = currentData.valuationPreMoney || 300000;
  const oldTotalShares = currentData.totalShares || 30000;
  
  if (depositAmount <= 0) {
    return {
      newShares: 0,
      postMoney: preMoney,
      ownershipPercent: 0,
      dilutionFactor: 0,
      pricePerShare: preMoney / oldTotalShares
    };
  }

  const postMoney = preMoney + depositAmount;
  const pricePerShare = preMoney / oldTotalShares;
  const newShares = Math.round(depositAmount / pricePerShare);
  const newTotalShares = oldTotalShares + newShares;
  const ownershipPercent = Number(((newShares / newTotalShares) * 100).toFixed(2));
  const dilutionFactor = Number(((1 - (oldTotalShares / newTotalShares)) * 100).toFixed(2));

  return {
    newShares,
    postMoney,
    ownershipPercent,
    dilutionFactor,
    pricePerShare,
    newTotalShares
  };
}

/**
 * Mathematical Calculation for Investor Withdrawal (Share Buyback / Liquidation)
 * Payout = Shares * PricePerShare
 * Remaining Shares = Old Shares - Shares
 * New Total Shares = Old Total Shares - Shares
 */
export function calculateWithdrawMath(
  currentData: BusinessData,
  founderId: string,
  sharesToWithdraw: number
) {
  const founder = currentData.founders.find(f => f.id === founderId);
  const preMoney = currentData.valuationPreMoney || 300000;
  const oldTotalShares = currentData.totalShares || 30000;
  const pricePerShare = preMoney / oldTotalShares;

  if (!founder || sharesToWithdraw <= 0) {
    return {
      payoutAmount: 0,
      remainingFounderShares: founder ? founder.shares : 0,
      newTotalShares: oldTotalShares,
      remainingValuation: preMoney
    };
  }

  const effectiveShares = Math.min(sharesToWithdraw, founder.shares);
  const payoutAmount = Math.round(effectiveShares * pricePerShare);
  const remainingFounderShares = founder.shares - effectiveShares;
  const newTotalShares = Math.max(1, oldTotalShares - effectiveShares);
  const remainingValuation = Math.max(0, preMoney - payoutAmount);

  return {
    payoutAmount,
    effectiveShares,
    remainingFounderShares,
    newTotalShares,
    remainingValuation,
    pricePerShare
  };
}

/**
 * Execute a Deposit and push changes to Firebase RTDB
 */
export async function executeDeposit(
  currentData: BusinessData,
  investorNameTh: string,
  investorNameEn: string,
  amount: number,
  note: string = 'ผู้ร่วมลงทุนรอบใหม่ (New Equity Round)'
): Promise<BusinessData> {
  const math = calculateDepositMath(currentData, amount, investorNameTh);
  const existingFounderIndex = currentData.founders.findIndex(
    f => f.nameTh.toLowerCase() === investorNameTh.toLowerCase() ||
         f.nameEn.toLowerCase() === investorNameEn.toLowerCase()
  );

  let updatedFounders = [...currentData.founders];
  const newTotalShares = math.newTotalShares;

  if (existingFounderIndex >= 0) {
    // Existing founder adding more capital
    const f = updatedFounders[existingFounderIndex];
    const newShares = f.shares + math.newShares;
    updatedFounders[existingFounderIndex] = {
      ...f,
      investedAmount: f.investedAmount + amount,
      shares: newShares
    };
  } else {
    // New external or co-investor joining
    const newInvestor: FounderMember = {
      id: `investor-${Date.now()}`,
      nameTh: investorNameTh,
      nameEn: investorNameEn || investorNameTh,
      university: 'ผู้ร่วมลงทุนภายนอก / Strategic Angel Investor',
      roleTh: 'ผู้ร่วมลงทุน (Angel / Strategic Co-Investor)',
      roleEn: 'Angel / Co-Investor',
      bioTh: `ร่วมลงทุนพัฒนาเทคโนโลยี D-MIND ในรอบ Seed Expansion เมื่อวันที่ ${new Date().toLocaleDateString('th-TH')}`,
      investedAmount: amount,
      investDate: new Date().toISOString().split('T')[0],
      shares: math.newShares,
      percentage: math.ownershipPercent,
      skills: ['Capital Allocation', 'Disaster Tech Investment', 'Commercial Scaling']
    };
    updatedFounders.push(newInvestor);
  }

  // Recalculate percentages for all founders
  updatedFounders = updatedFounders.map(f => ({
    ...f,
    percentage: Number(((f.shares / newTotalShares) * 100).toFixed(2))
  }));

  const newBalance = currentData.cashBalance + amount;
  const newTx: FinancialTransaction = {
    id: `tx-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    type: 'deposit',
    amount: amount,
    title: `เงินร่วมลงทุน (Deposit) - ${investorNameTh}`,
    description: note,
    investorOrParty: investorNameTh,
    balanceAfter: newBalance,
    sharesImpact: math.newShares
  };

  const updatedData: BusinessData = {
    ...currentData,
    valuationPreMoney: math.postMoney,
    valuationPostMoney: math.postMoney,
    totalShares: newTotalShares,
    cashBalance: newBalance,
    founders: updatedFounders,
    transactions: [newTx, ...currentData.transactions]
  };

  await saveBusinessData(updatedData);
  return updatedData;
}

/**
 * Execute a Withdrawal and push changes to Firebase RTDB
 */
export async function executeWithdrawal(
  currentData: BusinessData,
  founderId: string,
  sharesToWithdraw: number,
  reason: string = 'ขอถอนคืนเงินทุน / ลดสัดส่วนหุ้นส่วน'
): Promise<BusinessData> {
  const math = calculateWithdrawMath(currentData, founderId, sharesToWithdraw);
  const founder = currentData.founders.find(f => f.id === founderId);
  if (!founder || math.effectiveShares <= 0) return currentData;

  const newTotalShares = math.newTotalShares;
  let updatedFounders = currentData.founders.map(f => {
    if (f.id === founderId) {
      return {
        ...f,
        shares: math.remainingFounderShares,
        investedAmount: Math.max(0, f.investedAmount - math.payoutAmount)
      };
    }
    return f;
  });

  // Remove founder if shares drop to 0 and not mentor
  updatedFounders = updatedFounders.filter(f => f.shares > 0 || f.isMentor);

  // Recalculate percentages
  updatedFounders = updatedFounders.map(f => ({
    ...f,
    percentage: Number(((f.shares / newTotalShares) * 100).toFixed(2))
  }));

  const newBalance = Math.max(0, currentData.cashBalance - math.payoutAmount);
  const newTx: FinancialTransaction = {
    id: `tx-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    type: 'withdraw',
    amount: math.payoutAmount,
    title: `ถอนทุนคืน (Withdrawal) - ${founder.nameTh}`,
    description: `${reason} (คืนหุ้นจำนวน ${math.effectiveShares.toLocaleString()} หุ้น)`,
    investorOrParty: founder.nameTh,
    balanceAfter: newBalance,
    sharesImpact: -math.effectiveShares
  };

  const updatedData: BusinessData = {
    ...currentData,
    valuationPreMoney: math.remainingValuation,
    valuationPostMoney: math.remainingValuation,
    totalShares: newTotalShares,
    cashBalance: newBalance,
    founders: updatedFounders,
    transactions: [newTx, ...currentData.transactions]
  };

  await saveBusinessData(updatedData);
  return updatedData;
}

/**
 * Add a new business expense and persist to Firebase RTDB
 */
export async function addExpenseItem(
  currentData: BusinessData,
  expense: Omit<ExpenseItem, 'id'>
): Promise<BusinessData> {
  const newId = `exp-${Date.now()}`;
  const newExp: ExpenseItem = {
    ...expense,
    id: newId
  };

  const newBalance = Math.max(0, currentData.cashBalance - expense.amount);
  const newTx: FinancialTransaction = {
    id: `tx-${Date.now()}`,
    date: expense.date,
    type: 'expense',
    amount: expense.amount,
    title: `ค่าใช้จ่าย: ${expense.title}`,
    description: `${expense.category.toUpperCase()} | ${expense.proofNote || ''}`,
    investorOrParty: expense.recipient,
    balanceAfter: newBalance
  };

  const updatedData: BusinessData = {
    ...currentData,
    cashBalance: newBalance,
    expenses: [newExp, ...currentData.expenses],
    transactions: [newTx, ...currentData.transactions]
  };

  await saveBusinessData(updatedData);
  return updatedData;
}
