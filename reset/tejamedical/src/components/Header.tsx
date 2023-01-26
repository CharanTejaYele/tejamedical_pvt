import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { getAuth, signOut } from "firebase/auth";

const StyledHeaderBox = styled(Box)({
  padding: "0px 36px",
  "@media only screen and (max-width: 900px)": {
    display: "block",
  },
});

const StyledMenuBox = styled(Box)({
  display: "flex",
  "@media only screen and (max-width: 900px)": {
    display: "grid",
    gridTemplateColumns: "150px 150px",
    justifyContent: "space-around",
    gridAutoRows: "50px",
    padding: "20px",
  },
});

const HeaderTitle = styled(Box)({
  display: "flex",
  alignItems: "center",
  "@media only screen and (max-width: 900px)": {
    justifyContent: "center",
    paddingTop: "20px",
  },
});

function Header() {
  const navigate = useNavigate();

  return (
    <StyledHeaderBox
      sx={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#2B4162",
        alignItems: "center",
      }}
      minHeight={"68px"}
      mb="36px"
    >
      <HeaderTitle display="flex" minWidth={"60px"}>
        {/* <img src={immunization} alt="" height={"30px"} /> */}

        <Typography
          variant="h6"
          noWrap
          sx={{
            mr: 2,
            display: { md: "flex" },
            fontWeight: 700,
            fontSize: { xs: "1rem" },
            color: "#e0e0e2",
            textDecoration: "none",
          }}
        >
          TEJA MEDICAL AND GENERAL STORES
        </Typography>
      </HeaderTitle>

      <StyledMenuBox alignItems="center">
        <Button
          sx={{
            color: "#e0e0e2",
            margin: "5px",
            border: "0px",
            "&:hover": {
              borderColor: "#e0e0e2",
            },
            "@media only screen and (max-width: 900px)": {
              borderColor: "#e0e0e2",
              border: "1px solid",
            },
          }}
          variant="outlined"
          onClick={() => navigate("/billing")}
        >
          Add Bill
        </Button>
        <Divider
          orientation="vertical"
          color="#e0e0e2"
          sx={{ height: "30px", display: { xs: "none", md: "flex" } }}
        />
        <Button
          sx={{
            color: "#e0e0e2",
            margin: "5px",
            border: "0px",
            "&:hover": {
              borderColor: "#e0e0e2",
            },
            "@media only screen and (max-width: 900px)": {
              borderColor: "#e0e0e2",
              border: "1px solid",
            },
          }}
          variant="outlined"
          onClick={() => navigate("/registration")}
        >
          Registration
        </Button>
        <Divider
          orientation="vertical"
          color="#e0e0e2"
          sx={{ height: "30px", display: { xs: "none", md: "flex" } }}
        />{" "}
        <Button
          sx={{
            color: "#e0e0e2",
            margin: "5px",
            border: "0px",
            "&:hover": {
              borderColor: "#e0e0e2",
            },
            "@media only screen and (max-width: 900px)": {
              borderColor: "#e0e0e2",
              border: "1px solid",
            },
          }}
          variant="outlined"
          onClick={() => navigate("/allcustomers")}
        >
          {" "}
          Customers List
        </Button>
        <Divider
          orientation="vertical"
          color="#e0e0e2"
          sx={{ height: "30px", display: { xs: "none", md: "flex" } }}
        />{" "}
        <Button
          sx={{
            my: 2,
            color: "white",
            border: "0px",
            margin: "5px",
            "&:hover": {
              borderColor: "#e0e0e2",
            },
            "@media only screen and (max-width: 900px)": {
              borderColor: "#e0e0e2",
              border: "1px solid",
            },
          }}
          variant="outlined"
          onClick={() => {
            const auth = getAuth();
            signOut(auth)
              .then(() => {
                console.log("Signed Out");
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        >
          Logout
        </Button>
      </StyledMenuBox>
    </StyledHeaderBox>
  );
}
export default Header;
