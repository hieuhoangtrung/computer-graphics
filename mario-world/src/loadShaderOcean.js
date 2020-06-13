import {renderer,scene,camera} from './scene';

import { Ocean } from 'three/examples/jsm/misc/Ocean';
import { globalObject } from "./scene";

var lastTime =  new Date() .getTime();

var ms_Ocean = null;

function updateSea() {
    var currentTime = new Date().getTime();
    ms_Ocean.deltaTime = (currentTime - lastTime) / 1000 || 0.0;
    lastTime = currentTime;
    ms_Ocean.render(ms_Ocean.deltaTime);
    ms_Ocean.overrideMaterial = ms_Ocean.materialOcean;

    ms_Ocean.exposure = globalObject.sun.position.y * 0.5 / 1500;

    ms_Ocean.materialOcean.uniforms[ "u_size" ].value = ms_Ocean.size;
    ms_Ocean.materialOcean.uniforms[ "u_sunDirection" ].value.set(ms_Ocean.sunDirectionX, ms_Ocean.sunDirectionY, ms_Ocean.sunDirectionZ);
    ms_Ocean.materialOcean.uniforms[ "u_exposure" ].value = ms_Ocean.exposure;

}

function initSea() {

  var gsize = 2560;
  var res = 1024;
  var gres = res / 2;
  var origx = - gsize / 2;
  var origz = - gsize / 2;
  ms_Ocean = new Ocean(renderer, camera, scene,
      {
          USE_HALF_FLOAT: false,
          INITIAL_SIZE: 1280,
          INITIAL_WIND: [ 10.0, 10.0 ],
          INITIAL_CHOPPINESS: 1.5,
          CLEAR_COLOR: [ 1.0, 1.0, 1.0, 0.0 ],
          GEOMETRY_ORIGIN: [ origx, origz ],
          SUN_DIRECTION: [ - 1.0, 1.0, 1.0 ],
          OCEAN_COLOR: new THREE.Vector3(0.004, 0.016, 0.047),
          SKY_COLOR: new THREE.Vector3(3.2, 9.6, 12.8),
          EXPOSURE: 0.35,
          GEOMETRY_RESOLUTION: gres,
          GEOMETRY_SIZE: gsize,
          RESOLUTION: res
      });

      ms_Ocean.materialOcean.uniforms[ "u_projectionMatrix" ] = { value: camera.projectionMatrix };
      ms_Ocean.materialOcean.uniforms[ "u_viewMatrix" ] = { value: camera.matrixWorldInverse };
      ms_Ocean.materialOcean.uniforms[ "u_cameraPosition" ] = { value: camera.position };
      ms_Ocean.oceanMesh.castShadow = true;
      ms_Ocean.oceanMesh.receiveShadow = true;
      scene.add(ms_Ocean.oceanMesh);
}

export{initSea,updateSea}
