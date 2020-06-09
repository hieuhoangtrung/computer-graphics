import { Sky } from 'three/examples/jsm/objects/Sky';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import {scene} from "./scene"

var sky = new Sky();
var uniforms = sky.material.uniforms;

function initSky(){
  sky.scale.setScalar( 450000 );
  scene.add( sky );
  var effectController = {
    turbidity: 10,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1,
    sun: ! true
  };


  function guiChanged() {

    var uniforms = sky.material.uniforms;
    uniforms[ "turbidity" ].value = effectController.turbidity;
    uniforms[ "rayleigh" ].value = effectController.rayleigh;
    uniforms[ "mieCoefficient" ].value = effectController.mieCoefficient;
    uniforms[ "mieDirectionalG" ].value = effectController.mieDirectionalG;
    uniforms[ "luminance" ].value = effectController.luminance;

}

var gui = new GUI();

gui.add( effectController, "turbidity", 1.0, 20.0, 0.1 ).onChange( guiChanged );
gui.add( effectController, "rayleigh", 0.0, 4, 0.001 ).onChange( guiChanged );
gui.add( effectController, "mieCoefficient", 0.0, 0.1, 0.001 ).onChange( guiChanged );
gui.add( effectController, "mieDirectionalG", 0.0, 1, 0.001 ).onChange( guiChanged );
gui.add( effectController, "luminance", 0.0, 2 ).onChange( guiChanged );
// gui.add( effectController, "inclination", 0, 1, 0.0001 ).onChange( guiChanged );
// gui.add( effectController, "azimuth", 0, 1, 0.0001 ).onChange( guiChanged );
// gui.add( effectController, "sun" ).onChange( guiChanged );

guiChanged();
  
  // uniforms[ "turbidity" ].value = effectController.turbidity;
  // uniforms[ "rayleigh" ].value = effectController.rayleigh;
  // uniforms[ "mieCoefficient" ].value = effectController.mieCoefficient;
  // uniforms[ "mieDirectionalG" ].value = effectController.mieDirectionalG;
  // uniforms[ "luminance" ].value = effectController.luminance;
 
}

function shaderSky(sun){
  
  // sun.position.x -= 2000;
  // sun.position.y -= 50;
    
  uniforms[ "sunPosition" ].value.copy( sun.position );
}

export { initSky,shaderSky}