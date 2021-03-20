import axios from "axios";
import Api from "../api";
import { NormalizedAsset } from "../../types/normalizedAsset";
import SuperRareParser from "./superRareParser";

type FetchAssets = {
  owner?: string;
};

// const CORS_ANYWHERE = "https://api.allorigins.win/get?url=";
const ASSETS_ENDPOINT = "https://superrare.co/sr-json/v0/nfts/assets";

export default class SuperRareApi implements Api {
  async fetchAssets(params: FetchAssets) {
    const { owner = "" } = params;
    const owner_addresses = owner;
    let payload;
    try {
      payload = await axios.get(ASSETS_ENDPOINT, {
        params: { owner_addresses },
      });
    } catch (error) {
      console.error(error);
    } finally {
      return payload?.data || {};
    }
  }

  async getTokensByOwner(owner: string): Promise<NormalizedAsset[]> {
    const assets = await this.fetchAssets({
      owner,
    });

    const normalizedTokens = assets.map(
      SuperRareParser.normalizeSuperRareAsset
    );

    return normalizedTokens;
  }
}
