# map_intent.py

def is_map_question(query: str) -> bool:
    query = query.lower()

    keywords = [
        # Proximity / Nearby
        "near", "nearest", "nearby", "close to", "around here", "in the vicinity", "walking distance",
        "within x miles", "within x minutes", "surrounding area", "next to", "adjacent to",

        # Places of interest
        "subway", "subway station", "metro", "train station", "bus stop", "public transport", "transit",
        "grocery", "grocery store", "supermarket", "shopping center", "retail", "market", "store",
        "gym", "fitness center", "yoga", "park", "school", "university", "college",
        "hospital", "clinic", "pharmacy", "atm", "bank", "coffee shop", "cafe", "restaurant", "bar",

        # Distance, route, and travel
        "how far", "how long", "how do I get to", "distance to", "travel time", "commute", "travel",
        "reach", "get to", "time to", "route", "map", "directions", "drive to", "walk to",
        "bike to", "transit to", "uber", "lyft", "cab", "trip", "duration",

        # Location safety or quality
        "safe area", "safe neighborhood", "crime", "quiet area", "busy area", "traffic", "congested",
        "good neighborhood", "bad neighborhood", "good location", "bad location", "is it safe", "walkability",

        # Location comparison
        "closer to", "easier to get to", "better location", "more central", "centrally located",
        "good for commute", "best area to live", "accessible", "connectivity",

        # Real estate-centric phrasing
        "convenient location", "location good", "location like", "walk score", "transit score", "proximity",
        "near major roads", "close to subway", "near transit hub"
    ]

    return any(kw in query for kw in keywords)
