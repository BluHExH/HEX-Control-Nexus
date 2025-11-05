#!/usr/bin/env python3
"""
HEX Control Nexus - Automation Core
Main entry point for the automation system
"""

import argparse
import json
import logging
import os
import signal
import sys
from typing import Dict, List
import time

from scraper import Scraper
from api_client import APIClient
from notifier import Notifier

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class AutomationEngine:
    def __init__(self, config_path: str = "config/config.json"):
        self.config_path = config_path
        self.config = self.load_config()
        self.running = False
        self.jobs = {}
        
        # Setup signal handlers for graceful shutdown
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
        
    def load_config(self) -> Dict:
        """Load configuration from JSON file"""
        try:
            with open(self.config_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load config: {e}")
            return {}
            
    def signal_handler(self, signum, frame):
        """Handle shutdown signals gracefully"""
        logger.info(f"Received signal {signum}, shutting down gracefully...")
        self.running = False
        sys.exit(0)
        
    def run_target(self, target_name: str, dry_run: bool = False):
        """Run a specific target"""
        target = None
        for t in self.config.get('targets', []):
            if t['name'] == target_name:
                target = t
                break
                
        if not target:
            logger.error(f"Target '{target_name}' not found in config")
            return
            
        logger.info(f"Running target: {target_name}")
        
        if target.get('mode') == 'static':
            scraper = Scraper(target, self.config)
            if not dry_run:
                scraper.scrape()
            else:
                logger.info("Dry run mode - would scrape target")
        else:
            logger.warning(f"Mode '{target.get('mode')}' not implemented yet")
            
    def run_all_targets(self, dry_run: bool = False):
        """Run all enabled targets"""
        for target in self.config.get('targets', []):
            if not self.running:
                break
            self.run_target(target['name'], dry_run)
            
    def run_daemon(self):
        """Run in daemon mode"""
        self.running = True
        logger.info("Starting daemon mode")
        
        while self.running:
            self.run_all_targets()
            # Sleep for configured interval or 1 hour by default
            interval = self.config.get('daemon_interval', 3600)
            logger.info(f"Sleeping for {interval} seconds")
            time.sleep(interval)

def main():
    parser = argparse.ArgumentParser(description='HEX Control Nexus Automation Engine')
    parser.add_argument('--target', type=str, help='Run specific target')
    parser.add_argument('--config', type=str, default='config/config.json', help='Config file path')
    parser.add_argument('--once', action='store_true', help='Run once and exit')
    parser.add_argument('--daemon', action='store_true', help='Run in daemon mode')
    parser.add_argument('--dry-run', action='store_true', help='Dry run without actually scraping')
    parser.add_argument('--export', type=str, help='Export format (csv, jsonl, sqlite)')
    
    args = parser.parse_args()
    
    # Print banner
    try:
        with open('scripts/banner.txt', 'r') as f:
            print(f.read())
    except:
        print("HEX Control Nexus - Multi-Language Automation Hub")
    
    engine = AutomationEngine(args.config)
    
    if args.target:
        engine.run_target(args.target, args.dry_run)
    elif args.daemon:
        engine.run_daemon()
    else:
        engine.run_all_targets(args.dry_run)
        
    logger.info("Automation run completed")

if __name__ == "__main__":
    main()