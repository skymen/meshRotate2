import { id, addonType } from "../../config.caw.js";
import AddonTypeMap from "../../template/addonTypeMap.js";

// Improved 3D Mesh Rotation System - Direct C3.WorldInfo Override
class Mesh3DRotateSystem {
  constructor(instance) {
    this.instance = instance;
    this.rotationX = 0;
    this.rotationY = 0;
    this.scaleX = 1;
    this.scaleY = 1;

    // Get the WorldInfo object
    this.worldInfo = this.instance.getWorldInfo
      ? this.instance.getWorldInfo()
      : globalThis.sdk_runtime
          .GetInstanceByUID(this.instance.uid)
          .GetWorldInfo();

    // Store original Z elevation and create custom property
    this._originalZElevation = this.worldInfo.GetZElevation();
    this._meshZOffset = 0;

    // Override WorldInfo methods
    this.setupMethodOverrides();

    // Create 2x2 mesh by default
    this.createMesh(2, 2);
  }

  get rotationZ() {
    return this.instance.angleDegrees || 0;
  }

  set rotationZ(value) {
    if (this.instance.angleDegrees !== undefined) {
      this.instance.angleDegrees = value;
    } else {
      this.worldInfo.SetAngle((value * Math.PI) / 180);
    }
  }

  setupMethodOverrides() {
    // Store original methods
    this._originalSetZElevation = this.worldInfo.SetZElevation.bind(
      this.worldInfo
    );
    this._originalSetWidth = this.worldInfo.SetWidth.bind(this.worldInfo);
    this._originalSetHeight = this.worldInfo.SetHeight.bind(this.worldInfo);
    this._originalSetAngle = this.worldInfo.SetAngle.bind(this.worldInfo);
    this._originalSetOriginX = this.worldInfo.SetOriginX.bind(this.worldInfo);
    this._originalSetOriginY = this.worldInfo.SetOriginY.bind(this.worldInfo);
    this._originalSetSize = this.worldInfo.SetSize.bind(this.worldInfo);

    // Override SetZElevation to intercept changes
    this.worldInfo.SetZElevation = (value) => {
      // Don't update if this is our internal mesh offset update
      if (!this._updatingMeshOffset) {
        // Calculate the offset being applied and apply it to originalZElevation
        const currentTotalZ = this._originalZElevation + this._meshZOffset;
        const offset = value - currentTotalZ;
        this._originalZElevation += offset;
        this.updateRotation();
      } else {
        this._originalSetZElevation(value);
      }
    };

    // Override other methods to trigger rotation updates
    this.worldInfo.SetWidth = (value) => {
      this._originalSetWidth(value);
      this.updateRotation();
    };

    this.worldInfo.SetHeight = (value) => {
      this._originalSetHeight(value);
      this.updateRotation();
    };

    this.worldInfo.SetAngle = (value) => {
      this._originalSetAngle(value);
      this.updateRotation();
    };

    this.worldInfo.SetOriginX = (value) => {
      this._originalSetOriginX(value);
      this.updateRotation();
    };

    this.worldInfo.SetOriginY = (value) => {
      this._originalSetOriginY(value);
      this.updateRotation();
    };

    this.worldInfo.SetSize = (width, height) => {
      this._originalSetSize(width, height);
      this.updateRotation();
    };
  }

  restoreMethodOverrides() {
    // Restore original methods
    this.worldInfo.SetZElevation = this._originalSetZElevation;
    this.worldInfo.SetWidth = this._originalSetWidth;
    this.worldInfo.SetHeight = this._originalSetHeight;
    this.worldInfo.SetAngle = this._originalSetAngle;
    this.worldInfo.SetOriginX = this._originalSetOriginX;
    this.worldInfo.SetOriginY = this._originalSetOriginY;
    this.worldInfo.SetSize = this._originalSetSize;

    // Set final Z elevation to original value
    this._originalSetZElevation(this._originalZElevation);
  }

  createMesh(width = 2, height = 2) {
    this.instance.createMesh(width, height);
    this.meshWidth = width;
    this.meshHeight = height;
    this.updateRotation();
  }

  releaseMesh() {
    this.instance.releaseMesh();
    this.restoreMethodOverrides();
  }

  setRotation(x, y, z) {
    this.rotationX = x;
    this.rotationY = y;
    this.rotationZ = z;
    this.updateRotation();
  }

  setScale(x, y) {
    this.scaleX = x;
    this.scaleY = y;
    this.updateRotation();
  }

  setOriginalZElevation(value) {
    this._originalZElevation = value;
    this.updateRotation();
  }

  getOriginalZElevation() {
    return this._originalZElevation;
  }

