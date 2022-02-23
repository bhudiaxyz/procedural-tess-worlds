import AbstractPlanetGenerator from "./AbstractPlanetGenerator";
import DualPolyhedronGeometryGenerator from "./DualPolyhedronGeometryGenerator";


export default class NormalTilePlanetGeometryGenerator extends AbstractPlanetGenerator {

  constructor(random, noise, config_props) {
    super(random, noise, config_props);
  }

  generate(props) {
    let planetSize = props.planetSize;
    let subdivisions = props.subdivisions;
    let minHeight = props.minHeight;
    let maxHeight = props.maxHeight;

    let geomGen = new DualPolyhedronGeometryGenerator()
    let planet = geomGen.generate({
      planetSize: planetSize,
      subdivisions: subdivisions,
    })
    let planetGeometry = planet.geometry;

    let faceIndices = ['a', 'b', 'c'];
    let vertexHeights = [];

    // Find min, max values of noise to use for value mapping
    let values = this.getMinMaxValues(planetGeometry.vertices, planetSize);

    // Scale vertices based on noise
    for (let i = 0; i < planetGeometry.vertices.length; i++) {
      let vertex = planetGeometry.vertices[i];
      let height = this.rescale(this.getNoiseValue(vertex, planetSize / 2), values.minValue, values.maxValue, minHeight, maxHeight);
      vertexHeights.push(height);
    }

    // Give colors to mesh faces based on largest noise value
    for (let i = 0; i < planet.polygonGroups.length; i++) {
      let faces = planet.polygonGroups[i].faces;
      let average = 0;

      // For each face of polygon
      for (let j = 0; j < faces.length; j++) {
        let faceIndex = faces[j];
        for (let k = 0; k < faceIndices.length; k++) {
          average += vertexHeights[planetGeometry.faces[faceIndex][faceIndices[k]]];
        }
      }

      average /= faceIndices.length * faces.length;
      let heightPercent = (average - minHeight) / (maxHeight - minHeight);
      for (let j = 0; j < faces.length; j++) {
        let faceIndex = faces[j];
        this.setFaceColor(heightPercent, planetGeometry.faces[faceIndex]);
      }
    }

    return planetGeometry;
  }
}
