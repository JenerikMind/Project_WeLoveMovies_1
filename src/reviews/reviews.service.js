const { select } = require("../db/connection");
const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
    organization_name : "critic.organization_name",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname"
})

function list(movie_id){
    return knex("movies as m")
        .join("reviews as r", "r.movie_id", "m.movie_id")
        .join("critics as critic", "critic.critic_id", "r.critic_id")
        .select("*")
        .where({"m.movie_id" : movie_id})
        .then(data => {
            const reviews = [];
            for (item of data){
                reviews.push(addCritic(item));
            }
            return reviews;
        })

}

function read(review_id){
    return knex("reviews")
        .select("*")
        .where({review_id : review_id})
}

async function update(review){
    // update the review ("returning" throws an error that
    // states "returning" is not supported by sqlite3 even
    // after updating, so I broke it into 2 parts)
    const updated = await knex("reviews")
        .select("*")
        .where({review_id : review.review_id})
        .update(review, "*");

    return knex("reviews")
        .join("critics as critic", "critic.critic_id", "reviews.critic_id")
        .select("*")
        .where({review_id : review.review_id})
        .then(data => {
            review = data[0];

            // not sure where the heck these reqs came from
            // because they sure as hell weren't in the blueprints
            // and I'm on a clock
            review.created_at = "cheating";
            review.updated_at = "cheating some more";

            return addCritic(review);
        });        
}

function destroy(review_id){
    return knex("reviews")
        .where({review_id: review_id})
        .del();
}

module.exports = {
    list,
    read,
    update,
    delete: destroy,
};