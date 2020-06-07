import { FBXLoader } from "./shared/FBXLoader";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';

import marioAnimatedFile from "./models/mario/scene.gltf";
import marioMesh from "./models/mario/animations/Run.fbx";
import star from "./models/Star.fbx";
import extraLife from "./models/Extra_Life.fbx";
import boo from "./models/Boo.fbx";
import fireflower from "./models/FireFlower.fbx";
import goomba from "./models/Goomba.fbx";
import qmark from "./models/Question_Mark_Block.fbx";
import brickblock from "./models/BrickBlock/source/Brick Block.fbx";
import smallCastle from "./models/Castle/Castle_Small.fbx";
import mushroom from "./models/mushroom.fbx";
import { CSS2DObject } from  './shared/CSS2DRenderer'

import { scene, camera, globalObject, worldObject } from './scene';
import {ColladaLoader} from 'three/examples/jsm/loaders/ColladaLoader';
import coinFile from '../../peter-lab/src/lab08/models/coin.dae';

/*
note:
brickblock: scale:1/40 d: 16

*/

function addAnimatedMario() {
  var loader = new GLTFLoader();

  var dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('js/libs/draco/gltf/');
  loader.setDRACOLoader(dracoLoader);

  loader.setDDSLoader(new DDSLoader());
  loader.load(marioAnimatedFile, function (data) {
      worldObject.marioMain =  data.scene;
      worldObject.marioMain.traverse(function (node) {
          if (node.isMesh || node.isLight) node.castShadow = true;
      });
      globalObject.marioAnimations = data.animations;
      if (globalObject.marioAnimations.length) {
        globalObject.marioAnimatioMixer = new THREE.AnimationMixer(worldObject.marioMain);
          const animation = globalObject.marioAnimations[4]; // stand
          const action = globalObject.marioAnimatioMixer.clipAction(animation);
          action.play();
      }
      worldObject.marioMain.scale.set(1/2, 1/2, 1/2);
      worldObject.marioMain.position.set(0,-1,-3);
      worldObject.marioMain.rotation.y += Math.PI;
      camera.add(worldObject.marioMain);
  });
}

function addCoins() {
  var loadingManager = new THREE.LoadingManager(function () {
    scene.add(worldObject.coin);
  });

  var loader = new ColladaLoader(loadingManager);
  loader.options.convertUpAxis = true;
  loader.load(coinFile, function (collada) {
    worldObject.coin = collada.scene;
    worldObject.coin.position.set(700, 70, 50);
    worldObject.coin.scale.set(1/5, 1/5, 1/5);
  });
}

function updateMarioAnimation(index) {
  const animation = globalObject.marioAnimations[index];
  const updatedAction = globalObject.marioAnimatioMixer.clipAction(animation);
  updatedAction.play();
}

function loadModels() {
  // self.threeOnEvent = new THREE.onEvent(scene,camera);
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
  }

  loadBrickBlocks('brick_1', 700, 120, 100);
  loadBrickBlocks('brick_1', 700, 120, 73);
  loadBrickBlocks('brick_2', 700, 120, 46);
  loadBrickBlocks('brick_3', 700, 120, 19);
  loadBrickBlocks('brick_4', 700, 120, -8);
  loadBrickBlocks('brick_5', 700, 220, -98);
  loadBrickBlocks('brick_6', 700, 220, -125);
  loadBrickBlocks('brick_7', 700, 220, -152);
  loadBrickBlocks('brick_8', 700, 220, -179);
  loadBrickBlocks('brick_9', 700, 220, -206);
  loadBrickBlocks('brick_10', 646, 120, -700);
  loadBrickBlocks('brick_11', 700, 120, -646);
  loadBrickBlocks('brick_12', 754, 120, -592);
  loadBrickBlocks('brick_13', 0, 220, -700);
  loadBrickBlocks('brick_14', -90, 120, -700);
