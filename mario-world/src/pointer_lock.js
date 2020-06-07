// import { PointerLockControls } from "./shared/PointerLockControls";
import { FBXLoader } from "./shared/FBXLoader";
import marioMesh from "./models/mario/animations/Run.fbx";
import yoshiSchool from "./models/yoshi4school.fbx";
import * as dat from "dat.gui";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader.js";

import coinFile from "../../peter-lab/src/lab08/models/coin.dae";
import mushroomFile from "../../peter-lab/src/lab08/models/mushroom.dae";
import goombaFile from "../../peter-lab/src/lab08/models/goomba.dae";
import marioAnimatedFile from "./models/mario/scene.gltf";

var camera, scene, renderer, controls;

var objects = [];
var controller;
var raycaster;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var vertex = new THREE.Vector3();
var color = new THREE.Color(0x013220);

var font;
var score = 0;
var scoreCounter;
var coin;
var mushroom;

var goombaDirection;
var goomba;

var boxSize = 30;
var maxBounding = boxSize / 2 - 1;

var marioAnimatioMixer;
var marioMain;
var marioAnimations;
var marioActions = {
  stand: 0,
  jump: 1,
  run: 2,
  run2: 3,
  walk: 4,
};
var marioState = "walk";

const registerEvents = () => {
  const onKeyDown = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;
      case 37: // left
      case 65: // a
        moveLeft = true;
        break;
      case 40: // down
      case 83: // s
        moveBackward = true;
        break;
      case 39: // right
      case 68: // d
        moveRight = true;
        break;
      case 32: // space
        if (canJump === true) velocity.y += 100;
        canJump = false;
        break;
      case 49:
        updateMarioAction("stand");
        break;
      case 50:
        updateMarioAction("jump");
        break;
      case 51:
        updateMarioAction("run");
        break;
      case 52:
        updateMarioAction("run2");
        break;
      case 53:
        updateMarioAction("walk");
        break;
      default:
        break;
    }
  };
  const onKeyUp = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;
      case 37: // left
      case 65: // a
        moveLeft = false;
        break;
      case 40: // down
      case 83: // s
        moveBackward = false;
        break;
      case 39: // right
      case 68: // d
        moveRight = false;
        break;
      case 13:
        controls.unlock();
        break;
      case 27:
        controls.isLocked ? controls.unlock() : controls.lock();
        break;
      default:
        // updateMarioAction("stand");
        break;
    }
  };

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  instructions.addEventListener(
    "click",
    function () {
      controls.lock();
    },
    false
  );

  controls.addEventListener("lock", function () {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });

  controls.addEventListener("unlock", function () {
    blocker.style.display = "block";
    instructions.style.display = "";
  });
  document.addEventListener("keydown", onKeyDown, false);
  document.addEventListener("keyup", onKeyUp, false);
  window.addEventListener("resize", onWindowResize, false);
};

const createObjects = () => {
  // floor

  var floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000, 100, 100);
  floorGeometry.rotateX(-Math.PI / 2);

  // vertex displacement
  var position = floorGeometry.attributes.position;

  for (var i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i);
    vertex.x += Math.random() * 20 - 10;
    vertex.y += Math.random() * 2;
    vertex.z += Math.random() * 20 - 10;
    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

  position = floorGeometry.attributes.position;
  var colors = [];

  for (var i = 0, l = position.count; i < l; i++) {
    // color.setHSL(0.13, 0.28, 0.38);
    colors.push(color.r, color.g, color.b);
  }

  floorGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
  );

  var floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });

  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  scene.add(floor);

  // objects
  var boxGeometry = new THREE.BoxBufferGeometry(20, 20, 20);
  boxGeometry = boxGeometry.toNonIndexed(); // ensure each face has unique vertices

  position = boxGeometry.attributes.position;
  colors = [];

  for (var i = 0, l = position.count; i < l; i++) {
    color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
    colors.push(color.r, color.g, color.b);
  }

  boxGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
  );
  const loader = new FBXLoader();
  // for (var i = 0; i < 0; i ++) {
  //     loader.load(marioMesh, function (object) {
  //         const animation = new THREE.AnimationMixer(object);
  //         const action = animation.clipAction(object.animations[0]);
  //         action.play();
  //         object.traverse(function (child) {
  //           if (child.isMesh) {
  //             child.castShadow = true;
  //             child.receiveShadow = true;
  //           }
  //         });
  //         object.position.x = Math.floor(Math.random() * 2 - 10) * 2;
  //         object.position.y = Math.floor(Math.random() * 2) * 2 + 1;
  //         object.position.z = Math.floor(Math.random() * 2 - 10) * 2;
  //         scene.add(object);
  //         objects.push(object);
  //       });
  // }
};

