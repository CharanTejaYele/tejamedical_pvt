// import { useEffect, useState } from "react";
// import { getDatabase, onValue, ref } from "firebase/database";
// import * as React from "react";
// import Box from "@mui/material/Box";
// import Collapse from "@mui/material/Collapse";
// import IconButton from "@mui/material/IconButton";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Typography from "@mui/material/Typography";
// import Paper from "@mui/material/Paper";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// function createData(
//   CustomerName: string | null,
//   CustomerMobileNumber: string | null,
//   fat: string | null,
//   carbs: string | null,
//   protein: string | null,
//   price: string | null
// ) {
//   return {
//     CustomerName,
//     CustomerMobileNumber,
//     fat,
//     carbs,
//     protein,
//     price,
//     history: [
//       {
//         date: "2020-01-05",
//         customerId: "11091700",
//         amount: "3",
//       },
//       {
//         date: "2020-01-02",
//         customerId: "Anonymous",
//         amount: "3",
//       },
//     ],
//   };
// }

// function Row(props: { row: ReturnType<typeof createData> }) {
//   const { row } = props;
//   const [open, setOpen] = React.useState(false);

//   return (
//     <React.Fragment>
//       <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
//         <TableCell>
//           <IconButton
//             aria-label="expand row"
//             size="small"
//             onClick={() => setOpen(!open)}
//           >
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//         </TableCell>
//         <TableCell component="th" scope="row">
//           {row.CustomerName}
//         </TableCell>
//         <TableCell align="right">{row.carbs}</TableCell>
//         <TableCell align="right">{row.fat}</TableCell>
//         <TableCell align="right">{row.carbs}</TableCell>
//         <TableCell align="right">{row.protein}</TableCell>
//       </TableRow>
//       <TableRow>
//         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             <Box sx={{ margin: 1 }}>
//               <Typography variant="h6" gutterBottom component="div">
//                 History
//               </Typography>
//               <Table size="small" aria-label="purchases">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Date</TableCell>
//                     <TableCell>Customer</TableCell>
//                     <TableCell align="right">Amount</TableCell>
//                     <TableCell align="right">Total price ($)</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {row.history.map((historyRow) => (
//                     <TableRow key={historyRow.date}>
//                       <TableCell component="th" scope="row">
//                         {historyRow.date}
//                       </TableCell>
//                       <TableCell>{historyRow.customerId}</TableCell>
//                       <TableCell align="right">{historyRow.amount}</TableCell>
//                       <TableCell align="right">{historyRow.amount}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </React.Fragment>
//   );
// }

// export default function CollapsibleTable() {
//   const [customerDetails, setCustomerDetails] = useState<ICustomerDetails[]>(
//     []
//   );

//   useEffect(() => {
//     const fetchData = async () => {
//       const db = getDatabase();
//       const usersRef = ref(db, "/users/");
//       await onValue(usersRef, (snapshot) => {
//         let customers: ICustomerDetails[] = [];

//         snapshot.forEach((childSnapshot) => {
//           let customer: ICustomerDetails = {
//             CustomerName: "",
//             RefererMobileNumber: "",
//             AllBills: [],
//             MobileNumber: "",
//             Wallet: [],
//           };
//           const keyName = "" + childSnapshot.key;
//           const data = childSnapshot.val();

//           customer.MobileNumber = keyName;
//           customer.CustomerName = data.CustomerName;
//           customer.RefererMobileNumber = data.RefererMobileNumber;

//           if (data.AllBills) {
//             Object.entries(data.AllBills).forEach(() => {
//               customer.AllBills.push({
//                 MobileNumber: keyName,
//                 Date: data.AllBills.date,
//                 Amount: data.AllBills.amount,
//               });
//             });
//           }

//           if (data.Wallet) {
//             Object.entries(data.Wallet).forEach(() => {
//               if (data.Wallet.bills) {
//                 Object.entries(data.Wallet.bills).forEach(() => {
//                   customer.Wallet.push({
//                     MobileNumber: data.Wallet.phoneNumber,
//                     Date: String(data.Wallet.date),
//                     Amount: data.Wallet.amount,
//                   });
//                 });
//               }
//             });
//           }

