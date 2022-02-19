import * as THREE from 'three';

import BiomeTexture from "../tools/BiomeTexture";
import NebulaTexture from "../tools/NebulaTexture";
import NormalPlanetGeometryGenerator from "../generator/NormalPlanetGeometryGenerator";

const imgGrass = require('../../assets/textures/terrain/grass3.jpg');
const imgMoon = require('../../assets/textures/planets/moon.png');
const imgSand = require('../../assets/textures/terrain/sand2.jpg');
const imgSnow = require('../../assets/textures/terrain/snow2.jpg');
const imgStone = require('../../assets/textures/terrain/stone2.jpg');
const imgWater = require('../../assets/textures/terrain/water1.jpg');
const imgWaterNormals = require('../../assets/textures/terrain/water_normals1.jpg');


// import terrainVertShader from '!raw-loader!glslify-loader!../shaders/terrain.vert';
// import terrainFragShader from '!raw-loader!glslify-loader!../shaders/terrain.frag';
import terrainVertShader from '!raw-loader!glslify-loader!../shaders/terrain.vert';
import terrainFragShader from '!raw-loader!glslify-loader!../shaders/water.frag';

export default class SimpleTessPlanet extends THREE.Object3D {
  constructor(
    random,
    noise,
    radius = 1000.0,
    detail = 6) {
    super();

    const textureLoader = new THREE.TextureLoader();

    this.params = {
      waterLevel: 0.2,
      oceanVisible: true,
      oceanSpeed: 0.0000275963,
      speed: 0.00008,
      // roughness: 0.049,
      roughness: 0.0,
      lacunarity: 0.01,
      octaves: 3,
      rotation: new THREE.Vector3(0.0, 0.003, 0.000),

      color: new THREE.Color(0x00ffff),
      opacity: 0.31,
      atmo1: 0.5,
      atmo2: 0.5,
      atmo3: 1.0,
      atmo4: 0.25,
      atmo5: 0.01
    };

    // this.waterTexture = new BiomeTexture();
    // this.sandTexture = this.grassTexture = this.stoneTexture = this.snowTexture = new NebulaTexture();
    // this.waterTexture = new BiomeTexture();
    // this.sandTexture = new NebulaTexture();
    // this.grassTexture = new NebulaTexture();
    // this.stoneTexture = new NebulaTexture();
    // // this.snowTexture = new NebulaTexture();
    // this.snowTexture = textureLoader.load(imgSnow)

    // texWater: {type: "t", value: textureLoader.load(imgWater)},
    // texSand: {type: "t", value: textureLoader.load(imgSand)},
    // texGrass: {type: "t", value: textureLoader.load(imgGrass)},
    // texStone: {type: "t", value: textureLoader.load(imgStone)},

    this.generateTexture();

    // this.geometry = new THREE.IcosahedronBufferGeometry(radius, detail);
    let planet = new NormalPlanetGeometryGenerator(random, noise, {
      lacunarity: this.params.lacunarity,
      persistance: 0.0,
      octaves: this.params.octaves,
    });
    this.geometry = planet.generate({
      planetSize: radius,
      subdivisions: detail,
      minHeight: 1.0,
      maxHeight: 1.2,
    });

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        "atmo1": {type: "f", value: this.params.atmo1},
        "atmo2": {type: "f", value: this.params.atmo2},
        "atmo3": {type: "f", value: this.params.atmo3},
        "atmo4": {type: "f", value: this.params.atmo4},
        "atmo5": {type: "f", value: this.params.atmo5},
        "alpha": {type: "f", value: this.params.opacity},
        "color": {type: "c", value: this.params.color},
        // texWater: {type: "t", value: this.waterTexture.texture},
        // texSand: {type: "t", value: this.sandTexture.texture},
        // texGrass: {type: "t", value: this.grassTexture.texture},
        // texStone: {type: "t", value: this.stoneTexture.texture},
        // texSnow: {type: "t", value: this.snowTexture},
        lightPosition: {type: 'v3', value: new THREE.Vector3(window.light.position.x * radius, window.light.position.y * radius, window.light.position.z * radius)},
        lightColor: {type: 'v4', value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0)},
        lightIntensity: {type: 'f', value: 1.0},
        time: {type: "f", value: 0.0},
        radius: {type: "f", value: radius},
        roughness: {type: "f", value: this.params.roughness},
        lacunarity: {type: "f", value: this.params.lacunarity},
        seed: {type: "f", value: random() * 7}
      },
      vertexShader: terrainVertShader,
      fragmentShader: terrainFragShader
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.add(this.mesh);

    this.createControls();
  }

  createControls() {
    let f = window.gui.addFolder('Planet');

    f.add(this.params, "waterLevel", 0, 1.0).listen().onChange(value => {
      this.updateTexture();
    });
    f.add(this.params, 'roughness', 0.0, 0.2).onChange(value => {
      this.updateMaterial();
    });
    f.add(this.params, 'lacunarity', 0.0, 0.2).onChange(value => {
      this.updateMaterial();
    });
  }

  updateTexture() {
    this.generateTexture();
    this.updateMaterial();
  }

  generateTexture() {
    // this.waterTexture.generateTexture({waterLevel: this.params.waterLevel});
    //
    // const props = {waterLevel: 0.0};
    // this.sandTexture.generateTexture(props);
    // this.grassTexture.generateTexture(props);
    // this.stoneTexture.generateTexture(props);
    // this.snowTexture.generateTexture(props);
  }

  updateMaterial() {
    this.material.uniforms.roughness.value = this.params.roughness;
    this.material.uniforms.lacunarity.value = this.params.lacunarity;

    // this.material.uniforms.texWater.value = this.waterTexture.texture;
    // this.material.uniforms.texSand.value = this.sandTexture.texture;
    // this.material.uniforms.texGrass.value = this.grassTexture.texture;
    // this.material.uniforms.texStone.value = this.stoneTexture.texture;
    // this.material.uniforms.texSnow.value = this.snowTexture.texture;

    this.material.needsUpdate = true;
  }

  render() {
    this.generateTexture();
    this.updateMaterial();
  }

  update(dt = 0) {
    //this.rotation.x += 0.0015;
    this.rotation.y += 0.0025;
    //this.rotation.z += 0.0045;
  }
};
