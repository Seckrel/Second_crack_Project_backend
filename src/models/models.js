import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    userName: { type: String, require: true },
    password: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    phnNumber: { type: Number, default: -1 },
    count: { type: Number, default: 0 }
});

const User = mongoose.model('user', userSchema);

const productSchema = new Schema({
    name: String,
    price: Number,
    src: String,
    quantity: { type: Number, default: 0, min: 0 },
    _reviewId: [{ type: Schema.Types.ObjectId, ref: 'reviews' }]
})

const Product = mongoose.model('product', productSchema);

const reviewSchema = new Schema({
    review: { type: String, required: true, maxLength: 100 },
    _productId: { type: Schema.Types.ObjectId, ref: 'product', required: true },
    _userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    stars: { type: Number, min: 0, max: 5, default: 0 },
}, {
    timestamps: true,
})

const Reviews = mongoose.model('reviews', reviewSchema);


module.exports = {
    User,
    Product,
    Reviews,
};
