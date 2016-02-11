'use strict';

 /**
  @typedef BuilderOptions
  @type {object}
  @property {string} source - The CSV source file path.
  @property {boolean} [json] - The Builder#build method output format, JSON if true, Javacript object otherwise.
  @property {object} mapping - The structure declaration of the Builder#build output.
 */

const Formatter = require('./formatter');
const JSONConverter = require('csvtojson').Converter;

/**
 * Class representing a JSON Builder object.
 */
class Builder {
    /**
     * Create a JSON Builder.
     * @constructor
     * @param {BuilderOptions} options - The optional persistent builder options.
     */
    constructor(options) {
        if (options) {
            this.options = options;
        }

        this.formatters = new Formatter();
    }

    /**
     * Build JSON data (or a Javascript object) from a CSV file using the provided (or persistent) options.
     * @param {BuilderOptions} options - Optional non-persistent builder options.
     */
    build(next, options) {
        const _options = options || this.options;

        const converter = new JSONConverter({});
        converter.fromFile(`${_options.source}`, (err, input) => {
            if (err) {
                return next(err, null);
            }
            const output = input.map((data) => {
                this.formatters.root(data, _options.mapping);
            });
            next(null, _options.json ? JSON.stringify(output) : output);
        });
    }
}

module.exports = Builder;
