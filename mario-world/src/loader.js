import { FBXLoader } from "./shared/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader.js";

import marioAnimatedFile from "./models/mario/scene.gltf";
import star from "./models/Star.fbx";
import boo from "./models/Boo.fbx";
import fireflower from "./models/FireFlower.fbx";
import goomba from "./models/Goomba.fbx";
import qmark from "./models/Question_Mark_Block.fbx";
import brickblock from "./models/BrickBlock/source/Brick Block.fbx";
import smallCastle from "./models/Castle/Castle_Small.fbx";
import mushroom from "./models/mushroom.fbx";
import tree1 from "./models/Trees/tree_3.FBX";

import {scene, globalObject, worldObject, goal} from "./scene";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import coinFile from "./models/coin.dae";

function addAnimatedMario() {
  var loader = new GLTFLoader();

  var dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("js/libs/draco/gltf/");
  loader.setDRACOLoader(dracoLoader);

  loader.setDDSLoader(new DDSLoader());
  loader.load(marioAnimatedFile, function (data) {
    worldObject.marioMain = data.scene;
    worldObject.marioMain.traverse(function (node) {
      if (node.isMesh || node.isLight) node.castShadow = true;
    });
    globalObject.marioAnimations = data.animations;
    if (globalObject.marioAnimations.length) {
      globalObject.marioAnimationMixer = new THREE.AnimationMixer(
        worldObject.marioMain
      );
      const animation = globalObject.marioAnimations[0]; // stand
      const action = globalObject.marioAnimationMixer.clipAction(animation);
      action.play();
    }
    worldObject.marioMain.scale.set(10, 10, 10);
    worldObject.marioMain.position.set(700, 50, 100);
    worldObject.marioMain.add(goal);
    goal.position.set(0, 5, -10);
    scene.add(worldObject.marioMain);

    updateScore(globalObject.score); /// need to check here
  });
}

function  addCoins() {
  addOneCoin("coin1",647, 60, 345);
  addOneCoin("coin2",-700, 60, 50);
  addOneCoin("coin3",0, 60, 750);
  addOneCoin("coin4",773, 60, 772);
  addOneCoin("coin5",-20, 60, 250);
  addOneCoin("coin6",0, 60, 250);
  addOneCoin("coin7",20, 60, 250);
  addOneCoin("coin8",-20, 60, 300);
  addOneCoin("coin9",0, 60, 300);
  addOneCoin("coin10",20, 60, 300);
  addOneCoin("coin11",-6, 60, -400);
  addOneCoin("coin12",-642, 60, -674);
  addOneCoin("coin13",700, 60, -700);
  addOneCoin("coin14",750, 60, -750);
  addOneCoin("coin15",650, 60, -650);
}

function addOneCoin(name, x , y , z ){
  var loader = new ColladaLoader();
  loader.options.convertUpAxis = true;
  loader.load(coinFile, function (collada) {
    worldObject[name] = collada.scene;
    worldObject[name].position.set(x, y, z);
    worldObject[name].scale.set(1, 1 , 1);
    scene.add(worldObject[name]);
  });
}

function updateMarioAnimation(index) {
  if (index !== globalObject.marioState) {
    globalObject.marioAnimationMixer = new THREE.AnimationMixer(
      worldObject.marioMain
    );
    const animation = globalObject.marioAnimations[index];
    const updatedAction = globalObject.marioAnimationMixer.clipAction(animation);
    updatedAction.play();
  }

}

