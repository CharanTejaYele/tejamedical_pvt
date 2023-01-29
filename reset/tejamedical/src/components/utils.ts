import { getAuth } from "firebase/auth";
import {
  child,
  get,
  getDatabase,
  onValue,
  ref,
  update,
} from "firebase/database";
import { app } from "../firebase-config";
import { NotExpired } from "./Customers/CustomerListUtils";

export function formatPhoneNumber(value: string) {
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

export function formatAmount(value: string) {
  value = value.replace(/[^\d]/g, "");
  if (!value) return value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumSignificantDigits: 10,
  }).format(parseInt(value));
}

export function Formatnumber(value: string) {
  return Number(value.replace(/[^\d]/g, ""));
}

const db = getDatabase();
const dbRef = ref(getDatabase());
export const auth = getAuth(app);

export const AddToReferrer = async (
  RefereeMobileNumber: string,
  BillAmount: number,
  PurchaseDate: Date
) => {
  try {
    const snapshot = await get(child(dbRef, `users/${RefereeMobileNumber}`));
    if (snapshot.exists()) {
      if (snapshot.val().RefererMobileNumber !== "") {
        try {
          const CurrentWallet = await WalletAmount(
            BillAmount,
            RefereeMobileNumber
          );
          console.log(CurrentWallet, BillAmount);
          let temp = BillAmount - Number(CurrentWallet);
          const AmountToAdd = (() => {
            switch (true) {
              case temp >= 100 && temp < 500: {
                return (BillAmount - Number(CurrentWallet)) * 0.02;
              }
              case temp >= 500 && temp < 1000: {
                return (BillAmount - Number(CurrentWallet)) * 0.035;
              }
              case temp >= 1000: {
                return (BillAmount - Number(CurrentWallet)) * 0.05;
              }
              default:
                return undefined;
            }
          })();
          console.log(AmountToAdd);
          update(
            ref(
              db,
              "users/" +
                snapshot.val().RefererMobileNumber +
                "/Wallet/" +
                RefereeMobileNumber +
                "/"
            ),
            {
              [`${PurchaseDate}`]: AmountToAdd,
            }
          );

          return "Added To referrer";
        } catch (error) {
          return error;
        }
      } else {
        return RefereeMobileNumber + " : Has no Referrer";
      }
    } else {
      return "Referrer Does not Exist!";
    }
  } catch (error) {
    return error;
  }
};

export const HandleNewBill = async (BillDetails: {
  PhoneNumber: string;
  Amount: string;
}) => {
  const Today = new Date();
  try {
    const snapshot = await get(
      child(dbRef, `users/${BillDetails.PhoneNumber}`)
    );
    let ReferResponse: unknown;
    if (snapshot.exists()) {
      if (snapshot.val().RefererMobileNumber !== "") {
        ReferResponse = await AddToReferrer(
          BillDetails.PhoneNumber,
          Formatnumber(BillDetails.Amount),
          Today
        );
      }
      return update(
        ref(db, "users/" + BillDetails.PhoneNumber + "/AllBills/"),
        {
          [`${Today}`]: Formatnumber(BillDetails.Amount),
        }
      )
        .then(() => {
          if (ReferResponse === undefined) {
            return "Success";
          } else if (ReferResponse === "Added To referrer") {
            return "Bill successful and amount added to referrer";
          } else if (ReferResponse === "Has no Referrer") {
            return "Success";
          } else {
            return "Something Went wrong";
          }
        })
        .catch((error) => {
          return error;
        });
    } else {
      return "New User";
    }
  } catch (error) {
    return error;
  }
};

export const HandleNewCustomer = async (CustomerDetails: {
  PhoneNumber: string;
  RefererMobileNumber: string;
  Name: string;
}) => {
  try {
    const snapshot = await get(
      child(dbRef, `users/${CustomerDetails.RefererMobileNumber}`)
    );
    if (snapshot.exists() || CustomerDetails.RefererMobileNumber === "") {
      const childSnapshot = await get(
        child(dbRef, `users/${CustomerDetails.PhoneNumber}`)
      );
      if (childSnapshot.exists()) {
        return "User already exists!";
      } else {
        update(ref(db, "users/" + CustomerDetails.PhoneNumber), {
          CustomerName: CustomerDetails.Name,
          RefererMobileNumber: CustomerDetails.RefererMobileNumber,
        });
        return "User successfully added!";
      }
    } else {
      return "Referrer does not Exist";
    }
  } catch (error) {
    return error;
  }
};

export const WalletAmount = async (
  BillAmount: number,
  RefereeNumber: string
) => {
  return new Promise((resolve, reject) => {
    let TotalAmount = 0;
    let CurrentWallet = 0;
    onValue(
      ref(db, `/users/${RefereeNumber}`),
      (childSnapshot) => {
        const data = childSnapshot.val();

        let LatestDate = new Date("01/01/2000");
        if (data.AllBills) {
          Object.entries(data.AllBills).forEach(([date, amount]) => {
            if (new Date(date) > LatestDate) {
              LatestDate = new Date(date);
            }
          });
        }
        if (data.Wallet) {
          Object.entries(data.Wallet).forEach(([phoneNumber, bill]) => {
            if (bill) {
              Object.entries(bill).forEach(([date, amount]) => {
                TotalAmount = TotalAmount + Number(amount);
                if (NotExpired(date, LatestDate)) {
                  CurrentWallet += Number(amount);
                }
              });
            }
          });
        }
        resolve(Number(CurrentWallet));
      },
      {
        onlyOnce: true,
      }
    );
  });
};
