import { Document, model, Schema } from 'mongoose';

export interface Order extends Document {
    date: Date;
    amount: number;
    delivery: boolean;
    deliveryTime: Date;
    company: Schema.Types.ObjectId;
    products: Array<Schema.Types.ObjectId>;
    user: Schema.Types.ObjectId;
}

const Order = new Schema<Order>({
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

export default model<Order>("Order", Order)





// const mongoose = require('mongoose');

// const Order = mongoose.model('Order', {
//     date: {
//         type: Date,
//         required: true
//     },
//     amount: {
//         type: Number,
//         required: true
//     },
//     delivery: {
//         type: Boolean,
//         required: true
//     },
//     deliveryTime: {
//         type: Date,
//     },
//     company: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Company",
//     },
//     products: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//     }],
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     }

// })
// module.exports = Order;