'use strict';

 /**
  @typedef BuilderOptions
  @type {object}
  @property {string} source - The CSV source file path.
  @property {boolean} [json] - Tells the Builder#build method if it should output JSON instead of Javascript object, default false.
  @property {integer} [workers] - Defines the number of processes used by the Builder CSV Parser, default 1.
  @property {string} [delimiter] - Defines the CSV column delimiter character used by the Builder CSV Parser, default ','.
  @property {string} [escape] - Defines the CSV escape character used by the Builder CSV Parser, default '"'.
  @property {boolean} [trim] - Tells the Builder CSV Parser if it should trim the CSV data (headers and content), default true.
  @property {boolean} [header] - Tells the Builder CSV Parser if the CSV data contains a header row (as first row), default true.
  @property {array} [headers] - Defines or overrides the CSV headers used by the Builder CSV Parser, default null.
  @property {string} [eol] - Defines the CSV End Of Line character used by the Builder CSV Parser, default null (auto-detect or default system EOL character).
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

        const workers = _options.workers || 1;
        const delimiter = _options.delimiter || ',';
        const escape = _options.escape || '"';
        const trim = !(_options.trim == false); // eslint-disable-line eqeqeq
        const header = !(_options.header == false); // eslint-disable-line eqeqeq
        const headers = _options.headers || null;
        const eol = _options.eol || null;

        // TODO Doc

        const converter = new JSONConverter({
            constructResult: true,
            checkType: false,
            toArrayString: false,
            ignoreEmpty: false,
            fork: false,
            flatKeys: true,
            maxRowLength: 0,
            checkColumn: false,
            quote: escape,
            workerNum: workers,
            noheader: !header,
            delimiter,
            trim,
            headers,
            eol,
        });

        converter.fromFile(`${_options.source}`, (err, input) => {
            if (err) {
                return next(err, null);
            }
            const output = input.map((data) => this.formatters.root(data, _options.mapping));
            next(null, _options.json == true ? JSON.stringify(output) : output); // eslint-disable-line eqeqeq
        });
    }
}

module.exports = Builder;
