"""
HEX Control Nexus - API Client Module
Handles API requests with retry logic and circuit breaker
"""

import aiohttp
import asyncio
import logging
import json
import time
from typing import Dict, Any, Optional
from dataclasses import dataclass
from urllib.parse import urljoin

logger = logging.getLogger(__name__)

@dataclass
class CircuitBreaker:
    failure_threshold: int = 5
    timeout: int = 60
    failure_count: int = 0
    last_failure_time: float = 0
    state: str = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
    
    def is_open(self) -> bool:
        """Check if circuit breaker is open"""
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.timeout:
                self.state = "HALF_OPEN"
            else:
                return True
        return False
        
    def record_success(self):
        """Record a successful request"""
        self.failure_count = 0
        self.state = "CLOSED"
        
    def record_failure(self):
        """Record a failed request"""
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"

class APIClient:
    def __init__(self, base_url: str, headers: Dict[str, str] = None):
        self.base_url = base_url
        self.headers = headers or {}
        self.session = None
        self.circuit_breaker = CircuitBreaker()
        
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession(headers=self.headers)
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
            
    async def _request_with_retry(self, method: str, url: str, 
                                 retries: int = 3, 
                                 backoff_factor: float = 1.0,
                                 **kwargs) -> Optional[aiohttp.ClientResponse]:
        """Make HTTP request with retry logic"""
        if self.circuit_breaker.is_open():
            logger.warning(f"Circuit breaker is OPEN for {self.base_url}")
            return None
            
        last_exception = None
        
        for attempt in range(retries + 1):
            try:
                full_url = urljoin(self.base_url, url)
                response = await self.session.request(method, full_url, **kwargs)
                
                # Check if response is successful
                if response.status < 500:
                    self.circuit_breaker.record_success()
                    return response
                    
                # For 5xx errors, record failure and retry
                self.circuit_breaker.record_failure()
                logger.warning(f"HTTP {response.status} for {full_url}")
                
            except Exception as e:
                last_exception = e
                self.circuit_breaker.record_failure()
                logger.warning(f"Request failed (attempt {attempt + 1}): {e}")
                
            if attempt < retries:
                # Exponential backoff
                wait_time = backoff_factor * (2 ** attempt)
                logger.info(f"Waiting {wait_time}s before retry")
                await asyncio.sleep(wait_time)
                
        logger.error(f"All retries failed for {url}: {last_exception}")
        return None
        
    async def get(self, url: str, **kwargs) -> Optional[Dict[Any, Any]]:
        """Make GET request"""
        response = await self._request_with_retry("GET", url, **kwargs)
        if response and response.status == 200:
            try:
                return await response.json()
            except:
                text = await response.text()
                logger.warning(f"Failed to parse JSON response: {text}")
                return {"content": text}
        return None
        
    async def post(self, url: str, data: Dict = None, **kwargs) -> Optional[Dict[Any, Any]]:
        """Make POST request"""
        if data:
            kwargs['json'] = data
            
        response = await self._request_with_retry("POST", url, **kwargs)
        if response and response.status < 300:
            try:
                return await response.json()
            except:
                text = await response.text()
                logger.warning(f"Failed to parse JSON response: {text}")
                return {"content": text}
        return None
        
    async def put(self, url: str, data: Dict = None, **kwargs) -> Optional[Dict[Any, Any]]:
        """Make PUT request"""
        if data:
            kwargs['json'] = data
            
        response = await self._request_with_retry("PUT", url, **kwargs)
        if response and response.status < 300:
            try:
                return await response.json()
            except:
                text = await response.text()
                logger.warning(f"Failed to parse JSON response: {text}")
                return {"content": text}
        return None
        
    async def delete(self, url: str, **kwargs) -> bool:
        """Make DELETE request"""
        response = await self._request_with_retry("DELETE", url, **kwargs)
        return response is not None and response.status < 300

# Example usage function
async def fetch_public_api_data():
    """Example function to fetch and normalize public API data"""
    async with APIClient("https://jsonplaceholder.typicode.com") as client:
        # Fetch posts
        posts = await client.get("/posts")
        if posts:
            logger.info(f"Fetched {len(posts)} posts")
            
            # Normalize data
            normalized_posts = []
            for post in posts:
                normalized = {
                    "id": post.get("id"),
                    "title": post.get("title", "")[:100],  # Limit title length
                    "body": post.get("body", "")[:500],    # Limit body length
                    "user_id": post.get("userId"),
                    "scraped_at": time.time()
                }
                normalized_posts.append(normalized)
                
            return normalized_posts
        return []

# For testing
if __name__ == "__main__":
    async def main():
        data = await fetch_public_api_data()
        print(f"Retrieved {len(data) if data else 0} items")
        
    asyncio.run(main())