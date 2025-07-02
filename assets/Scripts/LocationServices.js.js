require('LensStudio:RawLocationModule');

let locationService = null;

const repeatUpdateUserLocation = script.createEvent('DelayedCallbackEvent');
repeatUpdateUserLocation.bind(() => {
  // Get users location.
  locationService.getCurrentPosition(
    function (geoPosition) {
      //Check if location coordinates have been updated based on timestamp
      let geoPositionTimestampMs = geoPosition.timestamp.getTime();
      if (timestampLastLocation != geoPositionTimestampMs) {
        script.latitude = geoPosition.latitude;
        script.longitude = geoPosition.longitude;
        script.horizontalAccuracy = geoPosition.horizontalAccuracy;
        script.verticalAccuracy = geoPosition.vertical;
        print('lat: ' + geoPosition.latitude);
        print('long: ' + geoPosition.longitude);
        if (geoPosition.altitude != 0) {
          script.altitude = geoPosition.altitude;
          print('altitude: ' + geoPosition.altitude);
        }
        print('location source: ' + geoPosition.locationSource);
        timestampLastLocation = geoPositionTimestampMs;
      }
    },
    function (error) {
      print(error);
    }
  );
  // Acquire next location update in 1 second, increase this value if required for AR visualisation purposes such as 0.5 or 0.1 seconds
  repeatUpdateUserLocation.reset(1.0);
});
function createAndLogLocationAndHeading() {
  // Create location handler

  locationService = GeoLocation.createLocationService();

  // Set the accuracy
  locationService.accuracy = GeoLocationAccuracy.Navigation;

  // Acquire heading orientation updates
  var onOrientationUpdate = function (northAlignedOrientation) {
    //Providing 3DoF north aligned rotation in quaternion form
    let heading = GeoLocation.getNorthAlignedHeading(northAlignedOrientation);
    print('Heading orientation: ' + heading.toFixed(3));
    // Convert to a 2DoF rotation for plane rendering purposes
    var rotation = (heading * Math.PI) / 180;
    script.screenTransform.rotation = quat.fromEulerAngles(0, 0, rotation);
  };
  locationService.onNorthAlignedOrientationUpdate.add(onOrientationUpdate);

  // Acquire next location immediately with zero delay
  repeatUpdateUserLocation.reset(0.0);
}

script.createEvent('OnStartEvent').bind(() => {
  createAndLogLocationAndHeading();
});