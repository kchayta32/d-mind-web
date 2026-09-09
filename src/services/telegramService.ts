/**
 * D-MIND Contact & Alert Service
 * Secure Client Implementation:
 * - NEVER exposes bot tokens, secrets, or internal chat IDs in the browser.
 * - Forwards contact form submissions strictly to backend API (/api/contact).
 * - Backend server handles validation, sanitization, rate limiting, and Telegram dispatch.
 */

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  subjectLabel?: string;
  message: string;
  hp_website?: string; // Honeypot field for automated spam bots
}

export interface TelegramSendResult {
  success: boolean;
  message: string;
  chatCount?: number;
}

/**
 * Send contact form submission to backend API (/api/contact)
 */
export async function sendContactToTelegram(data: ContactFormData): Promise<TelegramSendResult> {
  // Silent drop if honeypot was populated by a bot
  if (data.hp_website && data.hp_website.trim().length > 0) {
    return {
      success: true,
      message: 'ส่งข้อความถึงทีมพัฒนา D-MIND เรียบร้อยแล้ว ขอบคุณที่ติดต่อเรา',
      chatCount: 1
    };
  }

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || '',
        subject: data.subject,
        message: data.message.trim(),
        hp_website: data.hp_website || ''
      })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 429) {
        return {
          success: false,
          message: 'คุณส่งข้อความถี่เกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง'
        };
      }
      return {
        success: false,
        message: result.error || 'ไม่สามารถส่งข้อความได้ในขณะนี้ กรุณาลองใหม่อีกครั้งภายหลัง'
      };
    }

    return {
      success: true,
      message: 'ส่งข้อความถึงทีมพัฒนา D-MIND เรียบร้อยแล้ว ขอบคุณที่ติดต่อเรา',
      chatCount: result.chat_count ?? 1
    };
  } catch (err) {
    console.warn('Contact submission error:', err);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง'
    };
  }
}
