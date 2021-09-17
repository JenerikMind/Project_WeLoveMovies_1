const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./movies.service");

async function validMovieId(req, res, next){
    const {movie_id} = req.params;
    try {
        const movie = await service.read(movie_id).first();
        if (movie){
            res.locals.movie = movie;
            next();
        }else{
            next({
                status: 404,
                message: `Movie with ID ${movie_id} not found.`
            })
        }
    }catch(error){
        next(error);
    }

}

async function list(req, res, next){
    const { is_showing } = req.query;
    let movies = null;
    if (is_showing && is_showing === "true"){
        movies = await service.list(true);
    }else{
        movies = await service.list();
    }
    res.json({ data: movies });
}

async function read(req, res){
    res.json({ data: res.locals.movie });
}

function return404(req, res, next){
        next({
            status: 404,
            message: "Invalid route."
        });
}

module.exports = {
    list,
    read: [validMovieId, read],
    return404: [validMovieId, asyncErrorBoundary(return404)],

    // middleware
    validMovieId,
}