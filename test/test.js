"use strict";

var assert = require('assert'),
    aql = require('../aql');

describe('items', function () {
    describe('#find()', function () {

        it('should return "items.find().limit(100)" when criteria is not present', function () {
            assert.equal(aql.items.find().query, 'items.find()');
        });

        it('should present criterias when it is set in parameter', function () {
            assert.equal(aql.items.find({
                repo: "abc"
            }).query, 'items.find({"repo":"abc"})');
        });

    });

    describe('#query()', () => {

        it('should throw an error when input parameter is not DomainQuery object', () => {
            let err = new Error("AQL: query parameter is invalid!");

            assert.deepEqual(aql.query(), err);
            assert.deepEqual(aql.query({}), err);
            assert.deepEqual(aql.query(true), err);
            assert.deepEqual(aql.query([]), err);
            assert.deepEqual(aql.query("dafs"), err);
        });

    });
});
