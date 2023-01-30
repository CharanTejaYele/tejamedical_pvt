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
  TotalSavings: number;
  Wallet: Bill[];
  AllBills: Bill[];
}

export function NotExpired(date: string, LatestDate: Date) {
  const BillDate = new Date(date).getTime();
  if (LatestDate > new Date(date)) return false;
  const Today = new Date().getTime();
  const diffTime = Math.abs(Today - BillDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 30) return true;
  return false;
}

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
