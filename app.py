import datetime
import random
import os
import hashlib
import math
import urllib.request
import urllib.parse
import json
from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__, static_folder="dist")

# Simple In-Memory Database for demonstration
trip_history = [
    {
        "id": "1",
        "source": "Chennai",
        "destination": "Bangalore",
        "vehicle": "Electric Sedan",
        "departureTime": "08:30 AM",
        "travelTime": "5h 15m",
        "confidence": "94%",
        "fuelCost": "₹0.00",
        "carbon": "0.0 kg",
        "risk": "Low",
        "date": "2026-06-25",
        "score": 96
    },
    {
        "id": "2",
        "source": "San Francisco",
        "destination": "Los Angeles",
        "vehicle": "Hybrid SUV",
        "departureTime": "02:15 PM",
        "travelTime": "6h 10m",
        "confidence": "88%",
        "fuelCost": "₹3527.50",
        "carbon": "74.2 kg",
        "risk": "Moderate",
        "date": "2026-06-22",
        "score": 82
    },
    {
        "id": "3",
        "source": "Mumbai",
        "destination": "Pune",
        "vehicle": "Gasoline Hatchback",
        "departureTime": "06:00 PM",
        "travelTime": "3h 40m",
        "confidence": "76%",
        "fuelCost": "₹1510.60",
        "carbon": "31.8 kg",
        "risk": "High",
        "date": "2026-06-18",
        "score": 64
    }
]

# Simple CORS handling decorator/middleware
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS,PUT,DELETE"
    return response

def get_coordinates(city_name):
    try:
        url = "https://photon.komoot.io/api/?q=" + urllib.parse.quote(city_name) + "&limit=1"
        req = urllib.request.Request(url, headers={'User-Agent': 'THADAM-TravelApp/1.0'})
        res = urllib.request.urlopen(req, timeout=5)
        data = json.loads(res.read())
        if data['features']:
            lon, lat = data['features'][0]['geometry']['coordinates']
            return lat, lon
    except Exception:
        pass
    return None

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 3958.8 # Earth radius in miles
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def calculate_real_distance(source, destination):
    coords1 = get_coordinates(source)
    coords2 = get_coordinates(destination)
    if coords1 and coords2:
        straight_line = haversine_distance(coords1[0], coords1[1], coords2[0], coords2[1])
        return straight_line * 1.3 # multiply by 1.3 to approximate road distance
    
    # Fallback to deterministic hash
    hash_str = f"{source.lower()}-{destination.lower()}"
    hash_val = int(hashlib.md5(hash_str.encode()).hexdigest(), 16)
    return float(hash_val % 300 + 50)