  updateRotation() {
    if (!this.instance.getMeshSize || this.instance.getMeshSize()[0] === 0) {
      return;
    }

    const [meshW, meshH] = this.instance.getMeshSize();

    // Get object dimensions and origin
    const originX = this.worldInfo.GetOriginX();
    const originY = this.worldInfo.GetOriginY();
    const width = this.worldInfo.GetWidth() * this.scaleX;
    const height = this.worldInfo.GetHeight() * this.scaleY;

    // Calculate corners in world space relative to origin
    const corners = [
      [-originX * width, -originY * height, 0], // Top-left
      [(1 - originX) * width, -originY * height, 0], // Top-right
      [-originX * width, (1 - originY) * height, 0], // Bottom-left
      [(1 - originX) * width, (1 - originY) * height, 0], // Bottom-right
    ];

    let minZ = 0;
    const rotatedCorners = [];

    // Apply rotations in XYZ order (Z last)
    for (let corner of corners) {
      let point = this.rotatePoint(
        corner,
        this.rotationX,
        this.rotationY,
        this.rotationZ
      );
      rotatedCorners.push(point);
      minZ = Math.min(minZ, point[2]);
    }

    // Calculate Z offset to prevent negative Z (in world space)
    this._meshZOffset = minZ;

    // Update actual instance Z elevation
    this._updatingMeshOffset = true;
    this._originalSetZElevation(this._originalZElevation + this._meshZOffset);
    this._updatingMeshOffset = false;

    // Apply mesh points
    let cornerIndex = 0;
    for (let row = 0; row < meshH; row++) {
      for (let col = 0; col < meshW; col++) {
        if (cornerIndex < rotatedCorners.length) {
          const [x, y, z] = rotatedCorners[cornerIndex];

          // Convert back to normalized coordinates for mesh point positioning
          // Use original dimensions (not scaled) since mesh points are normalized to actual object size
          const originalWidth = this.worldInfo.GetWidth();
          const originalHeight = this.worldInfo.GetHeight();
          const normalizedX = (x + originX * width) / originalWidth;
          const normalizedY = (y + originY * height) / originalHeight;

          this.instance.setMeshPoint(col, row, {
            mode: "absolute",
            x: normalizedX,
            y: normalizedY,
            zElevation: z - this._meshZOffset, // World space Z elevation
          });

          cornerIndex++;
        }
      }
    }
  }

  // XYZ Euler rotation (Z applied last)
  rotatePoint([x, y, z], rotX, rotY, rotZ) {
    const rx = (rotX * Math.PI) / 180;
    const ry = (rotY * Math.PI) / 180;
    const rz = (rotZ * Math.PI) / 180;

    // X rotation
    let newY = y * Math.cos(rx) - z * Math.sin(rx);
    let newZ = y * Math.sin(rx) + z * Math.cos(rx);
    y = newY;
    z = newZ;

    // Y rotation
    let newX = x * Math.cos(ry) + z * Math.sin(ry);
    newZ = -x * Math.sin(ry) + z * Math.cos(ry);
    x = newX;
    z = newZ;

    // Z rotation (last)
    newX = x * Math.cos(rz) - y * Math.sin(rz);
    newY = x * Math.sin(rz) + y * Math.cos(rz);

    return [newX, newY, z];
  }

  setRotationFromVectors(upX, upY, upZ, forwardX, forwardY, forwardZ) {
    // Normalize vectors
    const upLen = Math.sqrt(upX * upX + upY * upY + upZ * upZ);
    const forwardLen = Math.sqrt(
      forwardX * forwardX + forwardY * forwardY + forwardZ * forwardZ
    );

    const up = [upX / upLen, upY / upLen, upZ / upLen];
    const forward = [
      forwardX / forwardLen,
      forwardY / forwardLen,
      forwardZ / forwardLen,
    ];

    // Calculate right vector
    const right = [
      forward[1] * up[2] - forward[2] * up[1],
      forward[2] * up[0] - forward[0] * up[2],
      forward[0] * up[1] - forward[1] * up[0],
    ];

    // Convert to XYZ Euler angles
    const rotY = Math.asin(-forward[0]);
    const rotX = Math.atan2(forward[1], forward[2]);
    const rotZ = Math.atan2(right[0], up[0]);

    this.rotationX = (rotX * 180) / Math.PI;
    this.rotationY = (rotY * 180) / Math.PI;
    this.rotationZ = (rotZ * 180) / Math.PI;

    this.updateRotation();
  }

  getRotationX() {
    return this.rotationX;
  }
  getRotationY() {
    return this.rotationY;
  }
  getRotationZ() {
    return this.rotationZ;
  }
  getScaleX() {
    return this.scaleX;
  }
  getScaleY() {
    return this.scaleY;
  }
  getMeshZOffset() {
    return this._meshZOffset;
  }
}

/**
 * Sets up 3D mesh rotation on any world instance
 * @param {IWorldInstance} instance - The world instance to add 3D rotation to
 * @param {Object} options - Optional configuration
 * @returns {Mesh3DRotateSystem} The rotation system for further control
 */
