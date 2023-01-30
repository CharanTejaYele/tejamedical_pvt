import { Typography, Button, Snackbar } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { HandleNewBill, HandleNewCustomer, auth } from "../DataUtils";
import { AddCustomerBox, StyledTextField } from "./Billing.styles";
import { useNavigate } from "react-router-dom";
import { Formatnumber, formatAmount, formatPhoneNumber } from "../GenericUtils";

export const Billing = () => {
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

  const [BillDetails, setBillDetails] = useState({
    PhoneNumber: "",
    Amount: "",
  });

  const [Errordetails, setErrordetails] = useState({
    PhoneNumber: "",
    Amount: "",
    CustomerName: "",
    RefererMobileNumber: "",
  });

  const [NewUser, setNewUser] = useState({
    NewUser: false,
    CustomerName: "",
    RefererMobileNumber: "",
  });

  const [APICALLED, setAPICALLED] = useState(false);

  const handleChange =
    (prop: string) => (event: { target: { value: any } }) => {
      if (prop === "PhoneNumber") {
        setBillDetails({
          ...BillDetails,
          [prop]: formatPhoneNumber(event.target.value),
        });
      } else if (prop === "Amount") {
        setBillDetails({
          ...BillDetails,
          [prop]: formatAmount(event.target.value),
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
    if (BillDetails.PhoneNumber.length !== 12) {
      setErrordetails({
        ...Errordetails,
        PhoneNumber: "Enter mobile number",
      });
      return false;
    }
    if (Formatnumber(BillDetails.Amount) < 100) {
      setErrordetails({
        ...Errordetails,
        Amount: "Enter Amount greater than 100",
      });
      return false;
    }
    if (NewUser.NewUser) {
      if (NewUser.RefererMobileNumber.length !== 0) {
        if (NewUser.RefererMobileNumber.length !== 12) {
          setErrordetails({
            ...Errordetails,
            RefererMobileNumber: "Enter 10 Digit Mobile number of the Referer",
          });
          return false;
        }
      }
      if (NewUser.CustomerName === "") {
        setErrordetails({
          ...Errordetails,
          CustomerName: "Enter Valid Name",
        });
        return false;
      }
    }
    return true;
  }

  const handleAddDetails = async () => {
    setAPICALLED(true);
    if (Validate()) {
      if (NewUser.NewUser) {
        const response = await HandleNewCustomer({
          PhoneNumber: BillDetails.PhoneNumber,
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
      }

      const newResponse = await HandleNewBill({
        PhoneNumber: BillDetails.PhoneNumber,
        Amount: BillDetails.Amount,
      });
      if (newResponse === "Success") {
        setSnackbarDetails({
          ...SnackbarDetails,
          message: "Bill successfully updated",
          isopen: true,
        });
        setNewUser({
          ...NewUser,
          NewUser: false,
          CustomerName: "",
          RefererMobileNumber: "",
        });
        setBillDetails({ ...BillDetails, PhoneNumber: "", Amount: "" });
      } else if (newResponse === "New User") {
        setSnackbarDetails({
          ...SnackbarDetails,
          message: "New User",
          isopen: true,
        });
        setNewUser({ ...NewUser, NewUser: true });
      } else if (
        newResponse === "Bill successful and amount added to referrer"
      ) {
        setSnackbarDetails({
          ...SnackbarDetails,
          message: "Bill successful and amount added to referrer",
          isopen: true,
        });
        setNewUser({
          ...NewUser,
          NewUser: false,
          CustomerName: "",
          RefererMobileNumber: "",
        });
        setBillDetails({ ...BillDetails, PhoneNumber: "", Amount: "" });
      } else {
        setSnackbarDetails({
          ...SnackbarDetails,
          message: "Something went wrong!",
          isopen: true,
        });
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
        New Bill
      </Typography>{" "}
      <StyledTextField
        required
        error={Errordetails["PhoneNumber"] !== ""}
        helperText={
          Errordetails["PhoneNumber"] === "" ? "" : Errordetails["PhoneNumber"]
        }
        variant="outlined"
        label="Phone number"
        sx={{ marginBottom: "20px" }}
        onChange={handleChange("PhoneNumber")}
        inputProps={{ maxLength: 12 }}
        value={BillDetails.PhoneNumber}
      />
      <StyledTextField
        required
        error={Errordetails["Amount"] !== ""}
        helperText={Errordetails["Amount"] === "" ? "" : Errordetails["Amount"]}
        variant="outlined"
        label="Amount"
        sx={{ marginBottom: "20px" }}
        onChange={handleChange("Amount")}
        inputProps={{ maxLength: 12 }}
        value={BillDetails.Amount}
      />
      {NewUser.NewUser && (
        <>
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
            error={Errordetails["CustomerName"] !== ""}
            helperText={
              Errordetails["CustomerName"] === ""
                ? ""
                : Errordetails["CustomerName"]
            }
            variant="outlined"
            label="Name"
            sx={{ marginBottom: "20px" }}
            onChange={handleChange("CustomerName")}
            value={NewUser.CustomerName}
          />
          <StyledTextField
            required
            error={Errordetails["RefererMobileNumber"] !== ""}
            helperText={
              Errordetails["RefererMobileNumber"] === ""
                ? ""
                : Errordetails["RefererMobileNumber"]
            }
            variant="outlined"
            label="Referer Mobile number"
            sx={{ marginBottom: "20px" }}
            onChange={handleChange("RefererMobileNumber")}
            value={NewUser.RefererMobileNumber}
          />
        </>
      )}
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
export default Billing;