# AI Prediction Engine Endpoint
@app.route("/api/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"})
        
    data = request.get_json() or {}
    source = data.get("source", "City A").strip() or "City A"
    destination = data.get("destination", "City B").strip() or "City B"
    vehicle = data.get("vehicle", "Electric Sedan")
    departure_time = data.get("departureTime", "08:00")
    preference = data.get("preference", "Fastest")
    mood = data.get("mood", "Normal")

    # Generate deterministic mock distance
    routes = {
        ("chennai", "bangalore"): 291.66,
        ("san francisco", "los angeles"): 402.17,
        ("mumbai", "pune"): 203.7,
    }
    key = (source.lower(), destination.lower())
    key_rev = (destination.lower(), source.lower())
    if key in routes:
        dist_factor = routes[key]
    elif key_rev in routes:
        dist_factor = routes[key_rev]
    else:
        dist_factor = calculate_real_distance(source, destination)
    
    # Speed based on vehicle & preferences
    speed = 65  # mph
    if preference == "Eco":
        speed = 55
    elif preference == "Fastest":
        speed = 75
    elif preference == "Cheapest":
        speed = 60

    base_time_hours = dist_factor / speed
    
    # Parse departure time to simulate peak traffic index
    hour = 8
    try:
        hour = int(departure_time.split(":")[0])
    except Exception:
        pass

    # High traffic during rush hours: 8-9 AM and 5-7 PM
    traffic_delay_multiplier = 1.0
    if (8 <= hour <= 9) or (17 <= hour <= 19):
        traffic_delay_multiplier = 1.35
    elif (12 <= hour <= 14):
        traffic_delay_multiplier = 1.15
        
    total_time_hours = base_time_hours * traffic_delay_multiplier
    
    # Calculate confidence score
    confidence_score = 95 - int(traffic_delay_multiplier * 15) - random.randint(0, 5)
    confidence_score = max(55, min(99, confidence_score))
    
    # Fuel cost calculations (per mile)
    # Electric: ₹3.5, Hybrid: ₹8.0, Gas: ₹15.0
    fuel_rate = 15.0
    co2_rate = 0.35 # kg per mile
    
    if "Electric" in vehicle:
        fuel_rate = 3.5
        co2_rate = 0.05
    elif "Hybrid" in vehicle:
        fuel_rate = 8.0
        co2_rate = 0.18
    elif "Hydrogen" in vehicle:
        fuel_rate = 6.0
        co2_rate = 0.0
        
    if preference == "Eco":
        fuel_rate *= 0.9
        co2_rate *= 0.85
        
    estimated_fuel_cost = dist_factor * fuel_rate
    estimated_carbon = dist_factor * co2_rate

    # Risk analysis based on rush hour and simulated weather conditions
    risk_level = "Low"
    risk_score = 20
    if traffic_delay_multiplier > 1.3:
        risk_level = "High"
        risk_score = 78
    elif traffic_delay_multiplier > 1.1:
        risk_level = "Moderate"
        risk_score = 45

    # Travel Score (100 is best)
    travel_score = 100 - int(risk_score * 0.4) - int((1 - (confidence_score / 100)) * 60)
    travel_score = max(35, min(98, travel_score))

    # Departure time optimizer options
    best_time_hour = (hour - 2) if hour > 10 else 10
    ampm = "AM" if best_time_hour < 12 else "PM"
    display_hour = best_time_hour % 12
    if display_hour == 0:
        display_hour = 12
    best_time_str = f"{display_hour:02d}:00 {ampm}"

    # Convert total time to hours and minutes
    h = int(total_time_hours)
    m = round((total_time_hours - h) * 60)
    if m == 60:
        h += 1
        m = 0
    time_str = f"{h}h {m:02d}m"

    # Create new trip record
    new_trip = {
        "id": str(len(trip_history) + 1),
        "source": source,
        "destination": destination,
        "vehicle": vehicle,
        "departureTime": departure_time,
        "travelTime": time_str,
        "confidence": f"{confidence_score}%",
        "fuelCost": f"₹{estimated_fuel_cost:.2f}",
        "carbon": f"{estimated_carbon:.1f} kg",
        "risk": risk_level,
        "date": datetime.date.today().isoformat(),
        "score": travel_score
    }
    
    trip_history.insert(0, new_trip)

    return jsonify({
        "status": "success",
        "prediction": {
            "source": source,
            "destination": destination,
            "travelTime": time_str,
            "confidence": f"{confidence_score}%",
            "confidenceNum": confidence_score,
            "fuelCost": f"₹{estimated_fuel_cost:.2f}",
            "carbon": f"{estimated_carbon:.1f} kg",
            "carbonNum": round(estimated_carbon, 1),
            "risk": risk_level,
            "riskScore": risk_score,
            "travelScore": travel_score,
            "bestDepartureTime": best_time_str,
            "delayProbability": f"{int((traffic_delay_multiplier - 1.0) * 100 + 10)}%",
            "weatherImpact": "Clear sky with mild headwind" if risk_level == "Low" else "Light rain causing highway slickness",
            "distanceMiles": round(dist_factor, 1),
            "bestRoute": f"THADAM Optimus Highway {random.randint(1,9)} (via Route {int(dist_factor % 10) + 1})",
            "recommendationCard": f"Leave {('after 15 minutes' if best_time_hour > hour else 'now')} to save {random.randint(10, 30)} minutes. Fuel saving ₹{random.randint(20, 80)}.",
            "decisionScore": min(99, travel_score + 2),
            "recommendedVehicle": vehicle if "Electric" in vehicle else "Electric Sedan",
            "budget": {
                "tollCost": f"₹{random.randint(40, 150)}",
                "parkingCost": f"₹{random.randint(20, 50)}",
                "totalCost": f"₹{(estimated_fuel_cost + random.randint(60, 200)):.2f}"
            },
            "weatherTimeline": [
                {"time": "08:00 AM", "temp": "28°C", "condition": "Sunny", "impact": "None"},
                {"time": "09:00 AM", "temp": "30°C", "condition": "Clear", "impact": "None"},
                {"time": "10:00 AM", "temp": "32°C", "condition": "Cloudy", "impact": "Low"},
                {"time": "11:00 AM", "temp": "34°C", "condition": "Hot", "impact": "Medium"}
            ],
            "aiMusic": [
                {"title": "Lo-Fi Beats" if mood in ["Stressed", "Tired"] else "Road Trip Hits", "genre": "Relaxing" if mood in ["Stressed", "Tired"] else "Pop", "duration": "1h 30m"},
                {"title": "Focus Flow" if mood == "Angry" else "Tamil Hits", "genre": "Ambient", "duration": "45m"}
            ],
            "nearbyServices": [
                {"type": "EV Station", "name": "ChargePoint Highway", "dist": "1.2 mi"},
                {"type": "Hospital", "name": "City MedCare", "dist": "3.5 mi"},
                {"type": "Restaurant", "name": "Green Eats", "dist": "0.8 mi"}
            ],
            "carbonDetails": {
                "ecoScore": 92 if "Electric" in vehicle else 65,
                "greenRecommendation": "Opt for Eco Mode to reduce footprint by 15%."
            }
        }
    })

