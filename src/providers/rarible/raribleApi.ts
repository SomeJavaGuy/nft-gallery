import axios from "axios";
import Api from "../api";

type FetchAssets = {
  params: {
    owner?: string;
  };
};

export default class OpenSeaApi implements Api {
  async fetchAssets(params: FetchAssets) {
    let payload;
    try {
      payload = await axios.get(
        `http://api.rarible.com/protocol/ethereum/nft/indexer/v1/items`,
        {
          params,
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      return payload || {};
    }
  }

  async getTokensByOwner(owner: string): Promise<any[]> {
    const assets = await this.fetchAssets({
      params: { owner },
    });
    console.log("assets", assets);
    // @ts-ignore
    return assets.items;
  }
}