//           customers.push(customer);
//         });
//         setCustomerDetails(customers);
//       });
//     };
//     fetchData();
//   }, []);

//   const rows: {
//     CustomerName: string | null;
//     CustomerMobileNumber: string | null;
//     fat: string | null;
//     carbs: string | null;
//     protein: string | null;
//     price: string | null;
//     history: {
//       date: string;
//       customerId: string;
//       amount: string;
//     }[];
//   }[] = [];
//   customerDetails.forEach((customer) => {
//     rows.push(
//       createData(
//         customer.CustomerName,
//         customer.MobileNumber,
//         customer.RefererMobileNumber,
//         customer.CustomerName,
//         customer.MobileNumber,
//         customer.RefererMobileNumber
//       )
//     );
//   });

//   return (
//     <TableContainer
//       component={Paper}
//       sx={{ maxWidth: "1200px", margin: "0px auto" }}
//     >
//       <Table aria-label="collapsible table">
//         <TableHead>
//           <TableRow>
//             <TableCell />
//             <TableCell>Customer Name</TableCell>
//             <TableCell align="right">Customer Mobile Number</TableCell>
//             <TableCell align="right">Total Purchases</TableCell>
//             <TableCell align="right">Total Savings</TableCell>
//             <TableCell align="right">Current Wallet</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {rows.map((row) => (
//             <Row key={row.CustomerName} row={row} />
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";

const fetchData = async () => {
  let customers: ICustomerDetails[] = [];
  const db = await getDatabase();
  const usersRef = ref(db, "/users/");
  await onValue(usersRef, (snapshot) => {
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
  });
  return customers;
};

function createData(
  CustomerName: string,
  MobileNumber: string,
  RefererMobileNumber: string | null,
  TotalPurchase: number,
  CurrentWallet: number,
  ExpiredWallet: number
) {
  return {
    CustomerName,
    MobileNumber,
    RefererMobileNumber,
    TotalPurchase,
    CurrentWallet,
    ExpiredWallet,
  };
}

const CustomerList = () => {
  const [customers, setCustomers] = useState<ICustomerDetails[]>([]);
  let rows: {
    CustomerName: string;
    MobileNumber: string;
    RefererMobileNumber: string | null;
    TotalPurchase: number;
    CurrentWallet: number;
    ExpiredWallet: number;
  }[] = [];

  const data = fetchData();
  // setCustomers(data);

  if (customers) {
    customers.forEach(
      (customer: {
        CustomerName: string;
        MobileNumber: string;
        RefererMobileNumber: string | null;
        TotalPurchase: number;
        CurrentWallet: number;
        ExpiredWallet: number;
      }) => {
        rows.push(
          createData(
            customer.CustomerName,
            customer.MobileNumber,
            customer.RefererMobileNumber,
            customer.TotalPurchase,
            customer.CurrentWallet,
            customer.ExpiredWallet
          )
        );
      }
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 900 }}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Customer Name</TableCell>
            <TableCell align="right">Phone Number</TableCell>
            <TableCell align="right">Referer Number</TableCell>
            <TableCell align="right">Current Wallet</TableCell>
            <TableCell align="right">Total Purchased</TableCell>
            <TableCell align="right">Expired Wallet</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.CustomerName}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.CustomerName}
              </TableCell>
              <TableCell align="right">{row.MobileNumber}</TableCell>
              <TableCell align="right">{row.RefererMobileNumber}</TableCell>
              <TableCell align="right">{row.CurrentWallet}</TableCell>
              <TableCell align="right">{row.TotalPurchase}</TableCell>
              <TableCell align="right">{row.CurrentWallet}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default CustomerList;

export interface Bill {
  MobileNumber: string;
  Date: string;
  Amount: string;
}

export interface ICustomerDetails {
  CustomerName: string;
  MobileNumber: string;
  RefererMobileNumber: string | null;
  TotalPurchase: number;
  CurrentWallet: number;
  ExpiredWallet: number;
  Wallet: Bill[];
  AllBills: Bill[];
}
