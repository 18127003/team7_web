var elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
    host: 'https://q58f1o4kxp:vz65kt546k@haidangdb-8506706446.us-east-1.bonsaisearch.net:443',
    log: 'error'
});
module.exports = esClient;