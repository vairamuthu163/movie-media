import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { API_BASE_URL } from "../../baseUrl";
import Spinner from "./Spinner";
import CloseIcon from "./CloseIcon";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetails = ({ id, setSelectedMovie }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);

  const fetchMovieDetails = async (movieId) => {
    try {
      const endpoint = `${API_BASE_URL}/movie/${movieId}?append_to_response=videos,credits`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }

      const data = await response.json();
      setMovieDetails(data);
    } catch (error) {
      console.log("Failed to fetch movie details:", error);
    }
  };

  useEffect(() => {
    setIsModalOpen(true);
    fetchMovieDetails(id);
  }, [id]);

  const handleCloseModal = () => {
    setIsModalOpen(false);

    // Resets the selected movie in the parent component.
    setSelectedMovie(null);
  };

  const getRunTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hrs}h ${mins}m`;
  };

  const getOfficialTrailer = (videos) => {
    return videos.results.find(
      (video) =>
        video.type === "Trailer" && video.official && video.site === "YouTube"
    )?.key;
  };

  return (
    <Modal isModalOpen={isModalOpen} closeModal={handleCloseModal}>
      <div className="modal-content">
        {!movieDetails ? (
          <Spinner />
        ) : (
          <>
            <section className="movie-trailer">
              <div className="trailer-video">
                {movieDetails.videos?.results?.length > 0 ? (
                  <>
                    <iframe
                      height="315"
                      src={`https://www.youtube.com/embed/${getOfficialTrailer(
                        movieDetails.videos
                      )}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&loop=1`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>

                    <button onClick={handleCloseModal}>
                      <CloseIcon />
                    </button>
                  </>
                ) : (
                  <img
                    src={
                      movieDetails.poster_path
                        ? `https://images.tmdb.org/t/p/w500/${movieDetails.poster_path}`
                        : "./no-movie.png"
                    }
                    alt={movieDetails.title}
                  />
                )}
              </div>
            </section>

            <section className="movie-details-container">
              <div className="movie-details">
                <h3>
                  <span className="movie-title">{movieDetails.title}</span>
                  {"  "}
                  <span className="movie-release-date">
                    {movieDetails.release_date
                      ? movieDetails.release_date.split("-")[0]
                      : "N/A"}
                    {"    "}
                    {getRunTime(movieDetails.runtime)}
                  </span>
                </h3>
                <div className="movie-rating">
                  <img src="star.svg" alt="Star icon" />

                  <p className="ml-1">
                    {movieDetails.vote_average
                      ? movieDetails.vote_average.toFixed(1)
                      : "N/A"}
                  </p>
                </div>
              </div>

              <section className="movie-overview">
                <h4>Overview</h4>
                <p>{movieDetails.overview}</p>
              </section>

              <div className="movie-cast-details">
                <h4>Cast</h4>
                <div className="cast-list">
                  {movieDetails.credits?.cast?.length > 0 ? (
                    movieDetails.credits.cast.slice(0, 10).map((castMember) => (
                      <div key={castMember.cast_id} className="cast-member">
                        {castMember.profile_path ? (
                          <>
                            <img
                              src={
                                castMember.profile_path
                                  ? `https://images.tmdb.org/t/p/w200/${castMember.profile_path}`
                                  : ""
                              }
                              alt={castMember.name}
                            />
                            <p>{castMember.name}</p>
                          </>
                        ) : (
                          <p>{castMember.name}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No cast information available.</p>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </Modal>
  );
};

export default MovieDetails;
