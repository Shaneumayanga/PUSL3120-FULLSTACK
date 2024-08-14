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
  Paper,
} from "@mui/material";
import { getData } from "../api/auth";
import { useParams } from "react-router-dom";

function BookPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await getData(`api/movie/get-movie-by-id/${id}`);
      const movie = result.data.movie;
      setMovie(movie);
      setIsLoading(false);
    })();
  }, [id]);

  return (
    <Box sx={{ padding: 4 }}>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Movie Card on the Left */}
          <Grid item xs={12} md={6} lg={5}>
            <Paper elevation={3}>
              <Card>
                <CardMedia
                  component="img"
                  image={movie.image_url}
                  alt={movie.movie_name}
                  sx={{
                    height: "250px",
                    objectFit: "cover",
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: "bold" }}>
                    {movie.movie_name}
                  </Typography>
                  <Typography variant="body1" color="text.primary" sx={{ marginBottom: 1 }}>
                    {movie.venue}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                    {new Date(movie.show_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                  <Typography variant="h6" color="text.primary" sx={{ fontWeight: "bold" }}>
                    {movie.price}
                  </Typography>
                  <Box sx={{ marginTop: 2 }}>
                    <Button variant="contained" color="primary" fullWidth>
                      Book Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Paper>
          </Grid>

          {/* Available Seats Placeholder on the Right */}
          <Grid item xs={12} md={6} lg={7}>
            <Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                Available Seats
              </Typography>
              {/* Placeholder for seat selection */}
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Seat selection component will go here.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default BookPage;
