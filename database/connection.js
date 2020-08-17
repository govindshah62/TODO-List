const mongoose = require('mongoose');

module.exports=async()=>{
    try {
        const conn=await mongoose.connect(process.env.mongoURI,{
            useNewUrlParser:true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB connected:${conn.connection.host}`);
    } catch (error) {
       console.log('Database connectivity error',error); 
       throw new Error(error);
    }   
}