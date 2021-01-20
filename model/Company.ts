import { Document, model, Schema } from 'mongoose';
import { Photo, Day, OpeningDay } from '../types/types'

export interface Company extends Document {
    name: string;
    role: string;
    email: string;
    hash: string;
    salt: string;
    token: string;
    account: Account;
    description: string;
    phone: string;
    address: string;
    postalCode: number;
    city: string;
    country: string;
    location: Array<number>;
    photo: Array<Photo>;
    openingHours: OpeningDay;
    products: Array<Schema.Types.ObjectId>;
    orders: Array<Schema.Types.ObjectId>;
}

export type Account = {
    username: string
    firstname?: string
    lastname?: string
}

const Company = new Schema<Company>({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    hash: {
        type: String,
        unique: true
    },
    salt: {
        type: String,
        unique: true
    },
    token: {
        type: String,
        unique: true
    },
    account: {
        username: {
            type: String,
            required: true,
            unique: true
        },
        firstname: String,
        lastname: String,
    },
    description: String,
    phone: String,
    address: {
        type: String,
        required: true
    },
    postalCode: Number,
    city: String,
    country: String,
    location: {
        type: [Number], // Longitude et latitude
        index: "2d" // Créer un index geospatial https://docs.mongodb.com/manual/core/2d/
    },
    openingHours: {
        monday: {
            beginHours: String,
            endHours: String
        },
        tuesday: {
            beginHours: String,
            endHours: String
        },
        wednesday: {
            beginHours: String,
            endHours: String
        },
        thursday: {
            beginHours: String,
            endHours: String
        },
        friday: {
            beginHours: String,
            endHours: String
        },
        saturday: {
            beginHours: String,
            endHours: String
        },
        sunday: {
            beginHours: String,
            endHours: String
        },
    },
    photo: [Object],
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
    },],
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "order"
        }
    ]
})

export default model<Company>("Company", Company)