/* global describe it */

const assert = require('assert');

const options = require('./options');
const JSONBuilder = require('../index');
const builder = new JSONBuilder(options);

describe('Builder', () => {
    it('#build()', () => {
        builder.build((built) => {
            assert(built);
        });
    });
});
