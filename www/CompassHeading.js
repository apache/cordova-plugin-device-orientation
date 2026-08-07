/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

var CompassHeading = function (obj) {
    if (obj.sinHeading != undefined) this.sinHeading = obj.sinHeading;
    if (obj.cosHeading != undefined) this.cosHeading = obj.cosHeading;
    this.headingAccuracy = obj.headingAccuracy;
    if (obj.magneticHeading != undefined) this.magneticHeading = obj.magneticHeading;
    if (obj.trueHeading != undefined) this.trueHeading = obj.trueHeading;
    if (obj.timeStamp != undefined) this.timeStamp = obj.timeStamp;
    else this.timeStamp = Date.now();
};

module.exports = CompassHeading;
