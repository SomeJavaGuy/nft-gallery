import axios from "axios";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "react-three-fiber";
import * as THREE from "three";
import { Object3D } from "three";
import frames from "../config/frames";
import { Frames } from "../types/frames";
import { position } from "../types/position";
import FBXAsset, { FBXAssetProps } from "./FBXAsset";
import Image, { ImageProps } from "./Image";
import InfoPanel from "./InfoPanel";

const IMG_MAX_WIDTH = 2;
const IMG_MAX_HEIGHT = 1.5;

type FramedImageProps = {
  imageUrl: string;
  position: position;
  rotation: [x: number, y: number, z: number, order?: string | undefined];
  imageArgs: ImageProps["args"];
  //yFrameOffset: number;
  //zFrameOffset: number;
  frame: Frames;
  metadata: { [key: string]: string };
};

const FramedImage: React.FC<FramedImageProps> = ({
  imageUrl,
  imageArgs,
  position,
  rotation,
  //yFrameOffset,
  //zFrameOffset,
  frame,
  metadata,
  ...props
}) => {

  const [isLoading, setLoading] = useState(true);

  const [hover, setHover] = useState(false);

  const [frameScaleX, setFrameScaleX] = useState<number>(-1);
  const [frameScaleY, setFrameScaleY] = useState<number>(-1);

  const [width, setWidth] = useState<number>(-1);
  const [height, setHeight] = useState<number>(-1);

  const [scaleRatio, setScaleRatio] = useState<number>(-1);

  const [imageBase64, setImageBase64] = useState<any>(null);
  const [x, y, z] = position;
  const { path, infoXOffset, infoYOffset } = frames[frame];

  const { raycaster, camera } = useThree();

  const ref = useRef<Object3D>();

  console.log("FramedImage init")

  //Used to test if the pointer intersects with the current object (the test is made on the image object)
  useFrame(() => {
    if (ref.current) {
      raycaster.setFromCamera({ x: 0, y: 0 }, camera);
      var intersects = raycaster.intersectObject(ref.current)
      if (intersects.length > 0) {
        setHover(true);
      } else {
        setHover(false);
      }
    }
  })

  useEffect(() => {
    //Patch for IPFS protocal
    if (imageUrl.indexOf("ipfs://ipfs/") > -1) {
      imageUrl = imageUrl.replace("ipfs://ipfs/", "https://ipfs.io/ipfs/");
    }

    console.log("Loading image " + imageUrl + " " + metadata["Name"]);

    axios.get(imageUrl, {
      responseType: 'arraybuffer'
    })
      .then(function (response) {
        //Convert image binary to base64 then create local base64 image
        let base64 = Buffer.from(response.data, 'binary').toString('base64')
        const img = new window.Image();
        img.onload = function () {
          var width = (this as any).width;
          var height = (this as any).height;
          //Evaluate current image ratio based on max width and max height
          var hRatio = height / IMG_MAX_HEIGHT;
          var wRatio = width / IMG_MAX_WIDTH;
          console.log("hRatio " + hRatio + " " + metadata["Name"]);
          console.log("wRatio " + wRatio + " " + metadata["Name"]);
          var scaleRatio = 1;
          if (hRatio >= wRatio && hRatio > 1) {
            scaleRatio = 1 / hRatio;
          } else if (wRatio > hRatio && wRatio > 1) {
            scaleRatio = 1 / wRatio;
          }
          setWidth(width);
          setHeight(height);
          setScaleRatio(scaleRatio);
          setFrameScaleX(0.036 * scaleRatio * width);
          setFrameScaleY(0.027 * scaleRatio * height);
          setImageBase64(img.src);
          setLoading(false);
        }
        img.src = 'data:image/png;base64,' + base64;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        setLoading(false);
      })
  }, []);

  if (isLoading || width == -1 || height == -1 || scaleRatio == -1 || frameScaleX == -1 || frameScaleY == -1 || !imageBase64) {
    return <mesh />;
  }

  //console.log("w " + width + " h " + height);

  return (

    <Suspense fallback={null}>
      {hover && (
        <InfoPanel
          position={[x - infoXOffset, y - (height && scaleRatio ? (height * scaleRatio) / 2 : 1), z]}
          info={metadata}
        />
      )}
      <mesh>
        <Image innerRef={ref} rotation={rotation} position={[x, y, z]} url={imageBase64} args={[
          (width && scaleRatio ? width * scaleRatio : 1),
          (height && scaleRatio ? height * scaleRatio : 1),
        ]} />
        <FBXAsset
          rotation={rotation}
          scale={[frameScaleX, frameScaleY, 0.05]}
          url={path}
          position={[x, y - (height && scaleRatio ? (height * scaleRatio / 2) + (72 * scaleRatio) : 0), z]}
        />
      </mesh>
    </Suspense>
  );
};

export default FramedImage;
