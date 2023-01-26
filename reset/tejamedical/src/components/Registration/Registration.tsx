import { useState } from "react";
import { AddCustomerBox, StyledTextField } from "../Billing/Billing.styles";
import { Button, Snackbar, Typography } from "@mui/material";
import { formatPhoneNumber } from "../utils";
import { child, get, getDatabase, ref, update } from "firebase/database";

const Registration = () => {
  const db = getDatabase();
  const dbRef = ref(getDatabase());

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
        PhoneNumber: "Enter 10 Digit Phone Number",
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
        RefererMobileNumber: "Enter 10 Digit Mobile Number of the Referer",
      });
      return false;
    }
    return true;
  }

  function handleAddDetails() {
    setAPICALLED(true);
    if (Validate()) {
      get(child(dbRef, `users/${NewUser.RefererMobileNumber}`))
        .then((snapshot) => {
          if (snapshot.exists() || NewUser.RefererMobileNumber === "") {
            get(child(dbRef, `users/${NewUser.PhoneNumber}`)).then((user) => {
              if (user.exists()) {
                setSnackbarDetails({
                  ...SnackbarDetails,
                  message: "User Already Exists",
                  isopen: true,
                });
              } else {
                update(ref(db, "users/" + NewUser.PhoneNumber), {
                  CustomerName: NewUser.CustomerName,
                  RefererMobileNumber: NewUser.RefererMobileNumber,
                });
                setSnackbarDetails({
                  ...SnackbarDetails,
                  message: "User Successfully Registered",
                  isopen: true,
                });
                setNewUser({
                  ...NewUser,
                  PhoneNumber: "",
                  CustomerName: "",
                  RefererMobileNumber: "",
                });
              }
            });
          } else {
            setSnackbarDetails({
              ...SnackbarDetails,
              message: "Referrer Doesn't Exist",
              isopen: true,
            });
            setAPICALLED(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setAPICALLED(false);
      console.log(Errordetails);
    }
  }

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
        label="Phone Number"
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
        label="Referer Mobile Number"
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
