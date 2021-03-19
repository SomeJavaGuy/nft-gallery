import { useEffect, useState } from "react";
import RaribleApi from "../../providers/rarible/raribleApi";

const ProviderTest = () => {
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    let api = new RaribleApi();
    api
      .getTokensByOwner("0x492c6cef17ae4ed70a1a09b21126c3e2e091febb")
      .then((tokens: any) => {
        setAssets(tokens);
      })
      .catch((error: any) => {
        console.error(error);
        alert("Can't load owner's token");
      });
  }, []);

  return (
    <div>
      {assets?.length > 0 && assets.map((asset) => JSON.stringify(asset))}
    </div>
  );
};

export default ProviderTest;
