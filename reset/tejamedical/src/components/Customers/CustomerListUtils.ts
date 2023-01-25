import { getDatabase, onValue, ref } from "firebase/database";

export const fetchData = async () => {
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

  return customerDetails;
};

export interface Bill {
  MobileNumber: string;
  Date: string;
  Amount: string;
}

export interface ICustomerDetails {
  CustomerName: string;
  RefererMobileNumber: string | null;
  Wallet: Bill[];
  AllBills: Bill[];
  MobileNumber: string;
}
