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

var config = require('../../src/config/config');
var entityFactory = require('../../src/entities/entityFactory');
var RatingScaleQuestion = require('../../src/entities/question/RatingScaleQuestion');
var LikertScale = require('../../src/entities/scale/likertScale')

var clientUtils = require('../../src/clients/clientUtils');
var testUtils = require('../testUtils');

var path = config.testFixturesBaseDir.v1p1 + 'caliperEntityRatingScaleQuestion.json';

testUtils.readFile(path, function(err, fixture) {
  if (err) throw err;

  test('ratingScaleQuestionTest', function (t) {

    // Plan for N assertions
    t.plan(1);

    var BASE_EDU_IRI = 'https://example.edu';

    var sampleLikertScale = entityFactory().create(LikertScale, {
        id: BASE_EDU_IRI.concat('/scale/2'),
        scalePoints: 4,
        itemLabels: ['Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree'],
        itemValues: ['-2', '-1', '1', '2'],
        dateCreated: '2018-08-01T06:00:00.000Z'
    });

    var entity = entityFactory().create(RatingScaleQuestion, {
        id: BASE_EDU_IRI.concat('/question/2'),
        questionPosed: 'Do you agree with the opinion presented?',
        scale: sampleLikertScale
    });

    // Compare
    var diff = testUtils.compare(fixture, clientUtils.parse(entity));
    var diffMsg = 'Validate JSON' + (!_.isUndefined(diff) ? ' diff = ' + clientUtils.stringify(diff) : '');

    t.equal(true, _.isUndefined(diff), diffMsg);
    //t.end();
  });
});