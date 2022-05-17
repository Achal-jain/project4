const mongoose = require("mongoose")
const validUrl = require("valid-url")

const urlSchema =new mongoose.Schema({
    urlCode: {
        type:String, 
        required:true, 
        unique:true, 
        trim:true 
    }, 
    longUrl: {
         type:validUrl, 
         required:true 
        },
    
    shortUrl: {
        required:true,
        unique:true
    }

})