import { getDatabase, onValue, ref } from "firebase/database";

// export const fetchData = async () => {
//   let customers: ICustomerDetails[] = [];
//   const db = getDatabase();
//   const usersRef = ref(db, "/users/");
//   onValue(usersRef, (snapshot) => {
//     snapshot.forEach((childSnapshot) => {
//       let customer: ICustomerDetails = {
//         CustomerName: "",
//         MobileNumber: "",
//         RefererMobileNumber: null,
//         TotalPurchase: 0,
//         CurrentWallet: 0,
//         ExpiredWallet: 0,
//         Wallet: [],
//         AllBills: [],
//       };
//       const keyName = "" + childSnapshot.key;
//       const data = childSnapshot.val();

//       customer.MobileNumber = keyName;
//       customer.CustomerName = data.CustomerName;
//       customer.RefererMobileNumber = data.RefererMobileNumber;

//       if (data.AllBills) {
//         Object.entries(data.AllBills).forEach(() => {
//           customer.AllBills.push({
//             MobileNumber: keyName,
//             Date: data.AllBills.date,
//             Amount: data.AllBills.amount,
//           });
//         });
//       }

//       if (data.Wallet) {
//         Object.entries(data.Wallet).forEach(() => {
//           if (data.Wallet.bills) {
//             Object.entries(data.Wallet.bills).forEach(() => {
//               customer.Wallet.push({
//                 MobileNumber: data.Wallet.phoneNumber,
//                 Date: String(data.Wallet.date),
//                 Amount: data.Wallet.amount,
//               });
//             });
//           }
//         });
//       }
//       customers.push(customer);
//     });
//   });
//   return customers;
// };

// export interface Bill {
//   MobileNumber: string;
//   Date: string;
//   Amount: string;
// }

// export interface ICustomerDetails {
//   CustomerName: string;
//   MobileNumber: string;
//   RefererMobileNumber: string | null;
//   TotalPurchase: number;
//   CurrentWallet: number;
//   ExpiredWallet: number;
//   Wallet: Bill[];
//   AllBills: Bill[];
// }

export const fetchData = async () => {
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

export function NotExpired(date: string) {
  const BillDate = new Date(date).getTime();
  const Today = new Date().getTime();
  const diffTime = Math.abs(Today - BillDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 30) return true;
  return false;
}

