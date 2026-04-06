import requests
import sys
from datetime import datetime

class DravionAPITester:
    def __init__(self, base_url="https://explore-bot-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, expected_data_keys=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                response_data = {"raw_response": response.text}

            if success:
                # Check if expected data keys are present
                if expected_data_keys:
                    for key in expected_data_keys:
                        if key not in response_data:
                            success = False
                            print(f"❌ Failed - Missing expected key: {key}")
                            break
                
                if success:
                    self.tests_passed += 1
                    print(f"✅ Passed - Status: {response.status_code}")
                    print(f"   Response: {response_data}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response_data}")

            self.test_results.append({
                "test_name": name,
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_data": response_data
            })

            return success, response_data

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            self.test_results.append({
                "test_name": name,
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": "ERROR",
                "success": False,
                "error": str(e)
            })
            return False, {}

    def test_health_endpoint(self):
        """Test health check endpoint"""
        return self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200,
            expected_data_keys=["status", "service"]
        )

    def test_stats_endpoint(self):
        """Test stats endpoint"""
        return self.run_test(
            "Stats Endpoint",
            "GET", 
            "api/stats",
            200,
            expected_data_keys=["servers", "users", "commands_executed", "uptime"]
        )

    def test_status_endpoint(self):
        """Test status endpoint"""
        return self.run_test(
            "Status Endpoint",
            "GET",
            "api/status", 
            200,
            expected_data_keys=["overall", "last_updated", "services", "incidents"]
        )

    def test_changelog_endpoint(self):
        """Test changelog endpoint"""
        return self.run_test(
            "Changelog Endpoint",
            "GET",
            "api/changelog",
            200,
            expected_data_keys=["releases"]
        )

    def test_team_endpoint(self):
        """Test team endpoint"""
        return self.run_test(
            "Team Endpoint", 
            "GET",
            "api/team",
            200,
            expected_data_keys=["members"]
        )

    def validate_stats_data(self, stats_data):
        """Validate that stats data contains expected format"""
        expected_keys = ["servers", "users", "commands_executed", "uptime"]
        validation_results = []
        
        for key in expected_keys:
            if key in stats_data:
                value = stats_data[key]
                if isinstance(value, str) and value:
                    validation_results.append(f"✅ {key}: {value}")
                else:
                    validation_results.append(f"❌ {key}: Invalid format")
            else:
                validation_results.append(f"❌ {key}: Missing")
        
        return validation_results

def main():
    print("🚀 Starting Dravion Landing Page API Tests")
    print("=" * 50)
    
    # Setup
    tester = DravionAPITester()
    
    # Test health endpoint
    health_success, health_data = tester.test_health_endpoint()
    
    # Test stats endpoint
    stats_success, stats_data = tester.test_stats_endpoint()
    
    # Test status endpoint
    status_success, status_data = tester.test_status_endpoint()
    
    # Test changelog endpoint
    changelog_success, changelog_data = tester.test_changelog_endpoint()
    
    # Test team endpoint
    team_success, team_data = tester.test_team_endpoint()
    
    # Validate stats data format
    if stats_success:
        print(f"\n📊 Validating Stats Data Format:")
        validation_results = tester.validate_stats_data(stats_data)
        for result in validation_results:
            print(f"   {result}")
    
    # Print final results
    print(f"\n" + "=" * 50)
    print(f"📊 Final Results:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Print detailed results
    print(f"\n📋 Detailed Test Results:")
    for result in tester.test_results:
        status = "✅ PASS" if result["success"] else "❌ FAIL"
        print(f"   {status} - {result['test_name']} ({result['method']} {result['endpoint']})")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())