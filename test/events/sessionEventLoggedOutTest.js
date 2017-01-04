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

var _ = require('lodash');
var moment = require('moment');
var test = require('tape');

var config = require('../../src/config');
var eventFactory = require('../../src/events/eventFactory');
var eventValidator = require('../../src/events/eventValidator');
var eventUtils = require('../../src/events/eventUtils');
var SessionEvent = require('../../src/events/sessionEvent');
var actions = require('../../src/actions/actions');

var entityFactory = require('../../src/entities/entityFactory');
var Person = require('../../src/entities/agent/person');
var Session = require('../../src/entities/session/session');
var SoftwareApplication = require('../../src/entities/agent/softwareApplication');

var testUtils = require('../testUtils');

test('Create a SessionEvent (loggedOut) and validate properties', function(t) {

  // Plan for N assertions
  t.plan(2);

  const BASE_IRI = "https://example.edu";

  // Id
  var uuid = eventUtils.generateUUID(config.version);

  // Check Id
  t.equal(true, eventValidator.isUUID(uuid), "Validate generated UUID.");

  // Override ID with canned value
  uuid = "a438f8ac-1da3-4d48-8c86-94a1b387e0f6";

  // The Actor
  var actor = entityFactory().create(Person, BASE_IRI.concat("/users/554433"));

  // The Action
  var action = actions.loggedOut.term;

  // The Object of the interaction
  var obj = entityFactory().create(SoftwareApplication, BASE_IRI, { version: "v2" });

  // Event time
  var eventTime = moment.utc("2016-11-15T11:05:00.000Z");

  // Session
  var sessionId = BASE_IRI.concat("/sessions/1f6442a482de72ea6ad134943812bff564a76259");
  var session = entityFactory().create(Session, sessionId, {
    actor: actor,
    dateCreated: moment.utc("2016-11-15T10:00:00.000Z"),
    startedAtTime: moment.utc("2016-11-15T10:00:00.000Z"),
    endedAtTime: moment.utc("2016-11-15T11:05:00.000Z"),
    duration: "PT3000S"
  });

  // Assert that key attributes are the same
  var event = eventFactory().create(SessionEvent, {
    uuid: uuid,
    actor: actor,
    action: action,
    object: obj,
    eventTime: eventTime,
    session: session
  });

  // Compare JSON
  var diff = testUtils.jsonCompare('caliperEventSessionLoggedOut', event);
  t.equal(true, _.isUndefined(diff), "Validate JSON");

  t.end();
});