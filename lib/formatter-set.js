'use strict';

class FormatterSet {
    constructor() {
        this.formats = {};
    }

    add(options, formatter) {
        const namespace = options.namespace || '';

        this.formats[namespace] = this.formats[namespace] || {};
        this.formats[namespace][options.identifier] = formatter;
    }

    format(label, data, submapping) {
        if (label.includes(':')) {
            const array = label.split(':');

            /**
             * array[0] is the namespace
             * array[1] is the identifier
             */

            return this.formats[array[0]][array[1]](data, submapping, this);
        }
        return this[label](data, submapping);
    }

    object(data, mapping) {
        const result = {};
        mapping.properties.forEach((submapping) => result[submapping.destination] = this.format(submapping.format, data, submapping));
        return result;
    }

    array(data, mapping) {
        const result = [];
        mapping.values.forEach((submapping) => result.push(this.format(submapping.format, data, submapping)));
        return result;
    }

    raw(data, submapping) {
        const source = submapping.source;
        return source ? data[source] : submapping.value;
    }

    string(data, submapping) {
        const raw = this.raw(data, submapping);
        return raw === '' ? null : raw;
    }

    boolean(data, submapping) {
        const raw = this.raw(data, submapping);
        return raw === '' ? null : raw == true; // eslint-disable-line eqeqeq
    }

    float(data, submapping) {
        const raw = this.raw(data, submapping);
        return raw === '' ? null : parseFloat(raw);
    }

    integer(data, submapping) {
        const raw = this.raw(data, submapping);
        return raw === '' ? null : parseInt(raw, 10);
    }
}

module.exports = FormatterSet;
