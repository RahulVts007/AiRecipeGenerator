import dotenv from 'dotenv'
dotenv.config()

import pkg from 'pg'
const {Pool} = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? {rejectUnauthorized: false} : false
});

// pool.on is a event listener that is put on the pool itself 
// so when the event is connect it logs to the console
pool.on('connect' , () => {
    console.log("Connected to Postgres Database");
})

// when there is error in the pool the error is logged
pool.on('error' , (err) => {
    console.log(`Error: ${err}`);
    process.exit(-1); // it exits the process and stops the node.js program
    // if not used the connection has already fauiled but the program keeps running
});

export default{
    query: (text , params) => pool.query(text , params),
    pool
}
 