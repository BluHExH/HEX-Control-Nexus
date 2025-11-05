"""
HEX Control Nexus - Notification Module
Handles sending notifications via Telegram, Email, etc.
"""

import logging
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import requests

logger = logging.getLogger(__name__)

class Notifier:
    def __init__(self):
        self.telegram_token = os.getenv('TELEGRAM_BOT_TOKEN')
        self.telegram_chat_id = os.getenv('TELEGRAM_CHAT_ID')
        self.email_host = os.getenv('EMAIL_HOST')
        self.email_port = int(os.getenv('EMAIL_PORT', 587))
        self.email_user = os.getenv('EMAIL_USER')
        self.email_password = os.getenv('EMAIL_PASSWORD')
        
    def send_telegram_message(self, message: str) -> bool:
        """Send message via Telegram bot"""
        if not self.telegram_token or not self.telegram_chat_id:
            logger.warning("Telegram credentials not configured")
            return False
            
        try:
            url = f"https://api.telegram.org/bot{self.telegram_token}/sendMessage"
            data = {
                "chat_id": self.telegram_chat_id,
                "text": message
            }
            response = requests.post(url, data=data, timeout=30)
            response.raise_for_status()
            logger.info("Telegram message sent successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to send Telegram message: {e}")
            return False
            
    def send_email(self, subject: str, body: str, to_email: str) -> bool:
        """Send email notification"""
        if not all([self.email_host, self.email_user, self.email_password]):
            logger.warning("Email credentials not configured")
            return False
            
        try:
            msg = MIMEMultipart()
            msg['From'] = self.email_user
            msg['To'] = to_email
            msg['Subject'] = subject
            
            msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP(self.email_host, self.email_port)
            server.starttls()
            server.login(self.email_user, self.email_password)
            server.send_message(msg)
            server.quit()
            
            logger.info("Email sent successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            return False
            
    def send_slack_webhook(self, webhook_url: str, message: str) -> bool:
        """Send message via Slack webhook"""
        try:
            data = {"text": message}
            response = requests.post(webhook_url, json=data, timeout=30)
            response.raise_for_status()
            logger.info("Slack webhook message sent successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to send Slack webhook message: {e}")
            return False
            
    def send_discord_webhook(self, webhook_url: str, message: str) -> bool:
        """Send message via Discord webhook"""
        try:
            data = {"content": message}
            response = requests.post(webhook_url, json=data, timeout=30)
            response.raise_for_status()
            logger.info("Discord webhook message sent successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to send Discord webhook message: {e}")
            return False

# Example usage
if __name__ == "__main__":
    notifier = Notifier()
    
    # Example: Send Telegram notification
    # notifier.send_telegram_message("HEX Control Nexus started successfully!")
    
    # Example: Send email notification
    # notifier.send_email("HEX Control Nexus Alert", "System is running", "admin@example.com")