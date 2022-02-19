import * as THREE from 'three';
import AbstractGenerator from "./AbstractGenerator";
import IcosahedronGeometryGenerator from "./IcosahedronGeometryGenerator";


export default class DualPolyhedronGeometryGenerator extends AbstractGenerator {

  constructor() {
    super();
  }

  generate(props) {
    let geomGen = new IcosahedronGeometryGenerator()
    let verticesTriangles = geomGen.generate(props)

    let geometry = new THREE.Geometry();
    let faceIndex = 0;
    let polygonGroups = [];

    let i = 0;
    for (let key in verticesTriangles) {
      // Progress bar update
      if (i !== 0 && i % (Math.floor(verticesTriangles.length * 0.1)) === 0) postMessage({increment: i++});

      // Order vertices of polygon (ordered around a circle)
      let polygon = verticesTriangles[key];
      let orderedPolygon = [polygon[0]];
      let currentVertex = polygon[0];
      for (let j = 1; j < polygon.length; j++) {
        let nearestVertex;
        let minDist = Number.MAX_VALUE;
        for (let k = 1; k < polygon.length; k++) {
          if (!orderedPolygon.includes(polygon[k])) {
            if (currentVertex.distanceTo(polygon[k]) < minDist) {
              minDist = currentVertex.distanceTo(polygon[k]);
              nearestVertex = polygon[k];
            }
          }
        }
        orderedPolygon.push(nearestVertex);
        currentVertex = nearestVertex;
      }

      // Create mesh
      let polygonCenter = (polygon.length === 5)
        ? new THREE.Vector3(
          (polygon[0].x + polygon[1].x + polygon[2].x + polygon[3].x + polygon[4].x) / 5,
          (polygon[0].y + polygon[1].y + polygon[2].y + polygon[3].y + polygon[4].y) / 5,
          (polygon[0].z + polygon[1].z + polygon[2].z + polygon[3].z + polygon[4].z) / 5)
        : new THREE.Vector3(
          (polygon[0].x + polygon[1].x + polygon[2].x + polygon[3].x + polygon[4].x + polygon[5].x) / 6,
          (polygon[0].y + polygon[1].y + polygon[2].y + polygon[3].y + polygon[4].y + polygon[5].y) / 6,
          (polygon[0].z + polygon[1].z + polygon[2].z + polygon[3].z + polygon[4].z + polygon[5].z) / 6);

      geometry.vertices.push(polygonCenter);
      let centerIdx = geometry.vertices.length - 1;

      // Check if vertices exist before adding them to mesh
      let idxVertices = [];
      let newCount = 0;
      for (let j = 0; j < polygon.length; j++) {
        let idx = -1;
        for (let k = 0; k < geometry.vertices.length; k++) {
          let vertex = geometry.vertices[k];
          if (vertex.x === orderedPolygon[j].x && vertex.y === orderedPolygon[j].y && vertex.z === orderedPolygon[j].z) {
            idx = k;
            break;
          }
        }

        if (idx === -1) {
          geometry.vertices.push(orderedPolygon[j]);
          idxVertices[j] = geometry.vertices.length - 1;
          newCount++;
        } else {
          idxVertices[j] = idx;
        }
      }

      // Determine if order of vertices is clockwise or counterclockwise
      let edgeSum = 0;
      let reverseEdge = false;
      let reversePole = false;
      let centerAngle = geometry.vertices[centerIdx].angleTo(new THREE.Vector3(0, 0, -1));

      for (let j = 0; j < polygon.length; j++) {
        // Calculate differently for the poles
        if (geometry.vertices[centerIdx].x === 0 && centerAngle === Math.PI / 2) {
          edgeSum += (geometry.vertices[idxVertices[(j + 1) % polygon.length]].x - geometry.vertices[idxVertices[j]].x) *
            (geometry.vertices[idxVertices[(j + 1) % polygon.length]].z + geometry.vertices[idxVertices[j]].z);

          reversePole = (geometry.vertices[centerIdx].y > 0);
        } else if (centerAngle === Math.PI / 2) {
          edgeSum += (geometry.vertices[idxVertices[(j + 1) % polygon.length]].z - geometry.vertices[idxVertices[j]].z) *
            (geometry.vertices[idxVertices[(j + 1) % polygon.length]].y + geometry.vertices[idxVertices[j]].y);

          reverseEdge = (geometry.vertices[centerIdx].x > 0);
        } else {
          edgeSum += (geometry.vertices[idxVertices[(j + 1) % polygon.length]].x - geometry.vertices[idxVertices[j]].x) *
            (geometry.vertices[idxVertices[(j + 1) % polygon.length]].y + geometry.vertices[idxVertices[j]].y);
        }
      }

      // Negate sum if on backfacing side, on top pole, or along the edge between frontfacing and backfacing sides
      if (centerAngle > -Math.PI / 2 && centerAngle < Math.PI / 2 || reversePole || reverseEdge) {
        edgeSum *= -1;
      }

      // Add faces of pentagon/hexagon to mesh and store vertices and faces of the pentagon/hexagon for later use
      if (polygon.length === 5) {
        if (edgeSum < 0) {
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[0], idxVertices[1],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[0]], geometry.vertices[idxVertices[1]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[1], idxVertices[2],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[1]], geometry.vertices[idxVertices[2]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[2], idxVertices[3],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[2]], geometry.vertices[idxVertices[3]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[3], idxVertices[4],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[3]], geometry.vertices[idxVertices[4]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[4], idxVertices[0],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[4]], geometry.vertices[idxVertices[0]]])
          );

