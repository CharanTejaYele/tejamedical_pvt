import React, { useState } from "react";
import { AddCustomerBox, StyledTextField } from "./Billing.styles";
import { Button, Typography } from "@mui/material";

const Billing = () => {
  function formatPhoneNumber(value: string) {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return `${phoneNumber}`;
    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(
      3,
      6
    )} ${phoneNumber.slice(6, 10)}`;
  }
  function formatAmount(value: string) {
    value = value.replace(/[^\d]/g, "");
    if (!value) return value;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumSignificantDigits: 3,
    }).format(parseInt(value));
  }

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
        // onClick={handleAddDetails}
      >
        Add Details
      </Button>
    </AddCustomerBox>
  );
};

export default Billing;
