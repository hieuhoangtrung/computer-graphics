import coinAudioFile from "./sounds/coin.wav";
import powerDownAudioFile from "./sounds/power-down.wav";
import powerUpAudioFile from "./sounds/power-up.wav"


var MOVE_SPEED = 1;


var isVr = window.location.hash === '#VR';

// Last time the scene was rendered.
var lastRenderTime = 0;
// Currently active VRDisplay.
var vrDisplay;
// How big of a box to render.
var boxSize = 30;
var maxBounding = (boxSize / 2) - 1;
// Various global THREE.Objects.
var renderer;
var scene;
var coin;
var goomba;
var mushroom;
var controls;
var effect;
var camera;
var dollyCam;
var font;
var score = 0;
var scoreCounter;
var poweredUp = false;
// EnterVRButton for rendering enter/exit UI.
var vrButton;
var coinAudio;
var powerdownAudio;
var powerupAudio;
var clock = new THREE.Clock();

var keys = {
    forward: false,
    left: false,
    backward: false,
    right: false,
    moving: false
};
var moving = false;

var moveVector = new THREE.Vector3();
var leftVector = new THREE.Vector3();
var scratchVector = new THREE.Vector3();
var leftRotateMatrix = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3( 0, 1, 0 ), Math.PI / 2);

var goombaDirection;

function onLoad() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // getMoving();
    loadSounds();

    scene = new THREE.Scene();
    setCamera();
    addLights();
    addSceneElements();
    addEnemies();
    addFellows();
    addScoreCounter();

    // initWebVR();

    window.addEventListener('resize', onResize, true);
    window.addEventListener('vrdisplaypresentchange', onResize, true);
    window.addEventListener('keydown', moveOnKeydown, false);
    window.addEventListener('keyup', stopOnKeyup, false);
}

// function getMoving() {
//     if (isVr) {
//         firebase.database().ref('moving').on('value', function (snapshot) {
//             keys = snapshot.val();
//             if (keys.moving) {
//                 startMoving();
//             } else {
//                 stopMoving();
//             }
//         });
//     }
// }

function setCamera() {
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);

    // controls = new THREE.VRControls(camera);
    // controls.standing = true;
    // camera.position.y = controls.userHeight;

    dollyCam = new THREE.Group();
    dollyCam.position.set( 0, 0, 0 );
    dollyCam.add(camera);
    scene.add(dollyCam);
}

function addSceneElements() {
    // Add a repeating grid as a skybox.
    var loader = new THREE.TextureLoader();
    loader.load('img/box.png', addSkybox);

    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('models/coin.dae', function (collada) {
        coin = collada.scene;
        coin.position.set(0, controls.userHeight, -1);
        scene.add(coin);
    });
}

function addEnemies() {
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('models/goomba.dae', function (collada) {
        goomba = collada.scene;
        var x = Math.floor(Math.random() * maxBounding) - maxBounding;
        var z = Math.floor(Math.random() * maxBounding) - maxBounding;
        goomba.position.set(x, 0, z);
        scene.add(goomba);
        goombaDirection = new THREE.Vector3(0.015, 0, 0.025);
        lookAtDirection(goomba, goombaDirection);
    });
}

function addFellows() {
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('models/mushroom.dae', function (collada) {
        mushroom = collada.scene;
        var x = Math.floor(Math.random() * maxBounding) - maxBounding;
        var z = Math.floor(Math.random() * maxBounding) - maxBounding;
        mushroom.position.set(x, 0, z);
        scene.add(mushroom);
    });
}

function lookAtDirection(object, vector) {
    var lookAt = new THREE.Vector3();
    lookAt.addVectors(vector, object.position);
    object.lookAt(lookAt);
}

function addLights() {
    var ambientLight, shadowLight;
    ambientLight = new THREE.AmbientLight( 0x404040 );

    // A directional light shines from a specific direction.
    // It acts like the sun, that means that all the rays produced are parallel.
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    // Set the direction of the light
    shadowLight.position.set(150, 350, 350);

    // Allow shadow casting
    shadowLight.castShadow = true;

    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    // define the resolution of the shadow; the higher the better,
    // but also the more expensive and less performant
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    // to activate the lights, just add them to the scene
    scene.add(ambientLight);
    scene.add(shadowLight);
}

