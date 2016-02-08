class FormatterSet {
    constructor() {
        this.formats = {};
    }

    add(options, formatter) {
        const identifier = options.identifier;
        const namespace = options.namespace || '';

        this.formats[namespace] = this.formats[namespace] ? this.formats[namespace] : {};

        this.formats[namespace][identifier] = formatter;
    }

    format(label, data, submapping) {
        if (label.indexOf(':') !== -1) {
            const array = label.split(':');
            const namespace = array[0];
            const identifier = array[1];

            // return this.formats[namespace][identifier].bind(this)(data, submapping);
            return this.formats[namespace][identifier](data, submapping, this);
        }
        return this[label](data, submapping);
    }

    object(data, mapping) {
        const result = {};
        const properties = mapping.properties;
        let p;
        let submapping;
        for (p in properties) {
            if (properties.hasOwnProperty(p)) {
                submapping = properties[p];
                result[submapping.destination] = this.format(submapping.format, data, submapping);
            }
        }
        return result;
    }

    array(data, mapping) {
        const result = [];
        const values = mapping.values;
        let v;
        let submapping;
        for (v = 0; v < values.length; v++) {
            submapping = values[v];
            result.push(this.format(submapping.format, data, submapping));
        }
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
        return raw === '' ? null : raw === '1';
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
