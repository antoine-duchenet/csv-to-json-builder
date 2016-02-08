/* global sails */

'use strict';

const fs = require('fs');

const FormatterSet = require('./formatter-set');

const JSONConverter = require('csvtojson').Converter;
const converter = new JSONConverter({});


class Builder {
    constructor(settings) {
        this.settings = settings;
        this.mapping = this.settings.mapping;
        this.formatters = new FormatterSet();
    }

    build(next) {
        converter.on('end_parsed', (parsed) => {
            this.buildFromJSON(parsed, next);
        });
        fs.createReadStream(`${sails.config.appPath}${this.settings.source}`).pipe(converter);
    }

    buildFromJSON(input, next) {
        const output = [];

        input.map((i) => {
            const data = this.buildFromJSONRow(i);
            output.push(data);
        });
        return next ? next(output) : output;
    }

    buildFromJSONRow(data, next) {
        const result = {};
        let m;
        let submapping;
        for (m = 0; m < this.mapping.length; m++) {
            submapping = this.mapping[m];
            result[submapping.destination] = this.formatters.format(submapping.format, data, submapping);
        }
        return next ? next(result) : result;
    }
}

module.exports = Builder;