function loadModels() {
  const loader = new FBXLoader();
  const loadBrickBlocks = (name, x, y, z) => {
    loader.load(brickblock, function (object) {
      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      object.scale.set(1 / 30, 1 / 30, 1 / 30);
      object.position.set(x, y, z);
      worldObject[name] = object;
      scene.add(object);
    });
  };

  loadBrickBlocks("brick_1", 700, 120, 100);
  loadBrickBlocks("brick_2", 700, 120, 73);
  loadBrickBlocks("brick_3", 700, 120, 46);
  loadBrickBlocks("brick_4", 700, 120, 19);
  loadBrickBlocks("brick_5", 700, 120, -8);
  loadBrickBlocks("brick_6", 700, 220, -98);
  loadBrickBlocks("brick_7", 700, 220, -125);
  loadBrickBlocks("brick_8", 700, 220, -152);
  loadBrickBlocks("brick_9", 700, 220, -179);
  loadBrickBlocks("brick_10", 700, 220, -206);
  loadBrickBlocks("brick_11", 646, 120, -700);
  loadBrickBlocks("brick_12", 700, 120, -646);
  loadBrickBlocks("brick_13", 754, 120, -592);
  loadBrickBlocks("brick_14", 0, 220, -700);
  loadBrickBlocks("brick_15", -90, 120, -700);
  loadBrickBlocks("brick_16", -270, 120, -700);
  loadBrickBlocks("brick_17", -360, 220, -700);
  loadBrickBlocks("brick_18", -387, 220, -700);
  loadBrickBlocks("brick_19", -477, 220, -700);
  loadBrickBlocks("brick_20", -477, 220, -673);
  loadBrickBlocks("brick_21", -567, 220, -673);
  loadBrickBlocks("brick_22", -567, 120, -727);
  loadBrickBlocks("brick_23", -657, 220, -727);
  loadBrickBlocks("brick_24", -700, 120, -550);
  loadBrickBlocks("brick_25", -700, 120, -400);
  loadBrickBlocks("brick_26", 48, 220, 700);
  loadBrickBlocks("brick_27", 600, 120, 700);
  loadBrickBlocks("brick_28", 542, 120, 700);
  loadBrickBlocks("brick_29", 452, 220, 700);

// moving boxs
  const loadMovingBrickBlocks = (name, x, y, z, i, j, k) => {
    loader.load(brickblock, function (object) {
      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      object.scale.set(i, j, k);
      object.position.set(x, y, z);
      worldObject[name] = object;
      scene.add(object);
    });
  };

  loadMovingBrickBlocks("moveingwall1", -700, 33, 100, 1 / 10, 1 / 10, 1 / 30);
  loadMovingBrickBlocks("moveingwall2", -700, 33, 350, 1 / 10, 1 / 10, 1 / 30);
  loadMovingBrickBlocks("moveingwall3", -700, 33, 600, 1 / 10, 1 / 10, 1 / 30);
  loadMovingBrickBlocks("moveingbox1", 352, 220, 700, 1 / 30, 1 / 30, 1 / 30);
  loadMovingBrickBlocks("moveingbox2", 325, 220, 700, 1 / 30, 1 / 30, 1 / 30);
  loadMovingBrickBlocks("moveingbox3", 175, 220, 700, 1 / 30, 1 / 30, 1 / 30);
  loadMovingBrickBlocks("moveingbox4", 148, 220, 700, 1 / 30, 1 / 30, 1 / 30);
  loadMovingBrickBlocks("moveingbox5", 285, 43, 285, 1 / 30, 1 / 30, 1 / 30);
  loadMovingBrickBlocks("moveingbox6", -285, 43, 285, 1 / 30, 1 / 30, 1 / 30);
  loadMovingBrickBlocks("moveingbox7", 285, 43, -285, 1 / 30, 1 / 30, 1 / 30);
  loadMovingBrickBlocks("moveingbox8", -285, 43, -285, 1 / 30, 1 / 30, 1 / 30);
  //qmark

  const loadQMarks = (name, x, y, z) => {
    loader.load(qmark, function (object) {
      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      object.scale.set(1 / 30, 1 / 30, 1 / 30);
      object.position.set(x, y, z);
      worldObject[name] = object;
      scene.add(object);
    });
  };

  loadQMarks("qmark_1", 700, 225, 51);
  loadQMarks("qmark_2", 700, 125, -147);
  loadQMarks("qmark_3", 673, 125, -667);
  loadQMarks("qmark_4", 727, 125, -613);
  loadQMarks("qmark_5", -180, 225, -700);
  loadQMarks("qmark_6", -567, 225, -722);
  loadQMarks("qmark_7", -700, 225, -395);
  loadQMarks("qmark_8", -700, 125, 705);
  loadQMarks("qmark_9", 571, 125, 705);

  //star
  const loadStars = (name, x, y, z) => {
    loader.load(star, function (object) {
      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      object.scale.set(1 / 10, 1 / 10, 1 / 5);
      object.position.set(x, y, z);
      worldObject[name] = object;
      scene.add(object);
    });
  };

  loadStars("star_1", 48, 320, 700);
  loadStars("star_2", 700, 320, -300);
  loadStars("star_3", -700, 320, -700);
  loadStars("star_4", -700, 220, 700);

  //smallCastle

  loader.load(smallCastle, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(0, 50, -140);
    scene.add(object);
  });

  //fireflower
  const loadFlowers = (name, x, y, z) => {
    loader.load(fireflower, function (object) {
      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      object.scale.set(1 / 20, 1 / 20, 1 / 20);
      object.position.set(x, y, z);
      worldObject[name] = object;
      scene.add(object);
    });
  };

  loadFlowers("flower_1", 700, 255, 50);
  loadFlowers("flower_2", -180, 255, -700);
  loadFlowers("flower_3", -700, 155, -545);

  //monsters on the brick
  const loadGoombas = (name, r) => {
    loader.load(goomba, function (object) {
      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      object.scale.set(1 / 3, 1 / 3, 1 / 3);
      object.rotation.z = THREE.Math.degToRad(r);

      worldObject[name] = object;
      scene.add(object);
    });
  };

  loadGoombas("movingMonster1", 0);
  loadGoombas("movingMonster2", 180);
  //monster on the floor
  loadGoombas("movingMonster3", 270);
  loadGoombas("movingMonster4", 270);
  loadGoombas("movingMonster5", 90);
  loadGoombas("movingMonster6", 270);

  //ghost
  loader.load(boo, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    object.scale.set(1 / 10, 1 / 10, 1 / 10);
    object.position.set(-700, 85, 700);
    object.rotation.y = THREE.Math.degToRad(90);
    worldObject.movingGhost1 = object;

    scene.add(object);
  });

  const loadTrees = (name, x, y, z) => {
    loader.load(tree1, function (object) {
      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      object.scale.set(5, 5, 5);
      object.position.set(x, y, z);
      worldObject[name] = object;
      scene.add(object);
    });
  };

  loadTrees("tree1", 48, 57, 700);
  loadTrees("tree2", 700, 57, 700);
  loadTrees("tree3", -700, 57, -700);
  loadTrees("tree4", -700, 57, 700);

  //mushroom
  const loadMushroom = (name, x, y, z) => {
  loader.load(mushroom, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 2, 1 / 2, 1 / 2);
    object.position.set(x, y, z);
    worldObject[name] = object;
    scene.add(object);
  });
};

