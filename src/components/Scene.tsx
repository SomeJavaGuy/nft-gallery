import { useEffect, useState } from "react";
import { useThree } from "react-three-fiber";
import * as THREE from 'three';
import { Object3D } from "three";
import Box from "./Box";


//Used to size the scene depending on the number of assets
const SCALE_PER_ASSET = 2.6;
const LENGTH_PER_ASSET = 1.3;

const Scene = ({ name, assets }: any) => {

    const { scene } = useThree();

    const loader = new THREE.ObjectLoader();

    const [model, setModel] = useState<any | null>(null);

    useEffect(() => {
        const loadModel = loader.loadAsync(`/assets/gfx/editor/${name}`);

        //If we need a texture
        var textureLoader = new THREE.TextureLoader();
        var loadTexture = textureLoader.loadAsync('/assets/gfx/textures/marble.jpg');


        /*
        var generateBox = (position: any, scale: any) => {
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
            cube.position.set(position.x, position.y, position.z);
            cube.scale.set(scale.x, scale.y, scale.z);
        }
        */

        var generatePointLight = (initialObject: Object3D, position: any) => {
            var light = initialObject.clone();
            light.position.set(position.x, position.y, position.z);
            scene.add(light);
        }

        Promise.all([loadModel, loadTexture]).then(
            ([loadedModel, loadedTexture]) => {


                loadedModel.traverse((o) => {
                    console.log(o.name);

                    if (o.name == "floor") {
                        console.log("Assigning floor texture");
                        let material = (o as any).material;
                        material.map = loadedTexture;

                        loadedTexture.wrapS = THREE.RepeatWrapping;
                        loadedTexture.wrapT = THREE.RepeatWrapping;
                        loadedTexture.repeat.x = assets.length * SCALE_PER_ASSET * 0.2;
                        loadedTexture.repeat.y = 2;

                        o.scale.x = o.scale.x + (assets.length * SCALE_PER_ASSET);
                        o.scale.z = o.scale.z + (assets.length * SCALE_PER_ASSET);
                    }

                    if (o.name == "leftwall") {
                        //console.log("Left wall");
                        o.scale.z = o.scale.z + (assets.length * SCALE_PER_ASSET);
                    }

                    if (o.name == "rightwall") {
                        //console.log("Right wall");
                        o.scale.z = o.scale.z + (assets.length * SCALE_PER_ASSET);
                    }

                    if (o.name == "frontwall") {
                        //console.log("Front wall");
                        o.position.x = o.position.x + (assets.length * LENGTH_PER_ASSET);
                    }

                    if (o.name == "backwall") {
                        //console.log("Front wall");
                    }

                    if (o.name == "PointLight") {
                        //console.log("Front wall");

                        var position = { x: o.position.x, y: o.position.y, z: o.position.z };
                        for (var i = 0; i < assets.length/5; i++) {
                            position.x += 6;
                            generatePointLight(o, position);
                        }

                    }

                });


                //loadedModel.position.y = -95;

                //Depending on the number of assets, resize the scene accordingly
                console.log("Count of assets of the scene " + assets.length);

                setModel(loadedModel);
            },
        );
    }, []);

    return model ? <primitive object={model} dispose={null} /> : null;
}

export default Scene;