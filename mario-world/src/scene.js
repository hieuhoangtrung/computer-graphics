import grassGround from "./images/grasslight-big.jpg";
import sunSurface from "./images/sun.jpg";
import seaSurface from "./images/seaTextyure.jpg";
import bridgeSurface from "./images/bridge.jpg";
import Stats from "./shared/stats.module";
import { loadModels, addAnimatedMario, addCoins } from "./loader";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { registerEvents } from './registerEvent';
import { handleCollisionWithEnemy, handleGetCoin, handleGetMushroom } from './collision';
import { loadSounds } from './loadSounds';

// main three js objects
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const controls = new PointerLockControls(camera, document.body);
const clock = new THREE.Clock();
const stats = new Stats();
const raycaster = new THREE.Raycaster(
  new THREE.Vector3(),
  new THREE.Vector3(0, -1, 0),
  0,
  10
);

// global objects
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const moveForward = false;
const moveBackward = false;
const moveLeft = false;
const moveRight = false;
const canJump = false;

const globalObject = {
  velocity,
  direction,
  moveForward,
  moveBackward,
  moveLeft,
  moveRight,
  canJump,
};

const worldObject = {};

const animate = (
  globalObject,
  worldObject
) => {
  requestAnimationFrame(() =>
    animate(globalObject,
      worldObject
    )
  );

  const {
    dirLight,
    sun,
    velocity,
    moveForward,
    direction,
    moveRight,
    moveBackward,
    moveLeft,
    marioAnimatioMixer,
  } = globalObject;

  if (controls.isLocked) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;
    const intersections = raycaster.intersectObjects(Object.values(worldObject));
    // console.log(intersections, 'intersections');
    const onObject = intersections.length > 0;
    // var delta = (time - prevTime) / 100;
    const delta = clock.getDelta();
    const vDelta = delta * 10;
    velocity.x -= velocity.x * 10.0 * vDelta;
    velocity.z -= velocity.z * 10.0 * vDelta;

    velocity.y -= 9.8 * 100.0 * vDelta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) {
      velocity.z -= direction.z * 40.0 * vDelta;
    }
    if (moveLeft || moveRight) {
      velocity.x -= direction.x * 40.0 * vDelta;
    }

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      globalObject.canJump = true;
    }

    controls.moveRight(-velocity.x * vDelta);
    controls.moveForward(-velocity.z * vDelta);

    // controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;

      globalObject.canJump = true;
    }
    if (marioAnimatioMixer) {
      marioAnimatioMixer.update(delta);
    }

    // handle collision;
    handleCollisionWithEnemy();
    handleGetCoin();
    handleGetMushroom();
  }
  var time = Date.now() * 0.000003;

  var wall1x = +50 * Math.sin(time * 150);
  var wall2x = -50 * Math.sin(time * 150);

  if (worldObject.moveingwall1) {
    worldObject.moveingwall1.position.set(-700 + wall1x, 33, 100);
  }

  // worldObject.moveingwall2.position.set(-700 + wall2x, 33, 350);
  // worldObject.moveingwall3.position.set(-700 + wall1x, 33, 600);
  // worldObject.moveingbox1.position.set(352 + wall1x, 220, 700);
  // worldObject.moveingbox2.position.set(325 + wall1x, 220, 700);
  // worldObject.moveingbox3.position.set(175 + wall2x, 220, 700);
  // worldObject.moveingbox4.position.set(148 + wall2x, 220, 700);

  var boxx = 390 * Math.sin(time * 100);
  var boxz = 390 * Math.cos(time * 100);

  // worldObject.moveingbox5.position.set(boxx, 43, boxz);
  // worldObject.moveingbox6.position.set(boxx, 70, -boxz);
  // worldObject.moveingbox7.position.set(-boxx, 97, boxz);
  // worldObject.moveingbox8.position.set(-boxx, 124, -boxz);

  var sunx = Math.sin(time);
  var sunz = Math.cos(time);

  dirLight.position.set(1500 * sunx, 500, 1500 * sunz);
  sun.position.set(1500 * sunx, 500, 1500 * sunz);

  renderer.render(scene, camera);
  stats.update();
};

