import { Product } from '../models/models';

export const GetProductDetail = async ({ productId, req }) => {
    const product = await Product.findById(productId).populate({
        path: '_reviewId',
        populate: {
            path: '_userId',
            model: 'user'
        }
    })
    product._reviewId.forEach((review, idx) => {
        product._doc._reviewId[idx]._doc.editable= review._userId._id.toString() === req.userId
    })
    const resp = product.toJSON()
    resp._reviewId.sort((a,b) => b.editable-a.editable);
    return resp;
}