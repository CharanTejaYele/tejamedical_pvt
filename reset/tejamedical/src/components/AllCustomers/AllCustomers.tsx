import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { ICustomerDetails, NotExpired } from "../Customers/CustomerListUtils";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";

const db = getDatabase();

const AllCustomers = () => {
  const [Customers, setCustomers] = useState<ICustomerDetails[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        onValue(
          ref(db, "/users/"),
          (snapshot) => {
            let customersList: ICustomerDetails[] = [];
            snapshot.forEach((childSnapshot) => {
              let customer: ICustomerDetails = {
                CustomerName: "",
                MobileNumber: "",
                RefererMobileNumber: null,
                TotalPurchase: 0,
                CurrentWallet: 0,
                ExpiredWallet: 0,
                Wallet: [],
                AllBills: [],
              };
              const keyName = "" + childSnapshot.key;
              const data = childSnapshot.val();

              customer.MobileNumber = keyName;
              customer.CustomerName = data.CustomerName;
              customer.RefererMobileNumber = data.RefererMobileNumber;
              let LatestDate = new Date("01/01/2000");

              if (data.AllBills) {
                let totalpurchases = 0;
                Object.entries(data.AllBills).forEach(([date, amount]) => {
                  totalpurchases += Number(amount);
                  if (new Date(date) > LatestDate) {
                    LatestDate = new Date(date);
                  }
                  customer.AllBills.push({
                    MobileNumber: keyName,
                    Date: date,
                    Amount: amount + "",
                  });
                });
                customer.TotalPurchase = totalpurchases;
              }

              if (data.Wallet) {
                let TotalAmount = 0;
                let CurrentWallet = 0;
                Object.entries(data.Wallet).forEach(([phoneNumber, bill]) => {
                  if (bill) {
                    Object.entries(bill).forEach(([date, amount]) => {
                      TotalAmount = TotalAmount + Number(amount);
                      if (NotExpired(date, LatestDate)) {
                        CurrentWallet += Number(amount);
                      }
                      customer.Wallet.push({
                        MobileNumber: phoneNumber,
                        Date: date,
                        Amount: amount + "",
                      });
                    });
                  }
                });
                customer.ExpiredWallet = TotalAmount - CurrentWallet;
                customer.CurrentWallet = CurrentWallet;
              }

              customersList.push(customer);
            });
            setCustomers(customersList);
          },
          {
            onlyOnce: true,
          }
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate("/login");
    }
  });

  return (
    <Box sx={{ padding: "20px" }}>
      <TableContainer
        component={Paper}
        sx={{ maxWidth: 900, margin: "auto", minWidth: "350px" }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "600" }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: "600" }} align="right">
                Phone number
              </TableCell>
              <TableCell sx={{ fontWeight: "600" }} align="right">
                Referer number
              </TableCell>
              <TableCell sx={{ fontWeight: "600" }} align="right">
                Current Wallet
              </TableCell>
              <TableCell sx={{ fontWeight: "600" }} align="right">
                Total Purchased
              </TableCell>
              <TableCell sx={{ fontWeight: "600" }} align="right">
                Total Savings
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Customers.map((row) => (
              <TableRow
                key={row.MobileNumber}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.CustomerName}
                </TableCell>
                <TableCell align="right">{row.MobileNumber}</TableCell>
                <TableCell align="right">
                  {row.RefererMobileNumber || ""}
                </TableCell>
                <TableCell align="right">{row.CurrentWallet}</TableCell>
                <TableCell align="right">{row.TotalPurchase}</TableCell>
                <TableCell align="right">{row.ExpiredWallet}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllCustomers;
