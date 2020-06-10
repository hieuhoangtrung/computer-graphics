import {camera, worldObject, scene, globalObject } from "./scene";
import {updateScore} from './loader';

const dist = 15;

function handleCollisionWithEnemy() {
  if (
    worldObject.boo &&
    worldObject.marioMain.position.distanceTo(worldObject.boo.position) < dist
  ) {
    scene.remove(worldObject.boo);
    globalObject.powerdownAudio.play();
    delete worldObject.boo;
    globalObject.score--;
    updateScore(globalObject.score);
  }
}

function handleGetCoin() {
  for (let index = 1; index < 16; index++) {
    getOneCoin("coin"+index);
  }
}

function getOneCoin(name) {
  if (
    worldObject[name] &&
    worldObject.marioMain.position.distanceTo(worldObject[name].position) < dist
  ) {
    scene.remove(worldObject[name]);
    globalObject.coinAudio.play();
    delete worldObject[name];
    globalObject.score++;
    updateScore(globalObject.score);
  }
}

function handleGetMushroom() {
  for (let index = 1; index < 13; index++) {
    getOneMush("mushroom"+index);
  }
}

function getOneMush(name){
  var distance = 10;
  if (
    worldObject[name] &&
    worldObject.marioMain.position.distanceTo(worldObject[name].position) < distance
  ) {
    scene.remove(worldObject[name]);
    globalObject.powerupAudio.play();
    delete worldObject[name];
    globalObject.score++;
    updateScore(globalObject.score);
  }
}

export { handleCollisionWithEnemy, handleGetCoin, handleGetMushroom };
