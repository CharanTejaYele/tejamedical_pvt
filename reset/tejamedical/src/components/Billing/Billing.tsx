import React, { PureComponent, useState } from "react";
import { AddCustomerBox, StyledTextField } from "./Billing.styles";
import { Alert, Button, Typography } from "@mui/material";
import { Formatnumber, formatAmount, formatPhoneNumber } from "../utils";
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { app } from "../../firebase-config";

const Billing = () => {
  const db = getDatabase();
  const dbRef = ref(getDatabase());

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

  const database = getDatabase(app);

  function Validate() {
    if (BillDetails.PhoneNumber.length !== 12) {
      setErrordetails({
        ...Errordetails,
        PhoneNumber: "Enter mobile Number",
      });
      return false;
    }
    if (Formatnumber(BillDetails.Amount) < 500) {
      setErrordetails({
        ...Errordetails,
        Amount: "Enter Amount greater than 500",
      });
      return false;
    }
    if (NewUser.NewUser) {
      if (NewUser.RefererMobileNumber.length !== 0) {
        if (NewUser.RefererMobileNumber.length !== 12) {
          setErrordetails({
            ...Errordetails,
            RefererMobileNumber: "Enter 10 Digit Mobile Number of the Referer",
          });
          return false;
        }
      }
    }
    return true;
  }
  function AddToReferrer(
    RefereeMobileNumber: string,
    ReffereeBillAmount: Number,
    PurchaseDate: Date
  ) {
    console.log(RefereeMobileNumber);
    get(child(dbRef, `users/${RefereeMobileNumber}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          update(
            ref(
              db,
              "users/" +
                snapshot.val().RefererMobileNumber +
                "/wallet/" +
                RefereeMobileNumber +
                "/"
            ),
            {
              [`${PurchaseDate}`]: ReffereeBillAmount,
            }
          ).then(() => {
            window.location.reload();
          });
        } else {
          console.log(RefereeMobileNumber + "Didn't found");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleAddDetails() {
    setAPICALLED(true);
    if (Validate()) {
      const date = new Date();
      if (NewUser.NewUser) {
        get(child(dbRef, `users/${NewUser.RefererMobileNumber}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              update(ref(db, "users/" + BillDetails.PhoneNumber), {
                CustomerName: NewUser.CustomerName,
                RefererMobileNumber: NewUser.RefererMobileNumber,
                wallet: "0",
                "All Bills": {
                  [`${date}`]: Formatnumber(BillDetails.Amount),
                },
              });
              AddToReferrer(
                BillDetails.PhoneNumber,
                Formatnumber(BillDetails.Amount) / 10,
                date
              );
            } else {
              alert("Enter Correct Referrer Number");
              setAPICALLED(false);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        get(child(dbRef, `users/${BillDetails.PhoneNumber}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              console.log("False");
              update(
                ref(db, "users/" + BillDetails.PhoneNumber + "/All Bills/"),
                {
                  [`${date}`]: Formatnumber(BillDetails.Amount),
                }
              );
              AddToReferrer(
                BillDetails.PhoneNumber,
                Formatnumber(BillDetails.Amount) / 10,
                date
              );
            } else {
              setNewUser({ ...NewUser, NewUser: true });
              setAPICALLED(false);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      setAPICALLED(false);
    }
    console.log(Errordetails);
  }

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
        label="Phone Number"
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
            label="Referer Mobile Number"
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
    </AddCustomerBox>
  );
};
export default Billing;
