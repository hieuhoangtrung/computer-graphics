import {FBXLoader} from './shared/FBXLoader';
import yoshiSchool from './models/yoshi4school.fbx';
import marioMesh from './models/mario/animations/Run.fbx';
import star from './models/Star.fbx';
import extraLife from './models/Extra_Life.fbx';
import boo from './models/Boo.fbx';
import fireflower from "./models/FireFlower.fbx";
import Goomba from './models/Goomba.fbx';
import qmark from './models/Question_Mark_Block.fbx';
import brickblock from './models/BrickBlock/source/Brick Block.fbx';
import smallCastle from './models/Castle/Castle_Small.fbx';
import mushroom from './models/mushroom.fbx';
// import trees from './models/Cartoon_trees.fbx';



function loadModels({ scene, camera }, worldObject) {
  const loader = new FBXLoader();
  loader.load(yoshiSchool, function (object) {
    const sca = new THREE.Matrix4();
    sca.makeScale(2, 2, 2);
    object.applyMatrix(sca);
    const castleAnimation = new THREE.AnimationMixer(object);
    const action = castleAnimation.clipAction(object.animations[0]);
    action.play();
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(object);
    worldObject.castle = castleAnimation;
  });

  loader.load(marioMesh, function (object) {
    const sca = new THREE.Matrix4();
    const tra = new THREE.Matrix4();
    const ScaleFact = 10;

    sca.makeScale(ScaleFact, ScaleFact, ScaleFact);
    tra.makeTranslation(185, 50, 25);
    object.applyMatrix(sca);
    object.applyMatrix(tra);

    const animation = new THREE.AnimationMixer(object);
    const action = animation.clipAction(object.animations[0]);
    action.play();
    object.traverse(function (child) {
      if (child.isMesh) {

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    worldObject.mario = object;
    worldObject.marioAnimation = animation;
    scene.add(object);

    // move camera to mario:
    const temp = new THREE.Vector3();
    temp.set(object.position.x, object.position.y + 20, object.position.z - 50);
    camera.position.lerp(temp, 1);
    camera.lookAt(object.position);
  });

  loader.load(star, function (object) {
    object.traverse(function (child) {

      if (child.isMesh) {

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1/20, 1/20, 1/20);
    object.position.set(170, 50, 25);
    scene.add(object);
  });

  loader.load(extraLife, function (object) {
    
    object.traverse(function (child) {

      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1/3, 1/3, 1/3);
    object.position.set(150, 45, 25);
    scene.add(object);
  });


  loader.load(Goomba, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 5, 1 / 5, 1 / 5);
    object.position.set(90, 60, 25);
    scene.add(object);
  });
  

loader.load(fireflower, function (object) {
  object.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }

  });
  object.scale.set(1 / 30, 1 / 30, 1 / 30);
  object.position.set(110, 50, 25);
  scene.add(object);
});

//trees have a blank board, it might cannot add in our project
// loader.load(trees, function (object) {
//   object.traverse(function (child) {

//     if (child.isMesh) {
//       child.castShadow = true;
//       child.receiveShadow = true;
//     }
//   });
//   object.scale.set(1/3, 1/3, 1/3);
//   object.position.set(150, 50, 25);
//   scene.add(object);
// });

//the small ghost
loader.load(boo, function (object) {
  object.traverse(function (child) {

    if (child.isMesh) {

      // child.material.map = texture;
      // child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  object.scale.set(1 / 20, 1 / 20, 1 / 20);
  object.position.set(130, 55, 25);
  scene.add(object);
});


loader.load(qmark, function (object) {
  object.traverse(function (child) {

    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  object.scale.set(1 / 60, 1 / 60, 1 / 60);
  object.position.set(200, 50, 25);
  scene.add(object);
});


loader.load(brickblock, function (object) {
  object.traverse(function (child) {

    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  object.scale.set(1 / 60, 1 / 60, 1 / 60);
  object.position.set(220, 48, 25);
  scene.add(object);
});

loader.load(smallCastle, function (object) {
  object.traverse(function (child) {

    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  object.scale.set(1 / 60, 1 / 60, 1 / 60);
  object.position.set(170, 50, 0);
  scene.add(object);
});


loader.load(mushroom, function (object) {
  object.traverse(function (child) {

    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  object.scale.set(1 / 2, 1 / 2, 1 / 2);
  object.position.set(240, 40, 25);
  scene.add(object);
});



}

export { loadModels }
