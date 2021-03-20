import { useEffect, useState } from "react";
// import RaribleApi from "../../providers/rarible/raribleApi";
import ZoraApi from "../../providers/theGraph/zora";

const ProviderTest = () => {
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    let api = new ZoraApi();
    api
      .getTokensByOwner("0x7a6f726121030cadf9923333d5b6f29277024027")
      .then((tokens: any) => {
        console.log(`tokens`, tokens);
        setAssets(tokens);
      })
      .catch((error: any) => {
        console.error(error);
        alert("Can't load owner's token");
      });
  }, []);

  return (
    <div>
      {assets?.length > 0 &&
        assets.map((asset) => JSON.stringify(asset, null, 2))}
    </div>
  );
};

export default ProviderTest;
