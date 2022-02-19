import * as THREE from 'three';
import AbstractGenerator from "./AbstractGenerator";


export default class CubeGeometryGenerator extends AbstractGenerator {

  constructor() {
    super();
  }

  generate(props) {
    let cubeSize = props.cubeSize;
    let t = props.tessellation;

    let geometry = new THREE.Geometry();
    let vertices = geometry.vertices;

    // Generate unit cube
    let vertexIndex = 0;
    for (let i = 0; i < t; i++) {
      for (let j = 0; j < t; j++) {
        // Positive X face of cube
        geometry.vertices.push(
          new THREE.Vector3(0.5, 0.5 - j / t, 0.5 - i / t),
          new THREE.Vector3(0.5, 0.5 - (j + 1) / t, 0.5 - (i + 1) / t),
          new THREE.Vector3(0.5, 0.5 - j / t, 0.5 - (i + 1) / t),
          new THREE.Vector3(0.5, 0.5 - (j + 1) / t, 0.5 - i / t)
        );

        // Negative X face of cube
        geometry.vertices.push(
          new THREE.Vector3(-0.5, 0.5 - j / t, 0.5 - i / t),
          new THREE.Vector3(-0.5, 0.5 - j / t, 0.5 - (i + 1) / t),
          new THREE.Vector3(-0.5, 0.5 - (j + 1) / t, 0.5 - i / t),
          new THREE.Vector3(-0.5, 0.5 - (j + 1) / t, 0.5 - (i + 1) / t)
        );

        // Positive Y face of cube
        geometry.vertices.push(
          new THREE.Vector3(0.5 - j / t, 0.5, 0.5 - i / t),
          new THREE.Vector3(0.5 - j / t, 0.5, 0.5 - (i + 1) / t),
          new THREE.Vector3(0.5 - (j + 1) / t, 0.5, 0.5 - (i + 1) / t),
          new THREE.Vector3(0.5 - (j + 1) / t, 0.5, 0.5 - i / t)
        );

        // Negative Y face of cube
        geometry.vertices.push(
          new THREE.Vector3(0.5 - j / t, -0.5, 0.5 - i / t),
          new THREE.Vector3(0.5 - (j + 1) / t, -0.5, 0.5 - i / t),
          new THREE.Vector3(0.5 - j / t, -0.5, 0.5 - (i + 1) / t),
          new THREE.Vector3(0.5 - (j + 1) / t, -0.5, 0.5 - (i + 1) / t)
        );

        // Positive Z face of cube
        geometry.vertices.push(
          new THREE.Vector3(0.5 - j / t, 0.5 - i / t, 0.5),
          new THREE.Vector3(0.5 - (j + 1) / t, 0.5 - i / t, 0.5),
          new THREE.Vector3(0.5 - (j + 1) / t, 0.5 - (i + 1) / t, 0.5),
          new THREE.Vector3(0.5 - j / t, 0.5 - (i + 1) / t, 0.5)
        );

        // Negative Z face of cube
        geometry.vertices.push(
          new THREE.Vector3(0.5 - j / t, 0.5 - (i + 1) / t, -0.5),
          new THREE.Vector3(0.5 - (j + 1) / t, 0.5 - i / t, -0.5),
          new THREE.Vector3(0.5 - j / t, 0.5 - i / t, -0.5),
          new THREE.Vector3(0.5 - (j + 1) / t, 0.5 - (i + 1) / t, -0.5)
        );

        // Positive X face of cube
        geometry.faces.push(new THREE.Face3(
          vertexIndex, ++vertexIndex, ++vertexIndex,
          [vertices[vertexIndex - 2], vertices[vertexIndex - 1], vertices[vertexIndex]])
        );
        geometry.faces.push(new THREE.Face3(
          vertexIndex - 2, ++vertexIndex, vertexIndex - 2,
          [vertices[vertexIndex - 3], vertices[vertexIndex], vertices[vertexIndex - 3]])
        );

        // Negative X face of cube
        geometry.faces.push(new THREE.Face3(
          ++vertexIndex, ++vertexIndex, ++vertexIndex,
          [vertices[vertexIndex - 2], vertices[vertexIndex - 1], vertices[vertexIndex]])
        );
        geometry.faces.push(new THREE.Face3(
          vertexIndex, vertexIndex - 1, ++vertexIndex,
          [vertices[vertexIndex - 1], vertices[vertexIndex - 2], vertices[vertexIndex]])
        );

        // Positive Y face of cube
        geometry.faces.push(new THREE.Face3(
          ++vertexIndex, ++vertexIndex, ++vertexIndex,
          [vertices[vertexIndex - 2], vertices[vertexIndex - 1], vertices[vertexIndex]])
        );
        geometry.faces.push(new THREE.Face3(
          vertexIndex, ++vertexIndex, vertexIndex - 3,
          [vertices[vertexIndex - 1], vertices[vertexIndex], vertices[vertexIndex - 3]])
        );

        // Negative Y face of cube
        geometry.faces.push(new THREE.Face3(
          ++vertexIndex, ++vertexIndex, ++vertexIndex,
          [vertices[vertexIndex - 2], vertices[vertexIndex - 1], vertices[vertexIndex]])
        );
        geometry.faces.push(new THREE.Face3(
          vertexIndex - 1, ++vertexIndex, vertexIndex - 1,
          [vertices[vertexIndex - 2], vertices[vertexIndex], vertices[vertexIndex - 1]])
        );

        // Positive Z face of cube
        geometry.faces.push(new THREE.Face3(
          ++vertexIndex, ++vertexIndex, ++vertexIndex,
          [vertices[vertexIndex - 2], vertices[vertexIndex - 1], vertices[vertexIndex]])
        );
        geometry.faces.push(new THREE.Face3(
          vertexIndex, ++vertexIndex, vertexIndex - 3,
          [vertices[vertexIndex - 1], vertices[vertexIndex], vertices[vertexIndex - 3]])
        );

        // Negative Z face of cube
        geometry.faces.push(new THREE.Face3(
          ++vertexIndex, ++vertexIndex, ++vertexIndex,
          [vertices[vertexIndex - 2], vertices[vertexIndex - 1], vertices[vertexIndex]])
        );
        geometry.faces.push(new THREE.Face3(
          vertexIndex - 2, ++vertexIndex, vertexIndex - 2,
          [vertices[vertexIndex - 3], vertices[vertexIndex], vertices[vertexIndex - 2]])
        );

        vertexIndex++;
      }
    }

    for (let i = 0; i < geometry.vertices.length; i++) {
      geometry.vertices[i].multiplyScalar(cubeSize);
    }

    return geometry;


  }
}
