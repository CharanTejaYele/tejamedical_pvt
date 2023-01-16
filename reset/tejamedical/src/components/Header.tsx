import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import immunization from "./immunization.png";

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
        <img src={immunization} alt="" height={"30px"} />

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
          Immunization Due Children
        </Typography>
      </HeaderTitle>

    </StyledHeaderBox>
  );
}
export default Header;
