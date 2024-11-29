const mongoose = require('mongoose')
// const mongoURL = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1"
//mongodb+srv://yashass:yEscA5R5sCuetC9H@cluster0.hwdlzoo.mongodb.net/
const mongoURL = "mongodb+srv://yashass:ZaneZ8bc1OLZbTME@cluster0.ekync0n.mongodb.net/"

const fs = () =>{
    console.log("Connected to db")
}

const fe = (err) =>{
    console.log("disconnected to database", err)
}

const connectToMongo = () =>{
    // mongoose.connect(mongoURL).catch(err => console.log(err.reason))
    mongoose.connect(mongoURL).then(
        () =>{fs()},
        err =>{fe(err)}
    );
}

module.exports = connectToMongo