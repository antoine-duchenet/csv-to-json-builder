'use strict';

const fs = require('fs');

const FormatterSet = require('./formatter-set');

const JSONConverter = require('csvtojson').Converter;
const converter = new JSONConverter({});

/**
  @typedef Options
  @type {object}
  @property {string} source - The CSV source file path.
  @property {boolean} json - The Builder#build method output format, JSON if true, Javacript object otherwise.
  @property {object} mapping - The structure declaration of the Builder#build output.
 */

/**
 * Class representing a JSON Builder object.
 */
class Builder {
    /**
     * Create a JSON Builder
     * @constructor
     * @param {Options} options - The optional persistent builder options.
     */
    constructor(options) {
        if (options) {
            this.options = options;
        }

        this.formatters = new FormatterSet();
    }

    /**
     * Build JSON data (or a Javascript object) from a CSV file using the provided (or persistent) options.
     * @param {Options} options - Optional non-persistent builder options.
     */
    build(next, options) {
        const _options = options || this.options;

        converter.on('end_parsed', (input) => {
            const output = input.map((data) => {
                const result = {};
                _options.mapping.forEach((submapping) => result[submapping.destination] = this.formatters.format(submapping.format, data, submapping));
                return result;
            });
            next(_options.json ? JSON.stringify(output) : output);
        });

        fs.createReadStream(`${_options.source}`).pipe(converter);
    }
}

module.exports = Builder;