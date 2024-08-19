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
import { getData, postData } from "../api/auth";
import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import swal from "sweetalert";

function BookPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [originalPrice, setOriginalPrice] = useState(undefined);

  
  const navigate = useNavigate();

  const fetchData = async () => {
    const result = await getData(`api/movie/get-movie-by-id/${id}`);
    const movie = result.data.movie;
    setMovie(movie);
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      const isLoggedIn =
        localStorage.getItem("access_token") !== null ? true : false;

      if (!isLoggedIn) {
        swal("Oops!", `please login in order to continue`, "error");
        navigate("/login");
        return;
      }

      const token = localStorage.getItem("access_token");
      const ws = new WebSocket(`ws://localhost:5000?token=${token}`);

      ws.onopen = () => console.log("websocket opened");

      ws.onmessage = (msg) => {
        if (msg.data === "show_alert_booking") {
          swal(`Success!`, `Booking success`, "success");
        }

        if (msg.data === "refetch") {
          fetchData();
        }
      };

      fetchData();
    })();
  }, [id]);

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBookButtonClick = async (e) => {
    const seatsRequest = selectedSeats.map((seat) => {
      return { seat_number: seat };
    });

    try {
      console.log("seatsRequest", seatsRequest);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      };

      const bookRequest = await postData(
        "api/movie/book-seats",
        {
          seats: seatsRequest,
          _id: id,
        },
        headers
      );

      console.log("bookRequest", bookRequest);
    } catch (error) {
      console.log("error-handleBookButtonClick", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
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
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    {movie.movie_name}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{ marginBottom: 1 }}
                  >
                    {movie.venue}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginBottom: 1 }}
                  >
                    {new Date(movie.show_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{ fontWeight: "bold" }}
                  >
                    {movie.price}
                  </Typography>
                  <Box sx={{ marginTop: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleBookButtonClick}
                    >
                      Book Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={7}>
            <Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                Available Seats
              </Typography>
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {movie.seats.map((seat, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    color={
                      seat.is_available
                        ? selectedSeats.includes(seat.seat_number)
                          ? "secondary"
                          : "success"
                        : "error"
                    }
                    onClick={() => handleSeatClick(seat.seat_number)}
                    sx={{
                      margin: 1,
                      width: "60px",
                      height: "60px",
                      pointerEvents: seat.is_available ? "auto" : "none",
                    }}
                  >
                    {seat.seat_number}
                  </Button>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default BookPage;
