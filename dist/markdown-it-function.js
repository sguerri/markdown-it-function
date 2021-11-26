
/*! markdown-it-function 0.1.8 https://github.com/sguerri/markdown-it-function @license MIT */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.markdownitFunction = factory());
})(this, (function () { 'use strict';

    var render = function(data) 
    {
        return function(tokens, index)
        {
            let token = tokens[index];
            if (token.markup === '') return '';

            let items = /^([\w\d_-]+) *(\((.+)\))?/.exec(token.markup);
            let name = items[1];
            let params = items[3];
            if (params) params = params.trim();

            if (Object.keys(data).includes(name)) {
                if (!params) {
                    let result = data[name].trim();
                    return result + '\n';

                } else if (params[0] === '{') {
                    try {
                        params = JSON.parse(params);
                    } catch (e) {
                        return '';
                    }
                    let result = data[name];
                    Object.keys(params).forEach(key => {
                        result = result.replace(`$${key}`, params[key]);
                    });
                    return result + '\n';

                } else {
                    let items = params.split(',').map(item => item.trim());
                    let result = data[name];
                    for (let i = 1; i <= items.length; i++) {
                        result = result.replace(`$${i}`, items[i - 1]);
                    }
                    return result + '\n';
                }
            }

            return `<p>@@${token.markup}</p>\n`;
        }
    };

    var replace = function(/*md*/)
    {
        return function(state, startLine/*, endLine, silent*/)
        {
            let start = state.bMarks[startLine] + state.tShift[startLine];
            let startItem = state.src.substr(start, 3);
            
            if (startItem.length !== 3) return false;
            
            if (startItem[0] !== '@' || startItem[1] !== '@' || startItem[2] === ' ') return false;
            
            let max    = state.src.indexOf("\n", start + 1);
            let markup = state.src.substr(start + 2, max - start - 2);

            let old_parent   = state.parentType;
            let old_line_max = state.lineMax;
            state.parentType = 'pmo';

            let nextLine  = startLine;
            state.lineMax = nextLine;

            let token    = state.push('function', 'div', 0);
            token.markup = markup;
            token.block  = true;
            token.map    = [ startLine, nextLine ];

            state.md.block.tokenize(state, startLine + 1, nextLine);

            state.parentType = old_parent;
            state.lineMax = old_line_max;
            state.line = nextLine + 1;

            return true;
        }
    };

    var src = function(md, options)
    {
        options = options || {};
        md.block.ruler.before('fence', 'function', replace(), {
            alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
        });
        md.renderer.rules['function'] = render(options);
    };

    var markdownItFunction = src;

    return markdownItFunction;

}));
