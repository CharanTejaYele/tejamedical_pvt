import { Paper, TextField } from "@mui/material";
import { styled } from "@mui/system";

export const LoginForm = styled(Paper)({
  color: "darkslategray",
  backgroundColor: "#FAFAFA",
  maxWidth: "600px",
  minWidth: "300px",
  padding: 30,
  borderRadius: 6,
  margin: "180px 10%",
  "@media only screen and (max-width: 900px)": {
    margin: "10px",
  },
});

export const StyledTextField = styled(TextField)({
  width: "100%",
});
