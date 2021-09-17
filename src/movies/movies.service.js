const knex = require("../db/connection");

function list(is_showing=false){
    const data = is_showing ? 
        knex.raw(`SELECT * FROM movies m JOIN movies_theaters mt ON mt.movie_id = m.movie_id WHERE mt.is_showing = true LIMIT 15`) 
        : 
        knex("movies").select("*");

    return data;
}

function read(movie_id){
    return knex("movies").select("*").where({movie_id: movie_id});
}

function withTheaters(movie_id){
    return knex.raw(`select * from movies m join movies_theaters mt on m.movie_id = mt.movie_id join theaters t on t.theater_id = mt.theater_id where m.movie_id = ${movie_id}`);
}
module.exports = {
    list,
    read,
    withTheaters,
}