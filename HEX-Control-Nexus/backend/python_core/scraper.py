"""
HEX Control Nexus - Web Scraper Module
Handles static and dynamic web scraping tasks
"""

import requests
from bs4 import BeautifulSoup
import time
import random
import logging
import json
import csv
import sqlite3
import os
from urllib.parse import urljoin, urlparse
from typing import Dict, List, Optional
import re

logger = logging.getLogger(__name__)

class Scraper:
    def __init__(self, target_config: Dict, global_config: Dict):
        self.target = target_config
        self.config = global_config
        self.session = requests.Session()
        self.setup_session()
        
    def setup_session(self):
        """Setup session with user agents and headers"""
        user_agents = self.config.get('user_agents', [
            'Mozilla/5.0 (compatible; HEX/1.0)'
        ])
        self.session.headers.update({
            'User-Agent': random.choice(user_agents)
        })
        
    def check_robots_txt(self, url: str) -> bool:
        """Check robots.txt for allowed paths"""
        try:
            parsed_url = urlparse(url)
            robots_url = f"{parsed_url.scheme}://{parsed_url.netloc}/robots.txt"
            
            response = self.session.get(robots_url, timeout=10)
            if response.status_code == 200:
                # Simple check - in reality, you'd want a proper robots.txt parser
                if 'Disallow: ' + parsed_url.path in response.text:
                    logger.warning(f"Path {parsed_url.path} disallowed by robots.txt")
                    return False
            return True
        except Exception as e:
            logger.warning(f"Could not check robots.txt: {e}")
            return True  # Default to allowed if we can't check
            
    def scrape_page(self, url: str) -> Optional[BeautifulSoup]:
        """Scrape a single page and return BeautifulSoup object"""
        if not self.check_robots_txt(url):
            logger.error(f"Scraping disallowed by robots.txt: {url}")
            return None
            
        try:
            # Apply rate limiting
            delay = self.config.get('rate_limit', {}).get('delay_seconds', 1.0)
            if self.config.get('rate_limit', {}).get('jitter', False):
                delay += random.uniform(0, 1)
            time.sleep(delay)
            
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            logger.error(f"Failed to scrape {url}: {e}")
            return None
            
    def extract_data(self, soup: BeautifulSoup, selectors: Dict) -> List[Dict]:
        """Extract data from soup using CSS selectors"""
        items = []
        item_selector = selectors.get('item', '')
        field_selectors = selectors.get('fields', {})
        
        item_elements = soup.select(item_selector)
        
        for element in item_elements:
            item_data = {}
            for field_name, selector in field_selectors.items():
                try:
                    if selector.endswith('::text'):
                        # Extract text
                        selector = selector[:-7]  # Remove ::text
                        field_element = element.select_one(selector)
                        item_data[field_name] = field_element.get_text(strip=True) if field_element else ''
                    elif '::attr(' in selector:
                        # Extract attribute
                        attr_match = re.search(r'::attr\((\w+)\)', selector)
                        if attr_match:
                            attr_name = attr_match.group(1)
                            selector = selector[:attr_match.start()]
                            field_element = element.select_one(selector)
                            item_data[field_name] = field_element.get(attr_name, '') if field_element else ''
                    else:
                        # Default to text extraction
                        field_element = element.select_one(selector)
                        item_data[field_name] = field_element.get_text(strip=True) if field_element else ''
                except Exception as e:
                    logger.warning(f"Failed to extract field {field_name}: {e}")
                    item_data[field_name] = ''
                    
            items.append(item_data)
            
        return items
        
    def save_to_csv(self, data: List[Dict], filename: str):
        """Save data to CSV file"""
        if not data:
            return
            
        keys = data[0].keys()
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(data)
            
    def save_to_jsonl(self, data: List[Dict], filename: str):
        """Save data to JSONL file"""
        with open(filename, 'w', encoding='utf-8') as f:
            for item in data:
                f.write(json.dumps(item) + '\n')
                
    def save_to_sqlite(self, data: List[Dict], db_path: str, table_name: str, unique_key: str = None):
        """Save data to SQLite database"""
        if not data:
            return
            
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create table if it doesn't exist
        if data:
            columns = list(data[0].keys())
            column_defs = ', '.join([f"{col} TEXT" for col in columns])
            cursor.execute(f"CREATE TABLE IF NOT EXISTS {table_name} ({column_defs})")
            
            # Insert data
            for item in data:
                # Check for duplicates if unique_key is specified
                if unique_key and unique_key in item:
                    cursor.execute(f"SELECT 1 FROM {table_name} WHERE {unique_key} = ?", 
                                 (item[unique_key],))
                    if cursor.fetchone():
                        continue  # Skip duplicates
                        
                placeholders = ', '.join(['?' for _ in columns])
                values = [item.get(col, '') for col in columns]
                cursor.execute(f"INSERT INTO {table_name} VALUES ({placeholders})", values)
                
        conn.commit()
        conn.close()
        
    def scrape(self) -> List[Dict]:
        """Main scraping function"""
        base_url = self.target['base_url']
        start_paths = self.target['start_paths']
        selectors = self.target['selectors']
        storage_config = self.target.get('storage', {})
        
        all_data = []
        
        for path in start_paths:
            url = urljoin(base_url, path)
            logger.info(f"Scraping: {url}")
            
            soup = self.scrape_page(url)
            if not soup:
                continue
                
            data = self.extract_data(soup, selectors)
            all_data.extend(data)
            
            # Handle pagination
            pagination = self.target.get('pagination', {})
            next_selector = pagination.get('next_selector')
            next_url_template = pagination.get('next_url_template')
            
            if next_selector:
                next_link = soup.select_one(next_selector)
                if next_link and next_link.get('href'):
                    next_url = urljoin(base_url, next_link['href'])
                    # For demo, we'll just log the next URL
                    logger.info(f"Next page: {next_url}")
                    
        # Save data
        storage_type = storage_config.get('type', 'jsonl')
        storage_path = storage_config.get('path', f"output_{self.target['name']}.jsonl")
        unique_key = storage_config.get('unique_key')
        
        if storage_type == 'csv':
            self.save_to_csv(all_data, storage_path)
        elif storage_type == 'jsonl':
            self.save_to_jsonl(all_data, storage_path)
        elif storage_type == 'sqlite':
            table_name = self.target.get('name', 'scraped_data')
            self.save_to_sqlite(all_data, storage_path, table_name, unique_key)
            
        logger.info(f"Scraped {len(all_data)} items from {self.target['name']}")
        return all_data