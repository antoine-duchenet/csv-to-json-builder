module.exports = {
    source: 'data.csv',
    json: false,
    mapping: [
        { destination: 'user', format: 'object', properties: [
            { source: 'Email', destination: 'email', format: 'string' },
            { source: 'FirstName', destination: 'firstname', format: 'string' },
        ] },
    ],
};
