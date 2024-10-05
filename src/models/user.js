const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  firstName: {
  	type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  emailId:{
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Invalid email address  :" + value)
        }
      }
  },
  password:{
    type:String,
    required: true,
  },
  age : {
    type: Number,
    max:56,
    min:18,
  },
  gender : {
    type: String,
    validate(value) {
      if(!["male","female","other"].includes(value)){
        throw new Error("Gender data is not valid");
      }
    }
  },
  photoUrl:{
    type:String,
    default:"https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg"
  },
  about:{
    type:String,
    default:"This is default of the user."
  },
  skills:{
    type:[String],
  }
}, {timestamps:true})

const UserModel = mongoose.model("User", userSchema)
module.exports = {UserModel}