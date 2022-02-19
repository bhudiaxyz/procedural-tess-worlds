import * as THREE from 'three';

const GOLDEN_RATIO = (1.0 + Math.sqrt(5.0)) / 2.0;

function crossProduct(v1, v2) {
  return new THREE.Vector3(
    v1.y * v2.z - v1.z * v2.y,
    v1.z * v2.x - v1.x * v2.z,
    v1.x * v2.y - v1.y * v2.x
  );
}

function getCentroid(geometry, face) {
  var vertices = geometry.vertices;
  return new THREE.Vector3(
    (vertices[face['a']].x + vertices[face['b']].x + vertices[face['c']].x) / 3,
    (vertices[face['a']].y + vertices[face['b']].y + vertices[face['c']].y) / 3,
    (vertices[face['a']].z + vertices[face['b']].z + vertices[face['c']].z) / 3
  );
}
