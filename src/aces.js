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
    debugger;
    if (this._mesh3DRotation) {
      this._mesh3DRotation.setRotation(rotationX, rotationY, rotationZ);
    }
  }
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
        forwardZ
      );
    }
  }
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
  }
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
  }
);

action(
  category,
  "SetOriginalZElevation",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Set Original Z Elevation",
    displayText: "{my}: Set original Z elevation to {0}",
    description: "Set the original Z elevation without affecting rotation",
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
    if (this._mesh3DRotation) {
      this._mesh3DRotation.setOriginalZElevation(zElevation);
    }
  }
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
  false
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
  false
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
  false
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
  false
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
  false
);

expression(
  category,
  "OriginalZElevation",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the original Z elevation value",
    params: [],
  },
  function () {
    return this._mesh3DRotation
      ? this._mesh3DRotation.getOriginalZElevation()
      : 0;
  },
  false
);

expression(
  category,
  "MeshZOffset",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the current mesh Z offset",
    params: [],
  },
  function () {
    return this._mesh3DRotation ? this._mesh3DRotation.getMeshZOffset() : 0;
  },
  false
);
