import * as THREE from "three";

//  CameraController.js - Using OrbitControls (simulated)
const CameraController = (camera, renderer) => {
  // Simple orbit controls implementation
  let isMouseDown = false;
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let distance = camera.position.length();

  const onMouseDown = (event) => {
    isMouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
  };

  const onMouseUp = () => {
    isMouseDown = false;
  };

  const onMouseMove = (event) => {
    if (!isMouseDown) return;

    const deltaX = event.clientX - mouseX;
    const deltaY = event.clientY - mouseY;

    targetX -= deltaX * 0.005; // Reduced sensitivity
    targetY += deltaY * 0.005;

    targetY = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetY)); // Limited vertical rotation

    mouseX = event.clientX;
    mouseY = event.clientY;
  };

  const onWheel = (event) => {
    distance = Math.max(30, Math.min(150, distance + event.deltaY * 0.05));
  };

  const update = () => {
    currentX += (targetX - currentX) * 0.05; // Smoother movement
    currentY += (targetY - currentY) * 0.05;

    camera.position.x = Math.cos(currentY) * Math.sin(currentX) * distance;
    camera.position.y = Math.sin(currentY) * distance;
    camera.position.z = Math.cos(currentY) * Math.cos(currentX) * distance;

    camera.lookAt(0, 0, 0);
  };

  renderer.domElement.addEventListener("mousedown", onMouseDown);
  renderer.domElement.addEventListener("mouseup", onMouseUp);
  renderer.domElement.addEventListener("mousemove", onMouseMove);
  renderer.domElement.addEventListener("wheel", onWheel);

  return {
    update,
    dispose: () => {
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("wheel", onWheel);
    },
  };
};

export default CameraController;
