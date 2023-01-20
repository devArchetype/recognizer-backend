export default interface Builder {
  reset(): void;
  build(): object | null;
}
