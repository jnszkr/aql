"use strict";

let rp = require('request-promise');

/**
 * Artifactory Query Language domain query.
 */
class DomainQuery {

   constructor(domain) {
      this.domain = domain;
      this.criteria = undefined;
      this.fields = [];
      this.limitConfig = 100;
      this.sortConfig = undefined;
   }

   get query() {
      let _fields = this.fields.length > 0 ? `.include(${this.fields.map(JSON.stringify).join(', ')})` : '',
         _criterias = this.criteria ? JSON.stringify(this.criteria) : '',
         _sort = this.sortConfig ? `.sort(${JSON.stringify(this.sortConfig)})` : '',
         _limit = `.limit(${JSON.stringify(this.limitConfig)})`,
         _offset = this.offsetConfig > 0 ? `.offset(${JSON.stringify(this.offsetConfig)})` : '';


      return `${this.domain}.find(${_criterias})${_fields}${_sort}${_offset}${_limit}`;
   }

   /**
    * Find domain query with criteria.
    *
    * @param criteria
    * @returns {DomainQuery}
    */
   find(criteria) {
      criteria && (this.criteria = Object.assign({}, criteria));
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
      var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)),
         schema = ['string'];

      if (this._isValid(args, schema)) {
         this.fields = this.fields.concat(args);
      } else {
         this._warn('Field configuration is not valid', args, schema);
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
         $asc: ['string'],
         $dsc: ['string']
      };

      if (this._isValid(sort, schema)) {
         this.sortConfig = sort;
      } else {
         this._warn('Sort configuration is not valid', sort, schema);
      }

      return this;
   }

   /**
    * Limit
    * @param num
    * @returns {DomainQuery}
    */
   limit(num) {
      let schema = 0;

      if (this._isValid(num, schema)) {
         this.limitConfig = num;
      } else {
         this._warn('Limit configuration is not valid', num, schema);
      }

      return this;
   }

   /**
    * Offset
    * @param num
    * @returns {DomainQuery}
    */
   offset(num) {
      let schema = 0;

      if (this._isValid(num, schema)) {
         this.offsetConfig = num;
      } else {
         this._warn('Offset configuration is not valid', num, schema);
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
      let typeofObj = Array.isArray(obj) ? 'array' : typeof obj,
         typeofSchema = Array.isArray(schema) ? 'array' : typeof schema;

      if (typeofObj === typeofSchema) {

         if (['string', 'boolean', 'number'].indexOf(typeofObj) > -1) {
            return true;
         } else if (typeofObj === 'array' && schema.length > 0 && obj.length > 0) {
            return obj.every(elem => this._isValid(elem, schema[0]));
         } else if (typeofObj === 'object') {
            return Object.keys(obj).every(key => {
               let isInSchema = Object.keys(schema).indexOf(key) > -1,
                  isValid = this._isValid(obj[key], schema[key]);
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
   items: new DomainQuery('items'),
   build: new DomainQuery('builds'),
   archive: new DomainQuery('archive.entries'),
   config: conf => {
      let def = Object.assign({
         method: 'POST',
         transform: JSON.parse
      }, conf);
      this._request = rp.defaults(def);
   },
   query: query => {
      if (query instanceof DomainQuery) {
         query = query.query;
      } else if (typeof query !== 'string') {
         return new Error("AQL: query parameter is invalid!");
      }
      return this._request(query);
   }
}
