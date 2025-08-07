const experss = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
require('dotenv').config();
const app = experss();
const port = 4000;  



app.use(experss.json());
app.use(experss.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);


const DB = async ()=> {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");

    }catch(err){
        console.log("faild connection db : ",err);
    }
}

DB();


app.listen(port, ()=> {
    console.log(`Server is running on http://localhost:${port}`);
})