const init = () => {
  camera.position.set(700, 70, 100);
  camera.rotation.y += Math.PI;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  scene.add(controls.getObject());
  scene.background = new THREE.Color(0x87ceeb);
  const container = document.createElement("div");
  document.body.appendChild(container);

  //Light
  var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  scene.add(hemiLight);

  var dirLight = new THREE.DirectionalLight(0xffee88, 5);
  dirLight.position.set(0, 300, 0);

  scene.add(dirLight);

  dirLight.castShadow = true;
  dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024 * 2;

  var d = 1500;

  dirLight.shadowCameraLeft = -d;
  dirLight.shadowCameraRight = d;
  dirLight.shadowCameraTop = d;
  dirLight.shadowCameraBottom = -d;

  dirLight.shadowCameraFar = 3500;
  // dirLight.shadowBias = -0.0001;
  dirLight.shadowDarkness = 100;
  globalObject.dirLight = dirLight;

  //Sun
  var texttureLoader = new THREE.TextureLoader();
  var sunTexture = texttureLoader.load(sunSurface);

  var sunGeometry = new THREE.SphereBufferGeometry(20, 16, 8);
  var sunMat = new THREE.MeshPhysicalMaterial({
    emissive: 0xff0000,
    emissiveIntensity: 5,
    map: sunTexture,
  });
  var sun = new THREE.Mesh(sunGeometry, sunMat);
  sun.position.set(0, 500, 0);
  sun.castShadow = false;
  sun.receiveShadow = false;
  globalObject.sun = sun;
  scene.add(sun);

  //grounds
  var groundTexture = texttureLoader.load(grassGround);
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(1, 1);
  groundTexture.anisotropy = 16;
  groundTexture.encoding = THREE.sRGBEncoding;

  var groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
  var groundGeometry1 = new THREE.CylinderBufferGeometry(200, 200, 100, 8);
  var groundGeometry2 = new THREE.TorusBufferGeometry(400, 100, 16, 100);
  var groundGeometry3 = new THREE.BoxBufferGeometry(200, 100, 1000);
  var groundGeometry4 = new THREE.BoxBufferGeometry(200, 100, 200);

  var ground1 = new THREE.Mesh(groundGeometry1, groundMaterial);
  var ground2 = new THREE.Mesh(groundGeometry2, groundMaterial);
  var ground3 = new THREE.Mesh(groundGeometry3, groundMaterial);
  var ground4 = new THREE.Mesh(groundGeometry3, groundMaterial);
  var ground5 = new THREE.Mesh(groundGeometry3, groundMaterial);
  var ground6 = new THREE.Mesh(groundGeometry3, groundMaterial);
  var ground7 = new THREE.Mesh(groundGeometry4, groundMaterial);
  var ground8 = new THREE.Mesh(groundGeometry4, groundMaterial);
  var ground9 = new THREE.Mesh(groundGeometry4, groundMaterial);
  var ground10 = new THREE.Mesh(groundGeometry4, groundMaterial);

  ground1.position.set(0, 0, 0);
  ground1.receiveShadow = true;
  ground1.castShadow = true;
  ground2.rotation.x = THREE.Math.degToRad(90);
  ground2.position.set(0, -50, 0);
  ground2.receiveShadow = true;
  ground2.castShadow = true;
  ground3.rotation.y = THREE.Math.degToRad(90);
  ground3.position.set(300, 0, 700);
  ground3.receiveShadow = true;
  ground3.castShadow = true;
  ground4.rotation.y = THREE.Math.degToRad(90);
  ground4.position.set(-300, 0, -700);
  ground4.receiveShadow = true;
  ground4.castShadow = true;
  ground5.position.set(-700, 0, 300);
  ground5.receiveShadow = true;
  ground5.castShadow = true;
  ground6.position.set(700, 0, -300);
  ground6.receiveShadow = true;
  ground6.castShadow = true;
  ground7.position.set(700, 0, 400);
  ground7.receiveShadow = true;
  ground7.castShadow = true;
  ground8.position.set(-700, 0, -400);
  ground8.receiveShadow = true;
  ground8.castShadow = true;
  ground9.position.set(-400, 0, 700);
  ground9.receiveShadow = true;
  ground9.castShadow = true;
  ground10.position.set(400, 0, -700);
  ground10.receiveShadow = true;
  ground10.castShadow = true;

  worldObject.ground1 = ground1;
  worldObject.ground2 = ground2;
  worldObject.ground3 = ground3;
  worldObject.ground4 = ground4;
  worldObject.ground5 = ground5;
  worldObject.ground6 = ground6;
  worldObject.ground7 = ground7;
  worldObject.ground8 = ground8;
  worldObject.ground9 = ground9;
  worldObject.ground10 = ground10;
  scene.add(
    ground1,
    ground2,
    ground3,
    ground4,
    ground5,
    ground6,
    ground7,
    ground8,
    ground9,
    ground10
  );

  //bridge
  var brigeTexture = texttureLoader.load(bridgeSurface);
  brigeTexture.wrapS = brigeTexture.wrapT = THREE.RepeatWrapping;
  brigeTexture.repeat.set(4, 4);
  brigeTexture.anisotropy = 16;
  brigeTexture.encoding = THREE.sRGBEncoding;

  var bridgeMaterial = new THREE.MeshLambertMaterial({ map: brigeTexture });
  var bridgeGeoMetry1 = new THREE.BoxBufferGeometry(100, 0.1, 150);
  var bridgeGeoMetry2 = new THREE.BoxBufferGeometry(100, 0.1, 350);
  var bridgeGeoMetry3 = new THREE.BoxBufferGeometry(100, 0.1, 220);
  var bridge1 = new THREE.Mesh(bridgeGeoMetry1, bridgeMaterial);
  var bridge2 = new THREE.Mesh(bridgeGeoMetry1, bridgeMaterial);
  var bridge3 = new THREE.Mesh(bridgeGeoMetry2, bridgeMaterial);
  var bridge4 = new THREE.Mesh(bridgeGeoMetry3, bridgeMaterial);
  var bridge5 = new THREE.Mesh(bridgeGeoMetry3, bridgeMaterial);
  var bridge6 = new THREE.Mesh(bridgeGeoMetry1, bridgeMaterial);
  var bridge7 = new THREE.Mesh(bridgeGeoMetry3, bridgeMaterial);
  var bridge8 = new THREE.Mesh(bridgeGeoMetry1, bridgeMaterial);
  var bridge9 = new THREE.Mesh(bridgeGeoMetry1, bridgeMaterial);

  bridge1.position.set(700, 50.2, 250);
  bridge1.receiveShadow = true;
  bridge1.castShadow = true;

  bridge2.rotation.y = THREE.Math.degToRad(90);
  bridge2.position.set(550, 50.2, -700);
  bridge2.receiveShadow = true;
  bridge2.castShadow = true;

  bridge3.rotation.y = THREE.Math.degToRad(150);
  bridge3.position.set(270, 50.2, -500);
  bridge3.receiveShadow = true;
  bridge3.castShadow = true;

  bridge4.position.set(0, 50.2, 280);
  bridge4.receiveShadow = true;
  bridge4.castShadow = true;

  bridge5.position.set(0, 50.2, -500);
  bridge5.receiveShadow = true;
  bridge5.castShadow = true;

  bridge6.rotation.y = THREE.Math.degToRad(90);
  bridge6.position.set(-250, 50.2, 700);
  bridge6.receiveShadow = true;
  bridge6.castShadow = true;

  bridge7.rotation.y = THREE.Math.degToRad(90);
  bridge7.position.set(-500, 50.2, 0);
  bridge7.receiveShadow = true;
  bridge7.castShadow = true;

  bridge8.position.set(-700, 50.2, -250);
  bridge8.receiveShadow = true;
  bridge8.castShadow = true;

  bridge9.position.set(700, 50.2, 550);
  bridge9.receiveShadow = true;
  bridge9.castShadow = true;

  worldObject.bridge1 = bridge1;
  worldObject.bridge2 = bridge2;
  worldObject.bridge3 = bridge3;
  worldObject.bridge4 = bridge4;
  worldObject.bridge5 = bridge5;
  worldObject.bridge6 = bridge6;
  worldObject.bridge7 = bridge7;
  worldObject.bridge8 = bridge8;
  worldObject.bridge9 = bridge9;
  scene.add(
    bridge1,
    bridge2,
    bridge3,
    bridge4,
    bridge5,
    bridge6,
    bridge7,
    bridge8,
    bridge9
  );

  // sea
  var seaTexture = texttureLoader.load(seaSurface);
  seaTexture.wrapS = seaTexture.wrapT = THREE.RepeatWrapping;
  seaTexture.repeat.set(25, 25);
  seaTexture.anisotropy = 16;
  seaTexture.encoding = THREE.sRGBEncoding;

  var seaMaterial = new THREE.MeshLambertMaterial({ map: seaTexture });
  var sea = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2000, 2000),
    seaMaterial
  );
  sea.position.y = -50;
  sea.rotation.x = -Math.PI / 2;
  sea.receiveShadow = true;
  worldObject.sea = sea;
  scene.add(sea);

  loadModels();
  addAnimatedMario();
  addCoins();
  registerEvents();
  loadSounds();

  container.appendChild(renderer.domElement);

  container.appendChild(stats.dom);
  animate(globalObject, worldObject);
};

export { init, scene, camera, renderer, controls, globalObject, worldObject };
