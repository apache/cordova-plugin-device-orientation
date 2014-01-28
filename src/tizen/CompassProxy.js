var cordova = require('cordova'),
    CompassHeading = require('org.apache.cordova.device-orientation.CompassHeading'),
    CompassError = require('org.apache.cordova.device-orientation.CompassError');

var compassCallback = null,
    compassReady = false;


module.exports = {
    getHeading: function (successCallback, errorCallback) {
        if (window.DeviceOrientationEvent !== undefined) {
            compassCallback = function (orientation) {
                var heading = 360 - orientation.alpha;

                if (compassReady) {
                    if (successCallback)
                        successCallback( new CompassHeading (heading, heading, 0, 0));
                    window.removeEventListener("deviceorientation", compassCallback, true);
                }
                compassReady = true;
            };
            compassReady = false; // workaround invalid first event value returned by WRT
            window.addEventListener("deviceorientation", compassCallback, true);
        }
        else {
            if (errorCallback)
                errorCallback(CompassError.COMPASS_NOT_SUPPORTED);
        }
    },

    stopHeading: function (successCallback, errorCallback) {
        console.log("Compass stopHeading: not implemented yet.");
    }
};

require("cordova/tizen/commandProxy").add("Compass", module.exports);