loadMushroom("mushroom1", 700, 50, 180);
loadMushroom("mushroom2", 500, 50, 680);
loadMushroom("mushroom3", 50, 50, 50);
loadMushroom("mushroom4", -50, 50, -50);
loadMushroom("mushroom5", 0, 50, 0);
loadMushroom("mushroom6", 50, 50, -50);
loadMushroom("mushroom7", -50, 50, 50);
loadMushroom("mushroom8", 750, 50, -200);
loadMushroom("mushroom9", -650, 50, 700);
loadMushroom("mushroom10", 293, 50, -515);
loadMushroom("mushroom11", 364, 50, -134);
loadMushroom("mushroom12", -424, 50, 12);
}

function updateScore(score) {
  var loader = new THREE.FontLoader();
  loader.load("helvetiker_regular.typeface.json", function (f) {
    var font = f;
    if (globalObject.scoreCounter) {
      worldObject.marioMain.remove(globalObject.scoreCounter);
    }

    var geometry = new THREE.TextGeometry("SCORE: " + score, {
      font: font,
      size: 10, // font size
      height: 0.1, // how much extrusion (how thick / deep are the letters)
    });
    geometry.computeBoundingBox();
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xffffff,
    });
    globalObject.scoreCounter = new THREE.Mesh(geometry, material);
    globalObject.scoreCounter.position.set(1.5, 5, 0);
    globalObject.scoreCounter.rotation.y += Math.PI;
    globalObject.scoreCounter.scale.set(1/10, 1/10, 1/10);

    worldObject.marioMain.add(globalObject.scoreCounter);
  });
}

export {
  loadModels,
  addAnimatedMario,
  updateMarioAnimation,
  addCoins,
  updateScore,
};
