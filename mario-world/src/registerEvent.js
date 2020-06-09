import { camera, controls, renderer, worldObject, globalObject } from "./scene";
import { updateMarioAnimation } from "./loader";

const registerEvents = () => {
  const onKeyDown = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        globalObject.moveForward = true;
        updateMarioAnimation(2);
        globalObject.marioState = 2;
        break;
      case 37: // left
      case 65: // a
        globalObject.moveLeft = true;
        updateMarioAnimation(2);
        globalObject.marioState = 2;
        break;
      case 40: // down
      case 83: // s
        globalObject.moveBackward = true;
        updateMarioAnimation(2);
        globalObject.marioState = 2;
        break;
      case 39: // right
      case 68: // d
        globalObject.moveRight = true;
        updateMarioAnimation(2);
        globalObject.marioState = 2;
        break;
      case 32: // space
        globalObject.velocity.y += 100;
        worldObject.marioMain.position.y += 30;
        updateMarioAnimation(1);
        globalObject.marioState = 1;
        setTimeout(() => {
          worldObject.marioMain.position.y -= 30;
        }, 1000);
        break;
      default:
        break;
    }
  };
  const onKeyUp = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        globalObject.moveForward = false;
        setTimeout(()=> {
          updateMarioAnimation(0);
          globalObject.marioState = 0;
        }, 100);
        break;
      case 37: // left
      case 65: // a
        globalObject.moveLeft = false;
        setTimeout(()=> {
          updateMarioAnimation(0);
          globalObject.marioState = 0;
        }, 100);
        break;
      case 40: // down
      case 83: // s
        globalObject.moveBackward = false;
        setTimeout(()=> {
          updateMarioAnimation(0);
          globalObject.marioState = 0;
        }, 100);
        break;
      case 39: // right
      case 68: // d
        globalObject.moveRight = false;
        setTimeout(()=> {
          updateMarioAnimation(0);
          globalObject.marioState = 0;
        }, 100);
        break;
      case 32:
        setTimeout(()=> {
          updateMarioAnimation(0);
          globalObject.marioState = 0;
        }, 1000);
        break;
      case 13:
        globalObject.unlock();
        break;
      case 27:
        globalObject.isLocked ? globalObject.unlock() : globalObject.lock();
        break;
      default:
        break;
    }
  };

  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  instructions.addEventListener(
    "click",
    function () {
      globalObject.lock();
      globalObject.isLocked = true;
    },
    false
  );
  globalObject.lock = function () {
    instructions.style.display = "none";
    blocker.style.display = "none";
    globalObject.isLocked = true;
  };
  globalObject.unlock = function () {
    blocker.style.display = "block";
    instructions.style.display = "";
    globalObject.isLocked = false
  }

  document.addEventListener("keydown", onKeyDown, false);
  document.addEventListener("keyup", onKeyUp, false);

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", onWindowResize, false);
};

export { registerEvents };
