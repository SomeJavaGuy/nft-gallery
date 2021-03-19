import axios from "axios";
import Api from "../api";
import { NormalizedAsset } from "../../types/normalizedAsset";
import RaribleParser from "./raribleParser";

type FetchAssets = {
  owner?: string;
};

const CORS_ANYWHERE = "http://api.allorigins.win/get?url=";
const ITEMS_ENDPOINT =
  "http://api.rarible.com/protocol/ethereum/nft/indexer/v1/items";

// TODO: move elsewhere
const parseResponse = (payload: any) => {
  const content = payload?.data?.contents;
  if (content) {
    return JSON.parse(content);
  } else {
    return {};
  }
};

export default class OpenSeaApi implements Api {
  async fetchAssets(params: FetchAssets) {
    const { owner = "" } = params;
    let payload;
    try {
      payload = await axios.get(
        `${CORS_ANYWHERE}${ITEMS_ENDPOINT}?owner=${owner}`
      );
    } catch (error) {
      console.error(error);
    } finally {
      return parseResponse(payload) || {};
    }
  }

  async getTokenMetadata(itemId: string) {
    if (!itemId) {
      // TODO : better error handling
      return {};
    }

    let data = {};

    try {
      data = await axios.get(
        `${CORS_ANYWHERE}${ITEMS_ENDPOINT}/${itemId}/meta`
      );
    } catch (error) {
      console.error(error);
    }

    return data;
  }

  async getTokensByOwner(owner: string): Promise<NormalizedAsset[]> {
    const assets = await this.fetchAssets({
      owner,
    });

    const getTokenWithMetadata = assets.items.map(async (item: any) => {
      const metadata = await this.getTokenMetadata(item.id);
      return {
        ...parseResponse(metadata),
        token: item.token,
        tokenId: item.tokenId,
        creator: item.creator,
        owner,
      };
    });

    const normalizedTokens = (await Promise.all(getTokenWithMetadata)).map(
      (data) => {
        return RaribleParser.normalizeRaribleAsset(data);
      }
    );

    console.log(`rarible tokens from ${owner}`, normalizedTokens);
    return normalizedTokens;
  }
}
