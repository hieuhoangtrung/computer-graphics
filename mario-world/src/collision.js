import {camera, worldObject, scene, globalObject } from "./scene";
import {updateScore} from './loader';

const dist = 10;

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
  if (
    worldObject.coin &&
    worldObject.marioMain.position.distanceTo(worldObject.coin.position) < dist
  ) {
    scene.remove(worldObject.coin);
    globalObject.coinAudio.play();
    delete worldObject.coin;
    globalObject.score++;
    updateScore(globalObject.score);
  }
}

function handleGetMushroom() {
  const distance = 15;
  if (
    worldObject.mushroom &&
    worldObject.marioMain.position.distanceTo(worldObject.mushroom.position) < distance
  ) {
    scene.remove(worldObject.mushroom);
    globalObject.powerupAudio.play();
    delete worldObject.mushroom;
    globalObject.score++;
    updateScore(globalObject.score);
  }
}

export { handleCollisionWithEnemy, handleGetCoin, handleGetMushroom };