function loadSounds() {
    coinAudio = new Audio(coinAudioFile);
    powerdownAudio = new Audio(powerDownAudioFile);
    powerupAudio = new Audio(powerUpAudioFile);
    coinAudio.addEventListener('play', function () {
        coinAudio.pause();
        coinAudio.removeEventListener('play', arguments.callee, false);
    }, false);
    powerdownAudio.addEventListener('play', function () {
        powerdownAudio.pause();
        powerdownAudio.removeEventListener('play', arguments.callee, false);
    }, false);
    powerupAudio.addEventListener('play', function () {
        powerupAudio.pause();
        powerupAudio.removeEventListener('play', arguments.callee, false);
    }, false);
    window.addEventListener("touchstart", function() {
        window.removeEventListener('touchstart', arguments.callee, false);
        coinAudio.play();
        powerdownAudio.play();
        powerupAudio.play();
    }, false);
}

// function initWebVR() {
//     var uiOptions = {
//         color: 'black',
//         background: 'white',
//         corners: 'square'
//     };
//     vrButton = new webvrui.EnterVRButton(renderer.domElement, uiOptions);
//     vrButton.on('exit', function() {
//         camera.quaternion.set(0, 0, 0, 1);
//         camera.position.set(0, controls.userHeight, 0);
//     });
//     vrButton.on('hide', function() {
//         document.getElementById('ui').style.display = 'none';
//     });
//     vrButton.on('show', function() {
//         document.getElementById('ui').style.display = 'inherit';
//     });
//     document.getElementById('vr-button').appendChild(vrButton.domElement);
//     document.getElementById('magic-window').addEventListener('click', function() {
//         vrButton.requestEnterFullscreen();
//     });
//     // Apply VR stereo rendering to renderer.
//     // effect = new THREE.VREffect(renderer);
//     // effect.setSize(window.innerWidth, window.innerHeight);
// }

function addSkybox(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(boxSize, boxSize);

    var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0x01BE00,
        side: THREE.BackSide
    });

    // Align the skybox to the floor (which is at y=0).
    skybox = new THREE.Mesh(geometry, material);
    skybox.position.y = boxSize/2;
    scene.add(skybox);

    // For high end VR devices like Vive and Oculus, take into account the stage
    // parameters provided.
    setupStage();
}

function addScoreCounter() {
    var loader = new THREE.FontLoader();
    loader.load( 'node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function ( f ) {
        font = f;
        updateScore();
    });
}

function updateScore() {
    if (scoreCounter) {
        scene.remove(scoreCounter);
    }
    var geometry = new THREE.TextGeometry( 'SCORE: ' + score, {
        font: font,
        size: 1, // font size
        height: 0.1, // how much extrusion (how thick / deep are the letters)
    });
    geometry.computeBoundingBox();
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff } );
    scoreCounter = new THREE.Mesh( geometry, material );
    scoreCounter.position.x =  - geometry.boundingBox.max.x / 2;
    scoreCounter.position.y = maxBounding / 2;
    scoreCounter.position.z = -(maxBounding + 1);
    scoreCounter.castShadow = true;
    scoreCounter.receiveShadow = true;
    scene.add( scoreCounter );
}

// Request animation frame loop function
function animate(timestamp) {
    updatePosition();
    var delta = Math.min(timestamp - lastRenderTime, 500);
    lastRenderTime = timestamp;

    // Apply rotation to coin
    coin.rotation.y += delta * 0.0006 * 5;

    handleGetCoin();
    handleEnemyWallCollision();
    handleCollisionWithEnemy();
    handleGetMushroom();

    // Only update controls if we're presenting.
    if (vrButton.isPresenting()) {
        controls.update();
    }
    // Render the scene.
    // effect.render(scene, camera);

    vrDisplay.requestAnimationFrame(animate);
}

function handleGetCoin() {
    var dist = 1.61;
    if( dollyCam.position.distanceTo(coin.position) < dist) {
        var x = Math.floor(Math.random() * maxBounding) - maxBounding;
        var z = Math.floor(Math.random() * maxBounding) - maxBounding;
        coin.position.set(x, controls.userHeight, z);
        score++;
        updateScore();
        coinAudio.play();
    }
}

function handleEnemyWallCollision() {
    if (goomba.position.x > maxBounding || goomba.position.x < -maxBounding || goomba.position.z > maxBounding || goomba.position.z < -maxBounding) {
        var signX = (goomba.position.x > maxBounding || goomba.position.x < -maxBounding ? -1 : 1) * Math.sign(goombaDirection.x);
        var signZ = (goomba.position.z > maxBounding || goomba.position.z < -maxBounding ? -1 : 1) * Math.sign(goombaDirection.z);
        var x = Math.random() * (0.025 - 0.015) + 0.015;
        var z = Math.random() * (0.025 - 0.015) + 0.015;
        goombaDirection = new THREE.Vector3(x * signX, 0, z * signZ);
        lookAtDirection(goomba, goombaDirection);
    }
    goomba.position.add(goombaDirection);
}

