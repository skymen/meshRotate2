import { id, addonType } from "../../config.caw.js";
import AddonTypeMap from "../../template/addonTypeMap.js";

// Improved 3D Mesh Rotation System
class Mesh3DRotateSystem {
  constructor(instance) {
    this.instance = instance;
    this.rotationX = 0;
    this.rotationY = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.offset = 0;
    this.rotationZExtra = 0;
    this.lastForward = [0, 0, 1];

    // Cached instance geometry - read once, then only update on change
    this._cachedWidth = instance.width;
    this._cachedHeight = instance.height;
    this._cachedAngle = instance.angle;
    this._cachedOriginX = instance.originX;
    this._cachedOriginY = instance.originY;

    // Create 2x2 mesh by default
    this.createMesh(2, 2);
  }

  get rotationZ() {
    return this.instance.angleDegrees || 0;
  }

  set rotationZ(value) {
    this.instance.angleDegrees = value;
  }

  // Check if instance geometry changed since last update
  checkForChanges() {
    const inst = this.instance;
    const w = inst.width;
    const h = inst.height;
    const a = inst.angle;
    const ox = inst.originX;
    const oy = inst.originY;
    if (
      w !== this._cachedWidth ||
      h !== this._cachedHeight ||
      a !== this._cachedAngle ||
      ox !== this._cachedOriginX ||
      oy !== this._cachedOriginY
    ) {
      this._cachedWidth = w;
      this._cachedHeight = h;
      this._cachedAngle = a;
      this._cachedOriginX = ox;
      this._cachedOriginY = oy;
      this.updateRotation();
    }
  }

  // Update cached geometry from instance (call after external changes)
  syncCache() {
    const inst = this.instance;
    this._cachedWidth = inst.width;
    this._cachedHeight = inst.height;
    this._cachedAngle = inst.angle;
    this._cachedOriginX = inst.originX;
    this._cachedOriginY = inst.originY;
  }

  createMesh(width = 2, height = 2) {
    this.instance.createMesh(width, height);
    this.meshWidth = width;
    this.meshHeight = height;
    this.updateRotation();
  }

  releaseMesh() {
    this.instance.releaseMesh();
  }

  setRotation(x, y, z) {
    this.rotationX = x;
    this.rotationY = y;
    this.rotationZ = z;
    this.lastForward = this.calculateRotationNormal();
    this.updateRotation();
  }

  setScale(x, y) {
    this.scaleX = x;
    this.scaleY = y;
    this.updateRotation();
  }

  setOffset(value) {
    this.offset = value;
    this.updateRotation();
  }

  setRotationZExtra(value) {
    this.rotationZExtra = value;
    this.updateRotation();
  }

