import { Provider } from "./provider";

export type NormalizedAsset = {
  provider: Provider;
  creator: { address: string };
  owner: { address: string };
  collection?: { name: string; slug: string } | null;
  token_id: string | null;
  name: string | null;
  description: string | null;
  image_url: string | null;
  image_preview_url?: string | null;
  image_thumbnail_url?: string | null;
  image_original_url?: string | null;
  background_color?: string | null;
  external_link: string | null;
  asset_contract?: {
    address: string;
  };
  last_sale?: {
    total_price: string;
    payment_token: {
      symbol: string;
      decimals: number;
    };
  };
};
