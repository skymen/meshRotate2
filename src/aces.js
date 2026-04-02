import { action, condition, expression } from "../template/aceDefine.js";

const category = "Mesh3DRotate";

// Actions
action(
  category,
  "SetRotation",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Set Rotation",
    displayText: "{my}: Set rotation to X: {0}, Y: {1}, Z: {2}",
    description: "Set the 3D rotation of the object using Euler angles",
    params: [
      {
        id: "rotationX",
        name: "Rotation X",
        desc: "X-axis rotation in degrees",
        type: "number",
        initialValue: "0",
      },
      {
        id: "rotationY",
        name: "Rotation Y",
        desc: "Y-axis rotation in degrees",
        type: "number",
        initialValue: "0",
      },
      {
        id: "rotationZ",
        name: "Rotation Z",
        desc: "Z-axis rotation in degrees",
        type: "number",
        initialValue: "0",
      },
    ],
  },
  function (rotationX, rotationY, rotationZ) {
    if (this._mesh3DRotation) {
      this._mesh3DRotation.setRotation(rotationX, rotationY, rotationZ);
    }
  },
);

action(
  category,
  "SetRotationFromVectors",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Set Rotation From Vectors",
    displayText:
      "{my}: Set rotation from up vector ({0},{1},{2}) and forward vector ({3},{4},{5})",
    description:
      "Set the 3D rotation of the object from up and forward vectors",
    params: [
      {
        id: "upX",
        name: "Up X",
        desc: "Up vector X component",
        type: "number",
        initialValue: "0",
      },
      {
        id: "upY",
        name: "Up Y",
        desc: "Up vector Y component",
        type: "number",
        initialValue: "1",
      },
      {
        id: "upZ",
        name: "Up Z",
        desc: "Up vector Z component",
        type: "number",
        initialValue: "0",
      },
      {
        id: "forwardX",
        name: "Forward X",
        desc: "Forward vector X component",
        type: "number",
        initialValue: "0",
      },
      {
        id: "forwardY",
        name: "Forward Y",
        desc: "Forward vector Y component",
        type: "number",
        initialValue: "0",
      },
      {
        id: "forwardZ",
        name: "Forward Z",
        desc: "Forward vector Z component",
        type: "number",
        initialValue: "1",
      },
    ],
  },
  function (upX, upY, upZ, forwardX, forwardY, forwardZ) {
    if (this._mesh3DRotation) {
      this._mesh3DRotation.setRotationFromVectors(
        upX,
        upY,
        upZ,
        forwardX,
        forwardY,
        forwardZ,
      );
    }
  },
);

action(
  category,
  "SetScale",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Set Scale",
    displayText: "{my}: Set scale to X: {0}, Y: {1}",
    description: "Set the 3D scale of the object",
    params: [
      {
        id: "scaleX",
        name: "Scale X",
        desc: "X-axis scale multiplier",
        type: "number",
        initialValue: "1",
      },
      {
        id: "scaleY",
        name: "Scale Y",
        desc: "Y-axis scale multiplier",
        type: "number",
        initialValue: "1",
      },
    ],
  },
  function (scaleX, scaleY) {
    if (this._mesh3DRotation) {
      this._mesh3DRotation.setScale(scaleX, scaleY);
    }
  },
);

action(
  category,
  "SetMeshSize",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Set Mesh Size",
    displayText: "{my}: Set mesh size to {0}x{1}",
    description: "Set the number of mesh points for the object",
    params: [
      {
        id: "width",
        name: "Width",
        desc: "Number of mesh points horizontally",
        type: "number",
        initialValue: "2",
      },
      {
        id: "height",
        name: "Height",
        desc: "Number of mesh points vertically",
        type: "number",
        initialValue: "2",
      },
    ],
  },
  function (width, height) {
    if (this._mesh3DRotation) {
      this._mesh3DRotation.createMesh(width, height);
    }
  },
);

action(
  category,
  "SetOriginalZElevation",
  {
    highlight: false,
    deprecated: true,
    isAsync: false,
    listName: "Set Original Z Elevation",
    displayText: "{my}: Set original Z elevation to {0}",
    description:
      "(Deprecated) No longer needed - use the built-in Z elevation instead. Previously required to work around negative mesh Z limitations.",
    params: [
      {
        id: "zElevation",
        name: "Z Elevation",
        desc: "Original Z elevation value",
        type: "number",
        initialValue: "0",
      },
    ],
  },
  function (zElevation) {
    // Deprecated: just set the instance's Z elevation directly
    this.instance.zElevation = zElevation;
  },
);

action(
  category,
  "SetOffset",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Set Offset",
    displayText: "{my}: Set offset to {0}",
    description: "Set the offset in the direction of rotation normal",
    params: [
      {
        id: "offset",
        name: "Offset",
        desc: "Offset value in the direction of rotation normal",
        type: "number",
        initialValue: "0",
      },
    ],
  },
  function (offset) {
    if (this._mesh3DRotation) {
      this._mesh3DRotation.setOffset(offset);
    }
  },
);

action(
  category,
  "SetRotationZExtra",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Set Rotation Z Extra",
    displayText: "{my}: Set extra Z rotation to {0}",
    description: "Set the additional Z-axis rotation applied first",
    params: [
      {
        id: "rotationZExtra",
        name: "Rotation Z Extra",
        desc: "Additional Z-axis rotation in degrees",
        type: "number",
        initialValue: "0",
      },
    ],
  },
  function (rotationZExtra) {
    if (this._mesh3DRotation) {
      this._mesh3DRotation.setRotationZExtra(rotationZExtra);
    }
  },
);