  updateRotation() {
    if (!this.instance.getMeshSize || this.instance.getMeshSize()[0] === 0) {
      return;
    }

    const [meshW, meshH] = this.instance.getMeshSize();

    // Use cached geometry values - avoids slow instance property reads
    const originX = this._cachedOriginX;
    const originY = this._cachedOriginY;
    const cachedWidth = this._cachedWidth;
    const cachedHeight = this._cachedHeight;
    const width = cachedWidth * this.scaleX;
    const height = cachedHeight * this.scaleY;
    // Calculate corners in world space relative to origin
    const corners = [
      [-originX * width, -originY * height, 0], // Top-left
      [(1 - originX) * width, -originY * height, 0], // Top-right
      [-originX * width, (1 - originY) * height, 0], // Bottom-left
      [(1 - originX) * width, (1 - originY) * height, 0], // Bottom-right
    ];

    const rotatedCorners = [];

    // Apply rotations with extra Z rotation first, then XYZ order
    for (let corner of corners) {
      // First apply extra Z rotation
      let point = this.rotatePoint(corner, 0, 0, this.rotationZExtra);

      // Then apply main rotations in XYZ order (Z last)
      point = this.rotatePoint(
        point,
        this.rotationX,
        this.rotationY,
        this.rotationZ,
      );

      // Apply offset in the direction of the rotation normal
      if (this.offset !== 0) {
        const normal = this.lastForward;
        point[0] += normal[0] * this.offset;
        point[1] += normal[1] * this.offset;
        point[2] += normal[2] * this.offset;
      }
      point = this.rotatePoint(point, 0, 0, -this.rotationZ);

      rotatedCorners.push(point);
    }

    // Apply mesh points
    let cornerIndex = 0;
    for (let row = 0; row < meshH; row++) {
      for (let col = 0; col < meshW; col++) {
        if (cornerIndex < rotatedCorners.length) {
          const [x, y, z] = rotatedCorners[cornerIndex];

          // Convert back to normalized coordinates for mesh point positioning
          // Use original dimensions (not scaled) since mesh points are normalized to actual object size
          const normalizedX = (x + originX * width) / cachedWidth;
          const normalizedY = (y + originY * height) / cachedHeight;

          this.instance.setMeshPoint(col, row, {
            mode: "absolute",
            x: normalizedX,
            y: normalizedY,
            zElevation: z,
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

  // Calculate the normal vector of the rotated surface
  calculateRotationNormal() {
    // Start with the original normal (0, 0, 1) for a flat surface
    const originalNormal = [0, 0, 1];

    // Apply the same rotations as the mesh points
    // First apply extra Z rotation
    let normal = this.rotatePoint(originalNormal, 0, 0, this.rotationZExtra);

    // Then apply main rotations in XYZ order
    normal = this.rotatePoint(
      normal,
      this.rotationX,
      this.rotationY,
      this.rotationZ,
    );

    return normal;
  }

  setRotationFromVectors(upX, upY, upZ, forwardX, forwardY, forwardZ) {
    // Normalize input vectors
    const forwardLen = Math.sqrt(
      forwardX * forwardX + forwardY * forwardY + forwardZ * forwardZ,
    );
    const upLen = Math.sqrt(upX * upX + upY * upY + upZ * upZ);

    const forwardVec = [
      forwardX / forwardLen,
      forwardY / forwardLen,
      forwardZ / forwardLen,
    ];
    const upApprox = [upX / upLen, upY / upLen, upZ / upLen];

    // Store the forward vector
    this.lastForward = forwardVec;

    // Step 2: Right = forward × upApprox
    const right = [
      forwardVec[1] * upApprox[2] - forwardVec[2] * upApprox[1],
      forwardVec[2] * upApprox[0] - forwardVec[0] * upApprox[2],
      forwardVec[0] * upApprox[1] - forwardVec[1] * upApprox[0],
    ];

    // Normalize right vector
    const rightLen = Math.sqrt(
      right[0] * right[0] + right[1] * right[1] + right[2] * right[2],
    );

    if (rightLen === 0) {
      this.rotationX = 0;
      this.rotationY = 0;
      this.rotationZ = 0;
      this.rotationZExtra = 0;
      this.updateRotation();
      return;
    }
    right[0] /= rightLen;
    right[1] /= rightLen;
    right[2] /= rightLen;

    // Step 3: Up = right × forward (ensures perfect orthogonality)
    const up = [
      right[1] * forwardVec[2] - right[2] * forwardVec[1],
      right[2] * forwardVec[0] - right[0] * forwardVec[2],
      right[0] * forwardVec[1] - right[1] * forwardVec[0],
    ];

    // Build rotation matrix: [right, up, forward] as columns
    // Assuming your coordinate system uses Y-up, Z-forward, X-right conventions
    const matrix = [
      [right[0], up[0], forwardVec[0]],
      [right[1], up[1], forwardVec[1]],
      [right[2], up[2], forwardVec[2]],
    ];

    // Extract Euler angles from rotation matrix (Z Y X order)
    // For rotation order Z Y X, the matrix decomposition is:
    // R = Rz(rotZ) * Ry(rotY) * Rx(rotX)

    let rotY = Math.asin(-matrix[2][0]); // -sin(Y) = -(-sin(β))
    rotY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotY));

    let rotX, rotZ;
    if (Math.abs(Math.cos(rotY)) > 0.0001) {
      // Normal case - no gimbal lock
      rotX = Math.atan2(matrix[2][1], matrix[2][2]); // atan2(cos(Y)sin(X), cos(Y)cos(X))
      rotZ = Math.atan2(matrix[1][0], matrix[0][0]); // atan2(sin(Z)cos(Y), cos(Z)cos(Y))
    } else {
      // Gimbal lock case (Y = ±90°)
      rotX = Math.atan2(-matrix[0][1], matrix[1][1]);
      rotZ = 0;
    }

    // Convert to degrees and apply to your object
    // Since you use Z Y X ZExtra order, set the first three rotations
    this.rotationZ = (rotZ * 180) / Math.PI;
    this.rotationY = (rotY * 180) / Math.PI;
    this.rotationX = -(rotX * 180) / Math.PI;
    this.rotationZExtra = 0; // Start with no extra Z rotation

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
  getOffset() {
    return this.offset;
  }
  getRotationZExtra() {
    return this.rotationZExtra;
  }
}

/**
 * Sets up 3D mesh rotation on any world instance
 * @param {IWorldInstance} instance - The world instance to add 3D rotation to
 * @param {Object} options - Optional configuration
 * @returns {Mesh3DRotateSystem} The rotation system for further control
 */
function setupMesh3DRotation(instance, options = {}) {
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
    forwardZ,
  ) {
    this._mesh3DRotation.setRotationFromVectors(
      upX,
      upY,
      upZ,
      forwardX,
      forwardY,
      forwardZ,
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

  instance.setOffset3D = function (value) {
    this._mesh3DRotation.setOffset(value);
  };

  instance.getOffset3D = function () {
    return this._mesh3DRotation.getOffset();
  };

  instance.setRotationZExtra3D = function (value) {
    this._mesh3DRotation.setRotationZExtra(value);
  };

  instance.getRotationZExtra3D = function () {
    return this._mesh3DRotation.getRotationZExtra();
  };

  instance.releaseMesh3D = function () {
    if (this._mesh3DRotation) {
      this._mesh3DRotation.releaseMesh();
      delete this._mesh3DRotation;
      delete this.setRotation3D;
      delete this.setRotationFromVectors3D;
      delete this.getRotation3D;
      delete this.setScale3D;
      delete this.getScale3D;
      delete this.setOffset3D;
      delete this.getOffset3D;
      delete this.setRotationZExtra3D;
      delete this.getRotationZExtra3D;
      delete this.releaseMesh3D;
    }
  };

  // Apply initial rotation if provided
  if (options.rotationX || options.rotationY || options.rotationZ) {
    rotationSystem.setRotation(
      options.rotationX || 0,
      options.rotationY || 0,
      options.rotationZ || 0,
    );
  }

  // Apply initial scale if provided
  if (options.scaleX || options.scaleY) {
    rotationSystem.setScale(options.scaleX || 1, options.scaleY || 1);
  }

  // Apply initial offset if provided
  if (options.offset !== undefined) {
    rotationSystem.setOffset(options.offset);
  }

  // Apply initial extra Z rotation if provided
  if (options.rotationZExtra !== undefined) {
    rotationSystem.setRotationZExtra(options.rotationZExtra);
  }

  return rotationSystem;
}

export default function (parentClass) {
  return class extends parentClass {
    constructor() {
      super();
      this.properties = this._getInitProperties() ?? [];
      this._mesh3DRotation = null;
      this._autoUpdateMesh = true;
    }

    _setupMeshRotation() {
      this._autoUpdateMesh = this.properties[7] !== undefined
        ? !!this.properties[7]
        : true;
      setupMesh3DRotation(this.instance, {
        rotationX: this.properties[0] || 0,
        rotationY: this.properties[1] || 0,
        rotationZ: this.properties[2] || 0,
        scaleX: this.properties[3] || 1,
        scaleY: this.properties[4] || 1,
        offset: this.properties[5] || 0.1,
        rotationZExtra: this.properties[6] || 0,
      });
      this._mesh3DRotation = this.instance._mesh3DRotation;
    }

    _setAutoUpdateMesh(enabled) {
      this._autoUpdateMesh = enabled;
      this._setTicking2(enabled);
    }

    _postCreate() {
      this._setupMeshRotation();
      this._setAutoUpdateMesh(this._autoUpdateMesh);
    }

    _tick2() {
      this._mesh3DRotation.checkForChanges();
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
          (event) => event.callback !== callback,
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
        offset: this._mesh3DRotation ? this._mesh3DRotation.getOffset() : 0,
        rotationZExtra: this._mesh3DRotation
          ? this._mesh3DRotation.getRotationZExtra()
          : 0,
        autoUpdateMesh: this._autoUpdateMesh,
      };
    }

    _loadFromJson(o) {
      // Restore rotation state
      if (this._mesh3DRotation && o) {
        this._mesh3DRotation.setRotation(
          o.rotationX || 0,
          o.rotationY || 0,
          o.rotationZ || 0,
        );
        this._mesh3DRotation.setScale(o.scaleX || 1, o.scaleY || 1);
        this._mesh3DRotation.setOffset(o.offset || 0);
        this._mesh3DRotation.setRotationZExtra(o.rotationZExtra || 0);
        this._setAutoUpdateMesh(
          o.autoUpdateMesh !== undefined ? o.autoUpdateMesh : true,
        );
      }
    }
  };
}
