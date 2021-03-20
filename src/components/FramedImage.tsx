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
const IMG_MAX_HEIGHT = 3;

type FramedImageProps = {
  imageUrl: string;
  position: position;
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
  //yFrameOffset,
  //zFrameOffset,
  frame,
  metadata,
  ...props
}) => {
  const [hover, setHover] = useState(false);

  const [frameScaleX, setFrameScaleX] = useState<number>();
  const [frameScaleY, setFrameScaleY] = useState<number>();

  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  const [scaleRatio, setScaleRatio] = useState<number>();

  const [imageBase64, setImageBase64] = useState<any>();
  const [x, y, z] = position;
  const { path, infoXOffset, infoYOffset } = frames[frame];

  const { raycaster, camera } = useThree();

  const ref = useRef<Object3D>();

  //Used to test if the pointer intersects with the current object (the test is made on the image object)
  useFrame(() => {
    if (ref.current) {
      raycaster.setFromCamera({ x: 0, y: 0 }, camera);
      var intersects = raycaster.intersectObject(ref.current)
      if (intersects.length > 0) {
        //console.log("Does intersect")
        setHover(true);
      } else {
        // console.log("Does not intersect")
        setHover(false);
      }
    }
  })

  useEffect(() => {
    //Patch for IPFS protocal
    if (imageUrl.indexOf("ipfs://ipfs/") > -1) {
      imageUrl = imageUrl.replace("ipfs://ipfs/", "https://ipfs.io/ipfs/");
    }
    axios.get(imageUrl, {
      responseType: 'arraybuffer'
    })
      .then(function (response) {
        //Convert image binary to base64 then create local base64 image
        let base64 = Buffer.from(response.data, 'binary').toString('base64')
        const img = new window.Image();
        img.onload = function () {
          setWidth((this as any).width);
          setHeight((this as any).height);
          //alert((this as any).width + 'x' + (this as any).height);
          setImageBase64(img.src);

          //Evaluate current image ratio based on those max width and max height
          if (height && width) {
            var hRatio = height / IMG_MAX_HEIGHT;

            var wRatio = width / IMG_MAX_WIDTH;
            console.log("hRatio " + hRatio);
            console.log("wRatio " + wRatio);
            var scaleRatio = 1;
            if (hRatio > wRatio && hRatio > 1) {
              scaleRatio = 1 / hRatio;
            } else if (wRatio > hRatio && wRatio > 1) {
              scaleRatio = 1 / wRatio;
            }
            setScaleRatio(scaleRatio);
            console.log("scaleRatio " + scaleRatio);

            setFrameScaleX(0.036 * scaleRatio * width);
            setFrameScaleY(0.027 * scaleRatio * height);
          }
        }
        img.src = 'data:image/png;base64,' + base64;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  });


  //Resize frame scale (w and h) depending on image previous ratio
  //Display the info panel at the right place

  return (
    <Suspense fallback={null}>
      {hover && (
        <InfoPanel
          position={[x - infoXOffset, y - (height && scaleRatio ? (height * scaleRatio) / 2 : 1), z]}
          info={metadata}
        />
      )}
      <mesh >
        <Image innerRef={ref} position={[x, y, z]} url={imageBase64} args={[
          (width && scaleRatio ? width * scaleRatio : 1),
          (height && scaleRatio ? height * scaleRatio : 1),
        ]} />
        <FBXAsset
          scale={[frameScaleX, frameScaleY, 0.05]}
          url={path}
          position={[x, y - (height && scaleRatio ? (height * scaleRatio / 2) + (72 * scaleRatio) : 0), z]}
        />
      </mesh>
    </Suspense>
  );
};

export default FramedImage;
