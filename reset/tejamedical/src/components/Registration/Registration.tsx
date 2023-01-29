import { useState } from "react";
import { AddCustomerBox, StyledTextField } from "../Billing/Billing.styles";
import { Button, Snackbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { HandleNewCustomer, formatPhoneNumber } from "../utils";
import { auth } from "../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";

const Registration = () => {
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate("/login");
    }
  });

  const [SnackbarDetails, setSnackbarDetails] = useState({
    isopen: false,
    message: "",
  });

  const [Errordetails, setErrordetails] = useState({
    PhoneNumber: "",
    CustomerName: "",
    RefererMobileNumber: "",
  });

  const [NewUser, setNewUser] = useState({
    PhoneNumber: "",
    CustomerName: "",
    RefererMobileNumber: "",
  });

  const [APICALLED, setAPICALLED] = useState(false);

  const handleChange =
    (prop: string) => (event: { target: { value: any } }) => {
      if (prop === "PhoneNumber") {
        setNewUser({
          ...NewUser,
          [prop]: formatPhoneNumber(event.target.value),
        });
      } else if (prop === "CustomerName") {
        setNewUser({
          ...NewUser,
          [prop]: event.target.value,
        });
      } else if (prop === "RefererMobileNumber") {
        setNewUser({
          ...NewUser,
          [prop]: formatPhoneNumber(event.target.value),
        });
      }
      setErrordetails({ ...Errordetails, [prop]: "" });
    };

  function Validate() {
    if (NewUser.PhoneNumber.length !== 12) {
      setErrordetails({
        ...Errordetails,
        PhoneNumber: "Enter 10 Digit Phone number",
      });
      return false;
    }
    if (NewUser.CustomerName.length === 0) {
      setErrordetails({
        ...Errordetails,
        CustomerName: "Enter Customer Name",
      });
      return false;
    }
    if (
      NewUser.RefererMobileNumber.length !== 0 &&
      NewUser.RefererMobileNumber.length !== 12
    ) {
      setErrordetails({
        ...Errordetails,
        RefererMobileNumber: "Enter 10 Digit Mobile number of the Referer",
      });
      return false;
    }
    return true;
  }

  const handleAddDetails = async () => {
    setAPICALLED(true);
    if (Validate()) {
      const response = await HandleNewCustomer({
        PhoneNumber: NewUser.PhoneNumber,
        RefererMobileNumber: NewUser.RefererMobileNumber,
        Name: NewUser.CustomerName,
      });
      if (response === "User successfully added!") {
      } else if (response === "User already exists!") {
        setSnackbarDetails({
          ...SnackbarDetails,
          message: "User already exists!",
          isopen: true,
        });
        return;
      } else if (response === "Referrer does not Exist") {
        setSnackbarDetails({
          ...SnackbarDetails,
          message: "Referrer does not Exist",
          isopen: true,
        });
        return;
      } else {
        setSnackbarDetails({
          ...SnackbarDetails,
          message: "Something went wrong!",
          isopen: true,
        });
        return;
      }
    } else {
      setSnackbarDetails({
        ...SnackbarDetails,
        message: "Check Errors",
        isopen: true,
      });
    }
    setAPICALLED(false);
  };

  return (
    <AddCustomerBox>
      <Typography
        variant="h5"
        mb={"20px"}
        sx={{ textAlign: "center" }}
        color="#2b4162"
      >
        New User
      </Typography>
      <StyledTextField
        required
        error={Errordetails.PhoneNumber !== ""}
        helperText={
          Errordetails.PhoneNumber === "" ? "" : Errordetails.PhoneNumber
        }
        variant="outlined"
        label="Phone number"
        sx={{ marginBottom: "20px" }}
        onChange={handleChange("PhoneNumber")}
        inputProps={{ maxLength: 12 }}
        value={NewUser.PhoneNumber}
      />
      <StyledTextField
        required
        error={Errordetails.CustomerName !== ""}
        helperText={
          Errordetails.CustomerName === "" ? "" : Errordetails.CustomerName
        }
        variant="outlined"
        label="Name"
        sx={{ marginBottom: "20px" }}
        onChange={handleChange("CustomerName")}
        value={NewUser.CustomerName}
      />
      <StyledTextField
        required
        error={Errordetails.RefererMobileNumber !== ""}
        helperText={
          Errordetails.RefererMobileNumber === ""
            ? ""
            : Errordetails.RefererMobileNumber
        }
        variant="outlined"
        label="Referer Mobile number"
        sx={{ marginBottom: "20px" }}
        onChange={handleChange("RefererMobileNumber")}
        value={NewUser.RefererMobileNumber}
      />
      <Button
        variant="contained"
        sx={{ margin: "0px 60px 20px 60px" }}
        onClick={handleAddDetails}
        disabled={APICALLED}
      >
        Add Details
      </Button>
      <Snackbar
        open={SnackbarDetails.isopen}
        autoHideDuration={3000}
        message={SnackbarDetails.message}
        onClose={() => {
          setSnackbarDetails({ ...SnackbarDetails, isopen: false });
          setAPICALLED(false);
        }}
      />
    </AddCustomerBox>
  );
};
export default Registration;
