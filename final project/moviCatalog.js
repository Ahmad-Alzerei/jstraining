import fs from "fs";
import prompt from "prompt-sync";
import Movie from "./movie.js";

const input = prompt();
let catalogArray = [];

const readJson = (link) => {
    try {
        const rowDataJson = fs.readFileSync(link, "utf-8");
        const dataFromJson = JSON.parse(rowDataJson);
        return dataFromJson;
    } catch (err) {
        console.log("Error happened while reading");
        console.log(err.message);
        return []; // Return an empty array if an error occurs
    }
};

const writeJson = (data) => {
    try {
        const myData = JSON.stringify(data, null, 2);
        fs.writeFileSync("./test.json", myData, "utf-8");
        console.log("Data written to test.json");
    } catch (err) {
        console.log(err.message);
    }
};


const getMovies = async () => {
    try {
        const url =
            "https://api.themoviedb.org/3/trending/movie/week?language=en-US";
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MzFmN2M2NDg1YzRjMDk0ZTYzMTBkYzAwY2RiZmVkMiIsInN1YiI6IjY0N2Q5OWQ0Y2Y0YjhiMDEyMjc3MDQwMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DVN7wbPHMy8FuCEDZeH2JhaElN4fjrtQgXDOGKXXvqM",
            },
        };
        const response = await fetch(url, options);
        const data = await response.json();
        return data.results;
    }
    catch (err) {
        console.log("Failed to get movies from API.");
        console.log(err.message);
    }
};


const addAPIMoviesToCatalog = (movies) => {
    for (let movie of movies) {
        const newMovie = new Movie(
            movie.id,
            movie.title,
            movie.overview,
            `${movie.release_date[0]}${movie.release_date[1]}${movie.release_date[2]}${movie.release_date[3]}`,
            movie.Type,
            movie.vote_average + "/10"
        );
        catalogArray.push(newMovie);
    }
    return catalogArray;
};

// getMovies();

const userAddMovie = () => {
    let movieId = `user${catalogArray.length}`;
    let title = input("Enter title: ");
    let description = input("Enter description: ");
    let year = input("Enter year: ");
    let genre = input("Enter genre: ");
    let rate = input("Enter rate: ");
    const movie = new Movie(
        movieId,
        title,
        description,
        year,
        genre,
        rate
    );
    catalogArray.push(movie);
    writeJson(catalogArray);
};

const updateMovie = () => {
    let movieId = input("Enter the movie ID to update: ");
    for (let i = 0; i < catalogArray.length; i++) {
        if (catalogArray[i].id == movieId) {
            let newTitle = input("Enter the new title: ");
            let newYear = input("Enter the new release year: ");
            let newGenre = input("Enter the new genre: ");
            let newDescription = input("Enter the new description: ");
            let newRate = input("Enter the new rate: ");
            catalogArray[i] = {
                ...catalogArray[i],
                title: newTitle,
                description: newDescription,
                year: newYear,
                genre: newGenre,
                rating: newRate
            };
            break;
        }
    }
    writeJson(catalogArray);
};

const printCatalog = () => {
    let data = readJson("./test.json");
    data.forEach((movie) => {
        console.log(`===========================================
Movie Id: ${movie.id}
Title: ${movie.title}
Description: ${movie.description}
Released in: ${movie.year}
Genre: ${movie.genre}
Rating: ${movie.rating}
-------------------------------------------`);
    });
};

const deleteMovie = () => {
    let movieId = input("Enter the movie ID to delete: ");
    catalogArray = catalogArray.filter((movie) => {
        if (movie.id == movieId)
            return movie = "";
        else
            return movie;
    });
    writeJson(catalogArray);
};

const searchAboutMovie = () => {
    let movieTitle = input("Enter the movie title to search about: ");
    for (let i = 0; i < catalogArray.length; i++) {
        if (((catalogArray[i].title).toLowerCase()).includes(movieTitle.toLocaleLowerCase())) {
            console.log(`===========================================
Movie Id: ${catalogArray[i].id}
Title: ${catalogArray[i].title}
Description: ${catalogArray[i].description}
Released in: ${catalogArray[i].year}
Genre: ${catalogArray[i].genre}
Rating: ${catalogArray[i].rating}
-------------------------------------------`);
            break;
        }
    }
};

const filterMovies = () => {
    let filterBy = input(
        "Enter the criteria to filter by (year, genre, or rate): "
    ).toLocaleLowerCase;
    let filterValue = input("Enter the filter value: ");
    catalogArray.filter((movie) => {
        if (movie[filterBy].includes(filterValue)) {
            console.log(`===========================================
Movie Id: ${movie.id}
Title: ${movie.title}
Description: ${movie.description}
Released in: ${movie.year}
Genre: ${movie.genre}
Rating: ${movie.rating}
-------------------------------------------`);
        }
    });
};

const main = async () => {
    while (true) {
        catalogArray = readJson("./test.json");
        console.log(`===========================================
----------- MOVIES CATALOG INFO -----------
===========================================
1) ADD new movie
2) Update movie
3) Display movies catalog
4) Add API movies
5) Delete movie
6) Search about movie
7) Filter movies
0) Exit program\n`);
        let step = input("Enter number to do! ");

        switch (step) {
            case "1":
                userAddMovie();
                break;
            case "2":
                updateMovie();
                break;
            case "3":
                printCatalog();
                break;
            case "4":
                catalogArray = addAPIMoviesToCatalog(await getMovies());
                writeJson(catalogArray);
                break;
            case "5":
                deleteMovie();
                break;
            case "6":
                searchAboutMovie();
                break;
            case "7":
                filterMovies();
                break;
            case "0":
                writeJson(catalogArray);
                return;
        }
    }
};

main();