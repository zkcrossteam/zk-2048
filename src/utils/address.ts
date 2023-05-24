export const addressAbbreviation = (address: string, tailLength: number) =>
  `${address.slice(0, 8)}...${address.slice(address.length - tailLength)}`;
