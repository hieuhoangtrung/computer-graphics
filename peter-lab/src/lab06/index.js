// import * as THREE from '../build/three.module.js';
import Stats from '../shared/stats.module.js';
import '../shared/OrbitControls';
import { FBXLoader } from '../shared/FBXLoader.js';
import marioMesh from '../models/mario/animations/Run.fbx';
import yoshiSchool from '../models/yoshi4school.fbx';
import grassGround from '../../images/grasslight-big.jpg';
import '../shared/ColladaLoader.js';
import goombaFile from "../lab08/models/goomba.dae";
import mushroomFile from "../lab08/models/mushroom.dae";

var container, stats, controls;
var camera, scene, renderer, light;

var clock = new THREE.Clock();

var marioAnimation;
var castle;
var mario;
var temp = new THREE.Vector3;
var goomba;
var mushroom;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(100, 200, 300);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    // scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 200, 100);
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    scene.add(light);
    // scene.add( new CameraHelper( light.shadow.camera ) );

    // ground
    // var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
    // mesh.rotation.x = - Math.PI / 2;
    // mesh.receiveShadow = true;
    // scene.add(mesh);

    var texttureLoader = new THREE.TextureLoader();
    var groundTexture = texttureLoader.load( grassGround );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;
    var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );
    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
    mesh.position.y = - 250;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    // grid.material.opacity = 0.2;
    // grid.material.transparent = true;
    // scene.add(grid);

    // model
    var loader = new FBXLoader();
    loader.load(yoshiSchool, function (object) {
        var sca = new THREE.Matrix4();
        sca.makeScale(2, 2, 2);
        object.applyMatrix(sca);
        castle = new THREE.AnimationMixer(object);
        var action = castle.clipAction(object.animations[0]);
        action.play();
        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // scene.add(object);
    });

    loader.load(marioMesh, function (object) {
        var sca = new THREE.Matrix4();
        var tra = new THREE.Matrix4();

        var ScaleFact = 10;
        sca.makeScale(ScaleFact, ScaleFact, ScaleFact);
        tra.makeTranslation(185, 50, 25);

        object.applyMatrix(sca);
        object.applyMatrix(tra);

        marioAnimation = new THREE.AnimationMixer(object);

        var action = marioAnimation.clipAction(object.animations[0]);
        action.play();

        object.traverse(function (child) {
            if (child.isMesh) {

                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        mario = object;
        scene.add(object);
        temp.set(mario.position.x, mario.position.y + 20, mario.position.z - 50);
        camera.position.lerp(temp, 1);
        // camera.rotation.x += Math.PI / 4;
        camera.lookAt(mario.position);
        // controls.update();
    });

    addEnemies();
    addFellows();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 100, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize, false);

    // stats
    stats = new Stats();
    container.appendChild(stats.dom);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {

    requestAnimationFrame(animate);

    var delta = clock.getDelta();

    if (marioAnimation) marioAnimation.update(delta);
    if (castle) castle.update(delta);
    if (mario) {
        // temp.set(mario.position.x, mario.position.y + 20, mario.position.z - 50);
        // camera.position.lerp(temp, 1);
        // camera.lookAt( mario.position );
    }

    renderer.render(scene, camera);

    stats.update();

}

// movement
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    switch (keyCode) {
        case 65: // a
            mario.position.x += 2;
            break;
        case 68: // d
            mario.position.x -= 2;
            break;
        case 87: // w
            mario.position.z += 2;
            break;
        case 83: // s
            mario.position.z -= 2;
            break;
        case 32: {
            // mario.position.set(0, 0, 0);
            mario.position.y += 10.0;
            setTimeout(() => {
                mario.position.y -= 10.0;
            }, 100);
            break;
        }
        case 90:
            mario.rotation.y += Math.PI / 2;
        default:
            console.log(mario.position, 'mario position');
            break;
    }
    animate();
};

function addEnemies() {
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load(goombaFile, function (collada) {
        goomba = collada.scene;
        // var x = Math.floor(Math.random() * maxBounding) - maxBounding;
        // var z = Math.floor(Math.random() * maxBounding) - maxBounding;
        goomba.scale.set(1/5, 1/5, 1/5);
        goomba.position.set(170, 50, 25);
        scene.add(goomba);
        // var goombaDirection = new THREE.Vector3(0.015, 0, 0.025);
        // lookAtDirection(goomba, goombaDirection);
    });
}

// //Apply control on mouse-select
// var raycaster = new THREE.Raycaster();
// var selectedObj = false;

// //add event listener to the model
// function onDocumentMouseDown(event) {

//     var mouse = new THREE.Vector2;
//     mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
//     mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

//     raycaster.setFromCamera(mouse, camera);

//     var intersects = raycaster.intersectObjects(scene.children, false);
//     console.log(intersects, 'intersects');
//     if (intersects.length > 0) {
//         if (!selectedObj)
//         {
//             console.log("Selected!");
//             // intersects[ 0 ].object.material.color = new THREE.Color(1, 1.5, 155);
//             selectedObj = true;
//         }
//         if (selectedObj)
//         {
//             // mixer.material.color = new THREE.Color(1, 1, 10);
//             var pos = intersects[0].point;
//             console.log("Placed!");
//             // mixer.position.x = pos.x;
//             // mixer.position.y = pos.y;
//             selectedObj = false;
//         }
//     }
// }
// document.addEventListener('mousedown', onDocumentMouseDown, false);

function lookAtDirection(object, vector) {
    var lookAt = new THREE.Vector3();
    lookAt.addVectors(vector, object.position);
    object.lookAt(lookAt);
}

function addFellows() {
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load(mushroomFile, function (collada) {
        mushroom = collada.scene;
        // var x = Math.floor(Math.random() * maxBounding) - maxBounding;
        // var z = Math.floor(Math.random() * maxBounding) - maxBounding;
        mushroom.scale.set(1/5, 1/5, 1/5);
        mushroom.position.set(150, 50, 25);
        scene.add(mushroom);
    });
}