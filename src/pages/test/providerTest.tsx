import { useEffect, useState } from "react";
import SuperRareApi from "../../providers/superRare/superRareApi";
import RaribleApi from "../../providers/rarible/raribleApi";
import ZoraApi from "../../providers/theGraph/zora";
import { useParams } from "react-router-dom";
import TwitterShare from "../../components/TwitterShare";

const supportedProviders = {
  zora: ZoraApi,
  rarible: RaribleApi,
  superrare: SuperRareApi,
};

const ProviderTest = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const { owner, provider } = useParams<{
    owner: string;
    provider: keyof typeof supportedProviders;
  }>();

  useEffect(() => {
    // @ts-ignore
    if (!supportedProviders[provider]) {
      alert("protocol not supported");
      return;
    }

    if (!owner) {
      alert("Missing owner address");
      return;
    }
    const Api = supportedProviders[provider];
    let api = new Api();
    api
      .getTokensByOwner(owner)
      .then((tokens: any) => {
        console.log(`tokens`, tokens);
        setAssets(tokens);
      })
      .catch((error: any) => {
        console.error(error);
        alert("Can't load owner's tokens");
      });
  }, [owner, provider]);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, auto)",
          gridTemplateRows: "auto",
        }}
      >
        {assets?.length > 0 &&
          assets.map((asset) => (
            <div key={asset.name}>
              <img src={asset.image_url} alt="" style={{ width: "100px" }} />
              <p>{asset.name}</p>
            </div>
          ))}
      </div>
      <TwitterShare />
    </>
  );
};

export default ProviderTest;