export function setupMesh3DRotation(instance, options = {}) {
  // Don't setup twice
  if (instance._mesh3DRotation) {
    return instance._mesh3DRotation;
  }

  const rotationSystem = new Mesh3DRotateSystem(instance);

  // Store reference on the instance
  instance._mesh3DRotation = rotationSystem;

  // Add convenient methods directly to the instance
  instance.setRotation3D = function (x, y, z) {
    this._mesh3DRotation.setRotation(x, y, z);
  };

  instance.setRotationFromVectors3D = function (
    upX,
    upY,
    upZ,
    forwardX,
    forwardY,
    forwardZ
  ) {
    this._mesh3DRotation.setRotationFromVectors(
      upX,
      upY,
      upZ,
      forwardX,
      forwardY,
      forwardZ
    );
  };

  instance.getRotation3D = function () {
    return {
      x: this._mesh3DRotation.getRotationX(),
      y: this._mesh3DRotation.getRotationY(),
      z: this._mesh3DRotation.getRotationZ(),
    };
  };

  instance.setScale3D = function (x, y) {
    this._mesh3DRotation.setScale(x, y);
  };

  instance.getScale3D = function () {
    return {
      x: this._mesh3DRotation.getScaleX(),
      y: this._mesh3DRotation.getScaleY(),
    };
  };

  // Add originalZElevation getter/setter to the instance
  Object.defineProperty(instance, "originalZElevation", {
    get() {
      return this._mesh3DRotation.getOriginalZElevation();
    },
    set(value) {
      this._mesh3DRotation.setOriginalZElevation(value);
    },
    configurable: true,
    enumerable: true,
  });

  instance.releaseMesh3D = function () {
    if (this._mesh3DRotation) {
      this._mesh3DRotation.releaseMesh();
      delete this._mesh3DRotation;
      delete this.setRotation3D;
      delete this.setRotationFromVectors3D;
      delete this.getRotation3D;
      delete this.setScale3D;
      delete this.getScale3D;
      delete this.originalZElevation;
      delete this.releaseMesh3D;
    }
  };

  // Apply initial rotation if provided
  if (options.rotationX || options.rotationY || options.rotationZ) {
    rotationSystem.setRotation(
      options.rotationX || 0,
      options.rotationY || 0,
      options.rotationZ || 0
    );
  }

  // Apply initial scale if provided
  if (options.scaleX || options.scaleY) {
    rotationSystem.setScale(options.scaleX || 1, options.scaleY || 1);
  }

  return rotationSystem;
}

export default function (parentClass) {
  return class extends parentClass {
    constructor() {
      super();
      const properties = this._getInitProperties();
      if (properties) {
        // Initialize the mesh rotation system
        this._mesh3DRotation = null;
        this._setupMeshRotation();
      }
    }

    _setupMeshRotation() {
      // Get properties
      const props = this._getInitProperties();

      // Setup mesh rotation with initial values
      setupMesh3DRotation(this.instance, {
        rotationX: props[0],
        rotationY: props[1],
        rotationZ: props[2],
        scaleX: props[3],
        scaleY: props[4],
      });
    }

    _trigger(method) {
      this.dispatch(method);
      super._trigger(self.C3[AddonTypeMap[addonType]][id].Cnds[method]);
    }

    on(tag, callback, options) {
      if (!this.events[tag]) {
        this.events[tag] = [];
      }
      this.events[tag].push({ callback, options });
    }

    off(tag, callback) {
      if (this.events[tag]) {
        this.events[tag] = this.events[tag].filter(
          (event) => event.callback !== callback
        );
      }
    }

    dispatch(tag) {
      if (this.events[tag]) {
        this.events[tag].forEach((event) => {
          if (event.options && event.options.params) {
            const fn = self.C3[AddonTypeMap[addonType]][id].Cnds[tag];
            if (fn && !fn.call(this, ...event.options.params)) {
              return;
            }
          }
          event.callback();
          if (event.options && event.options.once) {
            this.off(tag, event.callback);
          }
        });
      }
    }

    _release() {
      // Clean up mesh rotation
      if (this._mesh3DRotation) {
        this._mesh3DRotation.releaseMesh();
      }
      super._release();
    }

    _saveToJson() {
      return {
        // Save rotation state
        rotationX: this._mesh3DRotation
          ? this._mesh3DRotation.getRotationX()
          : 0,
        rotationY: this._mesh3DRotation
          ? this._mesh3DRotation.getRotationY()
          : 0,
        rotationZ: this._mesh3DRotation
          ? this._mesh3DRotation.getRotationZ()
          : 0,
        scaleX: this._mesh3DRotation ? this._mesh3DRotation.getScaleX() : 1,
        scaleY: this._mesh3DRotation ? this._mesh3DRotation.getScaleY() : 1,
      };
    }

    _loadFromJson(o) {
      // Restore rotation state
      if (this._mesh3DRotation && o) {
        this._mesh3DRotation.setRotation(
          o.rotationX || 0,
          o.rotationY || 0,
          o.rotationZ || 0
        );
        this._mesh3DRotation.setScale(o.scaleX || 1, o.scaleY || 1);
      }
    }
  };
}
