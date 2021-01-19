import mongoose = require('mongoose');
import { Document, Model, model, Schema } from 'mongoose';

export interface User extends Document {
    email: string;
    role: string;
    token: string;
    hash: string;
    salt: string;
    orders: Array<Schema.Types.ObjectId>
    phone: string;
    account: Account;
}
type Account = {
    username: string;
    firstname?: string;
    lastname?: string;
    adress: string;
    postalCode: number;
    city: string;
    country: string;
}

const User = new Schema<User>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    token: String,
    hash: String,
    salt: String,
    roles: [String],
    account: {
        username: {
            type: String,
            unique: true
        },
        firstname: String,
        lastname: String,
        address: String,
        postalCode: Number,
        city: String,
        country: String,
    },
    phone: String,
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    ]
});
export default model<User>("User", User)