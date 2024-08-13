import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { getData, postData } from "../api/auth";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  const [userName, setUserName] = useState(undefined);
  const [confirmPassword, setConfirmPassword] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    if (confirmPassword !== password) {
      swal("Oops!", `Passwords do not match`, "error");
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        email: email,
        password: password,
        name: userName,
      };

      const registerResult = await postData("api/user/register", data);

      swal(
        `Hello ${registerResult.data.user_name}!`,
        `Successfully registered`,
        "success"
      );

      navigate("/login?login-to-continue=true");
      
    } catch (error) {
      swal("Oops!", `${error.response.data.data}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleRegister}
      sx={{
        maxWidth: 400,
        margin: "auto",
        padding: 3,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        backgroundColor: "#fff",
        marginTop: "20px",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 2, textAlign: "center" }}>
        Register
      </Typography>
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        required
        variant="outlined"
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="User name"
        type="text"
        fullWidth
        margin="normal"
        required
        variant="outlined"
        onChange={(e) => setUserName(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        required
        variant="outlined"
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        label="Confirm password"
        type="password"
        fullWidth
        margin="normal"
        required
        variant="outlined"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {isLoading ? (
        <CircularProgress></CircularProgress>
      ) : (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: 2,
            backgroundColor: "#3f51b5",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Register
        </Button>
      )}
    </Box>
  );
};

export default Register;
