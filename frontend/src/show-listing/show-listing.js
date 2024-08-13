import React from "react";
import { Card, CardContent, CardMedia, Typography, Button, Grid } from "@mui/material";

// Sample show data
const shows = [
  {
    id: 1,
    title: "Movie Night: The Grand Adventure",
    description: "Join us for a thrilling night of adventure and excitement.",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    title: "Comedy Fest: Laugh Out Loud",
    description: "Experience an evening full of laughter with the best comedians.",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    title: "Drama Series: The Epic Tale",
    description: "A gripping drama series that will keep you on the edge of your seat.",
    image: "https://via.placeholder.com/150",
  },
];

function ShowListing() {
  return (
    <Grid container spacing={3} sx={{ marginTop: 4 }}>
      {shows.map((show) => (
        <Grid item xs={12} sm={6} md={4} key={show.id}>
          <Card>
            <CardMedia component="img" height="140" image={show.image} alt={show.title} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {show.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {show.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default ShowListing;
