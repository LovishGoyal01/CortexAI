import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    name: {
        type: String,   
    },
    content: {
        type: String,
    }
},{
    _id: false
})        

const artifactSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    type: {
        type: String,
    },
    title: String,
    files: [fileSchema]    
},{
    _id: false
})

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    },
    role: {
        type: String,
        enum: ["user", "assistant"],
    },
    content: {
        type: String
    },        
    images:{
        type: [String]
    },
    artifacts: {
        type: [artifactSchema]
    }


},{
    timestamps: true
})

const Message = mongoose.model("Message", messageSchema);
export default Message;