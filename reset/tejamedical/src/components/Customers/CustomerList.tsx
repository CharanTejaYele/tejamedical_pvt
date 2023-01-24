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
import { Fragment, SetStateAction, useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
// import { Interface } from "readline";

function getData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  price: number
) {
  return {
    name,
    calories,
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

function Row(props: { row: ReturnType<typeof getData> }) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

interface Bill {
  Date: {
    Amount: Number;
  };
}

interface Wallet {
  MobileNumber: {
    Date: {
      Amount: Number;
    };
  }[];
}
interface ICustomerDetails {
  Name: any;
  // All_Bills: Bill[];
}

export default function CollapsibleTable() {
  const [CustomerDetails, setCustomerDetails] = useState<ICustomerDetails[]>();
  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();
      const starCountRef = ref(db, "/users/");
      await onValue(starCountRef, (snapshot) => {
        // const data = snapshot.val();
        let patient: ICustomerDetails[] = [];
        snapshot.forEach((childSnapshop) => {
          // let KeyName = childSnapshop.key;
          // let data = childSnapshop.val();
          patient.push(...patient, { Name: childSnapshop.val() });
        });
        setCustomerDetails(patient);
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(CustomerDetails);
  }, [CustomerDetails]);

  const rows = [
    getData("Frozen yoghurt", 159, 6.0, 24, 4.0, 3.99),
    getData("Ice cream sandwich", 237, 9.0, 37, 4.3, 4.99),
    getData("Eclair", 262, 16.0, 24, 6.0, 3.79),
    getData("Cupcake", 305, 3.7, 67, 4.3, 2.5),
    getData("Gingerbread", 356, 16.0, 49, 3.9, 1.5),
    // CustomerDetails.forEach(element => {
    //   console.log(Element.data)
    // });
    // <Row key={row.name} row={row} />
    // getData(
    //   CustomerDetail["101 010 1010"].CustomerName,
    //   356,
    //   16.0,
    //   49,
    //   3.9,
    //   1.5
    // ),
  ];

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: "1200px", margin: "0px auto" }}
    >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell align="right">Referred By</TableCell>
            <TableCell align="right">Referred</TableCell>
            <TableCell align="right">Total Billing</TableCell>
            <TableCell align="right">Wallet Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
