//ambil property pool dr objek postsgress
const {Pool} = require('pg')

// setup connection pool
const dbPool = new Pool({
    database: 'sahaware',
    port: 5432,
    user: 'postgres',
    password: '1234'
})

// export db pool to be use for query
module.exports = dbPool