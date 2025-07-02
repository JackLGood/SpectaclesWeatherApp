// SnapchatPlacesLocation.js
// -------------------------
// Attach to a scene object to fetch the user's latitude/longitude via
// Snapchat Places API endpoints using a Remote Service Module.

// @input Asset.RemoteServiceModule remoteServiceModule   // Asset configured with get_nearby_places & get_place
// @input int                  placesLimit = 1          // Max number of nearby places to query
// @input float                gpsAccuracyM = 65        // GPS accuracy in meters (default 65)
// @input Component.Text       latitudeText             // Text component to display latitude
// @input Component.Text       longitudeText            // Text component to display longitude

//––– SAFETY CHECK –––
var rsm = script.remoteServiceModule;
if (!rsm) {
    print("❌ Error: assign Remote Service Module to 'remoteServiceModule'.");
    return;
}

// On lens start, fetch nearby places
script.createEvent("OnStartEvent").bind(function() {
    var req = RemoteApiRequest.create();
    req.endpoint = "get_nearby_places";
    // Only include gpsAccuracyM and placesLimit; lat/lng auto-filled by the Lens
    req.body     = JSON.stringify({
        gps_accuracy_m: script.gpsAccuracyM,
        places_limit:   script.placesLimit
    });
    rsm.performApiRequest(req, onNearbyResponse);
});

function onNearbyResponse(response) {
    if (response.statusCode === 1) {
        var res = response.json !== undefined
                ? response.json
                : JSON.parse(response.body || "{}");
        print("📥 get_nearby_places response: " + JSON.stringify(res));

        var places = res.nearby_places || res.nearbyPlaces;
        if (places && places.length > 0) {
            var pid = places[0].place_id || places[0].placeId;
            fetchPlaceDetails(pid);
        } else {
            print("⚠️ No nearby places found");
        }
    } else {
        print("⚠️ get_nearby_places error: statusCode=" + response.statusCode);
    }
}

function fetchPlaceDetails(placeId) {
    var req = RemoteApiRequest.create();
    req.endpoint = "get_place";
    req.body     = JSON.stringify({ place_id: placeId });
    rsm.performApiRequest(req, onPlaceResponse);
}

function onPlaceResponse(response) {
    if (response.statusCode === 1) {
        var res = response.json !== undefined
                ? response.json
                : JSON.parse(response.body || "{}");
        print("📥 get_place response: " + JSON.stringify(res));

        var place = res.place;
        if (place && place.geometry && place.geometry.centroid) {
            var lat = place.geometry.centroid.lat;
            var lng = place.geometry.centroid.lng;
            script.latitudeText.text  = lat.toFixed(6);
            script.longitudeText.text = lng.toFixed(6);
        } else {
            print("⚠️ place.geometry.centroid missing");
        }
    } else {
        print("⚠️ get_place error: statusCode=" + response.statusCode);
    }
}