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

//Sound
//import OpenSeaApi from "../providers/opensea/openSeaApi";


function Gallery() {
    const { owneraddress } = useParams<{ owneraddress: string }>();

    const [assets, setAssets] = useState<NormalizedAsset[]>([]);

    useEffect(() => {
        let api = new RaribleApi();
        api
            .getTokensByOwner(owneraddress)
            .then((tokens: any) => {
                console.log(`tokens`, tokens);
                setAssets(tokens);
            })
            .catch((error: any) => {
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
