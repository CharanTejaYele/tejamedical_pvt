import React, { useState } from "react";
import { AddCustomerBox, StyledTextField } from "./Billing.styles";
import { Button, Typography } from "@mui/material";
import { formatAmount, formatPhoneNumber } from "../utils";
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { app } from "../../firebase-config";

const Billing = () => {
  const [BillDetails, setBillDetails] = useState({
    PhoneNumber: "",
    Amount: "",
  });

  const [Errordetails, setErrordetails] = useState({
    PhoneNumber: "",
    Amount: "",
  });

  const handleChange =
    (prop: string) => (event: { target: { value: any } }) => {
      if (prop === "PhoneNumber") {
        setBillDetails({
          ...BillDetails,
          [prop]: formatPhoneNumber(event.target.value),
        });
      } else {
        setBillDetails({
          ...BillDetails,
          [prop]: formatAmount(event.target.value),
        });
      }
      setErrordetails({ ...Errordetails, [prop]: "" });
    };

  const database = getDatabase(app);

  function handleAddDetails(): void {
    console.log("first");
    const db = getDatabase();
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${BillDetails.PhoneNumber}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          update(
            ref(
              db,
              "users/" + BillDetails.PhoneNumber + "/All Bills/" + new Date()
            ),
            {
              username: "name",
              email: "email",
              profile_picture: "imageUrl",
            }
          );
        } else {
          // update(ref(db, "users/" + BillDetails.PhoneNumber), {
          //   username: "name",
          //   email: "email",
          //   profile_picture: "imageUrl",
          // });
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
      <Button
        variant="contained"
        sx={{ margin: "0px 60px 20px 60px" }}
        onClick={handleAddDetails}
      >
        Add Details
      </Button>
    </AddCustomerBox>
  );
};

export default Billing;
