var assert = require('assert'),
    aql = require('../aql');

describe('items', function() {
  describe('#find()', function () {

    it('should return "items.find().limit(100)" when criteria is not present', function () {
      assert.equal(aql.items.find().query, 'items.find().limit(100)');
    });

    it('should present criterias when it is set in parameter', function () {
      assert.equal(aql.items.find({repo: "abc"}).query, 'items.find({"repo":"abc"}).limit(100)');
    });

  });
});