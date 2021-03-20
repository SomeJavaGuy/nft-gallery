import axios from "axios";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "../../generated/graphql";
import { NormalizedAsset } from "../../types/normalizedAsset";
import { Provider } from "../../types/provider";
import Api from "../api";

// Example of an owner: Coopahtroopa: 0x5b93ff82faaf241c15997ea3975419dddd8362c5 OR 0x59bd99198e0b4f08dbb9ce49b48303d894253999
// This is NFT gallery! https://ipfs.fleek.co/ipfs/bafybeidb7ipofwjax2kg5vaiqsmxjqq3jf7thk7oyt774jkcmwfdo47ima
// https://ipfs.fleek.co/ipfs/bafkreiau5rugaqh42yvtzx3wrts2ugs6fqmwd7pnxvmmbrlo4hadhzl334
// https://opensea.io/assets/0xabefbc9fd2f806065b4f3c237d4b59d9a97bcac7/81

const ZORA_SUBGRAPH = "https://api.thegraph.com/subgraphs/name/ourzora/zora-v1";

class ZoraParser {
  static normalizeZoraAsset(asset: any): NormalizedAsset {
    const { id, contentURI, creator, owner, description, name } = asset;

    return {
      creator: { address: creator.id },
      provider: Provider.ZORA,
      owner: { address: owner.id },
      token_id: id,
      description,
      name,
      image_url: contentURI,
      external_link: null,
    };
  }
}

export default class ZoraApi implements Api {
  async getTokenMetadata(url: string) {
    if (!url) {
      // TODO : better error handling
      return {};
    }

    let data;

    try {
      const payload = await axios.get(url);
      data = payload.data;
    } catch (error) {
      console.error(error);
    }
    return data || {};
  }

  async getTokensByOwner(owner: string): Promise<NormalizedAsset[]> {
    const client = new GraphQLClient(ZORA_SUBGRAPH);
    const sdk = getSdk(client);
    const { medias } = await sdk.mediaByOwner({ owner });

    const getTokensWithMetadata = medias.map(async (item: any) => {
      const metadata = await this.getTokenMetadata(item.metadataURI);
      return {
        ...metadata,
        ...item,
      };
    });

    const normalizedTokens = (await Promise.all(getTokensWithMetadata)).reduce(
      (acc, data) => {
        // filter out texts
        if (data.mimeType === "text/plain") return acc;

        return [...acc, ZoraParser.normalizeZoraAsset(data)];
      },
      []
    );

    return normalizedTokens;
  }
}
