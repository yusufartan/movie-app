class MovieAPI {
    constructor() {
        this.MovieApiURL = "https://api.themoviedb.org/3/discover/movie?api_key=";
        this.movieApiKey = "cbdcca71511ad9f6ca9f4f93edfb6b3a";
        this.baseImageURL = "http://image.tmdb.org/t/p/w500";
        this.searchMovieURL = `https://api.themoviedb.org/3/search/movie?api_key=${this.movieApiKey}&query=`;
        this.lang = "tr";
    }

    async getMovies(page = 1) {
        const url = `${this.MovieApiURL}${this.movieApiKey}&include_adult=false&include_video=false&language=${this.lang}&page=${page}&sort_by=popularity.desc`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Film bulunamadı...");
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error("Hata:", error.message);
            return [];
        }
    }

    async searchMovieFound(searchedFilm, page = 1) {
        if (!searchedFilm) return { results: [] }; // boş aramada API'yi yorma
        try {
            const response = await fetch(`${this.searchMovieURL}${searchedFilm}&page=${page}`);
            if (!response.ok) throw new Error("Film bulunamadı...");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("HATA:", error.message);
            return { results: [] };
        }
    }

    getIMDBcolor(average) {
        if (average >= 9) return "#2c9b00";     // Mükemmel
        if (average >= 7) return "#4fdc17";     // İyi
        if (average >= 5) return "#e69d0b";     // Orta
        return "#f60e0e";                       // Kötü
    }
}
