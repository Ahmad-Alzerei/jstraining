export default class Movie {
    id;
    title;
    description;
    releaseYear;
    genre;
    rating;
    constructor(id, title, description = "", releaseYear = "", genre = "", rating = 0) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.releaseYear = releaseYear;
        this.genre = genre;
        this.rating = rating;
    }

}