action(
  category,
  "SetInstanceSize",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Set Size & Update Mesh",
    displayText: "{my}: Set size to {0}x{1} and update mesh",
    description:
      "Set the object's width and height, then recalculate the mesh. Useful when Auto Update Mesh is disabled.",
    params: [
      {
        id: "width",
        name: "Width",
        desc: "Object width in pixels",
        type: "number",
        initialValue: "100",
      },
      {
        id: "height",
        name: "Height",
        desc: "Object height in pixels",
        type: "number",
        initialValue: "100",
      },
    ],
  },
  function (width, height) {
    this.instance.width = width;
    this.instance.height = height;
    if (this._mesh3DRotation) {
      this._mesh3DRotation._cachedWidth = width;
      this._mesh3DRotation._cachedHeight = height;
      this._mesh3DRotation.updateRotation();
    }
  },
);

action(
  category,
  "SetInstanceOrigin",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Set Origin & Update Mesh",
    displayText: "{my}: Set origin to ({0}, {1}) and update mesh",
    description:
      "Set the object's origin point (0-1 range), then recalculate the mesh. Useful when Auto Update Mesh is disabled.",
    params: [
      {
        id: "originX",
        name: "Origin X",
        desc: "Origin X (0 = left, 1 = right)",
        type: "number",
        initialValue: "0.5",
      },
      {
        id: "originY",
        name: "Origin Y",
        desc: "Origin Y (0 = top, 1 = bottom)",
        type: "number",
        initialValue: "0.5",
      },
    ],
  },
  function (originX, originY) {
    this.instance.originX = originX;
    this.instance.originY = originY;
    if (this._mesh3DRotation) {
      this._mesh3DRotation._cachedOriginX = originX;
      this._mesh3DRotation._cachedOriginY = originY;
      this._mesh3DRotation.updateRotation();
    }
  },
);

action(
  category,
  "SetAutoUpdateMesh",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Set Auto Update Mesh",
    displayText: "{my}: Set auto update mesh to {0}",
    description:
      "Enable or disable automatic mesh recalculation when the object's geometry changes",
    params: [
      {
        id: "enabled",
        name: "Enabled",
        desc: "Whether to automatically update the mesh on geometry changes",
        type: "combo",
        initialValue: "enabled",
        items: [{ enabled: "Enabled" }, { disabled: "Disabled" }],
      },
    ],
  },
  function (enabled) {
    this._autoUpdateMesh = enabled === 0;
  },
);

action(
  category,
  "ForceUpdateMesh",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Force Update Mesh",
    displayText: "{my}: Force update mesh",
    description:
      "Manually recalculate the mesh rotation. Useful when Auto Update Mesh is disabled.",
    params: [],
  },
  function () {
    if (this._mesh3DRotation) {
      this._mesh3DRotation.syncCache();
      this._mesh3DRotation.updateRotation();
    }
  },
);

// Conditions

condition(
  category,
  "IsAutoUpdateMesh",
  {
    highlight: false,
    deprecated: false,
    isTrigger: false,
    isInvertible: true,
    isCompatibleWithTriggers: true,
    listName: "Is Auto Update Mesh enabled",
    displayText: "{my}: Auto update mesh is enabled",
    description: "True if auto update mesh is currently enabled",
    params: [],
  },
  function () {
    return this._autoUpdateMesh;
  },
);

// Expressions
expression(
  category,
  "RotationX",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the current X rotation in degrees",
    params: [],
  },
  function () {
    return this._mesh3DRotation ? this._mesh3DRotation.getRotationX() : 0;
  },
  false,
);

expression(
  category,
  "RotationY",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the current Y rotation in degrees",
    params: [],
  },
  function () {
    return this._mesh3DRotation ? this._mesh3DRotation.getRotationY() : 0;
  },
  false,
);

expression(
  category,
  "RotationZ",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the current Z rotation in degrees",
    params: [],
  },
  function () {
    return this._mesh3DRotation ? this._mesh3DRotation.getRotationZ() : 0;
  },
  false,
);

expression(
  category,
  "ScaleX",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the current X scale multiplier",
    params: [],
  },
  function () {
    return this._mesh3DRotation ? this._mesh3DRotation.getScaleX() : 1;
  },
  false,
);

expression(
  category,
  "ScaleY",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the current Y scale multiplier",
    params: [],
  },
  function () {
    return this._mesh3DRotation ? this._mesh3DRotation.getScaleY() : 1;
  },
  false,
);

expression(
  category,
  "OriginalZElevation",
  {
    highlight: false,
    deprecated: true,
    returnType: "number",
    description:
      "(Deprecated) No longer needed - use the built-in Z expression instead. Returns the instance's Z elevation.",
    params: [],
  },
  function () {
    // Deprecated: just return the instance's Z elevation directly
    return this.instance ? this.instance.z : 0;
  },
  false,
);

expression(
  category,
  "MeshZOffset",
  {
    highlight: false,
    deprecated: true,
    returnType: "number",
    description:
      "(Deprecated) No longer needed - negative mesh Z values are now supported. Always returns 0.",
    params: [],
  },
  function () {
    // Deprecated: mesh Z offset hack is no longer needed
    return 0;
  },
  false,
);

expression(
  category,
  "Offset",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the current offset value",
    params: [],
  },
  function () {
    return this._mesh3DRotation ? this._mesh3DRotation.getOffset() : 0;
  },
  false,
);

expression(
  category,
  "RotationZExtra",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the current extra Z rotation value",
    params: [],
  },
  function () {
    return this._mesh3DRotation ? this._mesh3DRotation.getRotationZExtra() : 0;
  },
  false,
);
