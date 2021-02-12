import { Document, model, Schema } from 'mongoose';

export interface OrderType extends Document {
    date: Date;
    amount: number;
    delivery: boolean;
    deliveryTime: Date;
    company: Schema.Types.ObjectId;
    products: Array<Schema.Types.ObjectId>;
    user: Schema.Types.ObjectId;
}

const OrderSchema = new Schema<OrderType>({
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    delivery: {
        type: Boolean,
        required: true
    },
    deliveryTime: {
        type: Date,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})
const Order = model<OrderType>("Order", OrderSchema)
export default Order