# Trip History Endpoint
@app.route("/api/history", methods=["GET"])
def get_history():
    return jsonify(trip_history)

# Analytics Summary Endpoint
@app.route("/api/analytics", methods=["GET"])
def get_analytics():
    return jsonify({
        "savings": {
            "fuelSaved": "₹23,613.50",
            "carbonSaved": "184.2 kg",
            "timeSaved": "18.5 hours",
            "moneySaved": "₹34,096.40"
        },
        "weeklyMetrics": [
            {"day": "Mon", "hours": 4.2, "cost": 28, "carbon": 14},
            {"day": "Tue", "hours": 3.8, "cost": 22, "carbon": 11},
            {"day": "Wed", "hours": 5.1, "cost": 34, "carbon": 17},
            {"day": "Thu", "hours": 2.4, "cost": 15, "carbon": 8},
            {"day": "Fri", "hours": 6.0, "cost": 42, "carbon": 21},
            {"day": "Sat", "hours": 1.5, "cost": 8, "carbon": 4},
            {"day": "Sun", "hours": 2.0, "cost": 10, "carbon": 5}
        ],
        "monthlyMetrics": {
            "travelHours": [18, 22, 14, 25],
            "carbonSaved": [38, 45, 29, 52]
        }
    })

# AI Chat Assistant Endpoint
@app.route("/api/assistant", methods=["POST", "OPTIONS"])
def assistant():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"})
        
    data = request.get_json() or {}
    message = data.get("message", "").lower()
    
    responses = [
        "Welcome to THADAM AI Assistant. To get started, try entering a departure route in the Smart Planner.",
        "Eco-mode routing generally decreases carbon emissions by up to 25% by bypassing congested intersections.",
        "Optimal departure for Highway 10 is typically before 7:30 AM or after 7:00 PM to bypass peak heavy traffic.",
        "Hydrogen and Electric vehicles score 95+ on the eco-efficiency travel scale.",
        "By reducing speed by 10 mph on long distances, you can decrease carbon emissions significantly."
    ]
    
    response_text = random.choice(responses)
    
    if "carbon" in message or "eco" in message:
        response_text = "To minimize your carbon footprint, choose 'Eco' preferences. Electric Sedan or Hydrogen SUV options yield 0 tailpipe emissions."
    elif "traffic" in message or "delay" in message:
        response_text = "Traffic indicators are monitored using live AI feeds. Our predictive model adjusts for peak commute periods (8-10 AM, 5-7 PM)."
    elif "cost" in message or "fuel" in message:
        response_text = "Fuel cost is computed dynamically using average state fuel tariffs multiplied by your vehicle class efficiency coefficient."
    elif "hi" in message or "hello" in message:
        response_text = "Hello! I am your THADAM Smart Journey Co-Pilot. Ask me about travel scores, optimal times, or carbon metrics!"

    return jsonify({
        "reply": response_text
    })

# Serving compiled Vite files
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
