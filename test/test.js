"use strict";

var assert = require('assert'),
    aql = require('../aql');

describe('items', function () {
    describe('#find()', function () {

        it('should return empty find when criteria is not present', function () {
            assert.equal(aql.items    .find().query, 'items.find()');
            assert.equal(aql.builds   .find().query, 'builds.find()');
            assert.equal(aql.archives .find().query, 'archive.entries.find()');
        });

        it('should present criterias when it is set in parameter', function () {
            const criteria = { repo: "abc" }
            assert.equal(aql.items    .find(criteria).query, 'items.find({"repo":"abc"})');
            assert.equal(aql.builds   .find(criteria).query, 'builds.find({"repo":"abc"})');
            assert.equal(aql.archives .find(criteria).query, 'archive.entries.find({"repo":"abc"})');
        });

    });

    describe('#query()', () => {

        it('should throw an error when input parameter is not DomainQuery object', () => {
            let err = new Error("AQL: query parameter is invalid!");

            // assert.deepEqual(aql.query(), err);
            // assert.deepEqual(aql.query({}), err);
            // assert.deepEqual(aql.query(true), err);
            // assert.deepEqual(aql.query([]), err);
            // assert.deepEqual(aql.query("dafs"), err);
        });

    });
});
