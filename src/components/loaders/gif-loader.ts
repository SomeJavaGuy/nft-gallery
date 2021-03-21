import { FileLoader } from 'three/src/loaders/FileLoader';
import { DefaultLoadingManager } from 'three/src/loaders/LoadingManager';
import GifTexture from './gif-texture';
import { GifReader } from 'omggif';

export default class GifLoader {

  manager;
  crossOrigin;
  path: any;

  constructor(manager?: any) {
    this.manager = manager || DefaultLoadingManager;
    this.crossOrigin = 'anonymous';
  }

  load(url: any, onLoad: any, onProgress: any, onError: any) {
    const texture = new GifTexture();

    const loader = new FileLoader(this.manager);
    loader.setPath(this.path);
    loader.setResponseType('arraybuffer');

    loader.load(url, (response: any) => {
      //const gifData = new Uint8Array(response);
      //Buffer b = Buffer.from(response);
      const reader = new GifReader(Buffer.from(response));

      texture.setReader(reader);

      if (onLoad) onLoad(reader);
    }, onProgress, onError);

    return texture;
  }

  setPath(value: any) {
    this.path = value;
    return this;
  }
}
