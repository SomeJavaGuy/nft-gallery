import { NormalizedAsset } from "../../types/normalizedAsset";
import { Provider } from "../../types/provider";

export default class SuperRareParser {
  static normalizeSuperRareAsset(asset: any): NormalizedAsset {
    const {
      contractAddress,
      creator,
      image,
      url,
      owner,
      name,
      id,
      description,
    } = asset;

    return {
      creator: { address: creator?.address },
      provider: Provider.SUPER_RARE,
      owner: { address: owner?.address },
      token_id: id,
      asset_contract: { address: contractAddress },
      description,
      name,
      image_url: image,
      external_link: url,
    };
  }
}
