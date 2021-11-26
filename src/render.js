'use strict';

module.exports = function(data) 
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

