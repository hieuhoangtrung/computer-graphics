import grassGround from './images/grasslight-big.jpg';
import sunSurface from './images/sun.jpg';
import seaSurface from './images/seaTextyure.jpg';
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

const animate = ({ camera, clock, renderer, stats, scene , labelRenderer, dirLight, sun}, worldObject) => 
{
    requestAnimationFrame(() => animate({ 
      camera, clock, renderer, stats, scene, labelRenderer, dirLight, sun
    }, worldObject));


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

  var time = Date.now() * 0.0000001;
  if (dirLight.position.z <= 3000) {
    dirLight.position.z +=  Math.cos( time ) * 0.07
    sun.position.z +=  Math.cos( time ) * 0.07
  }
  else {
    dirLight.position.z = -3000
    sun.position.z =  -3000
  }

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
  dirLight.position.set( 0, 300, 0 );

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

//Sun
  var texttureLoader = new THREE.TextureLoader();
  var sunTexture = texttureLoader.load(sunSurface);

  var sunGeometry = new THREE.SphereBufferGeometry(20, 16, 8);
  var sunMat = new THREE.MeshPhysicalMaterial({
    emissive: 0xff0000,
    emissiveIntensity: 5,
    map: sunTexture
  });
  var sun = new THREE.Mesh(sunGeometry, sunMat);
  sun.position.set( 0, 500, 0 );
  sun.castShadow = false;
  sun.receiveShadow = false;
  globalObject.sun = sun;
  scene.add( sun )


  //grounds
  var groundTexture = texttureLoader.load(grassGround);
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(1, 1);
  groundTexture.anisotropy = 16;
  groundTexture.encoding = THREE.sRGBEncoding;

  var groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture});
  var groundGeometry1 = new THREE.BoxBufferGeometry( 100, 100, 100 );
  var groundGeometry2 = new THREE.BoxBufferGeometry( 100, 150, 100 );
  var groundGeometry3 = new THREE.BoxBufferGeometry( 200, 50, 200 );
  var groundGeometry4 = new THREE.BoxBufferGeometry( 300, 200, 100 );
  var groundGeometry5 = new THREE.BoxBufferGeometry( 200, 200, 100 );
  var groundGeometry6 = new THREE.BoxBufferGeometry( 100, 150, 100 );
  var groundGeometry7 = new THREE.BoxBufferGeometry( 100, 100, 200 );
  var groundGeometry8 = new THREE.BoxBufferGeometry( 200, 50, 200 );
  var groundGeometry9 = new THREE.BoxBufferGeometry( 300, 150, 200 );
  var groundGeometry10 = new THREE.BoxBufferGeometry( 100, 100, 200 );

  var ground1 = new THREE.Mesh(groundGeometry1, groundMaterial);
  var ground2 = new THREE.Mesh(groundGeometry2, groundMaterial);
  var ground3 = new THREE.Mesh(groundGeometry3, groundMaterial);
  var ground4 = new THREE.Mesh(groundGeometry4, groundMaterial);
  var ground5 = new THREE.Mesh(groundGeometry5, groundMaterial);
  var ground6 = new THREE.Mesh(groundGeometry6, groundMaterial);
  var ground7 = new THREE.Mesh(groundGeometry7, groundMaterial);
  var ground8 = new THREE.Mesh(groundGeometry8, groundMaterial);
  var ground9 = new THREE.Mesh(groundGeometry9, groundMaterial);
  var ground10 = new THREE.Mesh(groundGeometry10, groundMaterial);

  ground1.position.set(-250, 0, -350);
  ground1.receiveShadow = true;
  ground1.castShadow = true;
  ground2.position.set(-250, 25, -250);
  ground2.receiveShadow = true;
  ground2.castShadow = true;
  ground3.position.set(-100, -25, -300);
  ground3.receiveShadow = true;
  ground3.castShadow = true;
  ground4.position.set(-150, 50, -150);
  ground4.receiveShadow = true;
  ground4.castShadow = true;
  ground5.position.set(200, 50, -150);
  ground5.receiveShadow = true;
  ground5.castShadow = true;
  ground6.position.set(150, 25, -50);
  ground6.receiveShadow = true;
  ground6.castShadow = true;
  ground7.position.set(150, 0, 100);
  ground7.receiveShadow = true;
  ground7.castShadow = true;
  ground8.position.set(-100, -25, 100);
  ground8.receiveShadow = true;
  ground8.castShadow = true;
  ground9.position.set(-200, 25, 300);
  ground9.receiveShadow = true;
  ground9.castShadow = true;
  ground10.position.set(0, 0, 300);
  ground10.receiveShadow = true;
  ground10.castShadow = true;

  scene.add(ground1, ground2, ground3, ground4, ground5, ground6, ground7, ground8, ground9, ground10);

  // sea
  var seaTexture = texttureLoader.load(seaSurface);
  seaTexture.wrapS = seaTexture.wrapT = THREE.RepeatWrapping;
  seaTexture.repeat.set(25, 25);
  seaTexture.anisotropy = 16;
  seaTexture.encoding = THREE.sRGBEncoding;

  var seaMaterial = new THREE.MeshLambertMaterial({ map: seaTexture });
  var sea = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), seaMaterial);
  sea.position.y = -50;
  sea.rotation.x = - Math.PI / 2;
  sea.receiveShadow = true;
  scene.add(sea);

  loadModels(globalObject, worldObject);

  container.appendChild(renderer.domElement);

  controls.target.set(0, 100, 0);
  controls.update();

  window.addEventListener('resize', () => onWindowResize({camera, renderer }), false);

  container.appendChild(stats.dom);
  animate(globalObject, worldObject);
}

export { init }
