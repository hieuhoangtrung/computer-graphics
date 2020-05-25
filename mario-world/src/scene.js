import grassGround from './images/grasslight-big.jpg';
import Stats from './shared/stats.module';
import { loadModels } from './loader';
import './shared/OrbitControls';
import { DirectionalLightHelper } from 'three';
import { CSS2DRenderer, CSS2DObject } from  './shared/CSS2DRenderer'


const onWindowResize = ({ camera, renderer }) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

}


const animate = ({ camera, clock, renderer, stats, scene, labelRenderer, dirLight }, worldObject) => {
  requestAnimationFrame(() => animate({ camera, clock, renderer, stats, scene, labelRenderer, dirLight}, worldObject));

  const delta = clock.getDelta();
  if (worldObject.marioAnimation) worldObject.marioAnimation.update(delta);
  if (worldObject.castle) worldObject.castle.update(delta);
  //if (worldObject.star) worldObject.star.update(delta);
  // Always set camera follow mario
  // if (worldObject.mario) {
  //   const temp = new THREE.Vector3();
  //   temp.set(worldObject.mario.position.x, worldObject.mario.position.y + 20, worldObject.mario.position.z - 50);
  //   camera.position.lerp(temp, 1);
  //   camera.lookAt(worldObject.mario.position);
  // }

  var time = Date.now() * 0.005;
  dirLight.position.z = Math.cos( time ) * 100 + 100;

  renderer.render(scene, camera);
  labelRenderer.render( scene, camera );
  stats.update();

}

const init = () => {
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  const scene = new THREE.Scene();
  const stats = new Stats();
  const clock = new THREE.Clock();
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  var labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize( window.innerWidth, window.innerHeight );
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0px';
  document.body.appendChild( labelRenderer.domElement );
  var controls2 = new THREE.OrbitControls( camera, labelRenderer.domElement );

  const container = document.createElement('div');

  const globalObject = {
    camera,
    scene,
    controls,
    clock,
    renderer,
    stats,
    labelRenderer,
    controls2,
  };

  const worldObject= {};

  document.body.appendChild(container);

  camera.position.set(100, 200, 300);

  scene.background = new THREE.Color(0x87ceeb);
  // scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);


//Light
  var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
  scene.add( hemiLight );

  var dirLight = new THREE.DirectionalLight( 0xFFEE88, 5 );
  dirLight.position.set( -50, 75, 0 );

  scene.add( dirLight );

  dirLight.castShadow = true;
  dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024*2;

  var d = 300;

  dirLight.shadowCameraLeft = -d;
  dirLight.shadowCameraRight = d;
  dirLight.shadowCameraTop = d;
  dirLight.shadowCameraBottom = -d;

  dirLight.shadowCameraFar = 3500;
  // dirLight.shadowBias = -0.0001;
  dirLight.shadowDarkness = 100;
  globalObject.dirLight = dirLight;
  var lighthelper = new DirectionalLightHelper(dirLight, 50, 0xff0000);
  scene.add(lighthelper)


/*
  var sunGeometry = new THREE.SphereBufferGeometry(20, 16, 8);
  var sunMat = new THREE.MeshStandardMaterial({
    emissive: 0xffee88,
    emissiveIntensity: 1,
    color: 0xffee88
  });
  var sun = new THREE.Mesh(sunGeometry, sunMat);
  var sunlight = new THREE.PointLight(0xffee88,1,100000000,1);

  sunlight.add( sun );
  sunlight.power = 400;
  sunlight.shadowDarknes = 10;
  sunlight.position.set( 0, 400, 20 );
  sunlight.castShadow = true;

  sunlight.shadow.mapSize.width = 2048;
  sunlight.shadow.mapSize.height = 2048;
  sunlight.shadow.camera.near = 0.5;
  sunlight.shadow.camera.far = 1000;
  // sunlight.shadow.bias = - 0.005;

  scene.add( sunlight );

  const sunhelper = new THREE.CameraHelper( sunlight.shadow.camera );
  scene.add( sunhelper );
  */

  // ground
  /*
  var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);
  */
  var texttureLoader = new THREE.TextureLoader();
  var groundTexture = texttureLoader.load(grassGround);
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(25, 25);
  groundTexture.anisotropy = 16;
  groundTexture.encoding = THREE.sRGBEncoding;
  var groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
  var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial);
  mesh.position.y =0;
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  loadModels(globalObject, worldObject);

  container.appendChild(renderer.domElement);

  controls.target.set(0, 100, 0);
  controls.update();

  window.addEventListener('resize', () => onWindowResize({camera, renderer }), false);

  container.appendChild(stats.dom);
  animate(globalObject, worldObject);
}

export { init }
