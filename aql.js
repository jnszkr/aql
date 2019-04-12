"use strict";

let rp = require("request-promise");

/**
 * Artifactory Query Language domain query.
 */
class DomainQuery {
  constructor(domain) {
    this.domain = domain;
    this.config = {
      fields: []
    };
  }

  /**
   * AQL query string.
   *
   * @returns {String}
   */
  get query() {
    const { fields, criteria, sort, limit, offset } = this.config;
    const _fields =
      fields.length > 0
        ? `.include(${fields.map(JSON.stringify).join(", ")})`
        : "";
    const _criteria = criteria ? JSON.stringify(criteria) : "";
    const _sort = sort ? `.sort(${JSON.stringify(sort)})` : "";
    const _limit = limit ? `.limit(${JSON.stringify(limit)})` : "";
    const _offset = offset > 0 ? `.offset(${JSON.stringify(offset)})` : "";

    return `${
      this.domain
    }.find(${_criteria})${_fields}${_sort}${_offset}${_limit}`;
  }

  /**
   * Find domain query with criteria.
   *
   * @param criteria
   * @returns {DomainQuery}
   */
  find(criteria) {
    criteria && (this.config.criteria = Object.assign({}, criteria));
    return this;
  }

  /**
   * Include fields.
   *
   *      domain.include("name", "repo")
   *
   * @returns {DomainQuery}
   */
  include() {
    const args =
      arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
    const schema = ["string"];

    if (!this._isValid(args, schema)) {
      this._warn("Field configuration is not valid", args, schema);
    }

    for (let i = 0; i < args.length; i++) {
      if (this.config.fields.indexOf(args[i]) === -1)
        this.config.fields.push(
          typeof args[i] !== "string" ? JSON.stringify(args[i]) : args[i]
        );
    }

    return this;
  }

  /**
   * Sort object
   * @param sort
   * @returns {DomainQuery}
   */
  sort(sort) {
    let schema = {
      $asc: ["string"],
      $desc: ["string"]
    };

    if (this._isValid(sort, schema)) {
      this.config.sort = sort;
    } else {
      this._warn("Sort configuration is not valid", sort, schema);
    }

    return this;
  }

  /**
   * Limit
   * @param num
   * @returns {DomainQuery}
   */
  limit(num) {
    const schema = 0;

    if (this._isValid(num, schema)) {
      this.config.limit = num;
    } else {
      this._warn("Limit configuration is not valid", num, schema);
    }

    return this;
  }

  /**
   * Offset
   * @param num
   * @returns {DomainQuery}
   */
  offset(num) {
    const schema = 0;

    if (this._isValid(num, schema)) {
      this.config.offset = num;
    } else {
      this._warn("Offset configuration is not valid", num, schema);
    }

    return this;
  }

  /**
   * Validate input objects with a schema.
   *
   * @param obj
   * @param schema
   * @returns {boolean}
   * @private
   */
  _isValid(obj, schema) {
    const typeofObj = Array.isArray(obj) ? "array" : typeof obj;
    const typeofSchema = Array.isArray(schema) ? "array" : typeof schema;

    if (typeofObj === typeofSchema) {
      if (["string", "boolean", "number"].indexOf(typeofObj) > -1) {
        return true;
      } else if (typeofObj === "array" && schema.length > 0 && obj.length > 0) {
        return obj.every(elem => this._isValid(elem, schema[0]));
      } else if (typeofObj === "object") {
        return Object.keys(obj).every(key => {
          const isInSchema = Object.keys(schema).indexOf(key) > -1;
          const isValid = this._isValid(obj[key], schema[key]);
          return isInSchema && isValid;
        });
      }
    }

    return false;
  }

  /**
   * Console output.
   *
   * @param message
   * @param obj
   * @param schema
   * @private
   */
  _warn(message, obj, schema) {
    console.warn(`AQL: ${message}: ${JSON.stringify(obj)}`);
    console.warn(`     Provided object : ${JSON.stringify(obj)}`);
    console.warn(`     Schema object   : ${JSON.stringify(schema)}`);
  }
}

module.exports = {
  get items() {
    return new DomainQuery("items");
  },
  get builds() {
    return new DomainQuery("builds");
  },
  get archives() {
    return new DomainQuery("archive.entries");
  },
  config: conf => {
    let def = Object.assign(
      {
        method: "POST",
        transform: JSON.parse
      },
      conf
    );
    this._request = rp.defaults(def);
  },
  /**
   * Run query on your artifactory.
   *
   * ```javascript
   *    aql.query(aql.items.find({}))
   * ```
   *
   * @param {DomainQuery} query
   * @returns {Promise}
   */
  query: query => {
    if (query instanceof DomainQuery) {
      query = query.query;
    } else {
      return Promise.reject("Invalid query parameter!");
    }
    return this._request({ body: query }).promise();
  },
  /**
   * Domain query builder.
   */
  DomainQuery
};
