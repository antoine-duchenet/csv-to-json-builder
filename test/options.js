module.exports = {
    source: 'data.csv',
    json: false,

    workers: 1,
    delimiter: ',',
    escape: '"',
    trim: true,
    header: true,
    headers: null,
    eol: null,

    mapping: [
        { destination: 'user', format: 'object', properties: [
            { source: 'Email', destination: 'email', format: 'string' },
            { source: 'FirstName', destination: 'firstname', format: 'string' },
        ] },
    ],
};
