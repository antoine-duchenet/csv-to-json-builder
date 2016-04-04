# This documentation is not complete at the moment, check the provided JSDoc for a complete overview of the provided features.

# CSV to JSON Builder

Converts flat CSV data into structured Javascript objects (via a declarative mapping).

## NPM Install

### Via HTTPS
```
npm i --save git+https://git@github.com/antoine-duchenet/csv-to-json-builder.git
```

### Via SSL
```
npm i --save git+ssh://git@github.com/antoine-duchenet/csv-to-json-builder.git
```

## Basic Use

### Input

| # | Firstname | Lastname | Age | Phone           | Email                  |  €       |
|---|-----------|----------|-----|-----------------|------------------------|----------|
| 0 | James     | Willis   | 24  | 1-541-754-30100 | james.willis@email.com |  2000    |
| 1 | Mary      | Jane     | 28  | 1-541-754-30102 | mary.jane@email.com    |  3052.15 |


### Code

```js
const JSONBuilder = require('csv-to-json-builder');

const options = {
    source: 'example.csv',
    mapping: [
        { destination: 'user', format: 'object', properties: [
            { source: 'Firstname', destination: 'firstname', format: 'string' },
            { source: 'Lastname', destination: 'lastname', format: 'string' },
            { source: 'Age', destination: 'age', format: 'integer' },
        ] },
    ],
};

const builder = new JSONBuilder(options);

builder.build((built) => {
    console.log(JSON.stringify(built, null, 4));
});

```

### Output

```js
[
    {
        "user": {
            "firstname": "James",
            "lastname": "Willis",
            "age": 24
        }
    },
    {
        "user": {
            "firstname": "Mary",
            "lastname": "Jane",
            "age": 28
        }
    }
]
```

## Structured Javascript object

### Input

| # | Firstname | Lastname | Age | Phone           | Email                  |  €       |
|---|-----------|----------|-----|-----------------|------------------------|----------|
| 0 | James     | Willis   | 24  | 1-541-754-30100 | james.willis@email.com |  2000    |
| 1 | Mary      | Jane     | 28  | 1-541-754-30102 | mary.jane@email.com    |  3052.15 |


### Code

```js
const JSONBuilder = require('csv-to-json-builder');

const options = {
    source: 'example.csv',
    mapping: [
        { destination: 'user', format: 'object', properties: [
            { source: 'Firstname', destination: 'firstname', format: 'string' },
            { source: 'Lastname', destination: 'lastname', format: 'string' },
            { source: 'Age', destination: 'age', format: 'integer' },
            { destination: 'contacts', format: 'object', properties: [
                { source: 'Phone', destination: 'phone', format: 'string' },
                { source: 'Email', destination: 'email', format: 'string' },
            ] },
        ] },
    ],
};

const builder = new JSONBuilder(options);

builder.build((built) => {
    console.log(JSON.stringify(built, null, 4));
});

```

### Output

```js
[

    {
        "user": {
            "firstname": "James",
            "lastname": "Willis",
            "age": 24,
            "contacts": {
                "phone": "1-541-754-30100",
                "email": "james.willis@email.com"
            }
        }
    },
    {
        "user": {
            "firstname": "Mary",
            "lastname": "Jane",
            "age": 28,
            "contacts": {
                "phone": "1-541-754-30102",
                "email": "mary.jane@email.com"
            }
        }
    }
]
```

## Supported formats

Currently supported formats :
- String : `string`
- Integer : `integer`
- Float : `float`
- Boolean : `boolean`
- Array : `array` (with a `values` attribute)
- Object : `object` (with a `properties` attribute)

### Input

| # | Firstname | Lastname | Age | Phone           | Email                  |  €       |
|---|-----------|----------|-----|-----------------|------------------------|----------|
| 0 | James     | Willis   | 24  | 1-541-754-30100 | james.willis@email.com |  2000    |
| 1 | Mary      | Jane     | 28  | 1-541-754-30102 | mary.jane@email.com    |  3052.15 |


### Code

