const fs = require('fs');
const mdFunction = require('../index');

let md = require('markdown-it')();

md.use(mdFunction, {
    "container": "<div class='container'>",
    "endContainer": "</div>",
    "column": "<div class='column'>",
    "endColumn": "</div>",
    "class": "<div class='$1'>",
    "endClass": "</div>",
    "author": "<div class='author'>$1</div>",
    "authorName": "<div class='author'>$name</div>"
});

let input = fs.readFileSync('input.md', 'utf-8');
let output = md.render(input);

fs.writeFileSync('output.txt', output);
