'use strict';

var util = require('util');
var HttpResult = require('../session/http_result');
var EventEmitter = require('events').EventEmitter;

util.inherits(Cursor, EventEmitter);

var _handleError = function(err, obj) {
  if (err) throw err;
}

function Cursor(obj, session, route, query, segmentKey) {
  this._obj = obj;
  this._session = session;
  this._route = route;
  this._query = query;
  this._segmentKey = segmentKey || "data";
}

Cursor.prototype.run = function() {
  var base = this;
  try {
    this._session.get(this._route, JSON.stringify(this._query), _handleError, function(result) {
      if (result.code == HttpResult.OK) {
	var json = JSON.parse(result.body);
	var payload = json[base._segmentKey];

	payload.forEach(function(item) {
	  base.emit('data', base._obj.fromJSON(item));
	});

	base.emit('end');
	return {};
      }
    });
  } catch (e) {
    base.emit('error', e);
  }
}

Cursor.prototype.toArray = function(callback) {
  var buf = [];
  this.on('data', function(item) {
    buf.push(item);
  }).on('end', function() {
    callback(null, buf);
  }).on('error', function(e) {
    callback(e, null);
  });
}

module.exports = Cursor;
