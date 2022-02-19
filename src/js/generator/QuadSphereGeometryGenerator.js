import AbstractGenerator from "./AbstractGenerator";
import CubeGeometryGenerator from "./CubeGeometryGenerator";


export default class QuadSphereGeometryGenerator extends AbstractGenerator {

  constructor() {
    super();
  }

  generate(props) {
    let radius = props.radius;
    let tessellation = props.tessellation;

    // Turn cube into a sphere by normalizing each vertex then multiply each vertex by some radius
    let geomGen = new CubeGeometryGenerator()
    let quadsphere = geomGen.generate({
      cubeSize: radius,
      tessellation: tessellation,
    })
    quadsphere.mergeVertices();

    for (let i = 0; i < quadsphere.vertices.length; i++) {
      quadsphere.vertices[i].normalize().multiplyScalar(radius);
    }

    return quadsphere;

  }
}