```js
const JSONBuilder = require('csv-to-json-builder');

const options = {
    source: 'example.csv',
    mapping: [
        { destination: 'user', format: 'object', properties: [
            { source: '#', destination: 'id1Boolean?', format: 'boolean' },
            { source: 'Firstname', destination: 'firstnameString', format: 'string' },
            { source: 'Age', destination: 'ageInteger', format: 'integer' },
            { value: '3.14', destination: 'piFloat', format: 'float' },
            { destination: 'contactsObject', format: 'object', properties: [
                { source: 'Phone', destination: 'phone', format: 'string' },
                { source: 'Email', destination: 'email', format: 'string' },
            ] },
            { destination: 'contactsArray', format: 'array', values: [
                { source: 'Phone', format: 'string' },
                { source: 'Email', format: 'string' },
            ] },
        ] },
    ],
};

const builder = new JSONBuilder(options);

builder.build((built) => {
    console.log(JSON.stringify(built, null, 4));
});

```

### Output

```js
[
    {
        "user": {
            "id1Boolean?": false,
            "firstnameString": "James",
            "ageInteger": 24,
            "piFloat": 3.14,
            "contactsObject": {
                "phone": "1-541-754-30100",
                "email": "james.willis@email.com"
            },
            "contactsArray": [
                "1-541-754-30100",
                "james.willis@email.com"
            ]
        }
    },
    {
        "user": {
            "id1Boolean?": true,
            "firstnameString": "Mary",
            "ageInteger": 28,
            "piFloat": 3.14,
            "contactsObject": {
                "phone": "1-541-754-30102",
                "email": "mary.jane@email.com"
            },
            "contactsArray": [
                "1-541-754-30102",
                "mary.jane@email.com"
            ]
        }
    }
]
```

## The `value` property

The `value` property allows you to set some value in the resulting Javascript object without extracting it from the original CSV (i.e: `user.piFloat` in the previous example).

The `value` property is affected by the provided format.


## Custom formats

The builder allows you to provide custom formatters.

A formatter is a Javascript function following this signature :
```js
function formatter(data, mapping, base)
```

The `base` argument is optional, but highly recommended especially if you want to access the builder built-in methods.

### Input

| # | Firstname | Lastname | Age | Phone           | Email                  |  €       |
|---|-----------|----------|-----|-----------------|------------------------|----------|
| 0 | James     | Willis   | 24  | 1-541-754-30100 | james.willis@email.com |  2000    |
| 1 | Mary      | Jane     | 28  | 1-541-754-30102 | mary.jane@email.com    |  3052.15 |


### Code

```js
const JSONBuilder = require('csv-to-json-builder');

const options = {
    source: 'example.csv',
    mapping: [
        { destination: 'user', format: 'object', properties: [
            { source: 'Firstname', destination: 'firstname', format: 'string' },
            { source: 'Lastname', destination: 'lastname', format: 'string' },
            { source: 'Age', destination: 'age', format: 'integer' },
            { source: '€', destination: 'euro', format: 'custom:euro' },
        ] },
    ],
};

const builder = new JSONBuilder(options);

builder.formatters.add({ identifier: 'euro', namespace: 'custom'}, (data, mapping, base) => {
    const float = base.float(data, mapping);
    return float ? `${float}€` : null;
});

builder.build((built) => {
    console.log(JSON.stringify(built, null, 4));
});

```

The first argument of the `Builder.formatters.add()` method is an options object containing :
- `identifier` : the name of the custom format you want to create
- `namespace` : a namespacing prefix allowing you to structure your custom formats.

Your format can be called from the mapping object via the `<namespace>:<identifier>` label.
If no `namespace` is provided at the creation of the format, your format can be accessed via `:<identifier>` (equivalent to an empty string as `namespace`).

### Output

```js
[
    {
        "user": {
            "firstname": "James",
            "lastname": "Willis",
            "age": 24,
            "euro": "2000€"
        }
    },
    {
        "user": {
            "firstname": "Mary",
            "lastname": "Jane",
            "age": 28,
            "euro": "3052.15€"
        }
    }
]
```
