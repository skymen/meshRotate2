<img src="./src/icon.svg" width="100" /><br>
# Mesh 3D Rotate Enhanced
<i>Enhanced 3D mesh rotation system with direct WorldInfo override</i> <br>
### Version 1.0.0.11

[<img src="https://placehold.co/200x50/4493f8/FFF?text=Download&font=montserrat" width="200"/>](https://github.com/skymen/meshRotate2/releases/download/mesh3d_rotate_enhanced-1.0.0.11.c3addon/mesh3d_rotate_enhanced-1.0.0.11.c3addon)
<br>
<sub> [See all releases](https://github.com/skymen/meshRotate2/releases) </sub> <br>

---
<b><u>Author:</u></b> skymen <br>
<sub>Made using [CAW](https://marketplace.visualstudio.com/items?itemName=skymen.caw) </sub><br>

## Table of Contents
- [Usage](#usage)
- [Examples Files](#examples-files)
- [Properties](#properties)
- [Actions](#actions)
- [Conditions](#conditions)
- [Expressions](#expressions)
---
## Usage
To build the addon, run the following commands:

```
npm i
npm run build
```

To run the dev server, run

```
npm i
npm run dev
```

## Examples Files
| Description | Download |
| --- | --- |

---
## Properties
| Property Name | Description | Type |
| --- | --- | --- |
| Rotation X | X-axis rotation in degrees | float |
| Rotation Y | Y-axis rotation in degrees | float |
| Rotation Z | Z-axis rotation in degrees | float |
| Scale X | X-axis scale multiplier | float |
| Scale Y | Y-axis scale multiplier | float |
| Offset | Offset in the direction of rotation normal | float |
| Rotation Z Extra | Additional Z-axis rotation applied first (before main rotations) | float |


---
## Actions
| Action | Description | Params
| --- | --- | --- |
| Set Mesh Size | Set the number of mesh points for the object | Width             *(number)* <br>Height             *(number)* <br> |
| Set Offset | Set the offset in the direction of rotation normal | Offset             *(number)* <br> |
| Set Original Z Elevation | Set the original Z elevation without affecting rotation | Z Elevation             *(number)* <br> |
| Set Rotation | Set the 3D rotation of the object using Euler angles | Rotation X             *(number)* <br>Rotation Y             *(number)* <br>Rotation Z             *(number)* <br> |
| Set Rotation From Vectors | Set the 3D rotation of the object from up and forward vectors | Up X             *(number)* <br>Up Y             *(number)* <br>Up Z             *(number)* <br>Forward X             *(number)* <br>Forward Y             *(number)* <br>Forward Z             *(number)* <br> |
| Set Rotation Z Extra | Set the additional Z-axis rotation applied first | Rotation Z Extra             *(number)* <br> |
| Set Scale | Set the 3D scale of the object | Scale X             *(number)* <br>Scale Y             *(number)* <br> |


---
## Conditions
| Condition | Description | Params
| --- | --- | --- |


---
## Expressions
| Expression | Description | Return Type | Params
| --- | --- | --- | --- |
| MeshZOffset | Get the current mesh Z offset | number |  | 
| Offset | Get the current offset value | number |  | 
| OriginalZElevation | Get the original Z elevation value | number |  | 
| RotationX | Get the current X rotation in degrees | number |  | 
| RotationY | Get the current Y rotation in degrees | number |  | 
| RotationZ | Get the current Z rotation in degrees | number |  | 
| RotationZExtra | Get the current extra Z rotation value | number |  | 
| ScaleX | Get the current X scale multiplier | number |  | 
| ScaleY | Get the current Y scale multiplier | number |  | 
