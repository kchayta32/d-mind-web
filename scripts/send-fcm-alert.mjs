/**
 * D-MIND - Firebase Cloud Messaging (FCM) Emergency Alert Broadcast Script
 * 
 * Usage:
 *   node scripts/send-fcm-alert.mjs --title "แจ้งเตือนน้ำท่วมฉับพลัน" --body "ระดับน้ำแม่น้ำยมสูงขึ้นฉับพลัน โปรดยกของขึ้นที่สูง" --topic "disaster_alerts"
 * 
 * Requirements:
 *   - Service Account JSON downloaded from Firebase Console (Project Settings -> Service accounts)
 *   - Or set GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account.json"
 */

import fs from 'fs';
import path from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
};

const title = getArg('title', '🚨 D-MIND: แจ้งเตือนภัยฉุกเฉิน');
const body = getArg('body', 'มีรายงานพื้นที่เสี่ยงภัยน้ำท่วม โปรดตรวจสอบแผนที่สถานการณ์สด');
const token = getArg('token', null);
const topic = getArg('topic', 'disaster_alerts');
const clickUrl = getArg('url', 'https://d-mind.web.app/disaster-map');

console.log('='.repeat(60));
console.log('📢 D-MIND FCM Push Alert Dispatcher');
console.log('='.repeat(60));
console.log(`📌 Title:   ${title}`);
console.log(`📌 Body:    ${body}`);
console.log(`📌 Target:  ${token ? `Device Token (${token.substring(0, 15)}...)` : `Topic (${topic})`}`);
console.log(`📌 Action:  ${clickUrl}`);
console.log('-'.repeat(60));

/**
 * Construct standard FCM v1 payload
 */
const payload = {
  message: {
    ...(token ? { token } : { topic }),
    notification: {
      title,
      body,
      image: 'https://d-mind.web.app/dmind-premium-icon.png'
    },
    webpush: {
      headers: {
        Urgency: 'high',
        TTL: '86400'
      },
      notification: {
        title,
        body,
        icon: '/dmind-premium-icon.png',
        badge: '/dmind-premium-icon.png',
        vibrate: [300, 100, 300, 100, 300],
        requireInteraction: true,
        actions: [
          { action: 'open_map', title: '🗺️ เปิดแผนที่สด' },
          { action: 'dismiss', title: 'รับทราบ' }
        ]
      },
      fcm_options: {
        link: clickUrl
      }
    },
    data: {
      type: 'emergency_disaster_alert',
      url: clickUrl,
      timestamp: new Date().toISOString()
    }
  }
};

console.log('✅ FCM HTTP v1 JSON Payload ready:');
console.log(JSON.stringify(payload, null, 2));
console.log('\n💡 ในการส่งจริงผ่าน Backend:');
console.log('1. ใช้ Firebase Admin SDK: admin.messaging().send(payload.message)');
console.log('2. หรือยิง HTTP POST ไปที่: https://fcm.googleapis.com/v1/projects/d-mind-e11fc/messages:send');
console.log('   พร้อม Header Authorization: Bearer <ACCESS_TOKEN>');
