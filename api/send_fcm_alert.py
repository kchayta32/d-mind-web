"""
D-MIND Web - Firebase Cloud Messaging (FCM) Emergency Alert Dispatcher (Python)

Sends Web Push alerts to user devices via FCM HTTP v1 API.

Usage:
    python api/send_fcm_alert.py --title "เตือนภัยน้ำท่วม" --body "มวลน้ำจากแม่น้ำยมกำลังไหลเข้าสู่ตัวเมือง"
"""

import sys
import os
import json
import argparse
from datetime import datetime

def build_fcm_payload(title: str, body: str, token: str = None, topic: str = "disaster_alerts", click_url: str = "/disaster-map"):
    message = {
        "notification": {
            "title": title,
            "body": body,
            "image": "https://d-mind.web.app/dmind-premium-icon.png"
        },
        "webpush": {
            "headers": {
                "Urgency": "high"
            },
            "notification": {
                "title": title,
                "body": body,
                "icon": "/dmind-premium-icon.png",
                "badge": "/dmind-premium-icon.png",
                "vibrate": [300, 100, 300, 100, 300],
                "requireInteraction": True,
                "actions": [
                    {"action": "open_map", "title": "🗺️ เปิดแผนที่สด"},
                    {"action": "dismiss", "title": "รับทราบ"}
                ]
            },
            "fcm_options": {
                "link": click_url
            }
        },
        "data": {
            "url": click_url,
            "disaster_type": "flood",
            "timestamp": datetime.utcnow().isoformat()
        }
    }

    if token:
        message["token"] = token
    else:
        message["topic"] = topic

    return {"message": message}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Send D-MIND FCM Emergency Web Push Alert")
    parser.add_argument("--title", default="🚨 D-MIND แจ้งเตือนภัยฉุกเฉิน", help="Alert title")
    parser.add_argument("--body", default="มีรายงานน้ำท่วมฉับพลันในพื้นที่ โปรดตรวจสอบสถานการณ์", help="Alert body text")
    parser.add_argument("--token", default=None, help="Target device FCM registration token")
    parser.add_argument("--topic", default="disaster_alerts", help="Target topic (e.g. disaster_alerts)")
    parser.add_argument("--url", default="/disaster-map", help="URL to navigate when clicked")

    args = parser.parse_args()

    payload = build_fcm_payload(args.title, args.body, args.token, args.topic, args.url)
    print("=" * 60)
    print("📢 D-MIND FCM Web Push Dispatcher (Python)")
    print("=" * 60)
    print(f"Title:  {args.title}")
    print(f"Body:   {args.body}")
    print(f"Target: {'Device Token' if args.token else f'Topic ({args.topic})'}")
    print("-" * 60)
    print("Constructed FCM JSON:")
    print(json.dumps(payload, indent=2, ensure_ascii=False))