function lookAtDirection(object, vector) {
  var lookAt = new THREE.Vector3();
  lookAt.addVectors(vector, object.position);
  object.lookAt(lookAt);
}

function updateScore() {
  if (scoreCounter) {
    scene.remove(scoreCounter);
  }
  var geometry = new THREE.TextGeometry("SCORE: " + score, {
    font: font,
    size: 1, // font size
    height: 0.1, // how much extrusion (how thick / deep are the letters)
  });
  geometry.computeBoundingBox();
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
  });
  scoreCounter = new THREE.Mesh(geometry, material);
  scoreCounter.position.x = -geometry.boundingBox.max.x / 2;
  scoreCounter.position.y = maxBounding / 2;
  scoreCounter.position.z = -(maxBounding + 1);
  scoreCounter.castShadow = true;
  scoreCounter.receiveShadow = true;
  camera.add(scoreCounter);
}

function addScoreCounter() {
  var loader = new THREE.FontLoader();
  loader.load("helvetiker_regular.typeface.json", function (f) {
    font = f;
    updateScore();
  });
}

function addSceneElements() {
  // Add a repeating grid as a skybox.
  // var loader = new THREE.TextureLoader();
  // loader.load(boxFile, addSkybox);
  // loading manager

  var loadingManager = new THREE.LoadingManager(function () {
    scene.add(coin);
  });

  var loader = new ColladaLoader(loadingManager);
  loader.options.convertUpAxis = true;
  loader.load(coinFile, function (collada) {
    coin = collada.scene;
    coin.position.set(10, 10, 10);
    // scene.add(coin);
    // camera.lookAt(coin.position);
  });
}

function addFellows() {
  var loader = new ColladaLoader();
  loader.options.convertUpAxis = true;
  loader.load(mushroomFile, function (collada) {
    mushroom = collada.scene;
    mushroom.position.set(10, 8, 10);
    scene.add(mushroom);
  });
}

function addEnemies() {
  var loader = new ColladaLoader();
  loader.options.convertUpAxis = true;
  loader.load(goombaFile, function (collada) {
    goomba = collada.scene;
    goomba.position.set(10 + 2, 8, 10);
    scene.add(goomba);
    goombaDirection = new THREE.Vector3(0.015, 0, 0.025);
    // lookAtDirection(goomba, goombaDirection);
  });
}

function addAnimatedMario() {
  var loader = new GLTFLoader();

  var dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("js/libs/draco/gltf/");
  loader.setDRACOLoader(dracoLoader);

  loader.setDDSLoader(new DDSLoader());
  loader.load(marioAnimatedFile, function (data) {
    marioMain = data.scene;
    // marioMain.scale.set(2, 2, 2);
    marioMain.traverse(function (node) {
      if (node.isMesh || node.isLight) node.castShadow = true;
    });
    marioAnimations = data.animations;
    if (marioAnimations && marioAnimations.length) {
      marioAnimatioMixer = new THREE.AnimationMixer(marioMain);
      var index = marioActions[marioState] || 0;
      var animation = marioAnimations[index];
      var action = marioAnimatioMixer.clipAction(animation);
      action.play();
    }
    // marioMain.position.set(scoreCounter.position.x + 10, 5, scoreCounter.position.z);
    // scene.add(marioMain);
    marioMain.position.set(0, -2, -3);
    marioMain.rotation.y += Math.PI;
    // marioMain.rota
    camera.add(marioMain);
  });
}

function updateMarioAction(action) {
  var index = marioActions[action] || 0;
  console.log(action, index, "action");
  var animation = marioAnimations[index];
  var updatedAction = marioAnimatioMixer.clipAction(animation);
  updatedAction.play();
  if (action === "jump") {
    marioMain.position.y += 2;
    setTimeout(() => {
      marioMain.position.y -= 2;
    }, 500);
  }
}

