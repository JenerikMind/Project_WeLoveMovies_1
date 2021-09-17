const service = require("./reviews.service");
const movieController = require("../movies/movies.controller");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// return list of reviews assoc. with the movie_id
async function list(req, res) {
    const reviews = await service.list(res.locals.movie.movie_id);
    res.json({data: reviews});
}

async function update(req, res){
    const review = res.locals.review;
    const {data: {content, score}} = req.body;
    
    if (content) review.content = content;
    if (score) review.score = score;

    const updatedReview = await service.update(review);
    res.json({data: updatedReview});
}


function destroy(req, res, next){
    const review_id = res.locals.review.review_id;
    service.delete(review_id)
        .then(() => res.sendStatus(204))
        .catch(next);
}

// middleware
async function validReviewId(req, res, next){
    const {review_id} = req.params;
    const review = await service.read(review_id).first();
    if (review){
        res.locals.review = review;
        next();
    }else{
        next({
            status: 404,
            message: `The review with ID: ${review_id} cannot be found`
        })
    }
}


module.exports = {
    list: [movieController.validMovieId, list],
    update: [asyncErrorBoundary(validReviewId), update],
    delete: [asyncErrorBoundary(validReviewId), destroy],

}