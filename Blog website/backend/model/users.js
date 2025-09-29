/* eslint-disable no-undef */

// eslint-disable-next-line no-unused-vars
import mongoose from 'mongoose'
const Schema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true,
        minlength:[2,'Name must be at least 2 characters'],
        maxlength:[50,'Name cannot exceed 50 characters']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        lowercase:true,
        trim:true,
        match:[/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,'Please enter a valid email']
    },
    googleId:{
        type:String,
        default:''
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:[8,'Password must be at least 8 characters']
    },
    role:{
        type:[{
            type:String,
            enum:["READER","CREATER","ADMIN"],
        }],
        default:["READER"]
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }    
})

Schema.index({ email: 1 });
Schema.index({ googleId: 1 });

const User=mongoose.model('User',Schema);
export default User;
