import { useFBX } from "@react-three/drei";
import { useMemo } from "react";
import { PrimitiveProps } from "react-three-fiber";

export type FBXAssetProps = Omit<PrimitiveProps, "object"> & { url: string };

const FBXAsset: React.FC<FBXAssetProps> = ({ url, ...props }) => {
  const fbx = useFBX(url);

  const copiedObj = useMemo(() => fbx.clone(), [fbx])
  
  return <primitive {...props} object={copiedObj} dispose={null} />;
};

export default FBXAsset;
