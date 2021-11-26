'use strict';

var function_render   = require('./src/render');
var function_replace  = require('./src/replace');

module.exports = function(md, options)
{
    options = options || {};
    md.block.ruler.before('fence', 'function', function_replace(md), {
        alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
    });
    md.renderer.rules['function'] = function_render(options);
}