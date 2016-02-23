'use strict';

/**
    @typedef FormatOptions
    @desc The Format metadata (namespace and identifier used to call the Format from the mapping via the `${namespace}:${identifier}` label).
    @type {object}
    @property {string} [namespace] - The first (optional) part of the label representing the Format, it should be used to add some semantic to the Format identifier.
    @property {string} identifier - The second (required) part of the label representing the Format, it should be used to describe the action of the Format.
 */

/**
    @typedef FormatFunction
    @desc The Format logic (process applied to the provided preprocessed data and mapping when the Format is called).
    @type {function}
    @param {object|primitive} data - The preprocessed data to format.
    @param {object} mapping - The mapping to use.
    @return {object|primitive} Any valid Javacript object or Javascript primitive corresponding to the JSON formatted data.
*/

/**
 * Class representing a FormatEngine entity, responsible of the generic formatting of the preprocessed input into a JSON output.
 */
class FormatEngine {
    /**
     * Create a FormatEngine.
     * @constructor
     */
    constructor() {
        this.formats = {};
    }

    /**
     * Add a format to the FormatEngine.
     * @param {FormatOptions} options - The added Format FormatOptions.
     * @param {FormatFunction} format - The added Format FormatFunction.
     */
    add(options, format) {
        const namespace = options.namespace || '';

        this.formats[namespace] = this.formats[namespace] || {};
        this.formats[namespace][options.identifier] = format;
    }

    /**
     * Call the Format corresponding to the given label on the provided preprocessed data and mapping.
     * @param {string} label - The `${namespace}:${identifier}` label of the Format to call.
     * @param {object} data - The preprocessed data to format.
     * @param {object} mapping - The mapping to use.
     */
    format(label, data, mapping) {
        if (label.includes(':')) {
            const array = label.split(':');

            /*
             * array[0] is the namespace
             * array[1] is the identifier
             */

            return this.formats[array[0]][array[1]](data, mapping, this);
        }
        return this[label](data, mapping);
    }

    /**
     * Call the Root Format on the provided preprocessed data and mapping (generally used to format the mapping root array of objects).
     * @param {object} data - The preprocessed data to format.
     * @param {object} mapping - The mapping to use.
     */
    root(data, mapping) {
        const result = {};
        mapping.forEach((submapping) => result[submapping.destination] = this.format(submapping.format, data, submapping));
        return result;
    }

    /**
     * Call the Object Format on the provided data and mapping (generally used to format preprocessed data into a JSON object).
     * @param {object} data - The preprocessed data to format.
     * @param {object} mapping - The mapping to use.
     */
    object(data, mapping) {
        const result = {};
        mapping.properties.forEach((submapping) => result[submapping.destination] = this.format(submapping.format, data, submapping));
        return result;
    }

    /**
     * Call the Array Format on the provided preprocessed data and mapping (generally used to format preprocessed data into a JSON array).
     * @param {object} data - The preprocessed data to format.
     * @param {object} mapping - The mapping to use.
     */
    array(data, mapping) {
        const result = [];
        mapping.values.forEach((submapping) => result.push(this.format(submapping.format, data, submapping)));
        return result;
    }

    /**
     * Call the Raw Format on the provided preprocessed data and mapping (output a string corresponding to the content of a preprocessed piece of data, empty if this piece is empty).
     * @param {object} data - The preprocessed data to format.
     * @param {object} mapping - The mapping to use.
     */
    raw(data, submapping) {
        const source = submapping.source;
        return source ? data[source] : submapping.value;
    }

    /**
     * Call the String Format on the provided preprocessed data and mapping (output a string corresponding to the content of a preprocessed piece of data, null if this piece is empty).
     * @param {object} data - The preprocessed data to format.
     * @param {object} mapping - The mapping to use.
     */
    string(data, submapping) {
        const raw = this.raw(data, submapping);
        return raw === '' ? null : raw;
    }

    /**
     * Call the Boolean Format on the provided preprocessed data and mapping (output a boolean corresponding to the content of a preprocessed piece of data via a non-strict Javacript equality).
     * @param {object} data - The preprocessed data to format.
     * @param {object} mapping - The mapping to use.
     */
    boolean(data, submapping) {
        const raw = this.raw(data, submapping);
        return raw === '' ? null : raw == true; // eslint-disable-line eqeqeq
    }

    /**
     * Call the Float Format on the provided preprocessed data and mapping (output a float corresponding to the content of a preprocessed piece of data via the native parseFloat(string) function).
     * @param {object} data - The preprocessed data to format.
     * @param {object} mapping - The mapping to use.
     */
    float(data, submapping) {
        const raw = this.raw(data, submapping);
        return raw === '' ? null : parseFloat(raw);
    }

    /**
     * Call the Integer Format on the provided preprocessed data and mapping (output a integer corresponding to the content of a preprocessed piece of data via the native parseInt(string) function).
     * @param {object} data - The preprocessed data to format.
     * @param {object} mapping - The mapping to use.
     */
    integer(data, submapping) {
        const raw = this.raw(data, submapping);
        return raw === '' ? null : parseInt(raw, 10);
    }
}

module.exports = FormatEngine;