          polygonGroups.push({
            vertices: [centerIdx, idxVertices[0], idxVertices[1], idxVertices[2], idxVertices[3], idxVertices[4]],
            faces: [faceIndex, faceIndex + 1, faceIndex + 2, faceIndex + 3, faceIndex + 4]
          });
        } else {
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[1], idxVertices[0],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[1]], geometry.vertices[idxVertices[0]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[2], idxVertices[1],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[2]], geometry.vertices[idxVertices[1]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[3], idxVertices[2],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[3]], geometry.vertices[idxVertices[2]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[4], idxVertices[3],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[4]], geometry.vertices[idxVertices[3]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[0], idxVertices[4],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[0]], geometry.vertices[idxVertices[4]]])
          );

          polygonGroups.push({
            vertices: [centerIdx, idxVertices[4], idxVertices[3], idxVertices[2], idxVertices[1], idxVertices[0]],
            faces: [faceIndex, faceIndex + 1, faceIndex + 2, faceIndex + 3, faceIndex + 4]
          });
        }

        faceIndex += 5;
      } else {
        if (edgeSum < 0) {
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[0], idxVertices[1],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[0]], geometry.vertices[idxVertices[1]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[1], idxVertices[2],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[1]], geometry.vertices[idxVertices[2]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[2], idxVertices[3],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[2]], geometry.vertices[idxVertices[3]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[3], idxVertices[4],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[3]], geometry.vertices[idxVertices[4]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[4], idxVertices[5],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[4]], geometry.vertices[idxVertices[5]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[5], idxVertices[0],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[5]], geometry.vertices[idxVertices[0]]])
          );

          polygonGroups.push({
            vertices: [centerIdx, idxVertices[0], idxVertices[1], idxVertices[2], idxVertices[3], idxVertices[4], idxVertices[5]],
            faces: [faceIndex, faceIndex + 1, faceIndex + 2, faceIndex + 3, faceIndex + 4, faceIndex + 5]
          });
        } else {
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[1], idxVertices[0],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[1]], geometry.vertices[idxVertices[0]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[2], idxVertices[1],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[2]], geometry.vertices[idxVertices[1]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[3], idxVertices[2],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[3]], geometry.vertices[idxVertices[2]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[4], idxVertices[3],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[4]], geometry.vertices[idxVertices[3]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[5], idxVertices[4],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[5]], geometry.vertices[idxVertices[4]]])
          );
          geometry.faces.push(new THREE.Face3(
            centerIdx, idxVertices[0], idxVertices[5],
            [geometry.vertices[centerIdx], geometry.vertices[idxVertices[0]], geometry.vertices[idxVertices[5]]])
          );

          polygonGroups.push({
            vertices: [centerIdx, idxVertices[5], idxVertices[4], idxVertices[3], idxVertices[2], idxVertices[1], idxVertices[0]],
            faces: [faceIndex, faceIndex + 1, faceIndex + 2, faceIndex + 3, faceIndex + 4, faceIndex + 5]
          });
        }

        faceIndex += 6;
      }
    }

    return {
      geometry: geometry,
      polygonGroups: polygonGroups
    };
  }
}
