import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "react-three-fiber";
import { Loader, Sky, Stats, useProgress } from "@react-three/drei";
import { useParams } from "react-router-dom";
import ReactGA from "react-ga";
import { MathUtils } from "three";

import Scene from "../components/Scene";
import { Frames } from "../types/frames";
import FPSCamera from "../components/FPSCamera";
import Instructions from "../components/instructions/Instructions";
import { NormalizedAsset } from "../types/normalizedAsset";

import RaribleApi from "../providers/rarible/raribleApi";
import FramedImage from "../components/FramedImage";
import TwitterShare from "../components/TwitterShare";

//Sound
//import OpenSeaApi from "../providers/opensea/openSeaApi";

const MAX_NUMBER_ASSETS = 12;

function Gallery() {
  const { owneraddress } = useParams<{ owneraddress: string }>();

  const [assets, setAssets] = useState<NormalizedAsset[]>([]);
  const numberOfLoadedFrames = useRef(0);
  const { loaded, total, progress } = useProgress();

  var i = -3;
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);

    let api = new RaribleApi();
    api
      .getTokensByOwner(owneraddress)
      .then((tokens: NormalizedAsset[]) => {
        var count = 0;
        console.log(`tokens not tfiltered`, tokens);
        tokens = tokens.filter((asset) => {
          //DEBUG: HARD LIMIT SET TO 5

          if (count > MAX_NUMBER_ASSETS) return false;

          count++;
          return (
            asset.image_url != null && typeof asset.image_url != "undefined"
          );
        });
        console.log(`tokens filtered`, tokens);
        setAssets(tokens);
      })
      .catch((error: NormalizedAsset[]) => {
        console.error(error);
        alert("Can't load owner's token");
      });
  }, [owneraddress]);

  var spawnLeftSide = true;

  return (
    <div style={{ height: "100vh" }}>
      {MAX_NUMBER_ASSETS <= numberOfLoadedFrames.current && <Instructions />}
      <Canvas
        colorManagement
        shadowMap
        onCreated={({ gl, camera }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        {assets?.length > 0 &&
          assets.map((asset) => (
            <FramedImage
              key={asset.token_id}
              imageUrl={
                asset.image_url || "TODO DEFAULT IMAGE PLACEHOLDER MEME"
              }
              imageArgs={
                [
                  /*
                                //TODO: Directly calculated in the FramedImage object
                                hashmasks.ratio.width / hashmasks.frames[170336].scale,
                                hashmasks.ratio.height / hashmasks.frames[170336].scale,
                                */
                ]
              }
              frame={Frames.BIG_170336}
              /*
                             //TODO: Directly calculated in the FramedImage object
                            yFrameOffset={collections.hashmasks.frames[170336].yOffset}
                            zFrameOffset={collections.hashmasks.frames[170336].zOffset}
                            */
              position={[
                (i += 1.5),
                1.2,
                (spawnLeftSide = !spawnLeftSide) ? -4.55 : 4.55,
              ]}
              rotation={[0, spawnLeftSide ? 0 : MathUtils.degToRad(180), 0]}
              metadata={{
                Name: asset.name || "",
                Bid: asset.last_sale?.payment_token + " Ξ",
              }}
              onLoad={() => {
                numberOfLoadedFrames.current = numberOfLoadedFrames.current + 1;
              }}
            />
          ))}

        <Sky inclination={0.49} rayleigh={4.3} turbidity={8.4} />
        <FPSCamera
          mouseMoveSensitivity={0.0015}
          speed={20.0}
          jumpHeight={80.0}
          height={1}
        ></FPSCamera>

        {/* TODO: Disable stats in prod */}
        <Stats showPanel={0} />

        {assets?.length > 0 && (
          <Scene name={"scene_room_test.json"} assets={assets} />
        )}
      </Canvas>
      <Loader
        innerStyles={{ backgroundColor: "black" }}
        containerStyles={{ opacity: 0.9 }}
      />
      <TwitterShare
        style={{
          position: "absolute",
          top: "12px",
          zIndex: 99999,
          right: "15px",
        }}
      />
    </div>
  );
}

export default Gallery;
