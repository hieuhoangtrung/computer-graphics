import './OrbitControls';

//create the scene
const scene = new THREE.Scene();
var ratio = window.innerWidth/window.innerHeight;
//create the perspective camera
//for parameters see https://threejs.org/docs/#api/cameras/PerspectiveCamera
var camera = new THREE.PerspectiveCamera(45,ratio,0.1,1000);

//set the camera position
camera.position.set(0,0,15);
// and the direction
camera.lookAt(0,0,1);

//create the webgl renderer
var renderer = new THREE.WebGLRenderer();

//set the size of the rendering window
renderer.setSize(window.innerWidth,window.innerHeight);

//add the renderer to the current document
document.body.appendChild(renderer.domElement);

//create the material of the cube (basic material)
var material_cube = new THREE.MeshBasicMaterial();
//set the color of the cube
material_cube.color=  new THREE.Color(0,1,0);
//then set the renderer to wireframe
material_cube.wireframe=true;
//create the mesh of a cube
var geometry_cube = new THREE.BoxGeometry(2,2,2);
var cube = new THREE.Mesh(geometry_cube,material_cube);

// //and add to the scene
scene.add(cube);

//////////////
// CONTROLS //
//////////////

// move mouse and: left   click to rotate,
//                 middle click to zoom,
//                 right  click to pan
// add the new control and link to the current camera to transform its position

var controls = new THREE.OrbitControls(camera, renderer.domElement);

//final update loop
var MyUpdateLoop = function ()
{
  //call the render with the scene and the camera
  renderer.render(scene,camera);

  for (var i = 0; i < 36; i++) {

    // cubes[i].rotation.x+=0.01;
    // cubes[i].rotation.y+=0.01;
    cubes[i].rotation.z+=0.01;

  }

  controls.update();

  //finally perform a recoursive call to update again
  //this must be called because the mouse change the camera position
  requestAnimationFrame(MyUpdateLoop);

};

requestAnimationFrame(MyUpdateLoop);

//this function is called when the window is resized
var MyResize = function ()
{
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width,height);
  camera.aspect = width/height;
  camera.updateProjectionMatrix();
  renderer.render(scene,camera);
};

//link the resize of the window to the update of the camera
window.addEventListener('resize', MyResize);
var cubes = [];
var n = 36;
function createCubes() {
  for (var i = 0; i < 36; i++) {
    var rot1 = new THREE.Matrix4();
    var rot2 = new THREE.Matrix4();
    var sca = new THREE.Matrix4();
    var tra = new THREE.Matrix4();
    var com = new THREE.Matrix4();

    sca.makeScale(0.5, 2, 1.5);
    rot1.makeRotationY(i*(2*Math.PI/n));
    rot2.makeRotationZ(i*(Math.PI/n));
    tra.makeTranslation(10, 0, 0);

    com.multiply(rot1);
    com.multiply(tra);
    // com.multiply(rot2);
    com.multiply(sca);

    cubes[i] = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 8),
      new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true}));
    cubes[i].applyMatrix(com);
    scene.add(cubes[i]);
  }
}

//Create the ground
var plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 10, 5, 10),
  new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true}));
plane.rotation.x = -Math.PI * 0.5;
scene.add(plane);
createCubes();

//create the ball
var ball = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 8),
  new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true}));
scene.add(ball);

//use THREE current clock
var clock = new THREE.Clock();
var time = 0;
var delta = 0;

function render() {
  requestAnimationFrame(render);//repaint the window after every iteration --> call-in render method(recuresively)
  delta = clock.getDelta(); // update the THREE clock
  time += delta; // update the function internal timer
  ball.rotation.x = time * 4; //rotate relatively to the function timer
  ball.position.y = 0.5 + Math.abs(Math.sin(time * 3)) * 2; // change the ball y-pos relatively with the time
  ball.position.z = Math.cos(time) * 4; // change the ball z-pos relatively with the time
  renderer.render(scene, camera);
}

camera.position.set(2, 3, 5);
camera.lookAt(scene.position);
render();

