import mongoose from 'mongoose'

const Schema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Title is required'],
        trim:true,
        minlength:[5,'Title must be at least 5 characters'],
        maxlength:[200,'Title cannot exceed 200 characters']
    },
    content:{
        type:String,
        required:[true,'Content is required'],
        trim:true,
        minlength:[10,'Content must be at least 10 characters']
    },
    media:{
        type:String,
        default:''
    },
    views:{
        type:Number,
        default:0
    },
    viewedBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
    }],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,'Author is required']
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

Schema.index({ author: 1 });
Schema.index({ createdAt: -1 });

const Blog=mongoose.model('Blog',Schema);
export default Blog;
