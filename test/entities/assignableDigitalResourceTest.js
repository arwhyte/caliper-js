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

var config =  require('../../src/config/config');
var entityFactory = require('../../src/entities/entityFactory');
var AssignableDigitalResource = require('../../src/entities/resource/assignableDigitalResource');
var clientUtils = require('../../src/clients/clientUtils');
var testUtils = require('../testUtils');

const path = config.testFixturesBaseDir + "caliperEntityAssignableDigitalResource.json";

testUtils.readFile(path, function(err, fixture) {
  if (err) throw err;

  test('assignableDigitalResourceTest', function (t) {

    // Plan for N assertions
    t.plan(1);

    const BASE_SECTION_IRI = "https://example.edu/terms/201601/courses/7/sections/1";

    var entity = entityFactory().create(AssignableDigitalResource, {
      id: BASE_SECTION_IRI.concat("/assign/2"),
      name: "Week 9 Reflection",
      description: "3-5 page reflection on this week's assigned readings.",
      dateCreated: moment.utc("2016-11-01T06:00:00.000Z"),
      dateToActivate: moment.utc("2016-11-10T11:59:59.000Z"),
      dateToShow: moment.utc("2016-11-10T11:59:59.000Z"),
      dateToStartOn: moment.utc("2016-11-10T11:59:59.000Z"),
      dateToSubmit: moment.utc("2016-11-14T11:59:59.000Z"),
      maxAttempts: 2,
      maxSubmits: 2,
      maxScore: 50
    });

    // Compare
    var diff = testUtils.compare(fixture, clientUtils.parse(entity));
    var diffMsg = "Validate JSON" + (!_.isUndefined(diff) ? " diff = " + clientUtils.stringify(diff) : "");

    t.equal(true, _.isUndefined(diff), diffMsg);
    //t.end();
  });
});