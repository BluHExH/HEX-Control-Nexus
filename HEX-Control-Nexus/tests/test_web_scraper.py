import unittest
import sys
import os
from bs4 import BeautifulSoup

# Add the python_core directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'python_core'))

from scraper import Scraper

class TestWebScraper(unittest.TestCase):
    
    def setUp(self):
        """Set up test fixtures before each test method."""
        self.sample_html = """
        <html>
        <head><title>Test Page</title></head>
        <body>
            <div class="container">
                <div class="quote">
                    <span class="text">Test quote 1</span>
                    <span class="author">Author 1</span>
                    <div class="tags">
                        <a class="tag" href="/tag/tag1">tag1</a>
                        <a class="tag" href="/tag/tag2">tag2</a>
                    </div>
                </div>
                <div class="quote">
                    <span class="text">Test quote 2</span>
                    <span class="author">Author 2</span>
                    <div class="tags">
                        <a class="tag" href="/tag/tag3">tag3</a>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        self.target_config = {
            "name": "test_target",
            "mode": "static",
            "base_url": "http://example.com",
            "start_paths": ["/"],
            "selectors": {
                "item": ".quote",
                "fields": {
                    "text": ".text",
                    "author": ".author",
                    "tags": ".tags .tag"
                }
            },
            "pagination": {
                "next_selector": ".next a",
                "next_url_template": None
            },
            "storage": {
                "type": "jsonl",
                "path": "test_output.jsonl",
                "unique_key": "text"
            }
        }
        
        self.global_config = {
            "concurrency": {"global": 5, "per_domain": 2},
            "rate_limit": {"delay_seconds": 0.1, "jitter": False},
            "user_agents": ["Test Agent"]
        }
        
    def test_scraper_initialization(self):
        """Test that the scraper initializes correctly."""
        scraper = Scraper(self.target_config, self.global_config)
        self.assertIsNotNone(scraper)
        self.assertEqual(scraper.target, self.target_config)
        self.assertEqual(scraper.config, self.global_config)
        
    def test_extract_data(self):
        """Test data extraction from HTML."""
        scraper = Scraper(self.target_config, self.global_config)
        soup = BeautifulSoup(self.sample_html, 'html.parser')
        
        data = scraper.extract_data(soup, self.target_config['selectors'])
        
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]['text'], 'Test quote 1')
        self.assertEqual(data[0]['author'], 'Author 1')
        self.assertIn('tag1', data[0]['tags'])
        self.assertIn('tag2', data[0]['tags'])
        
    def test_save_to_csv(self):
        """Test saving data to CSV."""
        scraper = Scraper(self.target_config, self.global_config)
        test_data = [
            {"text": "Quote 1", "author": "Author 1", "tags": "tag1,tag2"},
            {"text": "Quote 2", "author": "Author 2", "tags": "tag3"}
        ]
        
        test_file = "test_output.csv"
        scraper.save_to_csv(test_data, test_file)
        
        # Check that file was created
        self.assertTrue(os.path.exists(test_file))
        
        # Clean up
        if os.path.exists(test_file):
            os.remove(test_file)
            
    def test_save_to_jsonl(self):
        """Test saving data to JSONL."""
        scraper = Scraper(self.target_config, self.global_config)
        test_data = [
            {"text": "Quote 1", "author": "Author 1", "tags": "tag1,tag2"},
            {"text": "Quote 2", "author": "Author 2", "tags": "tag3"}
        ]
        
        test_file = "test_output.jsonl"
        scraper.save_to_jsonl(test_data, test_file)
        
        # Check that file was created
        self.assertTrue(os.path.exists(test_file))
        
        # Clean up
        if os.path.exists(test_file):
            os.remove(test_file)
            
    def test_save_to_sqlite(self):
        """Test saving data to SQLite."""
        scraper = Scraper(self.target_config, self.global_config)
        test_data = [
            {"text": "Quote 1", "author": "Author 1", "tags": "tag1,tag2"},
            {"text": "Quote 2", "author": "Author 2", "tags": "tag3"}
        ]
        
        test_db = "test_output.db"
        scraper.save_to_sqlite(test_data, test_db, "test_table", "text")
        
        # Check that database file was created
        self.assertTrue(os.path.exists(test_db))
        
        # Clean up
        if os.path.exists(test_db):
            os.remove(test_db)

if __name__ == '__main__':
    unittest.main()