const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function list(req, res){
    const {movie_id} = req.params;
    let theaters = null;
    if (movie_id){
        theaters = await service.listSpecific(movie_id);
    }else{
        theaters = await service.list();
    }

    res.json({ data: theaters });
}

module.exports = { list }