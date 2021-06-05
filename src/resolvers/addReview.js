import { Reviews, Product } from '../models/models';

export const AddReview = async ({ review, productId, stars, reviewId, req }) => {
    try {
        if (!req.userId) throw new Error('Login to leave a review');
        const alreadyReviewedByUser = await Reviews.find({ _productId: productId, _userId: req.userId });
        if (alreadyReviewedByUser.length) {
            const update = await Reviews.findById(reviewId || alreadyReviewedByUser[0]._id).exec();
            update.review = review;
            update.stars = stars;
            await update.save();
            return update;
        } else {
            const response = await Reviews.create({
                review: review,
                _productId: productId,
                _userId: req.userId,
                stars: stars
            });
            Product.findByIdAndUpdate(
                productId,
                { runValidators: true },
                (err, doc) => {
                    if (err) throw new Error(err);
                    doc._reviewId.push(response._id)
                    doc.save()
                }
            )
            return response;
        }
    } catch (e) {
        console.log(e)
    }
}

