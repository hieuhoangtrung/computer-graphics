import Stats from "./shared/stats.module";
import { loadModels, addAnimatedMario, addCoins } from "./loader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { registerEvents } from "./registerEvent";
import {
  handleCollisionWithEnemy,
  handleGetCoin,
  handleGetMushroom,
} from "./collision";
import { loadSounds } from "./loadSounds";
import {
  loadBridge,
  loadDirLight,
  loadGround,
  loadSea,
  loadSun
} from './loadSceneElements';
import {initSea,updateSea} from "./loadShaderOcean";
import { initSky,shaderSky } from "./loadShaderSky"

// main three js objects
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
// const controls = new PointerLockControls(camera, document.body);
const cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.target.set(0, 50, 0);
cameraControls.update();
const clock = new THREE.Clock();
const stats = new Stats();

const temp = new THREE.Vector3();

// global objects
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const moveForward = false;
const moveBackward = false;
const moveLeft = false;
const moveRight = false;
const canJump = false;

let GhostMove = 5;
let score = 0;
let isLoading = true;
const marioState = 0;
const goal = new THREE.Object3D();
const isLocked = false;

const globalObject = {
  velocity,
  direction,
  moveForward,
  moveBackward,
  moveLeft,
  moveRight,
  canJump,
  score,
  marioState,
  isLocked,
};

const worldObject = {};

