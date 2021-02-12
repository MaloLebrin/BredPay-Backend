import { Document, model, Schema } from 'mongoose';

export interface UserType extends Document {
    _id: Schema.Types.ObjectId;
    email: string;
    role: string;
    token: string;
    hash: string;
    salt: string;
    orders: Array<Schema.Types.ObjectId>
    phone: string;
    account: Account;
}

export type Account = {
    username: string;
    firstname?: string;
    lastname?: string;
    adress: string;
    postalCode: number;
    city: string;
    country: string;
}

const UserSchema = new Schema<UserType>({
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
            type: Schema.Types.ObjectId,
            ref: "Order"
        }
    ]
});
const User = model<UserType>("User", UserSchema)
export default User