function handleGetMushroom() {
    var dist = 1.61;
    if(mushroom && dollyCam.position.distanceTo(mushroom.position) < dist) {
        scene.remove(mushroom);
        powerUp();
    }
}

function powerUp() {
    if (!poweredUp) {
        poweredUp = true;
        powerupAudio.play();
        MOVE_SPEED = 3;
        skybox.material.color.setHex(0xff0000);
        setTimeout(function () {
            powerDown();
        }, 10 * 1000);
    }
}

function powerDown() {
    if (poweredUp) {
        poweredUp = false;
        MOVE_SPEED = 1;
        skybox.material.color.setHex(0x01BE00);
        var x = Math.floor(Math.random() * maxBounding) - maxBounding;
        var z = Math.floor(Math.random() * maxBounding) - maxBounding;
        mushroom.position.set(x, 0, z);
        setTimeout(function () {
            scene.add(mushroom);
        }, 10 * 1000);
    }
}

function handleCollisionWithEnemy() {
    var dist = 1.61;
    if( dollyCam.position.distanceTo(goomba.position) < dist) {
        var x = Math.floor(Math.random() * maxBounding) - maxBounding;
        var z = Math.floor(Math.random() * maxBounding) - maxBounding;
        goomba.position.set(x, 0, z);
        if (score > 0) {
            score--;
        }
        updateScore();
        powerdownAudio.play();
        powerDown();
    }
}

function onResize(e) {
    // effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

// Get the HMD, and if we're dealing with something that specifies
// stageParameters, rearrange the scene.
function setupStage() {
    // navigator.getVRDisplays().then(function(displays) {
    //     if (displays.length > 0) {
    //         vrDisplay = displays[0];
    //         if (vrDisplay.stageParameters) {
    //             setStageDimensions(vrDisplay.stageParameters);
    //         }
    //         vrDisplay.requestAnimationFrame(animate);
    //     }
    // });
}

function setStageDimensions(stage) {
    // Make the skybox fit the stage.
    var material = skybox.material;
    scene.remove(skybox);

    // Size the skybox according to the size of the actual stage.
    var geometry = new THREE.BoxGeometry(stage.sizeX, boxSize, stage.sizeZ);
    skybox = new THREE.Mesh(geometry, material);

    // Place it on the floor.
    skybox.position.y = boxSize/2;
    scene.add(skybox);

    // Place the star in the middle of the scene, at user height.
    coin.position.set(0, controls.userHeight, 0);
}

function moveOnKeydown(evt) {
    if (evt.keyCode === 38) { //up
        keys.forward = true;
        startMoving();
    } else if (evt.keyCode === 40) { //down
        keys.backward = true;
        startMoving();
    } else if (evt.keyCode === 37) { //left
        keys.left = true;
        startMoving();
    } else if (evt.keyCode === 39) { //right
        keys.right = true;
        startMoving();
    }
}

function stopOnKeyup(evt) {
    if (evt.keyCode === 38) { //up
        keys.forward = false;
        stopMoving();
    } else if (evt.keyCode === 40) { //down
        keys.backward = false;
        stopMoving();
    } else if (evt.keyCode === 37) { //left
        keys.left = false;
        stopMoving();
    } else if (evt.keyCode === 39) { //right
        keys.right = false;
        stopMoving();
    }
}

function startMoving() {
    if (!moving) {
        // start moving in whichever direction the camera is looking
        moveVector.set(0, 0, 1).applyQuaternion(camera.quaternion);

        //only move along the ground
        moveVector.setY(0).normalize();

        leftVector.copy(moveVector).applyMatrix4(leftRotateMatrix);
        moving = true;
        keys.moving = true;
    }
    updateMoving();
}

function stopMoving() {
    updatePosition();
    moving = false;
    keys.moving = false;
    updateMoving();
}

function updatePosition() {
    var delta = clock.getDelta();

    if (moving) {
        if (keys.forward) {
            scratchVector.copy(moveVector).multiplyScalar(-delta * MOVE_SPEED);
            dollyCam.position.add(scratchVector);
        } else if (keys.backward) {
            scratchVector.copy(moveVector).multiplyScalar(delta * MOVE_SPEED);
            dollyCam.position.add(scratchVector);
        }

        if (keys.left) {
            scratchVector.copy(leftVector).multiplyScalar(-delta * MOVE_SPEED);
            dollyCam.position.add(scratchVector);
        } else if (keys.right) {
            scratchVector.copy(leftVector).multiplyScalar(delta * MOVE_SPEED);
            dollyCam.position.add(scratchVector);
        }
    }
}

function updateMoving() {
    if (!isVr) {
        firebase.database().ref('moving').set(keys);
    }
}

window.addEventListener('load', onLoad);