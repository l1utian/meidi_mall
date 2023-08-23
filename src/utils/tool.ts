export function formatLocation(
  stringList: string[],
  separator: string = " "
): string {
  const location = stringList
    .filter((part) => part?.trim().length)
    .join(separator);
  return location;
}

export function maskPhoneNumber(phoneNumber?: string): string {
  return phoneNumber
    ? phoneNumber.replace(/(\d{3})\d{4}(\d+)/, "$1****$2")
    : "";
}
