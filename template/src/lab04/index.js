import '../shared/OrbitControls';
//Declare Systen Variables
var scene;
var camera;
var renderer;
var geometry;
var controls;
var material;
var cubes = [];
var n = 36;

//Setup the Scene
function setupScene() {
  scene = new THREE.Scene( );
  var ratio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
  camera.position.set(0, 0, 15);
  camera.lookAt(0, 0, 1);

  renderer = new THREE.WebGLRenderer( );
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  material = new THREE.MeshLambertMaterial();
  material.color = new THREE.Color(1, 0, 0);
  material.wireframe = false;
  geometry = new THREE.BoxGeometry(1, 1, 1);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
}
setupScene();

//Animate the Geometries
var animateGeometries = function ( )
{
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animateGeometries);
};
requestAnimationFrame(animateGeometries);

//Resize the Scene with the window
var resizeScene = function ( )
{
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
};
window.addEventListener('resize', resizeScene);

//Add Lighting to the scene
function addLight() {
  //lighting
  //basic light from camera towards the scene
  var cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 0.5);
  camera.add(cameralight);
  scene.add(camera);

  //then add ambient
  //ambient lighting
  var ambientlight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.2);
  scene.add(ambientlight);
}
addLight();

//Lab 4 - Create a sphere to the scene
function createSphere(){
  var sphere_color = new THREE.Color(0.8,1,1);
  var sphere_geometry = new THREE.SphereGeometry(2,32,32);
  var sphere_material = new THREE.MeshPhongMaterial();

  sphere_material.color = sphere_color;
  let sphere_material_shininess = 100;

  sphere_material.wireframe = false;
  var sphere_mesh = new THREE.Mesh(sphere_geometry,sphere_material);
  scene.add(sphere_mesh);
}

//Lab 4 - Update the scene and add a sphere
function CreateScene()
{
  for (var i = 0; i < n; i++)
  {
    var rot2 = new THREE.Matrix4();
    var sca = new THREE.Matrix4();
    var rot = new THREE.Matrix4();
    var tra = new THREE.Matrix4();
    var combined = new THREE.Matrix4();
    sca.makeScale(0.5, 3, 1.5);
    rot2.makeRotationZ(i * (Math.PI / n));
    tra.makeTranslation(10, 0, 0);
    rot.makeRotationY(i * (2 * Math.PI / n));
    combined.multiply(rot);
    combined.multiply(tra);
    combined.multiply(rot2);
    combined.multiply(sca);
    cubes[i] = new THREE.Mesh(geometry, material);
    cubes[i].applyMatrix(combined);
    cubes[i].geometry.computeBoundingBox();
    scene.add(cubes[i]);
  }
  //Add the Sphere to the scene
  createSphere();
}
CreateScene();
