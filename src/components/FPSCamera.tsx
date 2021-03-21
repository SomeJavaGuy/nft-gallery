//Based on example found online and adapted for NFT Gallery!

import { useFrame, useThree } from "react-three-fiber";
import * as THREE from "three";

const FPSCamera = ({
  mouseMoveSensitivity = 0.002,
  speed = 800.0,
  jumpHeight = 350.0,
  height = 0,
  ...props
}) => {
  let { scene, camera, gl } = useThree();

  camera.near = 0.01;

  camera.position.setX(0);
  camera.position.setY(0);
  camera.position.setZ(0);

  var enabled = false;
  var jumpHeight = height + jumpHeight;
  var click = false;

  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;
  var canJump = false;
  var run = false;

  var velocity = new THREE.Vector3();
  var direction = new THREE.Vector3();

  var prevTime = performance.now();

  //camera.rotation.set(0, 0, 0);

  var pitchObject = new THREE.Object3D();
  pitchObject.add(camera);

  var yawObject = new THREE.Object3D();
  yawObject.position.y = 0;
  yawObject.add(pitchObject);

  scene.add(yawObject);

  var PI_2 = Math.PI / 2;

  //
  // Locking pointer
  //

  var instructions = document.querySelector("#instructions");
  var havePointerLock =
    "pointerLockElement" in document ||
    "mozPointerLockElement" in document ||
    "webkitPointerLockElement" in document;
  if (havePointerLock) {
    console.log("Pointer lock");
    var element: any = document.body;
    var pointerlockchange = function (event: any) {
      if (
        document.pointerLockElement === element ||
        (document as any).mozPointerLockElement === element ||
        (document as any).webkitPointerLockElement === element
      ) {
        enabled = true;
        (instructions as any).style.display = "none";
      } else {
        enabled = false;
        (instructions as any).style.display = "flex";
      }
    };
    var pointerlockerror = function (event: any) {
      (instructions as any).style.display = "none";
    };

    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener(
      "webkitpointerlockchange",
      pointerlockchange,
      false
    );
    document.addEventListener("pointerlockerror", pointerlockerror, false);
    document.addEventListener("mozpointerlockerror", pointerlockerror, false);
    document.addEventListener(
      "webkitpointerlockerror",
      pointerlockerror,
      false
    );

    //element.requestPointerLock();
    (instructions as any).addEventListener(
      "click",
      function (event: any) {
        //Pointer lock by default
        element.requestPointerLock =
          element.requestPointerLock ||
          element.mozRequestPointerLock ||
          element.webkitRequestPointerLock;
        if (/Firefox/i.test(navigator.userAgent)) {
          var fullscreenchange = function (event: any) {
            if (
              document.fullscreenElement === element ||
              (document as any).mozFullscreenElement === element ||
              (document as any).mozFullScreenElement === element
            ) {
              document.removeEventListener(
                "fullscreenchange",
                fullscreenchange
              );
              document.removeEventListener(
                "mozfullscreenchange",
                fullscreenchange
              );
              element.requestPointerLock();
            }
          };
          document.addEventListener(
            "fullscreenchange",
            fullscreenchange,
            false
          );
          document.addEventListener(
            "mozfullscreenchange",
            fullscreenchange,
            false
          );
          element.requestFullscreen =
            element.requestFullscreen ||
            element.mozRequestFullscreen ||
            element.mozRequestFullScreen ||
            element.webkitRequestFullscreen;
          element.requestFullscreen();
        } else {
          element.requestPointerLock();
        }
      },
      false
    );
  } else {
    console.log("No Pointer lock");
    //instructions.innerHTML = 'Your browser not suported PointerLock';
  }

  //
  //Event listeners
  //

  var onMouseMove = function (event: any) {
    if (enabled === false) return;

    var movementX =
      event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY =
      event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    yawObject.rotation.y -= movementX * mouseMoveSensitivity;
    pitchObject.rotation.x -= movementY * mouseMoveSensitivity;

    pitchObject.rotation.x = Math.max(
      -PI_2,
      Math.min(PI_2, pitchObject.rotation.x)
    );

    //console.log("onMouseMove " + yawObject.rotation.y + " " + pitchObject.rotation.x + " " + pitchObject.rotation.x)
  };

  var onKeyDown = function (event: any) {
    if (enabled === false) return;
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

      case 32: // space
        if (canJump === true)
          velocity.y += run === false ? jumpHeight : jumpHeight + 50;
        canJump = false;
        break;

      case 16: // shift
        run = true;
        break;
    }
  }.bind(this);

  var onKeyUp = function (event: any) {
    if (enabled === false) return;

    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;

      case 16: // shift
        run = false;
        break;
    }
  }.bind(this);

  var onMouseDownClick = function (event: any) {
    if (enabled === false) return;
    click = true;
  }.bind(this);

  var onMouseUpClick = function (event: any) {
    if (enabled === false) return;
    click = false;
  }.bind(this);

  var onWindowResize = function () {
    (camera as any).aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    gl.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", onWindowResize, false);

  var dispose = function () {
    document.removeEventListener("mousemove", onMouseMove, false);
    document.removeEventListener("keydown", onKeyDown, false);
    document.removeEventListener("keyup", onKeyUp, false);
    document.removeEventListener("mousedown", onMouseDownClick, false);
    document.removeEventListener("mouseup", onMouseUpClick, false);
  };

  document.addEventListener("mousemove", onMouseMove, false);
  document.addEventListener("keydown", onKeyDown, false);
  document.addEventListener("keyup", onKeyUp, false);
  document.addEventListener("mousedown", onMouseDownClick, false);
  document.addEventListener("mouseup", onMouseUpClick, false);

  useFrame((state, delta) => {
    if (enabled) {
      velocity.y -= 9.8 * 100.0 * delta;
      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;

      direction.z = Number(moveForward) - Number(moveBackward);
      direction.x = Number(moveRight) - Number(moveLeft);
      direction.normalize();

      var currentSpeed = speed;
      if (run && (moveForward || moveBackward || moveLeft || moveRight))
        currentSpeed = currentSpeed + currentSpeed * 1.1;

      if (moveForward || moveBackward)
        velocity.z -= direction.z * currentSpeed * delta;
      if (moveLeft || moveRight)
        velocity.x -= direction.x * currentSpeed * delta;

      yawObject.translateX(-velocity.x * delta);
      yawObject.translateZ(velocity.z * delta);

      yawObject.position.y += velocity.y * delta;

      if (yawObject.position.y < height) {
        velocity.y = 0;
        yawObject.position.y = height;

        canJump = true;
      }
    }
  });

  return null;
};

export default FPSCamera;

/**

 */
