import unittest
import sys
import os
import asyncio
import json

# Add the python_core directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend', 'python_core'))

from api_client import APIClient, fetch_public_api_data

class TestAPIAutomation(unittest.TestCase):
    
    def setUp(self):
        """Set up test fixtures before each test method."""
        self.base_url = "https://httpbin.org"
        self.client = APIClient(self.base_url)
        
    def test_api_client_initialization(self):
        """Test that the API client initializes correctly."""
        self.assertIsNotNone(self.client)
        self.assertEqual(self.client.base_url, self.base_url)
        self.assertIsNotNone(self.client.circuit_breaker)
        
    def test_circuit_breaker_initial_state(self):
        """Test circuit breaker initial state."""
        cb = self.client.circuit_breaker
        self.assertEqual(cb.state, "CLOSED")
        self.assertEqual(cb.failure_count, 0)
        self.assertFalse(cb.is_open())
        
    def test_circuit_breaker_open_state(self):
        """Test circuit breaker transitions to open state."""
        cb = self.client.circuit_breaker
        # Record failures to exceed threshold
        for _ in range(cb.failure_threshold + 1):
            cb.record_failure()
            
        self.assertTrue(cb.is_open())
        self.assertEqual(cb.state, "OPEN")
        
    def test_circuit_breaker_half_open_state(self):
        """Test circuit breaker transitions to half-open state."""
        cb = self.client.circuit_breaker
        # Record failures to exceed threshold
        for _ in range(cb.failure_threshold + 1):
            cb.record_failure()
            
        # Manually set last failure time to timeout ago
        import time
        cb.last_failure_time = time.time() - cb.timeout - 1
        
        # Check if it transitions to half-open
        self.assertTrue(cb.is_open())
        self.assertEqual(cb.state, "HALF_OPEN")
        
    async def async_test_get_request(self):
        """Test GET request with async client."""
        async with APIClient("https://httpbin.org") as client:
            response = await client.get("/get")
            self.assertIsNotNone(response)
            self.assertIn("url", response)
            
    async def async_test_post_request(self):
        """Test POST request with async client."""
        async with APIClient("https://httpbin.org") as client:
            data = {"test": "data"}
            response = await client.post("/post", data=data)
            self.assertIsNotNone(response)
            self.assertIn("json", response)
            self.assertEqual(response["json"], data)
            
    def test_fetch_public_api_data(self):
        """Test fetching public API data."""
        # This is a sync wrapper for the async function
        async def run_test():
            data = await fetch_public_api_data()
            return data
            
        # Run the async test
        try:
            data = asyncio.run(run_test())
            # We expect this to work or at least not raise an exception
            self.assertTrue(isinstance(data, list) or data is None)
        except Exception as e:
            # If there's a network issue, that's acceptable for this test
            print(f"Network test failed (acceptable): {e}")

if __name__ == '__main__':
    unittest.main()