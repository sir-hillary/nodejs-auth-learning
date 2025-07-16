require('dotenv').config();
const express = require('express')
const connectToDB = require('./database/db');
const authRoutes = require('./routes/auth-routes');
const homeRoutes= require('./routes/home-routes');
const adminRoutes = require('./routes/admin-route');
const imageRoutes = require('./routes/image-routes');
const { applyTimestamps } = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3000;


connectToDB();


// Middleware that parse the json requests

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', imageRoutes)





app.listen(PORT, ()=>{
    console.log(`server is now running on port ${PORT}`)
});