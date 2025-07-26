import {
  ADDON_CATEGORY,
  ADDON_TYPE,
  PLUGIN_TYPE,
  PROPERTY_TYPE,
} from "./template/enums.js";
import _version from "./version.js";
export const addonType = ADDON_TYPE.BEHAVIOR;
export const type = PLUGIN_TYPE.OBJECT;
export const id = "mesh3d_rotate_enhanced";
export const name = "Mesh 3D Rotate Enhanced";
export const version = _version;
export const minConstructVersion = undefined;
export const author = "skymen";
export const website = "https://www.construct.net";
export const documentation = "https://www.construct.net";
export const description =
  "Enhanced 3D mesh rotation system with direct WorldInfo override";
export const category = ADDON_CATEGORY.GENERAL;

export const hasDomside = false;
export const files = {
  extensionScript: {
    enabled: false, // set to false to disable the extension script
    watch: true, // set to true to enable live reload on changes during development
    targets: ["x86", "x64"],
    // you don't need to change this, the build step will rename the dll for you. Only change this if you change the name of the dll exported by Visual Studio
    name: "MyExtension",
  },
  fileDependencies: [],
  cordovaPluginReferences: [],
  cordovaResourceFiles: [],
};

// categories that are not filled will use the folder name
export const aceCategories = {};

export const info = {
  // icon: "icon.svg",
  // PLUGIN world only
  // defaultImageUrl: "default-image.png",
  Set: {
    // COMMON to all
    CanBeBundled: true,
    IsDeprecated: false,
    GooglePlayServicesEnabled: false,

    // BEHAVIOR only
    IsOnlyOneAllowed: true,

    // PLUGIN world only
    IsResizable: false,
    IsRotatable: false,
    Is3D: false,
    HasImage: false,
    IsTiled: false,
    SupportsZElevation: false,
    SupportsColor: false,
    SupportsEffects: false,
    MustPreDraw: false,

    // PLUGIN object only
    IsSingleGlobal: true,
  },
  // PLUGIN only
  AddCommonACEs: {
    Position: false,
    SceneGraph: false,
    Size: false,
    Angle: false,
    Appearance: false,
    ZOrder: false,
  },
};

export const properties = [
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "rotation_x",
    options: {
      initialValue: 0,
      interpolatable: true,
      dragSpeedMultiplier: 1,
    },
    name: "Rotation X",
    desc: "X-axis rotation in degrees",
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "rotation_y",
    options: {
      initialValue: 0,
      interpolatable: true,
      dragSpeedMultiplier: 1,
    },
    name: "Rotation Y",
    desc: "Y-axis rotation in degrees",
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "rotation_z",
    options: {
      initialValue: 0,
      interpolatable: true,
      dragSpeedMultiplier: 1,
    },
    name: "Rotation Z",
    desc: "Z-axis rotation in degrees",
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "scale_x",
    options: {
      initialValue: 1,
      interpolatable: true,
      dragSpeedMultiplier: 0.1,
    },
    name: "Scale X",
    desc: "X-axis scale multiplier",
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "scale_y",
    options: {
      initialValue: 1,
      interpolatable: true,
      dragSpeedMultiplier: 0.1,
    },
    name: "Scale Y",
    desc: "Y-axis scale multiplier",
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "offset",
    options: {
      initialValue: 0,
      interpolatable: true,
      dragSpeedMultiplier: 1,
    },
    name: "Offset",
    desc: "Offset in the direction of rotation normal",
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "rotation_z_extra",
    options: {
      initialValue: 0,
      interpolatable: true,
      dragSpeedMultiplier: 1,
    },
    name: "Rotation Z Extra",
    desc: "Additional Z-axis rotation applied first (before main rotations)",
  },
];
