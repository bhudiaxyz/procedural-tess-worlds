import QuadSphereGeometryGenerator from "./QuadSphereGeometryGenerator";
import AbstractPlanetGenerator from "./AbstractPlanetGenerator";


export default class NormalPlanetGeometryGenerator extends AbstractPlanetGenerator {

  constructor(random, noise, config_props) {
    super(random, noise, config_props);
  }

  generate(props) {
    let planetSize = props.planetSize;
    let subdivisions = props.subdivisions;
    let minHeight = props.minHeight;
    let maxHeight = props.maxHeight;

    let geomGen = new QuadSphereGeometryGenerator()
    let planetGeometry = geomGen.generate({
      radius: planetSize,
      tessellation: subdivisions,
    })

    let faceIndices = ['a', 'b', 'c'];

    // Find min, max values of noise to use for value mapping
    let values = this.getMinMaxValues(planetGeometry.vertices, planetSize);

    // Scale vertices based on noise
    for (let i = 0; i < planetGeometry.vertices.length; i++) {
      let vertex = planetGeometry.vertices[i];
      let height = this.rescale(this.getNoiseValue(vertex, planetSize / 2), values.minValue, values.maxValue, minHeight, maxHeight);
      vertex.multiplyScalar(height);

      // Adjust height if at water level. This keeps the water vertices level with each other
      let waterHeight = this.terrainType.darkGrass.threshold * (maxHeight - minHeight) + minHeight - .0001;
      if (height < waterHeight) {
        vertex.multiplyScalar(waterHeight / height);
      }
    }

    // Change vertex height based on noise and give colors to mesh faces based on largest vertex length
    for (let i = 0; i < planetGeometry.faces.length; i++) {
      let curValue = 0;
      let face = planetGeometry.faces[i];
      for (let j = 0; j < faceIndices.length; j++) {
        curValue = Math.max(curValue, planetGeometry.vertices[face[faceIndices[j]]].length() / planetSize);
      }
      let heightPercent = (curValue - minHeight) / (maxHeight - minHeight);
      this.setFaceColor(heightPercent, face);
    }

    return planetGeometry;
  }
}
