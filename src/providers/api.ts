export default interface Api {
  getTokensByOwner(owner: string): Promise<any[]>;
}
