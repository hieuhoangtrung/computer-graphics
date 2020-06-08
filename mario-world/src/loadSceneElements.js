import sunSurface from './images/sun.jpg';
import grassGround from './images/grasslight-big.jpg';
import bridgeSurface from './images/bridge.jpg';
import seaSurface from './images/seaTextyure.jpg';
import { globalObject, scene, worldObject} from './scene';

const texttureLoader = new THREE.TextureLoader();

function loadDirLight() {
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
}

function loadSun() {
  //Sun
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
}

function loadGround() {
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
}

function loadBridge() {
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
}

function loadSea() {
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
}

export { loadBridge, loadDirLight, loadGround, loadSea, loadSun }
