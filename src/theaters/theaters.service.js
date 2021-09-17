const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addMovies = mapProperties({
    title: "movies.title",
    rating: "movies.rating",
    runtime_in_minutes: "movies.runtime_in_minutes",
});

const theaterListBuilder = (data) => {
    const theaterArr = [];
    const theaterNames = [];

    for (item of data){

        if (!theaterNames.includes(item.name)){
            theaterNames.push(item.name);

            const theater = {
                address_line_1: item.address_line_1,
                address_line_2: item.address_line_2,
                city: item.city,
                name: item.name,
                state: item.state,
                zip: item.zip,
                movies: [],
            };

            const movie = {
                rating: item.rating,
                title: item.title,
                runtime_in_minutes: item.runtime_in_minutes,
            }

            theater.movies.push(movie);
            theaterArr.push(theater);
            console.log(theaterArr, "IF portion of statement");
        }else{
            console.log(theaterNames.indexOf, "theater names");
            const indexOfTheater = theaterNames.indexOf(item.name);
            const currentTheater = theaterArr[indexOfTheater];

            const movie = {
                rating: item.rating,
                title: item.title,
                runtime_in_minutes: item.runtime_in_minutes,
            }

            currentTheater.movies.push(movie);
        }
    }

    return theaterArr;
};


// [
//     {name: "alamo",
//     movies: [
//         {title: "sa"},
//         {title: "another one"}
//     ]
//     }
// ]

function list(){
    return knex("theaters as t")
        .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
        .innerJoin("movies", "mt.movie_id", "movies.movie_id")
        .select(
            "t.address_line_1",
            "t.address_line_2",
            "t.city",
            "t.name", 
            "t.state",
            "t.zip",
            "movies.rating", 
            "movies.title", 
            "movies.runtime_in_minutes"
            )
        .orderBy("t.city")
        .then(data => {
            const theaters = theaterListBuilder(data);
            console.log(theaters);
            return theaters;
        });
}

function listSpecific(movie_id){
    return knex("theaters as t")
        .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
        .join("movies as m", "m.movie_id", "mt.movie_id")
        .select("t.*")
        .where({"m.movie_id" : movie_id});
}

module.exports = { 
    list,
    listSpecific, 
}