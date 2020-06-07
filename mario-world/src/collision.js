import { camera, worldObject, scene, globalObject } from './scene';

const dist = 10;

function handleCollisionWithEnemy() {
  if (worldObject.boo && camera.position.distanceTo(worldObject.boo.position) < dist) {
    scene.remove(worldObject.boo);
    globalObject.powerdownAudio.play();
    delete worldObject.boo;
  }
}

function handleGetCoin() {
  if (worldObject.coin && camera.position.distanceTo(worldObject.coin.position) < dist) {
    scene.remove(worldObject.coin);
    globalObject.coinAudio.play();
    delete worldObject.coin;
  }
}

function handleGetMushroom() {
  const distance = 15;
  if (worldObject.mushroom && camera.position.distanceTo(worldObject.mushroom.position) < distance) {
    scene.remove(worldObject.mushroom);
    globalObject.powerupAudio.play();
    delete worldObject.mushroom;
  }
}

export { handleCollisionWithEnemy, handleGetCoin, handleGetMushroom };