function init() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 5;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  // scene.fog = new THREE.Fog(0xffffff, 0, 750);

  var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());
  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // DAT gui
  // var gui = new dat.GUI();
  // controller = new THREE.Object3D();
  // controller.objects = [];
  // controller.scene = scene;
  // controller.gui = gui;
  // controller.color = 0xFFFFFF;
  // controller.number_of_objects = controller.objects.length;
  // controller.selected_cube = 'mario';
  // controller.addMario = function () {
  //     const loader = new FBXLoader();
  //     loader.load(marioMesh, function (object) {
  //         const animation = new THREE.AnimationMixer(object);
  //         const action = animation.clipAction(object.animations[0]);
  //         action.play();
  //         object.traverse(function (child) {
  //           if (child.isMesh) {
  //             child.castShadow = true;
  //             child.receiveShadow = true;
  //           }
  //         });
  //         object.position.x = scoreCounter.position.x + Math.floor(Math.random() * 2 - 10);
  //         object.position.y = 5;
  //         object.position.z = scoreCounter.position.z + Math.floor(Math.random() * 2 - 10);
  //         object.name = 'Mario_' + controller.objects.length;
  //         controller.scene.add(object);
  //         controller.objects.push(object);
  //         controller.number_of_objects = controller.objects.length;
  //         controller.selected_cube = object.name;
  //       });
  // };

  // controller.removeMario = function () {
  //     var removedObj = controller.objects.pop();
  //     controller.scene.remove(removedObj);
  //     controller.number_of_objects = controller.objects.length;
  //     controller.selected_cube = removedObj.name;
  //     console.log('remove mario', removedObj);
  // }

  // controller.addCoin = function () {
  //     var loadingManager = new THREE.LoadingManager(function () {
  //         controller.scene.add(coin);
  //     });

  //     var loader = new ColladaLoader(loadingManager);
  //     loader.options.convertUpAxis = true;
  //     loader.load(coinFile, function (collada) {
  //         coin = collada.scene;
  //         coin.position.x = Math.floor(Math.random() * 2 - 10) * 2;
  //         coin.position.y = 10;
  //         coin.position.z = Math.floor(Math.random() * 2 - 10) * 2;
  //         // scene.add(coin);
  //         // camera.lookAt(coin.position);
  //     });
  // }

  // controller.addEnemies = function () {
  //     var loader = new ColladaLoader();
  //     loader.options.convertUpAxis = true;
  //     loader.load(goombaFile, function (collada) {
  //         goomba = collada.scene;
  //         var x = Math.floor(Math.random() * maxBounding) - maxBounding;
  //         var z = Math.floor(Math.random() * maxBounding) - maxBounding;
  //         goomba.position.set(x, 5, z);
  //         controller.scene.add(goomba);
  //         goombaDirection = new THREE.Vector3(0.015, 0, 0.025);
  //         // lookAtDirection(goomba, goombaDirection);
  //     });
  // }

  // gui.add(controller, 'number_of_objects').listen();
  // gui.add(controller, 'selected_cube').listen();
  // gui.add(controller, 'addMario');
  // gui.add(controller, 'removeMario');
  // gui.add(controller, 'addCoin');
  // gui.add(controller, 'addEnemies');

  createObjects();
  registerEvents();
  addScoreCounter();
  addSceneElements();
  addFellows();
  addEnemies();
  addAnimatedMario();
}

function animate() {
  requestAnimationFrame(animate);
  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;
    var intersections = raycaster.intersectObjects(objects);
    var onObject = intersections.length > 0;
    var time = performance.now();
    var delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) {
      velocity.z -= direction.z * 40.0 * delta;
      // marioMain.position.z -= direction.z * 4.0 * delta;
    }
    if (moveLeft || moveRight) {
      velocity.x -= direction.x * 40.0 * delta;
      // marioMain.position.x -= direction.x * 4.0 * delta;
    }

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;

      canJump = true;
    }

    prevTime = time;
    if (marioAnimatioMixer) marioAnimatioMixer.update(delta);
  }
  renderer.render(scene, camera);
}

init();
animate();

export { renderer, scene };
