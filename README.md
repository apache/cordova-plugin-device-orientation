---
title: Device Orientation
description: Access compass data.
---
<!---
# license: Licensed to the Apache Software Foundation (ASF) under one
#         or more contributor license agreements.  See the NOTICE file
#         distributed with this work for additional information
#         regarding copyright ownership.  The ASF licenses this file
#         to you under the Apache License, Version 2.0 (the
#         "License"); you may not use this file except in compliance
#         with the License.  You may obtain a copy of the License at
#
#           http://www.apache.org/licenses/LICENSE-2.0
#
#         Unless required by applicable law or agreed to in writing,
#         software distributed under the License is distributed on an
#         "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#         KIND, either express or implied.  See the License for the
#         specific language governing permissions and limitations
#         under the License.
-->

# cordova-plugin-device-orientation

[![Android Testsuite](https://github.com/apache/cordova-plugin-device-orientation/actions/workflows/android.yml/badge.svg)](https://github.com/apache/cordova-plugin-device-orientation/actions/workflows/android.yml) [![Chrome Testsuite](https://github.com/apache/cordova-plugin-device-orientation/actions/workflows/chrome.yml/badge.svg)](https://github.com/apache/cordova-plugin-device-orientation/actions/workflows/chrome.yml) [![iOS Testsuite](https://github.com/apache/cordova-plugin-device-orientation/actions/workflows/ios.yml/badge.svg)](https://github.com/apache/cordova-plugin-device-orientation/actions/workflows/ios.yml) [![Lint Test](https://github.com/apache/cordova-plugin-device-orientation/actions/workflows/lint.yml/badge.svg)](https://github.com/apache/cordova-plugin-device-orientation/actions/workflows/lint.yml)

# Usage Notice

With the [W3C Device Orientation API](https://www.w3.org/TR/orientation-event/), Android, iOS, and Windows devices may not need this plugin anymore.

However, on iOS 13+, potential issues with permissions and secure contexts can arise. Therefore it is recommended to use this plugin as it uses a native implementation.

------

## Description

This plugin provides access to the device's compass. The compass is a sensor
that detects the direction or heading that the device is pointed, typically
from the top of the device.  It measures the heading in degrees from 0 to
359.99, where 0 is north.

Access is via a global `navigator.compass` object.

Although the object is attached to the global scoped `navigator`, it is not available until after the `deviceready` event.

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        console.log(navigator.compass);
    }

Report issues on the [Apache Cordova issue tracker](https://issues.apache.org/jira/secure/RapidBoard.jspa?rapidView=190&projectKey=CB)

## Installation

    cordova plugin add cordova-plugin-device-orientation

## Supported Platforms

- Android
- Browser
- iOS
- Windows

## Methods

- navigator.compass.getCurrentHeading
- navigator.compass.watchHeading
- navigator.compass.clearWatch

## navigator.compass.getCurrentHeading

Get the current compass heading. The compass heading is returned via a `CompassHeading`
object using the `compassSuccess` callback function.

    navigator.compass.getCurrentHeading(compassSuccess, compassError);

### Example

    function onSuccess(heading) {
        alert('Heading: ' + heading.magneticHeading);
    };

    function onError(error) {
        alert('CompassError: ' + error.code);
    };

    navigator.compass.getCurrentHeading(onSuccess, onError);

## navigator.compass.watchHeading

Gets the device's current heading at a regular interval. Each time the heading
is retrieved, the `headingSuccess` callback function is executed.

The returned watch ID references the compass watch interval. The watch
ID can be used with `navigator.compass.clearWatch` to stop watching the navigator.compass.

    var watchID = navigator.compass.watchHeading(compassSuccess, compassError, [compassOptions]);

`compassOptions` may contain the following keys:

- __frequency__: How often to retrieve the compass heading in milliseconds. _(Number)_ (Default: 100)
- __filter__: The change in degrees required to initiate a watchHeading success callback. When this value is set, __frequency__ is ignored. _(Number)_

### Example

    function onSuccess(heading) {
        var element = document.getElementById('heading');
        element.innerHTML = 'Heading: ' + heading.magneticHeading;
    };

    function onError(compassError) {
        alert('Compass error: ' + compassError.code);
    };

    var options = {
        frequency: 3000
    }; // Update every 3 seconds

    var watchID = navigator.compass.watchHeading(onSuccess, onError, options);

### Update 29/08/2022

On Android, the plugin used a `Sensor.TYPE_ORIENTATION` which is [deprecated](https://developer.android.com/guide/topics/sensors/sensors_position).
This sensor was more and more [omitted](https://github.com/apache/cordova-plugin-device-orientation/issues/64) in new devices.
So now the plugin uses `Sensor.TYPE_ACCELEROMETER` and `Sensor.TYPE_MAGNETIC_FIELD` which are available everywhere.
They are fused together as instructed [here](https://developer.android.com/guide/topics/sensors/sensors_position#sensors-pos-orient),
except that the `SensorManager.getOrientation()` has a [bug that will not be fixed](https://issuetracker.google.com/issues/37127944).
[Stochastically](https://stackoverflow.com/users/2110762/stochastically) found a [solution](https://stackoverflow.com/questions/15537125/inconsistent-orientation-sensor-values-on-android-for-azimuth-yaw-and-roll/16418016#16418016) that works like a charm and is used here.


### Browser Quirks

Values for current heading are randomly generated in order to simulate the compass.

### iOS Quirks

Only one `watchHeading` can be in effect at one time in iOS.  If a
`watchHeading` uses a filter, calling `getCurrentHeading` or
`watchHeading` uses the existing filter value to specify heading
changes. Watching heading changes with a filter is more efficient than
with time intervals.

### Android Quirks

- No support for `filter`.

## navigator.compass.clearWatch

Stop watching the compass referenced by the watch ID parameter.

    navigator.compass.clearWatch(watchID);

- __watchID__: The ID returned by `navigator.compass.watchHeading`.

### Example

    var watchID = navigator.compass.watchHeading(onSuccess, onError, options);

    // ... later on ...

    navigator.compass.clearWatch(watchID);

## CompassHeading

A `CompassHeading` object is returned to the `compassSuccess` callback function.

### Properties

- __magneticHeading__: The heading in degrees from 0-359.99 at a single moment in time. _(Number)_

- __trueHeading__: The heading relative to the geographic North Pole in degrees 0-359.99 at a single moment in time. A negative value indicates that the true heading can't be determined.  _(Number)_

- __headingAccuracy__: The deviation in degrees between the reported heading and the true heading. _(Number)_

- __timestamp__: The time at which this heading was determined.  _(DOMTimeStamp)_

### Android Quirks

- The `trueHeading` property is not supported, but reports the same value as `magneticHeading`.

- The `headingAccuracy` property is always 0 because there is no difference between the `magneticHeading` and `trueHeading`.

### iOS Quirks

- The `trueHeading` property is only returned for location services enabled via `navigator.geolocation.watchLocation()`.

## CompassError

A `CompassError` object is returned to the `compassError` callback function when an error occurs.

### Properties

- __code__: One of the predefined error codes listed below.

### Constants

- `CompassError.COMPASS_INTERNAL_ERR`
- `CompassError.COMPASS_NOT_SUPPORTED`
