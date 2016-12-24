'use strict';

var path = require('path');
var postcss = require('postcss');
var Filter = require('broccoli-persistent-filter');

function PostCSS(inputNode, options) {
  this._options = options || {};

  Filter.call(this, inputNode, {
    annotation: this._options.annotation,
    persist: this._options.hasOwnProperty('persist') ? this._options.persist : true
  });

  if (!Array.isArray(this._options.plugins)) {
    throw new Error('postcss plugins not properly configured.');
  }

  this._processor = postcss(this._options.plugins);
}

PostCSS.prototype = Object.create(Filter.prototype);
PostCSS.prototype.constructor = PostCSS;
PostCSS.prototype.extensions = ['css']
PostCSS.prototype.targetExtension = 'css'

PostCSS.prototype.cacheKeyProcessString = function cacheKeyProcessString(string, relativePath) {
  /*
   * TODO: you'll want to make sure that changing the options hash (plugins)
   * invalidates the cache.  For example, user adds a new plugin or changes an option of
   * a plugin than cache needs to be invalidated.
   *
   * You also want to invalidate the cache if the dep changes between builds (i.e., version bump of plugin)
   */
  return Filter.prototype.cacheKeyProcessString.apply(this, arguments);
};

PostCSS.prototype.baseDir = function baseDir() {
  return path.join(__dirname, '..');
};

PostCSS.prototype.processString = function processString(content, relativeFile) {
  return this._processor.process(content, {
    from: relativeFile,
    to: relativeFile,
    map: {
      inline: false,
      annotation: false
    }
  }).then(function(response) {
    return response.css;
  });
};

module.exports = PostCSS;
