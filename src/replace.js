'use strict';

module.exports = function(/*md*/)
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
}
