import { camera, controls, renderer, worldObject, globalObject } from "./scene";
import { updateMarioAnimation } from "./loader";

const registerEvents = () => {
  const onKeyDown = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        globalObject.moveForward = true;
        globalObject.marioState = 2;
        // updateMarioAnimation(2);
        break;
      case 37: // left
      case 65: // a
        globalObject.moveLeft = true;
        globalObject.marioState = 2;
        break;
      case 40: // down
      case 83: // s
        globalObject.moveBackward = true;
        globalObject.marioState = 2;
        break;
      case 39: // right
      case 68: // d
        globalObject.moveRight = true;
        globalObject.marioState = 2;
        break;
      case 32: // space
        if (globalObject.canJump) {
          globalObject.velocity.y += 100;
          worldObject.marioMain.position.y += 0.2;
          setTimeout(() => {
            worldObject.marioMain.position.y -= 0.2;
          }, 200);
        }
        globalObject.canJump = false;
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
        globalObject.marioState = 0;
        // updateMarioAnimation(0);
        break;
      case 37: // left
      case 65: // a
        globalObject.moveLeft = false;
        globalObject.marioState = 0;
        break;
      case 40: // down
      case 83: // s
        globalObject.moveBackward = false;
        globalObject.marioState = 0;

        break;
      case 39: // right
      case 68: // d
        globalObject.moveRight = false;
        globalObject.marioState = 0;

        break;
      case 13:
        controls.unlock();
        break;
      case 27:
        controls.isLocked ? controls.unlock() : controls.lock();
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
      controls.lock();
    },
    false
  );

  controls.addEventListener("lock", function () {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });

  controls.addEventListener("unlock", function () {
    blocker.style.display = "block";
    instructions.style.display = "";
  });
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
