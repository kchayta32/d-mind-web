export interface SurveyQuestionItem {
  id: string;
  code: string; // e.g. "1.1", "1.2", "2.1"
  textTh: string;
  textEn: string;
  categoryKey: SurveyCategoryKey;
}

export type SurveyCategoryKey =
  | 'usability'
  | 'ui'
  | 'alert'
  | 'chatbot'
  | 'overall';

export interface SurveyCategoryDef {
  key: SurveyCategoryKey;
  code: string; // "1.1", "1.2", "1.3", "1.4", "1.5" for summary table
  titleTh: string;
  titleEn: string;
  iconName: string;
  items: SurveyQuestionItem[];
}

export const SURVEY_CATEGORIES: SurveyCategoryDef[] = [
  {
    key: 'usability',
    code: '1.',
    titleTh: 'ความสะดวกในการใช้งาน (Usability)',
    titleEn: 'Usability & Ease of Use',
    iconName: 'Wrench',
    items: [
      {
        id: 'usability_1',
        code: '1.1',
        textTh: 'ภาพรวมแอปพลิเคชันใช้งานง่าย',
        textEn: 'Overall application is easy to use',
        categoryKey: 'usability',
      },
      {
        id: 'usability_2',
        code: '1.2',
        textTh: 'ปุ่มและเมนูต่าง ๆ ใช้งานสะดวก',
        textEn: 'Buttons and navigation menus are convenient to use',
        categoryKey: 'usability',
      },
      {
        id: 'usability_3',
        code: '1.3',
        textTh: 'การตอบสนองที่รวดเร็ว',
        textEn: 'System responsiveness is fast and snappy',
        categoryKey: 'usability',
      },
      {
        id: 'usability_4',
        code: '1.4',
        textTh: 'การค้นหาข้อมูลและฟีเจอร์ต่าง ๆ ทำได้ง่าย',
        textEn: 'Searching data and locating features is straightforward',
        categoryKey: 'usability',
      },
      {
        id: 'usability_5',
        code: '1.5',
        textTh: 'แอปพลิเคชันไม่ค้างหรือเกิดข้อผิดพลาดระหว่างใช้งาน',
        textEn: 'App does not freeze or encounter crashes during usage',
        categoryKey: 'usability',
      },
    ],
  },
  {
    key: 'ui',
    code: '2.',
    titleTh: 'ส่วนติดต่อผู้ใช้ (User Interface)',
    titleEn: 'User Interface (UI)',
    iconName: 'Layout',
    items: [
      {
        id: 'ui_1',
        code: '2.1',
        textTh: 'รูปแบบการแสดงผลบนแผนที่เข้าใจง่าย',
        textEn: 'Map visualization format is intuitive and easy to understand',
        categoryKey: 'ui',
      },
      {
        id: 'ui_2',
        code: '2.2',
        textTh: 'ขนาดตัวอักษรและสีเหมาะสม มองเห็นชัดเจน',
        textEn: 'Typography size and color contrast are readable and clear',
        categoryKey: 'ui',
      },
      {
        id: 'ui_3',
        code: '2.3',
        textTh: 'การจัดวางองค์ประกอบบนหน้าจอเหมาะสม',
        textEn: 'Layout and visual element placement are balanced',
        categoryKey: 'ui',
      },
      {
        id: 'ui_4',
        code: '2.4',
        textTh: 'ธีมและสีของแอปพลิเคชันมีความสวยงาม',
        textEn: 'Application theme and color palette are aesthetically pleasing',
        categoryKey: 'ui',
      },
    ],
  },
  {
    key: 'alert',
    code: '3.',
    titleTh: 'ระบบแจ้งเตือน',
    titleEn: 'Notification & Alert System',
    iconName: 'Bell',
    items: [
      {
        id: 'alert_1',
        code: '3.1',
        textTh: 'ข้อความแจ้งเตือนเข้าใจง่ายและชัดเจน',
        textEn: 'Alert messages are clear and straightforward',
        categoryKey: 'alert',
      },
      {
        id: 'alert_2',
        code: '3.2',
        textTh: 'เสียงและรูปแบบการแจ้งเตือน',
        textEn: 'Alert sound, vibration and notification delivery style',
        categoryKey: 'alert',
      },
      {
        id: 'alert_3',
        code: '3.3',
        textTh: 'สามารถตั้งค่าการแจ้งเตือนได้ตามต้องการ',
        textEn: 'User can customize alert settings as needed',
        categoryKey: 'alert',
      },
    ],
  },
  {
    key: 'chatbot',
    code: '4.',
    titleTh: 'ระบบแชทบอท',
    titleEn: 'AI Chatbot System',
    iconName: 'Bot',
    items: [
      {
        id: 'chatbot_1',
        code: '4.1',
        textTh: 'การตอบคำถามที่เข้าใจง่าย',
        textEn: 'Answers provided are simple and easily comprehended',
        categoryKey: 'chatbot',
      },
      {
        id: 'chatbot_2',
        code: '4.2',
        textTh: 'ระบบตอบคำถามได้รวดเร็ว',
        textEn: 'Chatbot response generation is rapid',
        categoryKey: 'chatbot',
      },
      {
        id: 'chatbot_3',
        code: '4.3',
        textTh: 'สามารถสอบถามข้อมูลเกี่ยวกับภัยพิบัติได้ครอบคลุม',
        textEn: 'Disaster question coverage and scope are comprehensive',
        categoryKey: 'chatbot',
      },
      {
        id: 'chatbot_4',
        code: '4.4',
        textTh: 'ภาษาที่ใช้ในการสื่อสารเป็นธรรมชาติ',
        textEn: 'Communication tone and conversational language feel natural',
        categoryKey: 'chatbot',
      },
    ],
  },
  {
    key: 'overall',
    code: '5.',
    titleTh: 'ความพึงพอใจโดยรวม',
    titleEn: 'Overall Satisfaction',
    iconName: 'HeartHandshake',
    items: [
      {
        id: 'overall_1',
        code: '5.1',
        textTh: 'ความพึงพอใจต่อระบบดี-มายด์โดยรวม',
        textEn: 'Overall satisfaction with the D-MIND platform',
        categoryKey: 'overall',
      },
    ],
  },
];

export interface DetailedSurveySubmission {
  id?: string;
  created_at?: string;
  // Demographic Info & PDPA
  gender?: string;
  age?: string;
  occupation?: string;
  province?: string;
  pdpaConsent: boolean;
  // Ratings
  ratings: Record<string, number>; // id -> 1 to 5
  favoriteFeature: string;
  missingFeatures: string;
  generalSuggestions: string;
  respondentName?: string;
  respondentRole?: string;
}

export interface DemographicSummary {
  genderCounts: Record<string, number>;
  ageCounts: Record<string, number>;
  occupationCounts: Record<string, number>;
  provinceCounts: Record<string, number>;
}

export interface CategorySummaryItem {
  code: string;
  categoryKey: SurveyCategoryKey;
  nameTh: string;
  nameEn: string;
  mean: number;
  sd?: number;
  levelTh: string;
  levelEn: string;
  color: string;
  itemsSummary?: {
    code: string;
    textTh: string;
    mean: number;
    levelTh: string;
  }[];
}

export interface AppEvaluationCriteria {
  testItemTh: string;
  testItemEn: string;
  passCriteriaTh: string;
  failCriteriaTh: string;
  actualResultTh: string;
  status: 'passed' | 'failed';
}
