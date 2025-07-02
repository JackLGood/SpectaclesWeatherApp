// AccuWeatherCurrentSimple.js
// ---------------------------
// Attach this script to your WeatherManager to fetch and display
// the current temperature (°F) and neighborhood via Snap’s AccuWeather API.

// @input Asset.RemoteServiceModule remoteServiceModule   // Remote Service Module asset
// @input Component.Text         temperatureText          // Text to display current temperature
// @input Component.Text         neighborhoodText         // Text to display neighborhood
// @output string                weatherResponse          // Outputs the raw weather JSON

print("⏱ Sending coords:" + script.latitude + script.longitude);
//––– SAFETY CHECK –––
var rsm = script.remoteServiceModule;
if (!rsm) {
    print("❌ Error: assign a Remote Service Module asset to 'remoteServiceModule'.");
    return;
}

// On start, request current condition
script.createEvent("OnStartEvent").bind(function() {
    var req = RemoteApiRequest.create();
    req.endpoint = "current_condition";
    // HTTP method is configured on the Remote Service Module endpoint (ensure it's set to POST)
    req.body     = JSON.stringify({ lat: script.latitude, lng: script.longitude });
    rsm.performApiRequest(req, onResponse);
});

function onResponse(response) {
    if (response.statusCode === 1) {
        // Parse result
        var data = response.json !== undefined
                 ? response.json
                 : JSON.parse(response.body || "{}");
        // Store raw JSON
        script.weatherResponse = JSON.stringify(data);
        // Log full weather response
        print("📥 Weather response: " + JSON.stringify(data));
        global.weatherResponse = script.weatherResponse;
        // Current temp
        var weather = data.currentCondition;
        var tempF = weather && weather.temperatureF;
        script.temperatureText.text = tempF !== undefined ? Math.round(tempF) + "°F" : "N/A";
        
        // Neighborhood
        var addr = data.address || {};
        script.neighborhoodText.text = addr.neighborhood || "";
    } else {
        print("⚠️ AccuWeather API error: statusCode=" + response.statusCode);
        script.temperatureText.text  = "Unavailable";
        script.neighborhoodText.text = "";
    }
}