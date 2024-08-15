import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import { Box, Grid, Typography, Button } from "@mui/material";

import "../app.css";

import ShowListing from "../show-listing/show-listing";
import { Link } from "react-router-dom";

import { getData, postData } from "../api/auth";

const images = [
  "https://dims.apnews.com/dims4/default/0a73f78/2147483647/strip/true/crop/3000x1688+0+156/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2Fc0%2Fd7%2F8952bf0805373c77af588787a7fd%2Fca0bfc7687ac42fa8f4c10c46d5623ad",
  "https://static0.moviewebimages.com/wordpress/wp-content/uploads/article/VzIeDdvhfU8CfLDFitDx0kYldHsLXp.jpg",
];

const ImageSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...settings}>
      {images.map((image, index) => (
        <div key={index} className="slider-image">
          <img src={image} alt={`Slide ${index + 1}`} />
          <div className="image-overlay"></div>
        </div>
      ))}
    </Slider>
  );
};

function Home() {
  const showListingRef = useRef(null);

  const handleScrollToShowListing = () => {
    if (showListingRef.current) {
      showListingRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("access_token") !== null ? true : false;
    setIsLoggedIn(isLoggedIn);
  }, []);

  return (
    <Box position="relative" sx={{ overflowX: "hidden" }}>
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        p={2}
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 3,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: isLoggedIn ? "none" : "block",
          }}
        >
          <Link to="/login">
            <Button
              variant="outlined"
              color="primary"
              sx={{ marginRight: 2, fontWeight: "bold", textTransform: "none" }}
            >
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button
              variant="contained"
              color="primary"
              sx={{ fontWeight: "bold", textTransform: "none" }}
            >
              Register
            </Button>
          </Link>
        </Box>
        <Box
          sx={{
            display: isLoggedIn ? "block" : "none",
          }}
        >
          <Link to="/profile">
            <Button
              variant="contained"
              color="primary"
              sx={{ fontWeight: "bold", textTransform: "none" }}
            >
              Profile
            </Button>
          </Link>
          <Button
            variant="contained"
            onClick={(e) => {
              localStorage.removeItem("access_token");
              window.location.reload();
            }}
            sx={{
              fontWeight: "bold",
              textTransform: "none",
              backgroundColor: "red",
              marginLeft: "2px",
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>
      <ImageSlider />
      <Grid container spacing={1}>
        <Grid item xs={12} className="welcome-text">
          <Typography sx={{ fontFamily: "Radio Canada Big", fontSize: "50px" }}>
            Welcome to CinemaX
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleScrollToShowListing}
            sx={{
              marginTop: "20px",
              backgroundColor: "#3f51b5",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Book Your Show
          </Button>
        </Grid>
      </Grid>
      <div ref={showListingRef}>
        <ShowListing />
      </div>
    </Box>
  );
}

export default Home;
