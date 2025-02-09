const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    projectLanguage : {
        type : String,
        required : true,
        enum: ['python','java','cpp','c','javascript','go','bash']
    },createdBy :{
        type : String,
        required : true
    },
    code :{
        type : String,
        required : true
    },
    date :{
        type : Date,
        default : Date.now
    },
    version :{
        type : String,
        required : true
    }
})

module.exports = mongoose.model("Project",projectSchema)