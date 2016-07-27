/*
 * This file is part of IMS Caliper Analytics™ and is licensed to
 * IMS Global Learning Consortium, Inc. (http://www.imsglobal.org)
 * under one or more contributor license agreements.  See the NOTICE
 * file distributed with this work for additional information.
 *
 * IMS Caliper is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * IMS Caliper is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License along
 * with this program. If not, see http://www.gnu.org/licenses/.
 */

var moment = require('moment');
var test = require('tape');

var entityFactory = require('../../src/entities/entityFactory');
var EpubVolume = require('../../src/entities/resource/ePubVolume');
var Frame = require('../../src/entities/resource/frame');
var Person = require('../../src/entities/agent/person');

var jsonCompare = require('../testUtils');
var requestor = require('../../src/request/httpRequestor');

test('Create an Envelope containing batched entities and validate properties', function (t) {

  // Plan for N assertions
  t.plan(1);
  
  const BASE_EPUB_IRI = "https://example.com/viewer/book/34843";

  var personId = "https://example.edu/user/554433";
  var person = entityFactory().create(Person, personId, {
    dateCreated: moment.utc("2015-08-01T06:00:00.000Z"),
    dateModified: moment.utc("2015-09-02T11:30:00.000Z")
  });

  var epubVolume = entityFactory().create(EpubVolume, BASE_EPUB_IRI.concat("#epubcfi(/4/3)"), {
    name: "The Glorious Cause: The American Revolution, 1763-1789 (Oxford History of the United States)",
    dateCreated: moment.utc("2015-08-01T06:00:00.000Z"),
    dateModified: moment.utc("2015-09-02T11:30:00.000Z"),
    version: "2nd ed."
  });

  var frame = entityFactory().create(Frame, BASE_EPUB_IRI.concat("#epubcfi(/4/3/1)"), {
    name: "Key Figures: George Washington",
    isPartOf: epubVolume,
    dateCreated: moment.utc("2015-08-01T06:00:00.000Z"),
    dateModified: moment.utc("2015-09-02T11:30:00.000Z"),
    version: "2nd ed.",
    index: 1
  });

  // Initialize faux sensor and default options
  var sensor = createFauxSensor("https://example.edu/sensor/001");
  var options = {};

  // Initialize requestor, create envelope and reset sendTime with fixture value (or test will fail).
  requestor.initialize(options);

  var sendTime = moment.utc("2015-09-15T11:05:01.000Z");
  var data = [ person, epubVolume, frame ];
  var envelope = requestor.createEnvelope(sensor, sendTime, data);

  // Assert that JSON produced is the same
  jsonCompare('caliperEnvelopeEntityBatch', envelope, t);
});

/**
 * Create a fake sensor object in order to avoid generating a "window is not defined"
 * reference error since we are not running tests in the browser but on the server.
 * @param id
 * @returns {{id: *}}
 */
function createFauxSensor(id) {
  return {id: id};
}