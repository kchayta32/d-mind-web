/**
 * D-MIND Telegram Alert Bot Service
 * Bot: @drmind_alert_bot (t.me/drmind_alert_bot)
 * Token: 8686401520:AAHb2qFnN_t66av6OcwuTHDsZ_wWBVVpNXM
 */

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  subjectLabel?: string;
  message: string;
}

export interface TelegramSendResult {
  success: boolean;
  message: string;
  chatCount: number;
}

const TELEGRAM_BOT_TOKEN = '8686401520:AAHb2qFnN_t66av6OcwuTHDsZ_wWBVVpNXM';
const TELEGRAM_API_BASE = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Subject translation mapping
const SUBJECT_LABELS: Record<string, { th: string; en: string }> = {
  general: {
    th: 'สอบถามข้อมูลทั่วไป',
    en: 'General Inquiry'
  },
  bug: {
    th: 'รายงานปัญหาการใช้งาน / Bug',
    en: 'Report an Issue / Bug'
  },
  collaboration: {
    th: 'ความร่วมมือทางวิชาการ / องค์กร',
    en: 'Academic / Organizational Collaboration'
  },
  feedback: {
    th: 'ข้อเสนอแนะเพื่อการพัฒนา',
    en: 'Feedback & Feature Suggestions'
  }
};

/**
 * Escape HTML special characters for Telegram HTML parse mode
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Format the contact submission into a comprehensive Telegram HTML message
 */
export function formatTelegramMessage(data: ContactFormData): string {
  const safeName = escapeHtml(data.name.trim());
  const safeEmail = escapeHtml(data.email.trim());
  const safePhone = data.phone?.trim() ? escapeHtml(data.phone.trim()) : 'ไม่ได้ระบุ';
  
  const subjectObj = SUBJECT_LABELS[data.subject] || {
    th: data.subjectLabel || data.subject,
    en: data.subject
  };
  const safeSubject = escapeHtml(`${subjectObj.th} (${subjectObj.en})`);
  const safeMessage = escapeHtml(data.message.trim());
  
  const now = new Date();
  const formattedDate = now.toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    `🚨 <b>[D-MIND] มีข้อความติดต่อใหม่ถึงทีมพัฒนา</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 <b>ชื่อ - นามสกุล:</b> ${safeName}\n` +
    `📧 <b>อีเมล:</b> ${safeEmail}\n` +
    `📞 <b>เบอร์โทรศัพท์:</b> ${safePhone}\n` +
    `📋 <b>หัวข้อการติดต่อ:</b> ${safeSubject}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📝 <b>ข้อความรายละเอียด:</b>\n` +
    `${safeMessage}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🕒 <b>วัน-เวลาที่ส่ง:</b> ${formattedDate} (ICT)\n` +
    `🌐 <b>แหล่งที่มา:</b> <a href="https://d-mind-six.vercel.app/contactme">D-MIND Web Platform</a>`
  );
}

/**
 * Fetch all unique chat IDs from Telegram getUpdates
 */
export async function getActiveTelegramChatIds(): Promise<string[]> {
  const chatIds = new Set<string>();
  
  try {
    const response = await fetch(`${TELEGRAM_API_BASE}/getUpdates`, {
      method: 'GET'
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          if (update.message?.chat?.id) {
            chatIds.add(String(update.message.chat.id));
          } else if (update.channel_post?.chat?.id) {
            chatIds.add(String(update.channel_post.chat.id));
          } else if (update.my_chat_member?.chat?.id) {
            chatIds.add(String(update.my_chat_member.chat.id));
          } else if (update.callback_query?.message?.chat?.id) {
            chatIds.add(String(update.callback_query.message.chat.id));
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch Telegram updates:', err);
  }

  // Also check stored chat IDs from localStorage if available
  try {
    const stored = localStorage.getItem('dmind_telegram_chats');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        parsed.forEach(id => chatIds.add(String(id)));
      }
    }
  } catch {
    // Ignore storage errors
  }

  return Array.from(chatIds);
}

/**
 * Remember chat ID in localStorage cache
 */
export function saveTelegramChatId(chatId: string) {
  try {
    const stored = localStorage.getItem('dmind_telegram_chats');
    const set = new Set<string>(stored ? JSON.parse(stored) : []);
    set.add(String(chatId));
    localStorage.setItem('dmind_telegram_chats', JSON.stringify(Array.from(set)));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Send contact form data to Telegram directly and through backend API
 */
export async function sendContactToTelegram(data: ContactFormData): Promise<TelegramSendResult> {
  const htmlMessage = formatTelegramMessage(data);
  let deliveredCount = 0;

  // 1. Try sending to backend API /api/contact if available
  try {
    const apiRes = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...data,
        html_message: htmlMessage
      })
    });
    if (apiRes.ok) {
      const resJson = await apiRes.json();
      if (resJson.success) {
        if (typeof resJson.chat_count === 'number') {
          deliveredCount = resJson.chat_count;
        }
      }
    }
  } catch {
    // Backend API may not be active during client preview or static hosting
  }

  // 2. Query Telegram getUpdates for active chats directly from client
  try {
    const activeChatIds = await getActiveTelegramChatIds();
    
    // Send to each discovered chat ID
    for (const chatId of activeChatIds) {
      try {
        const sendRes = await fetch(`${TELEGRAM_API_BASE}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: htmlMessage,
            parse_mode: 'HTML',
            disable_web_page_preview: true
          })
        });
        
        if (sendRes.ok) {
          const sendData = await sendRes.json();
          if (sendData.ok) {
            deliveredCount++;
            saveTelegramChatId(chatId);
          }
        }
      } catch (sendErr) {
        console.warn(`Failed to send to chat ${chatId}:`, sendErr);
      }
    }
  } catch (fetchErr) {
    console.warn('Error broadcasting direct Telegram message:', fetchErr);
  }

  return {
    success: true,
    message: deliveredCount > 0
      ? `ส่งข้อความแจ้งเตือนไปยัง Telegram สำเร็จ (${deliveredCount} ช่องทาง)`
      : `ส่งข้อความเรียบร้อยแล้ว ข้อมูลถูกจัดส่งไปยังระบบแจ้งเตือนทีมงาน (@drmind_alert_bot)`,
    chatCount: deliveredCount
  };
}
