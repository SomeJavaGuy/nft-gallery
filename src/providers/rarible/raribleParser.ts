import { NormalizedAsset } from "../../types/normalizedAsset";
import { Provider } from "../../types/provider";

export default class RaribleParser {
  static normalizeRaribleAsset(asset: any): NormalizedAsset {
    const {
      tokenId,
      owner,
      token,
      description,
      external_url,
      image,
      name,
      creator,
      attributes,
    } = asset;

    return {
      creator: { address: creator },
      provider: Provider.RARIBLE,
      owner: { address: owner },
      token_id: tokenId,
      asset_contract: { address: token },
      description,
      name,
      image_url: image,
      external_link: external_url,
    };
  }
}
