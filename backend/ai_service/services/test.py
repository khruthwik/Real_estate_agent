import requests

def test_geocoding_api(api_key):
    print("\n--- Testing Geocoding API ---")
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": "New York City", "key": api_key}
    r = requests.get(url, params=params).json()
    handle_response(r)

def test_directions_api(api_key):
    print("\n--- Testing Directions API ---")
    url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {"origin": "New York, NY", "destination": "Boston, MA", "key": api_key}
    r = requests.get(url, params=params).json()
    handle_response(r)

def test_distance_matrix_api(api_key):
    print("\n--- Testing Distance Matrix API ---")
    url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    params = {"origins": "New York, NY", "destinations": "Boston, MA", "key": api_key}
    r = requests.get(url, params=params).json()
    handle_response(r)

def test_places_api(api_key):
    print("\n--- Testing Places API ---")
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {"query": "restaurants in New York", "key": api_key}
    r = requests.get(url, params=params).json()
    handle_response(r)

def handle_response(data):
    status = data.get("status")
    if status == "OK":
        print("✅ API call successful.")
    else:
        print(f"⚠️ API call failed. Status: {status}")
        if "error_message" in data:
            print("Error message:", data["error_message"])

# 🔁 Replace with your actual API key
your_api_key = ""

test_geocoding_api(your_api_key)
test_directions_api(your_api_key)
test_distance_matrix_api(your_api_key)
test_places_api(your_api_key)
