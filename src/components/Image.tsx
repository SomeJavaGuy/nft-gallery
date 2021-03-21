import { useMemo } from "react";
import * as THREE from "three";
import { position } from "../types/position";
import GifLoader from "./loaders/gif-loader";

export type ImageProps = {
  isGIF: boolean,
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
};

const Image: React.FC<ImageProps> = ({ innerRef, isGIF, url, position, args, ...props }) => {
  //var texture;

  const texture = useMemo(() => {
    if (isGIF) {
      /*
      console.log(isGIF + "Is GIF " + url)
      return new GifLoader().load(
        // resource URL
        url,

        // onLoad callback
        function (reader: any) {
          // You probably don't need to set onLoad, as it is handled for you. However,
          // if you want to manipulate the reader, you can do so here:
          console.log(reader.numFrames());
        },

        // onProgress callback
        function (xhr: any) {
          console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
        },

        // onError callback
        function () {
          console.error('An error happened.');
        }
      )
      */
    } else {
      return new THREE.TextureLoader().load(url);
    }
  }, [url, isGIF])



  if (args) {
    console.log("width " + args[0])
    console.log("height " + args[1])
  }

  return (
    <mesh ref={innerRef} position={position}>
      <planeBufferGeometry attach="geometry" args={args} />
      <meshBasicMaterial attach="material" map={texture} needsUpdate={true} />
    </mesh>
  );
};

export default Image;
