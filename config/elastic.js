var elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
    host: 'https://7gii23pxg2:nqq9f9e4o8@haidangdb-8712957073.ap-southeast-2.bonsaisearch.net:443',
    log: 'error'
});
module.exports = esClient;