/* eslint-disable no-param-reassign */
/* eslint-disable prefer-template */
import { useEffect, useState } from "react";
import * as THREE from "three";
import { useLoader, useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import CubePath from "./models/Cube.obj";
import CubeHalfQuadPath from "./models/Cube Half Triangles.obj";
import AnimalPath from "./models/animal.obj";
import BagPath from "./models/bag.obj";

import "./App.css";
import OBJFile from "obj-file-parser";
import {QuadWireFrameGeometry} from "./quadWireFrameGeometry";
const Paths = [CubePath, CubeHalfQuadPath, AnimalPath, BagPath]
export default function LoadObject() {
  const [childMaterials, setChildMaterials] = useState({});
  const { scene } = useThree();
  const objects = useLoader(OBJLoader, Paths);
  const objVertices = async (modelPath) =>{
    return fetch(modelPath)
      .then((r) => r.text())
      .then(objText  => {
        const objFile = new OBJFile(objText);
        return objFile.parse()
      })
  }
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const materialsChildren = {};
      objects.forEach((obj)=>{
        obj.traverse((child) => {
          if (child.isMesh) {
            materialsChildren[child.uuid] = child.material;
          }
        });
      })

      setChildMaterials(materialsChildren);
    }
    return () => {
      mounted = false;
    };
  }, [objects]);

  useEffect(() => {
    let mounted = true;
    if (mounted && childMaterials && Object.keys(childMaterials).length > 0) {
      objects.forEach((obj, index)=>{
        obj.traverse((child) => {
          if (child.isMesh) {
            child.visible = false
            if (childMaterials[child.uuid]) {

              objVertices(Paths[index]).then((object) => {
                const wireframe = new QuadWireFrameGeometry(child.geometry, object.models[0]);
                const line = new THREE.LineSegments( wireframe );
                line.material.depthTest = false;
                line.material.opacity = 1;
                line.material.transparent = true;
                line.material.color = new THREE.Color( 0xff0000 );
                line.position.set(index * 10, 0, 0);
                scene.add( line );
              })
              scene.add(child);
            }
          }
        });
      })
    }
    return () => {
      mounted = false;
    };
  }, [childMaterials]);
}
