import { GraphQLClient } from "graphql-request";
import { getSdk } from "../../generated/graphql";
import Api from "../api";

// Example of an owner: 0x59bd99198e0b4f08dbb9ce49b48303d894253999
// This is NFT gallery! https://ipfs.fleek.co/ipfs/bafybeidb7ipofwjax2kg5vaiqsmxjqq3jf7thk7oyt774jkcmwfdo47ima
// https://ipfs.fleek.co/ipfs/bafkreiau5rugaqh42yvtzx3wrts2ugs6fqmwd7pnxvmmbrlo4hadhzl334
// https://opensea.io/assets/0xabefbc9fd2f806065b4f3c237d4b59d9a97bcac7/81

const ZORA_SUBGRAPH = "https://api.thegraph.com/subgraphs/name/ourzora/zora-v1";

export default class ZoraApi implements Api {
  async getTokensByOwner(owner: string): Promise<any[]> {
    const client = new GraphQLClient(ZORA_SUBGRAPH);
    const sdk = getSdk(client);
    const { medias } = await sdk.mediaByOwner({ owner });
    console.log(`GraphQL data:`, medias);
    return [];
  }
}
