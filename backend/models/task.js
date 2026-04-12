const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title:{
    type:String,
    required:true,
    },
    completed:{
    type:Boolean,
    default:false,
    },
    CreatedAt:{
    type:Date,
    default:Date.now,
    },
});


module.exports = mongoose.model("Task",taskSchema);