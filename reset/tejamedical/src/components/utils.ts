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
  return value.replace(/[^\d]/g, "");
}
