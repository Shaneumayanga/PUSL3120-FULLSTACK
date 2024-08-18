import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getData ,postData} from "../api/auth";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        };

        const userData = await getData("api/user/get-profile", headers);
        const ticketData = await getData("api/user/get-user-ticket", headers);

        setUserData(userData.data.user);
        setTickets(ticketData.data.tickets[0].tickets);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleDelete = async (ticketId) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      };

      // await postData("api/user/")

      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket.id !== ticketId)
      );
    } catch (error) {
      console.error("Failed to delete ticket", error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6">Failed to load user data.</Typography>
      </Box>
    );
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      spacing={2}
      height="100vh"
      sx={{ backgroundColor: "#f5f5f5", padding: 3 }}
    >
      <Grid item xs={12} sm={8} md={6}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <Typography variant="h5" component="div">
                {userData.name}
              </Typography>
            </Box>
            <Divider />
            <Typography variant="body1" component="div" mt={2}>
              <strong>Email:</strong> {userData.email}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={8} md={6}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Booked Tickets
            </Typography>
            <Divider />
            {tickets.length > 0 ? (
              <List>
                {tickets.map((ticket, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(ticket._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`Movie: ${ticket.movie_name}`}
                      secondary={`Seat: ${ticket.seat} | Date: ${ticket.show_date}`}
                      primaryTypographyProps={{ fontWeight: "bold" }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" component="div" mt={2}>
                No tickets booked.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Profile;
