export function addressAbbreviation(address: string, tailLength: number) {
  return address.substring(0,8) + "..." + address.substring(address.length - tailLength, address.length);
}
