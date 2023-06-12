export default function (): Promise<{
  getBoard: (index: number) => number;
  getCurrency: () => number;
  sell: (n: number) => any;
  setBoard: (index: number, b: number) => any;
  setCurrency: (n: number) => any;
  step: (direction: number) => any;
  zkmain: () => number;
}>;
