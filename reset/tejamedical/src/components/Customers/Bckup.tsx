import { useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
interface Bill {
  MobileNumber: string;
  Date: string;
  Amount: number;
}

interface ICustomerDetails {
  CustomerName: string;
  RefererMobileNumber: string | null;
  Wallet: Bill[];
  AllBills: Bill[];
  MobileNumber: string;
}

function createData(
  CustomerName: string,
  CustomerMobileNumber: number,
  fat: number,
  carbs: number,
  protein: number,
  price: number
) {
  return {
    CustomerName,
    CustomerMobileNumber,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: "2020-01-05",
        customerId: "11091700",
        amount: 3,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
    ],
  };
}



export default function CollapsibleTable() {
  const [customerDetails, setCustomerDetails] = useState<ICustomerDetails[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();
      const usersRef = ref(db, "/users/");
      await onValue(usersRef, (snapshot) => {
        let customers: ICustomerDetails[] = [];

        snapshot.forEach((childSnapshot) => {
          let customer: ICustomerDetails = {
            CustomerName: "",
            RefererMobileNumber: "",
            AllBills: [],
            MobileNumber: "",
            Wallet: [],
          };
          const keyName = "" + childSnapshot.key;
          const data = childSnapshot.val();

          customer.MobileNumber = keyName;
          customer.CustomerName = data.CustomerName;
          customer.RefererMobileNumber = data.RefererMobileNumber;

          if (data.AllBills) {
            Object.entries(data.AllBills).forEach(() => {
              customer.AllBills.push({
                MobileNumber: keyName,
                Date: data.AllBills.date,
                Amount: data.AllBills.amount,
              });
            });
          }

          if (data.Wallet) {
            Object.entries(data.Wallet).forEach(() => {
              if (data.Wallet.bills) {
                Object.entries(data.Wallet.bills).forEach(() => {
                  customer.Wallet.push({
                    MobileNumber: data.Wallet.phoneNumber,
                    Date: String(data.Wallet.date),
                    Amount: data.Wallet.amount,
                  });
                });
              }
            });
          }

          customers.push(customer);
        });
        setCustomerDetails(customers);
      });
    };
    fetchData();
  }, []);

  const rows = [];
  customerDetails.forEach((customer) => {
    // rows.push(createData("Gingerbread", 356, 16.0, 49, 3.9, 1.5));
    // rows.push(
    //   createData(
    //     customer.CustomerName,
    //     customer.MobileNumber,
    //     customer.RefererMobileNumber
    //   )
    // );
  });

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: "1200px", margin: "0px auto" }}
    >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Customer Name</TableCell>
            <TableCell align="right">Customer Mobile Number</TableCell>
            <TableCell align="right">Total Purchases</TableCell>
            <TableCell align="right">Total Savings</TableCell>
            <TableCell align="right">Current Wallet</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))} */}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
