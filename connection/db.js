//ambil property pool dr objek postsgress
const {Pool} = require('pg')

// setup connection pool
const dbPool = new Pool({
    database: 'dbl7tv3k7im4rc',
    port: 5432,
    user: 'atwsrhykcnhojh',
    password: '0c971cd5e397b3b3bbb32aaa8bfae38c37a0b89cdfb28b88d72e21b4328cb887'
})

// export db pool to be use for query
module.exports = dbPool