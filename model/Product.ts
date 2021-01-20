import { Document, model, Schema } from 'mongoose';

export interface Product extends Document {
    productName: string;
    price: number;
    quantity: number;
    category: string;
    weight: number;
    description: string;
    allergens: Array<string>;
    cut: boolean;
    photo: Array<Photo>;
    company?: Schema.Types.ObjectId; 
}

type Photo = {
    path: string;
}

const Product = new Schema<Product>({
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    weight: Number,
    description: String,
    allergens: String, //peut être en faire une table
    cut: Boolean,
    photo: [Object],
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
    }
})
export default model<Product>("Product", Product)