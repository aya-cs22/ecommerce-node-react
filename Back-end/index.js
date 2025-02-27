const express = require('express');
const dotenv = require('dotenv');
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors');
dotenv.config({ path: 'config.env' });

const dbConecction = require('./config/database');
const ApiError = require('./utils/appError');
const globalError = require('./middleware/errorMiddleWare')
dbConecction();
const userRoutes = require('./routes/userRoutes');
const catergoryRoutes = require('./routes/catergoryRoutes')
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const productRoutes = require('./routes/productRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const reviewRoutes = require('./routes/serviceRoutes');

//express app
const app = express();
app.use(cors());

//MiddleWare
if(process.env.NODE_ENV==="development"){
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`)
};
app.use(express.json())

    
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/catergory', catergoryRoutes);
app.use('/api/v1/subcatergory', subCategoryRoutes);
app.use('/api/v1/brand', brandRoutes)
app.use('/api/v1/product', productRoutes)
app.use('/api/v1/service', serviceRoutes)
app.use('/api/v1/service', serviceRoutes)


app.all('*', (req, res, next) =>{
    next (new ApiError(`Can't Find this route: ${req.originalUrl}`, 400)) 
});
// Global error handling middleWare

app.use(globalError)
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

// Handel rejection outside express
process.on('unhandledRejection', (err) =>{
    console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(()=>{
        console.error(`shuitting down...`);
        process.exit(1)
    })
})