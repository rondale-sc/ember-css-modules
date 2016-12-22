'use strict';

var postcss = require('postcss');
var Filter = require('broccoli-persistent-filter');

function PostCSS(inputNode, options) {
  this._options = options || {};

  Filter.call(this, inputNode, {
    annotation: this._options.annotation
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
