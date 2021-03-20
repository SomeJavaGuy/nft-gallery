import * as THREE from "three";
import React, { useEffect, useState } from "react";
import { Canvas } from "react-three-fiber";
import { Sky, Stats } from "@react-three/drei";
import { useParams } from "react-router-dom";

import Scene from "../components/Scene";
import { Frames } from "../types/frames";
import FPSCamera from "../components/FPSCamera";
import Instructions from "../components/instructions/Instructions";
import { NormalizedAsset } from "../types/normalizedAsset";

import RaribleApi from "../providers/rarible/raribleApi";
import FramedImage from "../components/FramedImage";

//Sound
//import OpenSeaApi from "../providers/opensea/openSeaApi";


function Gallery() {
    const { owneraddress } = useParams<{ owneraddress: string }>();

    const [assets, setAssets] = useState<NormalizedAsset[]>([]);

    var i = 0;
    useEffect(() => {
        let api = new RaribleApi();
        api
            .getTokensByOwner(owneraddress)
            .then((tokens: NormalizedAsset[]) => {

                var count = 0;
                console.log(`tokens not tfiltered`, tokens);
                tokens = tokens.filter((asset) => {
                    count++;
                    //DEBUG: HARD LIMIT SET TO 5
                    if (count > 10)
                        return false;

                    return asset.image_url != null && typeof asset.image_url != "undefined"
                })
                console.log(`tokens filtered`, tokens);
                setAssets(tokens);
            })
            .catch((error: NormalizedAsset[]) => {
                console.error(error);
                alert("Can't load owner's token");
            });
    }, [owneraddress]);

    return (
        <div style={{ height: "100vh" }}>
            <Instructions />
            <Canvas
                colorManagement
                shadowMap
                onCreated={({ gl, camera }) => {
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.shadowMap.type = THREE.PCFSoftShadowMap;
                }}
            >
                {/*
      Managed in the scene for now*/}
                {/* <ambientLight />
      <pointLight position={[10, 10, 10]} /> */}


                {assets?.length > 0 &&
                    assets.map((asset) => (
                        <FramedImage
                            key={asset.token_id}
                            imageUrl={asset.image_url || "TODO DEFAULT IMAGE PLACEHOLDER MEME"}
                            imageArgs={[
                                /*
                                //TODO: Directly calculated in the FramedImage object
                                hashmasks.ratio.width / hashmasks.frames[170336].scale,
                                hashmasks.ratio.height / hashmasks.frames[170336].scale,
                                */
                            ]}
                            frame={Frames.BIG_170336}
                            /*
                             //TODO: Directly calculated in the FramedImage object
                            yFrameOffset={collections.hashmasks.frames[170336].yOffset}
                            zFrameOffset={collections.hashmasks.frames[170336].zOffset}
                            */
                            position={[i += 3.5, 1.10, 0]}
                            metadata={{
                                "Name": asset.name || "",
                                "Bid": asset.last_sale?.payment_token + " Ξ",
                            }}
                        />
                    ))
                }

                <Sky inclination={0.49} rayleigh={4.3} turbidity={8.4} />

                <FPSCamera
                    mouseMoveSensitivity={0.0015}
                    speed={20.0}
                    jumpHeight={80.0}
                    height={1}
                ></FPSCamera>

                {/* TODO: Disable stats in prod */}
                <Stats showPanel={0} />
                <Scene name={"scene_room_test.json"} />
            </Canvas>
        </div>
    );
}

export default Gallery;
