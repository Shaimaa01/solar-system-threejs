import * as THREE from "three";

class CameraController {
  constructor(camera) {
    this.camera = camera;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.cameraDistance = 100;
    this.init();
  }

  init() {
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("wheel", this.handleWheel, { passive: false });
  }

  handleMouseMove = (event) => {
    this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  handleWheel = (event) => {
    event.preventDefault();
    this.cameraDistance = Math.max(
      50,
      Math.min(200, this.cameraDistance + event.deltaY * 0.1)
    );
  };

  update() {
    // Smooth camera movement
    this.targetX += (this.mouseX - this.targetX) * 0.02;
    this.targetY += (this.mouseY - this.targetY) * 0.02;

    this.camera.position.x =
      Math.sin(this.targetX * Math.PI) * this.cameraDistance;
    this.camera.position.z =
      Math.cos(this.targetX * Math.PI) * this.cameraDistance;
    this.camera.position.y = this.targetY * 30 + 30;
    this.camera.lookAt(0, 0, 0);
  }

  dispose() {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("wheel", this.handleWheel);
  }
}

export default CameraController;
