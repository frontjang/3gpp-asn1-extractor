"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
var WordExtractor = require("word-extractor");
var extractor = new WordExtractor();

module.exports = exports = extract;
var token = {
    ran2: {
        start: {
            string: '-- ASN1START',
            re: /^-- ASN1START/gm,
        },
        stop: {
            string: '-- ASN1STOP',
            re: /^-- ASN1STOP/gm,
        },
    },
    ran3: {
        start: {
            string: '-- ***',
            re: /^-- \*\*\*/gm,
        },
        stop: {
            string: 'END',
            re: /^END$/gm,
        },
    },
};
function extract(input) {
    if (input.indexOf(token.ran2.start.string) != -1) {
        var tk = token.ran2;
    }
    else if (input.indexOf(token.ran3.start.string) != -1) {
        var tk = token.ran3;
    }
    else {
        throw 'Couldn\'t find known tokens';
    }
    var text = '';
    while (true) {
        let indexStart = input.search(tk.start.re);
        if (indexStart == -1) {
            break;
        }
        let indexStop = input.substring(indexStart).search(tk.stop.re);
        text += `${input.substring(indexStart, indexStart + indexStop + tk.stop.string.length)
            .replace(/\uFFFD/g, '')}\n`;
        input = input.substring(indexStart + indexStop + tk.stop.string.length);
    }
    return text;
}
if (require.main == module) {
    if (process.argv.length >= 3) {
        var extracted = extractor.extract(process.argv[2]);
		extracted.then(function(doc) {
			console.log(extract(doc.getBody()));
		});
    }
    else {
        console.log('Usage: node extractor <file_name>');
        console.log('  ex : node extractor 36331-f10.doc');
    }
}
