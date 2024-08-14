import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import { getData } from "../api/auth";
import { Link } from "react-router-dom";

function ShowListing() {
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [movies, setMovies] = useState(undefined);

  useEffect(() => {
    (async () => {
      setIsLoadingContent(true);

      try {
        const moviesList = await getData("api/movie/list-movies");
        console.log("moviesList", moviesList.data.movies);
        setMovies(moviesList.data.movies);
      } catch (error) {
        console.log("error-showlisting", error);
      } finally {
        setIsLoadingContent(false);
      }
    })();
  }, []);

  return (
    <Grid container spacing={3} sx={{ marginTop: 4 }}>
      {!isLoadingContent ? (
        movies.map((show) => (
          <Grid item xs={12} sm={6} md={4} key={show.id}>
            <Card sx={{ margin: "20px" }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: 0,
                  paddingTop: "56.25%",
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  image={show.image_url}
                  alt={show.image_url}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {show.title}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {show.venue}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {show.price}
                </Typography>
                <Link to={"/book/" + show._id}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                  >
                    Book Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <CircularProgress />
      )}
    </Grid>
  );
}

export default ShowListing;
