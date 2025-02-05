const mongoose = require('mongoose')
const dbConecction = () =>{
    mongoose.connect(process.env.DB_URI).then((conn) =>{
        console.log(`DataBase connected ${conn.connection.host}`)
    }).catch((err) => {
        console.error(`Data Base error ${error}`);
        process.exit(1);
    });
};
module.exports = dbConecction;