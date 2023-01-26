import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm, StyledTextField } from "./Login.styles";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase-config";

const Login = () => {
  const [error, setError] = useState(false);
  const [values, setValues] = useState({
    Email: "",
    Password: "",
    showPassword: false,
  });
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate("/billing");
    }
  });

  const handleChange =
    (prop: string) => (event: { target: { value: any } }) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };

  const HandleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, values.Email, values.Password)
      .then(() => {
        navigate("/billing");
      })
      .catch((error) => {
        setError(true);
      });
  };

  return (
    <LoginForm>
      <h2 style={{ textAlign: "left" }}>Login</h2>
      {error && (
        <Alert severity="error" sx={{ marginBottom: "20px" }}>
          Invalid email or password
        </Alert>
      )}
      <StyledTextField
        variant="outlined"
        label="Email"
        onChange={handleChange("Email")}
        sx={{ marginBottom: "20px" }}
      />
      <FormControl
        sx={{ marginBottom: "20px", width: "100%" }}
        variant="outlined"
      >
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={values.showPassword ? "text" : "password"}
          value={values.Password}
          onChange={handleChange("Password")}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
      <Button variant="contained" sx={{ margin: "10px" }} onClick={HandleLogin}>
        Login
      </Button>
    </LoginForm>
  );
};
export default Login;

