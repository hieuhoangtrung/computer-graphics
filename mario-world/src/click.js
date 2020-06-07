import * as THREE from '../build/three.module.js';

import { DragControls } from './jsm/controls/DragControls.js';

var container;
var camera, scene, renderer;
var controls, group;
var objects = [];
var enableSelection = false;

var mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();

init();

function init() {

    document.body.appendChild( container );

    container.appendChild( renderer.domElement );

    controls = new DragControls( [ ... objects ], camera, renderer.domElement );
    controls.addEventListener( 'drag', render );

//
    document.addEventListener( 'click', onClick, false );
    window.addEventListener( 'keydown', onKeyDown, false );
    window.addEventListener( 'keyup', onKeyUp, false );

    render();

}


function onKeyDown( event ) {
    enableSelection = ( event.keyCode === 16 ) ? true : false;
}

function onKeyUp() {
    enableSelection = false;
}

function onClick( event ) {
    
    event.preventDefault();

    if ( enableSelection === true ) {

        var draggableObjects = controls.getObjects();
        draggableObjects.length = 0;

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );

        var intersections = raycaster.intersectObjects( objects, true );

        if ( intersections.length > 0 ) {

            var object = intersections[ 0 ].object;

            if ( group.children.includes( object ) === true ) {

                object.material.emissive.set( 0x000000 );
                scene.attach( object );

            } else {

                object.material.emissive.set( 0xaaaaaa );
                group.attach( object );

            }

            controls.transformGroup = true;
            draggableObjects.push( group );

        }

        if ( group.children.length === 0 ) {

            controls.transformGroup = false;
            draggableObjects.push( ...objects );

        }

    }

    render();

}

function render() {

    renderer.render( scene, camera );

}