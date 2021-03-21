import { useMemo } from "react";
import * as THREE from "three";
import { position } from "../types/position";

export type ImageProps = {
  innerRef?: any;
  url: string;
  position: position;
  args:
  | [
    width?: number | undefined,
    height?: number | undefined,
    widthSegments?: number | undefined,
    heightSegments?: number | undefined
  ]
  | undefined;
  rotation: any;
};

const Image: React.FC<ImageProps> = ({ innerRef, url, position, args, rotation }) => {
  const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);
  
  if (args) {
    console.log("width " + args[0])
    console.log("height " + args[1])
  }

  return (
    <mesh rotation={rotation} ref={innerRef} position={position}>
      <planeBufferGeometry attach="geometry" args={args} />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
};

export default Image;
