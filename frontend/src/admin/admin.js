import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import swal from "sweetalert";

import { getData, postData } from "../api/auth";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const [movieName, setMovieName] = useState("");
  const [venue, setVenue] = useState("");
  const [price, setPrice] = useState("");
  const [showDate, setShowDate] = useState("");
  const [isLoadingData, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const isLoggedIn =
        localStorage.getItem("access_token") !== null ? true : false;

      if (!isLoggedIn) {
        swal("Oops!", `please login in order to continue`, "error");
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      };

      const userData = await getData("api/user/get-profile", headers);

      if (!userData.data.user.is_admin) {
        swal("Oops!", `you should be an admin to access this route`, "error");
        navigate("/");
        return;
      }
      console.log("userData", userData.data.user.is_admin);

      await fetchData();
    })();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const moviesList = await getData("api/movie/list-movies");
      console.log("moviesList", moviesList.data.movies);

      setMovies(moviesList.data.movies);
    } catch (error) {
      console.log("error-showlisting", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!movieName || !venue || !price || !showDate) {
      swal("Error", "All fields are required!", "error");
      return;
    }

    (async () => {
      const data = {
        movie_name: movieName,
        image_url:
          "https://img.yts.mx/assets/images/movies/drifting_home_2022/medium-cover.jpg",
        price: price,
        show_date: showDate,
        venue: venue,
      };

      try {
        const saveMovieResult = await postData("api/movie/create", data);
        console.log("saveMovieResult", saveMovieResult);
      } catch (error) {
        swal("Oops!", `${error.response.data.data}`, "error");
      }

      setIsLoading(true);

      // Reset the form fields after submission
      setMovieName("");
      setVenue("");
      setPrice("");
      setShowDate("");

      // Fetch updated movies list
      await fetchData();
    })();
  };

  const handleDelete = (movie_id) => {
    alert("movie_id", JSON.stringify(movie_id));
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        cinemaX admin
      </Typography>
      <Grid container spacing={4}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Movie Name"
                      fullWidth
                      value={movieName}
                      onChange={(e) => setMovieName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Venue"
                      fullWidth
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Price"
                      type="number"
                      fullWidth
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Show Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={showDate}
                      onChange={(e) => setShowDate(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Movie List Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Movies List
              </Typography>
              <List>
                {movies.map((movie, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={async () => {
                            try {
                              const movie_id = movie._id;

                              await postData("api/movie/delete-movie", {
                                _id: movie_id,
                              });

                              await fetchData();
                            } catch (error) {
                              console.log("error", error);
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={movie.movie_name}
                        secondary={`Venue: ${movie.venue}, Price: ${
                          movie.price
                        }, Show Date: ${formatDate(movie.show_date)}`}
                      />
                    </ListItem>
                    {index < movies.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminPanel;