const animate = () => {
  requestAnimationFrame(animate);

  const {
    dirLight,
    sun,
    moveForward,
    moveRight,
    moveBackward,
    moveLeft,
    marioAnimationMixer,
  } = globalObject;
  if (worldObject.marioMain) {
    temp.setFromMatrixPosition(goal.matrixWorld);
    camera.position.lerp(temp, 0.2);
    camera.lookAt(worldObject.marioMain.position);
  }
  if(globalObject.isLocked) {
    if (moveForward) {
      worldObject.marioMain.translateZ(3);
      // camera.translateZ( 1);
    }

    if (moveBackward) {
      worldObject.marioMain.translateZ(-3);
      // camera.translateZ( -1);
    }

    if(moveLeft) {
      worldObject.marioMain.rotation.y += Math.PI / 15;
    }

    if(moveRight) {
      worldObject.marioMain.rotation.y -= Math.PI / 15;
    }

// animation
    const delta = clock.getDelta();
    if (marioAnimationMixer) {
      marioAnimationMixer.update(delta);
    }

    // handle collision;
    handleCollisionWithEnemy();
    handleGetCoin();
    handleGetMushroom();

    if (!isLoading) {
      var time = Date.now() * 0.000003;

      var wall1x = +50 * Math.sin(time * 150);
      var wall2x = -50 * Math.sin(time * 150);

      worldObject.moveingwall1.position.set(-700 + wall1x, 33, 100);
      worldObject.moveingwall2.position.set(-700 + wall2x, 33, 350);
      worldObject.moveingwall3.position.set(-700 + wall1x, 33, 600);
      worldObject.moveingbox1.position.set(352 + wall1x, 220, 700);
      worldObject.moveingbox2.position.set(325 + wall1x, 220, 700);
      worldObject.moveingbox3.position.set(175 + wall2x, 220, 700);
      worldObject.moveingbox4.position.set(148 + wall2x, 220, 700);

      var boxx = 390 * Math.sin(time * 100);
      var boxz = 390 * Math.cos(time * 100);

      worldObject.moveingbox5.position.set(boxx, 43, boxz);
      worldObject.moveingbox6.position.set(boxx, 70, -boxz);
      worldObject.moveingbox7.position.set(-boxx, 97, boxz);
      worldObject.moveingbox8.position.set(-boxx, 124, -boxz);

      //monsters moving
      var moveSpeed = +55 * Math.sin(time * 200);
      worldObject.movingMonster1.position.set(700, 267, -144 + moveSpeed);
      worldObject.movingMonster2.position.set(700, 168, 50 + moveSpeed * -1);
      worldObject.movingMonster3.position.set(705 + moveSpeed * -1.5, 61, 50);
      worldObject.movingMonster4.position.set(705 + moveSpeed * 1.5, 61, 400);
      worldObject.movingMonster5.position.set(-705 + moveSpeed * -1.5, 61, 225);
      worldObject.movingMonster6.position.set(-705 + moveSpeed * 1.5, 61, 475);
      //type I, z, forwards
      if (moveSpeed + 0.01 > 55) {
        worldObject.movingMonster1.rotation.z = THREE.Math.degToRad(180);
      }
      if (moveSpeed - 0.01 < -55) {
        worldObject.movingMonster1.rotation.z = THREE.Math.degToRad(0);
      }
      //type II (reverse), z, backwards
      if (moveSpeed + 0.01 > 55) {
        worldObject.movingMonster2.rotation.z = THREE.Math.degToRad(0);
      }
      if (moveSpeed - 0.01 < -55) {
        worldObject.movingMonster2.rotation.z = THREE.Math.degToRad(180);
      }
      //type III, x, right
      if (moveSpeed + 0.01 > 55) {
        worldObject.movingMonster3.rotation.z = THREE.Math.degToRad(90);
        worldObject.movingMonster5.rotation.z = THREE.Math.degToRad(90);
      }
      if (moveSpeed - 0.01 < -55) {
        worldObject.movingMonster3.rotation.z = THREE.Math.degToRad(270);
        worldObject.movingMonster5.rotation.z = THREE.Math.degToRad(270);
      }
      //type IV, x, left
      if (moveSpeed + 0.01 > 55) {
        worldObject.movingMonster4.rotation.z = THREE.Math.degToRad(270);
        worldObject.movingMonster6.rotation.z = THREE.Math.degToRad(270);
      }
      if (moveSpeed - 0.01 < -55) {
        worldObject.movingMonster4.rotation.z = THREE.Math.degToRad(90);
        worldObject.movingMonster6.rotation.z = THREE.Math.degToRad(90);
      }

      //ghost moving
      worldObject.movingGhost1.position.x += GhostMove;

      //console.log(GhostMove);
      if (
        worldObject.movingGhost1.position.x >= 701 ||
        worldObject.movingGhost1.position.x <= -701
      ) {
        GhostMove = -GhostMove;
        if (GhostMove > 0) {
          worldObject.movingGhost1.rotation.y = THREE.Math.degToRad(90);
        } else {
          worldObject.movingGhost1.rotation.y = THREE.Math.degToRad(270);
        }

        //moving cloud
        /*
        worldObject.movingGhost1.position.x += GhostMove;
      //console.log(GhostMove);
      if (
        worldObject.movingGhost1.position.x >= 801 ||
        worldObject.movingGhost1.position.x <= -801
      ) {
        GhostMove = -GhostMove;
        if (GhostMove > 0) {
          worldObject.movingGhost1.rotation.y = THREE.Math.degToRad(90);
        } else {
          worldObject.movingGhost1.rotation.y = THREE.Math.degToRad(270);
        }*/
      }
    }
  }

  var sunx = Math.sin(time * 30);
  var sunz = Math.cos(time * 30);

  sun.position.set(1500 * sunx, 1500*sunx, 1500 * sunz);
  dirLight.position.set(1500 * sunx, 1500*sunx, 1500 * sunz);
  shaderSky(sun);
  renderer.render(scene, camera);
  updateSea();
  stats.update();
};

const init = () => {
  camera.position.set(700, 70, 100);
  camera.rotation.y += Math.PI;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  // scene.add(controls.getObject());
  document.body.appendChild(renderer.domElement);
  scene.background = new THREE.Color(0x87ceeb);
  const container = document.createElement("div");
  document.body.appendChild(container);

  loadDirLight();
  loadSun();
  loadGround();
  loadBridge();
  loadSea();
  loadModels();
  addAnimatedMario();
  addCoins();
  registerEvents();
  loadSounds();
  initSea();
  initSky();

  container.appendChild(renderer.domElement);
  container.appendChild(stats.dom);
  animate();
  setTimeout(() => {
    isLoading = false;
  }, 1000);
};

export {
  init,
  scene,
  camera,
  renderer,
  // controls,
  globalObject,
  worldObject,
  temp,
  goal,
};