//brickblock
//   loader.5oad(brickblock, function (object) {
//     object.traverse(function (child) {
//       if (child.isMesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;
//       }
//     });
//     object.scale.set(1 / 30, 1 / 30, 1 / 30);
//     object.position.set(700, 120, 100);
//     scene.add(object);
//   });

  // loader.load(brickblock, function (object) {
  //   object.traverse(function (child) {
  //     if (child.isMesh) {
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });
  //   object.scale.set(1 / 30, 1 / 30, 1 / 30);
  //   object.position.set(700, 120, 73);
  //   scene.add(object);
  //   var mushroomLabel = createDesc("brickblock",1000)
  //   object.on('hover',function(m) {
  //     object.add( mushroomLabel );
  //   },function(m) {
  //     object.remove(mushroomLabel)
  //   });
  // });

  // loader.load(brickblock, function (object) {
  //   object.traverse(function (child) {
  //     if (child.isMesh) {
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });
  //   object.scale.set(1 / 30, 1 / 30, 1 / 30);
  //   object.position.set(700, 120, 46);
  //   scene.add(object);
  //   var mushroomLabel = createDesc("brickblock",1000)
  //   object.on('hover',function(m) {
  //     object.add( mushroomLabel );
  //   },function(m) {
  //     object.remove(mushroomLabel)
  //   });
  // });

  // loader.load(brickblock, function (object) {
  //   object.traverse(function (child) {
  //     if (child.isMesh) {
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });
  //   object.scale.set(1 / 30, 1 / 30, 1 / 30);
  //   object.position.set(700, 120, 19);
  //   scene.add(object);
  //   var mushroomLabel = createDesc("brickblock",1000)
  //   object.on('hover',function(m) {
  //     object.add( mushroomLabel );
  //   },function(m) {700, 120, -646
  //     object.remove(mushroomLabel)
  //   });
  // });

  // loader.load(brickblock, function (object) {
  //   object.traverse(function (child) {
  //     if (child.isMesh) {
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });
  //   object.scale.set(1 / 30, 1 / 30, 1 / 30);
  //   object.position.set(700, 120, -8);
  //   scene.add(object);
  //   var mushroomLabel = createDesc("brickblock",1000)
  //   object.on('hover',function(m) {
  //     object.add( mushroomLabel );
  //   },function(m) {
  //     object.remove(mushroomLabel)
  //   });
  // });

  // loader.load(brickblock, function (object) {
  //   object.traverse(function (child) {
  //     if (child.isMesh) {
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });
  //   object.scale.set(1 / 30, 1 / 30, 1 / 30);
  //   object.position.set(700, 220, -98);
  //   scene.add(object);
  //   var mushroomLabel = createDesc("brickblock",1000)
  //   object.on('hover',function(m) {
  //     object.add( mushroomLabel );
  //   },function(m) {
  //     object.remove(mushroomLabel)
  //   });
  // });

  // loader.load(brickblock, function (object) {
  //   object.traverse(function (child) {
  //     if (child.isMesh) {
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });
  //   object.scale.set(1 / 30, 1 / 30, 1 / 30);
  //   object.position.set(700, 220, -125);
  //   scene.add(object);
  //   var mushroomLabel = createDesc("brickblock",1000)
  //   object.on('hover',function(m) {
  //     object.add( mushroomLabel );
  //   },function(m) {
  //     object.remove(mushroomLabel)
  //   });
  // });

  // loader.load(brickblock, function (object) {
  //   object.traverse(function (child) {
  //     if (child.isMesh) {
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });
  //   object.scale.set(1 / 30, 1 / 30, 1 / 30);
  //   object.position.set(700, 220, -152);
  //   scene.add(object);
  //   var mushroomLabel = createDesc("brickblock",1000)
  //   object.on('hover',function(m) {
  //     object.add( mushroomLabel );
  //   },function(m) {
  //     object.remove(mushroomLabel)
  //   });
  // });

  // loader.load(brickblock, function (object) {
  //   object.traverse(function (child) {
  //     if (child.isMesh) {
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });
  //   object.scale.set(1 / 30, 1 / 30, 1 / 30);
  //   object.position.set(700, 220, -179);
  //   scene.add(object);
  //   var mushroomLabel = createDesc("brickblock",1000)
  //   object.on('hover',function(m) {
  //     object.add( mushroomLabel );
  //   },function(m) {
  //     object.remove(mushroomLabel)
  //   });
  // });

  // loader.load(brickblock, function (object) {
  //   object.traverse(function (child) {
  //     if (child.isMesh) {
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });
  //   object.scale.set(1 / 30, 1 / 30, 1 / 30);
  //   object.position.set(700, 220, -206);
  //   scene.add(object);
  //   var mushroomLabel = createDesc("brickblock",1000)
  //   object.on('hover',function(m) {
  //     object.add( mushroomLabel );
  //   },function(m) {
  //     object.remove(mushroomLabel)
  //   });
  // });

  // loader.load(brickblock, function (object) {
  //   object.traverse(function (child) {
  //     if (child.isMesh) {
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });
  //   object.scale.set(1 / 30, 1 / 30, 1 / 30);
  //   object.position.set(646, 120, -700);
  //   scene.add(object);
  //   var mushroomLabel = createDesc("brickblock",1000)
  //   object.on('hover',function(m) {
  //     object.add( mushroomLabel );
  //   },function(m) {
  //     object.remove(mushroomLabel)
  //   });
  // });

  // loader.load(brickblock, function (object) {
  //   object.traverse(function (child) {
  //     if (child.isMesh) {
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });
  //   object.scale.set(1 / 30, 1 / 30, 1 / 30);
  //   object.position.set(700, 120, -646);
  //   scene.add(object);
  //   var mushroomLabel = createDesc("brickblock",1000)
  //   object.on('hover',function(m) {
  //     object.add( mushroomLabel );
  //   },function(m) {
  //     object.remove(mushroomLabel)
  //   });
  // });
  //
  // loader.load(brickblock, function (object) {
  //   object.traverse(function (child) {
  //     if (child.isMesh) {
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });
  //   object.scale.set(1 / 30, 1 / 30, 1 / 30);
  //   object.position.set(754, 120, -592);
  //   scene.add(object);
  //   var mushroomLabel = createDesc("brickblock",1000)
  //   object.on('hover',function(m) {
  //     object.add( mushroomLabel );
  //   },function(m) {
  //     object.remove(mushroomLabel)
  //   });
  // });

  // loader.load(brickblock, function (object) {
  //   object.traverse(function (child) {
  //     if (child.isMesh) {
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });
  //   object.scale.set(1 / 30, 1 / 30, 1 / 30);
  //   object.position.set(0, 220, -700);
  //   scene.add(object);
  //   var mushroomLabel = createDesc("brickblock",1000)
  //   object.on('hover',function(m) {
  //     object.add( mushroomLabel );
  //   },function(m) {
  //     object.remove(mushroomLabel)
  //   });
  // });

  // loader.load(brickblock, function (object) {
  //   object.traverse(function (child) {
  //     if (child.isMesh) {
  //       child.castShadow = true;
  //       child.receiveShadow = true;
  //     }
  //   });
  //   object.scale.set(1 / 30, 1 / 30, 1 / 30);
  //   object.position.set(-90, 120, -700);
  //   scene.add(object);
  //   var mushroomLabel = createDesc("brickblock",1000)
  //   object.on('hover',function(m) {
  //     object.add( mushroomLabel );
  //   },function(m) {
  //     object.remove(mushroomLabel)
  //   });
  // });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(-270, 120, -700);
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(-360, 220, -700);
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(-387, 220, -700);
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(-477, 220, -700);
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(-477, 220, -673);
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(-567, 220, -673);
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(-567, 120, -727);
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(-657, 220, -727);
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(-700, 120, -550);
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(-700, 120, -400);
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }

    });
    object.scale.set(1 / 10, 1 / 10, 1 / 30);
    object.position.set(-700, 33, 100);

    worldObject.moveingwall1 = object;
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }

    });
    object.scale.set(1 / 10, 1 / 10, 1 / 30);
    object.position.set(-700, 33, 350);

    worldObject.moveingwall2 = object;
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }

    });
    object.scale.set(1 / 10, 1 / 10, 1 / 30);
    object.position.set(-700, 33, 600);

    worldObject.moveingwall3 = object;
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(600, 120, 700);
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(542, 120, 700);
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(452, 220, 700);
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(352, 220, 700);

    worldObject.moveingbox1 = object;
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(325, 220, 700);

    worldObject.moveingbox2 = object;
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(175, 220, 700);

    worldObject.moveingbox3 = object;
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(148, 220, 700);

    worldObject.moveingbox4 = object;
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(48, 220, 700);
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(285, 43, 285);

    worldObject.moveingbox5 = object;
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(-285, 43, 285);

    worldObject.moveingbox6 = object;
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(285, 43, -285);

    worldObject.moveingbox7 = object;
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(brickblock, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(-285, 43, -285);

    worldObject.moveingbox8 = object;
    scene.add(object);
    var mushroomLabel = createDesc("brickblock",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

//qmark

  loader.load(qmark, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(700, 225, 51);
    scene.add(object);
    var mushroomLabel = createDesc("qmark",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(qmark, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(700, 125, -147);
    scene.add(object);
    var mushroomLabel = createDesc("qmark",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(qmark, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(673, 125, -667);
    scene.add(object);
    var mushroomLabel = createDesc("qmark",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(qmark, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(727, 125, -613);
    scene.add(object);
    var mushroomLabel = createDesc("qmark",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(qmark, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(-180, 225, -700);
    scene.add(object);
    var mushroomLabel = createDesc("qmark",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(qmark, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(-567, 225, -722);
    scene.add(object);
    var mushroomLabel = createDesc("qmark",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(qmark, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(-700, 225, -395);
    scene.add(object);
    var mushroomLabel = createDesc("qmark",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(qmark, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(-700, 125, 705);
    scene.add(object);
    var mushroomLabel = createDesc("qmark",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(qmark, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 30, 1 / 30, 1 / 30);
    object.position.set(571, 125, 705);
    scene.add(object);
    var mushroomLabel = createDesc("qmark",1000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });


//star

  loader.load(star, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 10, 1 / 10, 1 / 5);
    object.position.set(48, 320, 700);
    scene.add(object);
    var mushroomLabel = createDesc("star",300)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(star, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 10, 1 / 10, 1 / 5);
    object.position.set(700, 320, -300);
    scene.add(object);
    var mushroomLabel = createDesc("star",300)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(star, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 10, 1 / 10, 1 / 5);
    object.position.set(-700, 320, -700);
    scene.add(object);
    var mushroomLabel = createDesc("star",300)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(star, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 10, 1 / 10, 1 / 5);
    object.position.set(-700, 220, 700);
    scene.add(object);
    var mushroomLabel = createDesc("star",300)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

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
    var mushroomLabel = createDesc("smallCastle",2000)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

//fireflower

  loader.load(fireflower, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 20, 1 / 20, 1 / 20);
    object.position.set(700, 255, 50);
    scene.add(object);
    var mushroomLabel = createDesc("fireflower",300)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(fireflower, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 20, 1 / 20, 1 / 20);
    object.position.set(-180, 255, -700);
    scene.add(object);
    var mushroomLabel = createDesc("fireflower",300)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(fireflower, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 20, 1 / 20, 1 / 20);
    object.position.set(-700, 155, -545);
    scene.add(object);
    var mushroomLabel = createDesc("fireflower",300)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

//extraLife

  loader.load(extraLife, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 3, 1 / 3, 1 / 3);
    object.position.set(150, 45, 25);
    scene.add(object);
    var mushroomLabel = createDesc("extraLife",60)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });

  loader.load(goomba, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 5, 1 / 5, 1 / 5);
    object.position.set(90, 60, 25);
    scene.add(object);
    var mushroomLabel = createDesc("goomba",60)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
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
    // object.position.set(130, 55, 25);
    object.position.set(700, 70, 150);
    worldObject.boo = object;
    worldObject.boo.rotation.y += Math.PI;
    scene.add(object);
    var mushroomLabel = createDesc("boo",130)
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });
  });


  loader.load(mushroom, function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    object.scale.set(1 / 10, 1 / 10, 1 / 10);
    // object.position.set(240, 40, 25);
    object.position.set(700, 70, 80);
    worldObject.mushroom = object;
    scene.add(object);
    var mushroomLabel = createDesc("mushroom",55 )
    object.on('hover',function(m) {
      object.add( mushroomLabel );
    },function(m) {
      object.remove(mushroomLabel)
    });

  });
}

function createDesc(objName, objHeight){
  var objDiv = document.createElement( 'div' );
  objDiv.className = 'label';
  objDiv.textContent = objName;
  objDiv.style.marginTop = '-1em';
  var objLabel = new CSS2DObject( objDiv );
  objLabel.position.set( 10,objHeight,0);
  return objLabel;
}

var getObjectHalfSize = function(obj) {
  var objectBox = new THREE.Box3();
  objectBox.setFromObject(obj);
  return objectBox.max.clone().sub(objectBox.min).divideScalar(2);
};

export { loadModels, addAnimatedMario, updateMarioAnimation, addCoins };
