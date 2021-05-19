import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    profile_id: String,
    first_name: String,
    last_name: String,
    dp: String
});

const User = mongoose.model('user', userSchema);

const productSchema = new Schema({
    name: String,
    price: Number,
    src: String,
    review_id: [String]
})

const Product = mongoose.model('product', productSchema);

module.exports = {
    User,
    Product
};

// assests/shopImg/pexels-ashford-marx-6545899.jpg