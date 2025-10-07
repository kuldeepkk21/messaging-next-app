import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";


export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
    content: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        required: true,
        default: Date.now 
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified?: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const userSchema: Schema<User> = new Schema({
    username: { 
        type: String, 
        unique: true,
        trim: true,
        lowercase: true,
        required: [true, 'Username is required']
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: { 
        type: String, 
        required: true 
    },
    verifyCode: { 
        type: String, 
        required: true 
    },
    verifyCodeExpiry: { 
        type: Date, 
        required: true 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    isAcceptingMessages: { 
        type: Boolean, 
        default: true 
    },
    messages: [{ 
        type: messageSchema, 
        required: true 
    }]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || 
mongoose.model<User>('User', userSchema);

export { UserModel };
