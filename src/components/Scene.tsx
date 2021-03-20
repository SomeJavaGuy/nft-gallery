import { useEffect, useState } from "react";
import * as THREE from 'three';

const Scene = ({ name }: any) => {

    const loader = new THREE.ObjectLoader();

    const [model, setModel] = useState<any | null>(null);

    useEffect(() => {
        const loadModel = loader.loadAsync(`/assets/gfx/editor/${name}`);

        //If we need a texture
        var textureLoader = new THREE.TextureLoader();
        var loadTexture = textureLoader.loadAsync('/assets/gfx/textures/marble.jpg');

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
                        loadedTexture.repeat.x = 5;
                        loadedTexture.repeat.y = 5;
                    }
                });

                //loadedModel.position.y = -95;


                setModel(loadedModel);
            },
        );
    }, []);

    return model ? <primitive object={model} dispose={null} /> : null;
}

export default Scene;