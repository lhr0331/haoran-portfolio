import * as THREE from "./vendor/three.module.min.js?v=20260702-fix1";

const images = [
  ["source-14.jfif", "Silent Sea", "Cover"],
  ["source-01.jfif", "Night Walk", "Introduction"],
  ["source-02.jfif", "Night Cat", "Introduction"],
  ["source-03.jfif", "Amber Cat", "Introduction"],
  ["source-04.jfif", "Garden Cat", "Introduction"],
  ["source-05.jfif", "Shadow Cat", "Introduction"],
  ["source-08.jfif", "Goat", "Introduction"],
  ["source-10.jfif", "Stray Light", "Introduction"],
  ["source-12.jfif", "Temple and Trees", "Habitat"],
  ["source-07.jfif", "Temple Shadow", "Habitat"],
  ["source-09.jfif", "Red Lantern", "Habitat"],
  ["source-11.jfif", "Old Street", "Habitat"],
  ["source-06.jfif", "Night Bench", "Habitat"],
  ["source-24.jfif", "Habitat Spread", "Habitat"],
  ["source-20.jfif", "City Habitat", "Habitat"],
  ["source-32.jfif", "City Film", "Habitat"],
  ["source-31.jfif", "Childhood Place", "Nostalgia"],
  ["source-17.jfif", "Nostalgia Gate", "Nostalgia"],
  ["source-19.jfif", "Memory Ritual", "Nostalgia"],
  ["source-22.jfif", "Color Ritual", "Nostalgia"],
  ["source-33.jfif", "Ruins and Home", "Nostalgia"],
  ["source-29.jfif", "People and City", "Nostalgia"],
  ["source-30.jfif", "Street Rhythm", "Nostalgia"],
  ["source-18.jfif", "Boat Life", "Journey"],
  ["source-23.jfif", "River Boat", "Journey"],
  ["source-25.jfif", "Mother River", "Journey"],
  ["source-13.jfif", "Mountain Journey", "Journey"],
  ["source-15.jfif", "Lonely Tree", "Journey"],
  ["source-21.jfif", "Night Window", "Journey"],
  ["source-16.jfif", "Habitat Book", "Book"],
  ["source-26.jfif", "Sketches", "Sketches"],
  ["source-28.jfif", "Room Sketch", "Sketches"],
  ["source-27.jfif", "Original Cover", "Book"]
].map(([file, title, chapter], index) => ({
  index,
  file,
  src: `images/${file}`,
  title,
  chapter,
  focus: [
    [0.0, -0.08, 1.05],
    [-0.08, -0.12, 1.1],
    [0.0, -0.05, 1.18],
    [0.08, -0.02, 1.18],
    [-0.06, -0.02, 1.16],
    [-0.12, -0.06, 1.16],
    [-0.08, 0.02, 1.1],
    [0.05, -0.08, 1.16],
    [0.0, -0.04, 1.08],
    [0.02, -0.02, 1.08],
    [0.02, -0.06, 1.12],
    [-0.08, -0.02, 1.1],
    [0.18, -0.16, 1.12],
    [-0.08, 0.0, 1.04],
    [0.0, -0.02, 1.04],
    [0.05, -0.08, 1.06],
    [0.12, -0.08, 1.12],
    [-0.08, 0.04, 1.06],
    [0.08, -0.08, 1.05],
    [0.12, 0.02, 1.12],
    [0.0, -0.06, 1.08],
    [-0.06, -0.02, 1.06],
    [0.08, -0.08, 1.06],
    [-0.08, -0.02, 1.08],
    [0.16, -0.04, 1.1],
    [-0.18, -0.08, 1.12],
    [0.16, -0.18, 1.12],
    [0.0, -0.06, 1.1],
    [0.18, 0.04, 1.12],
    [-0.08, 0.0, 1.04],
    [0.06, 0.02, 1.12],
    [-0.02, -0.03, 1.1],
    [0.0, 0.0, 1.05]
  ][index] || [0, 0, 1.08]
}));

const chapterMoods = {
  Cover: { heat: 0.12, cool: 0.5 },
  Introduction: { heat: 0.72, cool: 0.22 },
  Habitat: { heat: 0.44, cool: 0.34 },
  Nostalgia: { heat: 0.34, cool: 0.52 },
  Journey: { heat: 0.22, cool: 0.62 },
  Sketches: { heat: 0.18, cool: 0.38 },
  Book: { heat: 0.2, cool: 0.42 }
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const doc = document.documentElement;
const stage = document.getElementById("webgl-stage");
const soundButton = document.querySelector(".sound-toggle");
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  preserveDrawingBuffer: false,
  powerPreference: "high-performance"
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x050505, 1);
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x070706, 0.018);

const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 700);
camera.position.set(0, 0, 8);

const ambient = new THREE.AmbientLight(0xf3eee5, 1.35);
scene.add(ambient);

const keyLight = new THREE.PointLight(0xff8b55, 4.4, 42);
keyLight.position.set(-5, 5, 10);
scene.add(keyLight);

const coolLight = new THREE.PointLight(0x9bb0bd, 2.4, 34);
coolLight.position.set(5, -3, 0);
scene.add(coolLight);

const tunnel = new THREE.Group();
scene.add(tunnel);

const galleryGroup = new THREE.Group();
scene.add(galleryGroup);

const textureLoader = new THREE.TextureLoader();
const planes = [];
const spacing = 14.2;
const totalDepth = (images.length - 1) * spacing;
const cameraState = {
  x: 0,
  y: 0,
  z: 8,
  lookX: 0,
  lookY: 0,
  lookZ: -4,
  fov: 48
};
const pointerState = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
  yaw: 0,
  pitch: 0,
  targetYaw: 0,
  targetPitch: 0
};
let lastFrameTime = 0;
let frameDelta = 1 / 60;
let routeTransition = 0;
let routeTransitionTarget = 0;
let routeTransitionTimer = 0;
const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();
const galleryClickable = [];
const lookTarget = new THREE.Vector3();

const lanePattern = [
  [0, 0.2],
  [-3.35, 0.95],
  [3.15, -0.75],
  [-1.35, -1.25],
  [2.1, 1.15],
  [-2.7, 0.1]
];

function makeFrame(width, height) {
  const frameGroup = new THREE.Group();
  const shape = new THREE.Shape();
  const hw = width / 2 + 0.12;
  const hh = height / 2 + 0.12;
  shape.moveTo(-hw, -hh);
  shape.lineTo(hw, -hh);
  shape.lineTo(hw, hh);
  shape.lineTo(-hw, hh);
  shape.lineTo(-hw, -hh);

  const points = shape.getPoints();
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: 0xf3eee5,
    transparent: true,
    opacity: 0.25
  });
  frameGroup.add(new THREE.Line(geometry, material));
  return frameGroup;
}

function makeGalleryPlaque(item) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(238, 226, 204, 0.92)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(79, 63, 43, 0.34)";
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
  ctx.fillStyle = "#4c3c2c";
  ctx.font = "44px Georgia, serif";
  ctx.fillText(String(item.index + 1).padStart(2, "0"), 34, 62);
  ctx.font = "34px Georgia, serif";
  ctx.fillText(item.title, 34, 116);
  ctx.font = "22px Arial, sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText(item.chapter.toUpperCase(), 36, 154);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.82,
    toneMapped: false
  });
}

function smoothstep(edge0, edge1, value) {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function damp(current, target, speed) {
  if (reducedMotion) return target;
  return current + (target - current) * (1 - Math.exp(-speed * frameDelta));
}

function wrapPulse(value) {
  return Math.sin(clamp(value, 0, 1) * Math.PI);
}

function triggerRouteTransition() {
  routeTransitionTarget = reducedMotion ? 0.62 : 1;
  document.body.classList.add("is-route-transitioning");
  document.body.dataset.routeTransitionTriggered = String(Date.now());
  window.clearTimeout(routeTransitionTimer);
  routeTransitionTimer = window.setTimeout(() => {
    routeTransitionTarget = 0;
    document.body.classList.remove("is-route-transitioning");
  }, reducedMotion ? 1100 : 1600);
}

function getPlaneByIndex(index) {
  return planes[clamp(index, 0, planes.length - 1)];
}

function getFocalWorld(plane, depthOffset = 2.8) {
  if (!plane) return new THREE.Vector3(0, 0, camera.position.z - 10);
  const { mesh, item } = plane;
  const geometry = mesh.geometry.parameters || { width: 5.25, height: 3.5 };
  const [fx, fy] = item.focus;
  const local = new THREE.Vector3(
    fx * geometry.width * 0.5,
    fy * geometry.height * 0.5,
    depthOffset
  );
  return mesh.localToWorld(local);
}

function addImagePlane(item) {
  const texture = textureLoader.load(item.src, (loadedTexture) => {
    loadedTexture.colorSpace = THREE.SRGBColorSpace;
    const source = loadedTexture.image;
    const aspect = source.naturalWidth / source.naturalHeight || source.width / source.height || 1;
    const maxSide = item.index === 0 ? 7.8 : 5.25;
    const width = aspect >= 1 ? maxSide : maxSide * aspect;
    const height = aspect >= 1 ? maxSide / aspect : maxSide;
    const backMaxSide = item.index === 0 ? 13.4 : 10.6;
    const backWidth = aspect >= 1 ? backMaxSide : backMaxSide * aspect;
    const backHeight = aspect >= 1 ? backMaxSide / aspect : backMaxSide;
    mesh.geometry.dispose();
    mesh.geometry = new THREE.PlaneGeometry(width, height, 1, 1);
    backdrop.geometry.dispose();
    backdrop.geometry = new THREE.PlaneGeometry(backWidth, backHeight, 1, 1);
    frame.clear();
    frame.add(makeFrame(width, height));
  });

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.96,
    toneMapped: false
  });

  const backdropMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.08,
    depthWrite: false,
    toneMapped: false
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(5.25, 3.5), material);
  const [laneX, laneY] = lanePattern[item.index % lanePattern.length];
  const depth = -item.index * spacing;
  mesh.position.set(laneX, laneY, depth);
  mesh.rotation.y = THREE.MathUtils.degToRad(laneX * -2.4);
  mesh.rotation.x = THREE.MathUtils.degToRad(laneY * 1.2);
  mesh.userData = item;

  const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(9.2, 5.8), backdropMaterial);
  backdrop.position.set(laneX * 0.34, laneY * 0.28, depth - 1.65);
  backdrop.rotation.y = THREE.MathUtils.degToRad(laneX * -1.2);
  backdrop.rotation.x = THREE.MathUtils.degToRad(laneY * 0.6);

  const frame = new THREE.Group();
  frame.position.copy(mesh.position);
  frame.rotation.copy(mesh.rotation);
  frame.add(makeFrame(5.25, 3.5));

  tunnel.add(backdrop);
  tunnel.add(mesh);
  tunnel.add(frame);
  planes.push({ mesh, frame, backdrop, item, baseX: laneX, baseY: laneY, baseZ: depth });
}

images.forEach(addImagePlane);

function addGalleryMuseumInterior() {
  const depth = 84;
  const floorMaterial = new THREE.MeshBasicMaterial({
    color: 0x71695e,
    transparent: true,
    opacity: 0.56,
    depthWrite: false
  });
  const wallMaterial = new THREE.MeshBasicMaterial({
    color: 0x928879,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const ceilingMaterial = new THREE.MeshBasicMaterial({
    color: 0x554f47,
    transparent: true,
    opacity: 0.44,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd9a8,
    transparent: true,
    opacity: 0.32,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const plinthMaterial = new THREE.MeshBasicMaterial({
    color: 0xb2a38d,
    transparent: true,
    opacity: 0.34,
    depthWrite: false
  });
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xe6d4b8,
    transparent: true,
    opacity: 0.22
  });
  const benchMaterial = new THREE.MeshBasicMaterial({
    color: 0x8c6a4b,
    transparent: true,
    opacity: 0.72,
    depthWrite: false
  });
  const benchBaseMaterial = new THREE.MeshBasicMaterial({
    color: 0x342a22,
    transparent: true,
    opacity: 0.58,
    depthWrite: false
  });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12.8, depth), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -2.56, -depth / 2 + 5.5);
  galleryGroup.add(floor);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(12.8, depth), ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 3.15, -depth / 2 + 5.5);
  galleryGroup.add(ceiling);

  [-6.18, 6.18].forEach((x) => {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(depth, 5.7), wallMaterial);
    wall.rotation.y = Math.PI / 2;
    wall.position.set(x, 0.24, -depth / 2 + 5.5);
    galleryGroup.add(wall);
  });

  [-6.04, 6.04].forEach((x) => {
    const sideSign = x > 0 ? 1 : -1;
    for (let i = 0; i < 18; i += 1) {
      const z = -i * 4.35 + 3.8;
      const bay = [
        [x, -1.72, z + 1.56],
        [x, 2.18, z + 1.56],
        [x, 2.18, z - 1.56],
        [x, -1.72, z - 1.56],
        [x, -1.72, z + 1.56]
      ].map((point) => new THREE.Vector3(...point));
      const bayGeometry = new THREE.BufferGeometry().setFromPoints(bay);
      galleryGroup.add(new THREE.Line(bayGeometry, lineMaterial));

      const sconce = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.82), glowMaterial.clone());
      sconce.material.opacity = 0.13;
      sconce.rotation.y = sideSign > 0 ? -Math.PI / 2 : Math.PI / 2;
      sconce.position.set(x - sideSign * 0.015, 2.2, z);
      galleryGroup.add(sconce);
    }
  });

  for (let i = 0; i < 12; i += 1) {
    const z = -i * 7.1 + 4.2;
    const light = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.07), glowMaterial);
    light.rotation.x = Math.PI / 2;
    light.position.set(0, 3.04, z);
    galleryGroup.add(light);

    const floorGlow = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 0.46), glowMaterial.clone());
    floorGlow.material.opacity = 0.14;
    floorGlow.rotation.x = -Math.PI / 2;
    floorGlow.position.set(0, -2.545, z - 0.4);
    galleryGroup.add(floorGlow);
  }

  for (let i = 0; i < 7; i += 1) {
    const z = -i * 11.4 - 4.6;
    const runner = new THREE.Mesh(new THREE.PlaneGeometry(1.24, 4.9), glowMaterial.clone());
    runner.material.opacity = 0.045;
    runner.rotation.x = -Math.PI / 2;
    runner.position.set(0, -2.535, z);
    galleryGroup.add(runner);
  }

  for (let i = 0; i < 4; i += 1) {
    const z = -i * 18.2 - 12.5;
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.18, 0.78), benchMaterial);
    seat.position.set(0, -2.18, z);
    galleryGroup.add(seat);

    [-0.82, 0.82].forEach((x) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.48, 0.54), benchBaseMaterial);
      leg.position.set(x, -2.43, z);
      galleryGroup.add(leg);
    });
  }

  [-3.55, 3.55].forEach((x) => {
    for (let i = 0; i < 5; i += 1) {
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.78, 3.6), plinthMaterial);
      plinth.position.set(x, -2.16, -i * 13.4 - 8.6);
      galleryGroup.add(plinth);
    }
  });

  const endGlow = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 2.8), glowMaterial.clone());
  endGlow.material.opacity = 0.11;
  endGlow.position.set(0, 0.28, -78);
  galleryGroup.add(endGlow);
}

function addGalleryPlane(item) {
  const texture = textureLoader.load(item.src, (loadedTexture) => {
    loadedTexture.colorSpace = THREE.SRGBColorSpace;
    const source = loadedTexture.image;
    const aspect = source.naturalWidth / source.naturalHeight || source.width / source.height || 1;
    const maxSide = window.innerWidth < 760 ? 1.35 : 1.85;
    const width = aspect >= 1 ? maxSide : maxSide * aspect;
    const height = aspect >= 1 ? maxSide / aspect : maxSide;
    mesh.geometry.dispose();
    mesh.geometry = new THREE.PlaneGeometry(width, height, 1, 1);
    mount.geometry.dispose();
    mount.geometry = new THREE.PlaneGeometry(width + 0.32, height + 0.32, 1, 1);
    frame.clear();
    frame.add(makeFrame(width, height));
    plaque.position.copy(mesh.position);
    plaque.rotation.copy(mesh.rotation);
    plaque.translateY(-height / 2 - 0.32);
    plaque.translateZ(0.035);
  });

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.92,
    toneMapped: false
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.85, 1.25), material);
  const side = item.index % 2 === 0 ? -1 : 1;
  const pair = Math.floor(item.index / 2);
  const z = -pair * 4.35 - 4.2;
  const x = side * 5.25;
  const y = 1.05 + ((pair % 3) - 1) * 0.42;
  mesh.position.set(x, y, z);
  mesh.rotation.y = side > 0 ? -Math.PI / 2.65 : Math.PI / 2.65;
  mesh.userData = { type: "gallery-image", index: item.index, item };

  const mountMaterial = new THREE.MeshBasicMaterial({
    color: 0xf1e5cf,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const mount = new THREE.Mesh(new THREE.PlaneGeometry(2.22, 1.52), mountMaterial);
  mount.position.copy(mesh.position);
  mount.rotation.copy(mesh.rotation);
  mount.translateZ(-0.035);

  const frame = new THREE.Group();
  frame.position.copy(mesh.position);
  frame.rotation.copy(mesh.rotation);
  frame.add(makeFrame(1.85, 1.25));

  const plaque = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.27), makeGalleryPlaque(item));
  plaque.position.copy(mesh.position);
  plaque.rotation.copy(mesh.rotation);
  plaque.translateY(-0.94);
  plaque.translateZ(0.035);

  galleryGroup.add(mount);
  galleryGroup.add(mesh);
  galleryGroup.add(frame);
  galleryGroup.add(plaque);
  galleryClickable.push(mesh);
}

function addGalleryCorridor() {
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xd8c7ad,
    transparent: true,
    opacity: 0.24
  });
  const accentMaterial = new THREE.LineBasicMaterial({
    color: 0xc78252,
    transparent: true,
    opacity: 0.28
  });
  const depth = 78;
  const rails = [
    [[-5.9, -2.45, 4], [-5.9, -2.45, -depth]],
    [[5.9, -2.45, 4], [5.9, -2.45, -depth]],
    [[-5.9, 2.9, 4], [-5.9, 2.9, -depth]],
    [[5.9, 2.9, 4], [5.9, 2.9, -depth]],
    [[-1.1, -2.7, 5], [-0.2, -2.7, -depth]],
    [[1.1, -2.7, 5], [0.2, -2.7, -depth]]
  ];

  rails.forEach(([from, to], index) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...from),
      new THREE.Vector3(...to)
    ]);
    galleryGroup.add(new THREE.Line(geometry, index > 3 ? accentMaterial : lineMaterial));
  });

  for (let i = 0; i < 23; i += 1) {
    const z = -i * 4.35 + 4.2;
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-5.9, -2.45, z),
      new THREE.Vector3(5.9, -2.45, z)
    ]);
    galleryGroup.add(new THREE.Line(geometry, lineMaterial));
  }
}

addGalleryMuseumInterior();
addGalleryCorridor();
images.forEach(addGalleryPlane);
document.body.dataset.galleryClickableCount = String(galleryClickable.length);
document.body.dataset.gallerySpacing = String(spacing);

const starGeometry = new THREE.BufferGeometry();
const starCount = 700;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i += 1) {
  const i3 = i * 3;
  starPositions[i3] = (Math.random() - 0.5) * 18;
  starPositions[i3 + 1] = (Math.random() - 0.5) * 10;
  starPositions[i3 + 2] = -Math.random() * (totalDepth + 60) + 12;
}
starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({
  color: 0xf3eee5,
  size: 0.018,
  transparent: true,
  opacity: 0.35
});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const railMaterial = new THREE.LineBasicMaterial({ color: 0xb84a2d, transparent: true, opacity: 0.18 });
for (let i = 0; i < 8; i += 1) {
  const x = -6 + i * 1.7;
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(x, -3.8, 12),
    new THREE.Vector3(x * 0.28, -0.6, -totalDepth - 18)
  ]);
  scene.add(new THREE.Line(geometry, railMaterial));
}

const archiveGrid = document.getElementById("archive-grid");
archiveGrid.innerHTML = images.map((item) => `
  <article class="archive-card" data-archive-jump="${item.index}" role="button" tabindex="0" aria-label="Open image ${item.index + 1}, ${item.title}">
    <figure>
      <img src="${item.src}" alt="${item.title}">
    </figure>
    <figcaption>${String(item.index + 1).padStart(2, "0")} ${item.title} / ${item.chapter}</figcaption>
  </article>
`).join("");

const galleryShortcuts = document.getElementById("gallery-shortcuts");
if (galleryShortcuts) {
  galleryShortcuts.innerHTML = images.map((item) => `
    <button type="button" data-gallery-jump="${item.index}" aria-label="Open image ${item.index + 1}, ${item.title}">
      ${String(item.index + 1).padStart(2, "0")}
    </button>
  `).join("");
}

const flightIndex = document.querySelector(".flight-index");
const flightTitle = document.querySelector(".flight-title");
const flightChapter = document.querySelector(".flight-chapter");
const navLinks = document.querySelectorAll("[data-jump]");
const galleryNavLink = document.querySelector('.top-nav a[href="#gallery"]');
const sceneCopies = document.querySelectorAll(".scene-copy");
const sceneSections = Array.from(document.querySelectorAll(".scene-section"));
const cursor = document.querySelector(".cursor-dot");
const soundState = {
  ctx: null,
  master: null,
  bellTimer: 0,
  isPlaying: false,
  blocked: false
};
window.__portfolioBoot = {
  started: true,
  soundButton: !!soundButton,
  readyState: document.readyState,
  raf: 0
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getScrollProgress() {
  const trackLength = getTrackLength();
  return trackLength <= 0 ? 0 : clamp((window.scrollY - getGalleryLength()) / trackLength, 0, 1);
}

function getTrackLength() {
  const archive = document.getElementById("visual-index");
  return Math.max(1, archive.offsetTop - getGalleryLength() - window.innerHeight * 0.92);
}

function getGalleryLength() {
  const cover = document.getElementById("cover");
  return cover ? cover.offsetTop : 0;
}

function getGalleryAmount() {
  const length = Math.max(1, getGalleryLength());
  return 1 - smoothstep(length * 0.72, length * 1.02, window.scrollY);
}

function jumpToIndex(targetIndex, withTransition = true) {
  if (withTransition) triggerRouteTransition();
  const targetScroll = getGalleryLength() + (targetIndex * spacing / (totalDepth + 26)) * getTrackLength();
  window.setTimeout(() => {
    window.scrollTo({ top: targetScroll, behavior: reducedMotion ? "auto" : "smooth" });
  }, withTransition ? 300 : 0);
}

function jumpToElement(element, withTransition = true) {
  if (!element) return;
  if (withTransition) triggerRouteTransition();
  window.setTimeout(() => {
    element.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  }, withTransition ? 300 : 0);
}

window.__portfolioGallery = {
  jumpToIndex,
  get clickableCount() {
    return galleryClickable.length;
  },
  get spacing() {
    return spacing;
  }
};

function layoutSceneSections() {
  const unit = window.innerWidth < 760 ? 92 : 84;
  sceneSections.forEach((section, index) => {
    const start = Number(section.dataset.scene || 0);
    const next = sceneSections[index + 1];
    const end = next ? Number(next.dataset.scene || images.length) : images.length;
    const span = Math.max(1, end - start);
    const extra = section.id === "cover" ? 38 : 0;
    section.style.minHeight = `${Math.max(116, span * unit + extra)}dvh`;
  });
}

function updateCopyVisibility(activeIndex) {
  sceneSections.forEach((section, index) => {
    const start = Number(section.dataset.scene || 0);
    const next = sceneSections[index + 1];
    const end = next ? Number(next.dataset.scene || images.length) : images.length;
    const visible = activeIndex >= start && activeIndex < end;
    section.querySelectorAll(".scene-copy").forEach((copy) => {
      copy.classList.toggle("is-visible", visible);
    });
  });
}

const jumpRanges = Array.from(navLinks).map((link, index, list) => ({
  link,
  start: Number(link.dataset.jump),
  end: index < list.length - 1 ? Number(list[index + 1].dataset.jump) : images.length + 1
}));

function updateNav(activeIndex) {
  galleryNavLink?.classList.remove("is-active");
  jumpRanges.forEach(({ link, start, end }) => {
    link.classList.toggle("is-active", activeIndex >= start && activeIndex < end);
  });
}

function updateFlight(activeIndex) {
  const item = images[activeIndex] || images[0];
  flightIndex.textContent = String(item.index + 1).padStart(2, "0");
  flightTitle.textContent = item.title;
  flightChapter.textContent = item.chapter;
}

function updateSceneAtmosphere(activeIndex, handoff) {
  const item = images[activeIndex] || images[0];
  const mood = chapterMoods[item.chapter] || chapterMoods.Cover;
  doc.style.setProperty("--scene-image", `url("${item.src}")`);
  doc.style.setProperty("--scene-heat", String(mood.heat + handoff * 0.22));
  doc.style.setProperty("--scene-cool", String(mood.cool + handoff * 0.18));
}

function updateShortcutState(activeIndex) {
  if (!galleryShortcuts) return;
  galleryShortcuts.querySelectorAll("[data-gallery-jump]").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.galleryJump) === activeIndex);
  });
}

function renderGalleryScene(time, galleryAmount) {
  const length = Math.max(1, getGalleryLength());
  const localProgress = clamp(window.scrollY / length, 0, 1);
  const walk = smoothstep(0, 1, localProgress);
  pointerState.x = damp(pointerState.x, pointerState.targetX, 7.2);
  pointerState.y = damp(pointerState.y, pointerState.targetY, 7.2);
  pointerState.yaw = damp(pointerState.yaw, pointerState.targetYaw, 6.8);
  pointerState.pitch = damp(pointerState.pitch, pointerState.targetPitch, 6.8);

  galleryGroup.visible = true;
  tunnel.visible = false;
  stars.visible = true;
  renderer.setClearColor(0x1b1712, 1);
  scene.fog.color.set(0x211c16);
  scene.fog.density = 0.011;
  ambient.intensity = 1.78;

  const z = 9 - walk * 33;
  camera.position.set(-Math.sin(pointerState.yaw) * 0.55, 0.25 + pointerState.y * 0.22, z);
  camera.fov = damp(camera.fov, mix(58, 48, walk) - Math.abs(pointerState.yaw) * 2.2, 8);
  camera.updateProjectionMatrix();
  lookTarget.set(
    camera.position.x + Math.sin(pointerState.yaw) * 18,
    camera.position.y + Math.sin(pointerState.pitch) * 6,
    z - Math.cos(pointerState.yaw) * 18
  );
  camera.lookAt(lookTarget);

  keyLight.position.set(-4.8 + Math.sin(pointerState.yaw) * 2.8, 4.2, z + 4);
  keyLight.intensity = 5.8 + Math.abs(pointerState.yaw) * 0.9;
  coolLight.position.set(4.8 - Math.sin(pointerState.yaw) * 1.8, -2.6, z - 10);
  coolLight.intensity = 0.72;
  stars.position.z = (walk * 2.4) % spacing;

  galleryClickable.forEach((mesh) => {
    const distance = Math.abs(mesh.position.z - z);
    const focus = clamp(1 - distance / 22, 0, 1);
    const hover = mesh.userData.hovered ? 1 : 0;
    mesh.material.opacity = 0.44 + focus * 0.42 + hover * 0.12;
    const scale = 1 + focus * 0.08 + hover * 0.12 + (reducedMotion ? 0 : Math.sin(time * 0.001 + mesh.userData.index) * 0.01);
    mesh.scale.setScalar(scale);
  });

  const activeIndex = clamp(Math.round(walk * (images.length - 1)), 0, images.length - 1);
  updateFlight(activeIndex);
  updateNav(activeIndex);
  galleryNavLink?.classList.add("is-active");
  navLinks.forEach((link) => link.classList.remove("is-active"));
  updateShortcutState(activeIndex);
  updateSceneAtmosphere(activeIndex, 0.18 * galleryAmount);
  updateCopyVisibility(-1);
  document.body.classList.remove("is-archive", "is-finale");
  const copyFade = 1 - smoothstep(0.08, 0.28, walk) * 0.58;
  doc.style.setProperty("--gallery-copy-alpha", copyFade.toFixed(3));
  doc.style.setProperty("--gallery-copy-shift", `${(-18 * smoothstep(0.04, 0.28, walk)).toFixed(2)}px`);
  doc.style.setProperty("--handoff", (0.12 + galleryAmount * 0.12).toFixed(3));
  doc.style.setProperty("--iris", "0");
  window.__portfolioDebug = {
    mode: "gallery",
    activeIndex,
    galleryAmount: Number(galleryAmount.toFixed(3)),
    pointer: {
      x: Number(pointerState.x.toFixed(3)),
      y: Number(pointerState.y.toFixed(3)),
      yaw: Number(pointerState.yaw.toFixed(3)),
      pitch: Number(pointerState.pitch.toFixed(3))
    },
    sound: window.__portfolioSound?.state || (soundState.isPlaying ? "playing" : soundState.blocked ? "blocked" : "idle")
  };
  document.body.dataset.portfolioMode = "gallery";
  document.body.dataset.portfolioActiveIndex = String(activeIndex);
  document.body.dataset.galleryYaw = pointerState.yaw.toFixed(3);
  document.body.dataset.galleryPitch = pointerState.pitch.toFixed(3);
  document.body.dataset.routeTransition = routeTransition.toFixed(3);
  renderer.render(scene, camera);
}

function renderScene(time = 0) {
  routeTransition = damp(routeTransition, routeTransitionTarget, routeTransitionTarget > routeTransition ? 18 : 7.5);
  doc.style.setProperty("--route-transition", routeTransition.toFixed(3));

  const galleryAmount = getGalleryAmount();
  if (galleryAmount > 0.02) {
    renderGalleryScene(time, galleryAmount);
    requestAnimationFrame(animationLoop);
    return;
  }

  galleryGroup.visible = false;
  tunnel.visible = true;
  renderer.setClearColor(0x050505, 1);
  scene.fog.color.set(0x070706);
  scene.fog.density = 0.018;
  ambient.intensity = 1.35;
  coolLight.intensity = 2.4;
  const progress = getScrollProgress();
  const travel = progress * (totalDepth + 26);
  const segment = clamp(travel / spacing, 0, images.length - 1);
  const segmentIndex = Math.floor(segment);
  const segmentPhase = segment - segmentIndex;
  const activeIndex = clamp(Math.round(segment), 0, images.length - 1);
  const fromPlane = getPlaneByIndex(segmentIndex);
  const toPlane = getPlaneByIndex(segmentIndex + 1);
  const fromFocus = getFocalWorld(fromPlane, 3.1);
  const toFocus = getFocalWorld(toPlane, 3.1);
  const transfer = smoothstep(0.14, 0.88, segmentPhase);
  const pulse = wrapPulse(segmentPhase);
  const iris = smoothstep(0.08, 0.45, segmentPhase) * (1 - smoothstep(0.56, 0.94, segmentPhase));
  const handoff = pulse * 0.78;
  doc.style.setProperty("--handoff", handoff.toFixed(3));
  doc.style.setProperty("--iris", iris.toFixed(3));
  doc.style.setProperty("--gallery-copy-alpha", "1");
  doc.style.setProperty("--gallery-copy-shift", "0px");
  updateSceneAtmosphere(activeIndex, handoff);
  const focusPush = mix(fromPlane?.item.focus[2] || 1.06, toPlane?.item.focus[2] || 1.06, transfer);
  const focal = new THREE.Vector3(
    mix(fromFocus.x, toFocus.x, transfer),
    mix(fromFocus.y, toFocus.y, transfer),
    mix(fromFocus.z, toFocus.z, transfer)
  );
  const cameraZ = 8 - travel + iris * 2.05 * focusPush + pulse * 0.48;
  const targetX = focal.x * 0.38 + Math.sin(progress * Math.PI * 1.6) * 0.14 + (transfer - 0.5) * pulse * 0.22;
  const targetY = focal.y * 0.3 + Math.cos(progress * Math.PI * 1.15) * 0.1;
  const targetLookX = focal.x * (0.66 + iris * 0.1);
  const targetLookY = focal.y * (0.58 + iris * 0.08);
  const targetLookZ = focal.z - 4.7 - iris * 3.25;
  cameraState.x = damp(cameraState.x, targetX, 9.4);
  cameraState.y = damp(cameraState.y, targetY, 9.4);
  cameraState.z = damp(cameraState.z, cameraZ, 9.8);
  cameraState.lookX = damp(cameraState.lookX, targetLookX, 10.6);
  cameraState.lookY = damp(cameraState.lookY, targetLookY, 10.6);
  cameraState.lookZ = damp(cameraState.lookZ, targetLookZ, 10.6);
  cameraState.fov = damp(cameraState.fov, 45 - iris * 7.2 - pulse * 1.15, 7.4);

  camera.position.set(cameraState.x, cameraState.y, cameraState.z);
  camera.fov = cameraState.fov;
  camera.updateProjectionMatrix();
  camera.lookAt(cameraState.lookX, cameraState.lookY, cameraState.lookZ);

  keyLight.position.z = camera.position.z + 8;
  keyLight.intensity = 3.6 + iris * 2.9 + pulse * 0.8;
  coolLight.position.z = camera.position.z - 8;
  stars.position.z = (travel * 0.08) % spacing;

  planes.forEach(({ mesh, frame, backdrop, item, baseX, baseY, baseZ }) => {
    const distance = Math.abs(baseZ - camera.position.z);
    const focus = clamp(1 - distance / 24, 0, 1);
    const sceneDistance = Math.abs(item.index - segment);
    const handoff = clamp(1 - sceneDistance / 1.15, 0, 1);
    const drift = reducedMotion ? 0 : Math.sin(time * 0.00045 + item.index) * 0.08;
    mesh.position.x = baseX + drift;
    mesh.position.y = baseY + drift * 0.35;
    backdrop.position.x = baseX * 0.34 + drift * 0.28;
    backdrop.position.y = baseY * 0.28 + drift * 0.16;
    frame.position.copy(mesh.position);
    mesh.material.opacity = 0.16 + focus * 0.68 + handoff * 0.22;
    backdrop.material.opacity = 0.025 + focus * 0.12 + handoff * 0.16;
    frame.children.forEach((child) => {
      child.children?.forEach((line) => {
        if (line.material) line.material.opacity = 0.06 + focus * 0.28 + handoff * 0.22;
      });
    });
    const localPulse = wrapPulse(clamp(1 - sceneDistance, 0, 1));
    const scale = 0.9 + focus * 0.08 + localPulse * 0.09;
    mesh.scale.setScalar(scale);
    backdrop.scale.setScalar(1.08 + focus * 0.12 + localPulse * 0.18);
    frame.scale.setScalar(scale);
  });

  updateFlight(activeIndex);
  updateNav(activeIndex);
  updateShortcutState(activeIndex);
  updateCopyVisibility(activeIndex);
  const archive = document.getElementById("visual-index");
  const archiveRect = archive.getBoundingClientRect();
  const archiveVisible = archiveRect.top < window.innerHeight * 0.62 && archiveRect.bottom > 0;
  document.body.classList.toggle("is-archive", archiveVisible);
  document.body.classList.toggle("is-finale", activeIndex >= 32 && !archiveVisible);
  if (archiveVisible) {
    navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === "#visual-index"));
  }
  window.__portfolioDebug = {
    activeIndex,
    segment: Number(segment.toFixed(3)),
    phase: Number(segmentPhase.toFixed(3)),
    handoff: Number(handoff.toFixed(3)),
    iris: Number(iris.toFixed(3)),
    sound: window.__portfolioSound?.state || (soundState.isPlaying ? "playing" : soundState.blocked ? "blocked" : "idle"),
    camera: {
      x: Number(camera.position.x.toFixed(3)),
      y: Number(camera.position.y.toFixed(3)),
      z: Number(camera.position.z.toFixed(3)),
      fov: Number(camera.fov.toFixed(3))
    },
    look: {
      x: Number(cameraState.lookX.toFixed(3)),
      y: Number(cameraState.lookY.toFixed(3)),
      z: Number(cameraState.lookZ.toFixed(3))
    }
  };
  document.body.dataset.portfolioMode = "tunnel";
  document.body.dataset.portfolioActiveIndex = String(activeIndex);
  document.body.dataset.galleryYaw = pointerState.yaw.toFixed(3);
  document.body.dataset.galleryPitch = pointerState.pitch.toFixed(3);
  document.body.dataset.routeTransition = routeTransition.toFixed(3);
  renderer.render(scene, camera);
  requestAnimationFrame(animationLoop);
}

function animationLoop(time) {
  frameDelta = lastFrameTime ? clamp((time - lastFrameTime) / 1000, 1 / 120, 1 / 24) : 1 / 60;
  lastFrameTime = time;
  window.__portfolioBoot.raf += 1;
  try {
    renderScene(time);
  } catch (error) {
    window.__portfolioDebug = {
      error: error?.message || String(error),
      stack: error?.stack || "",
      sound: soundState.isPlaying ? "playing" : soundState.blocked ? "blocked" : "idle"
    };
    console.error(error);
    requestAnimationFrame(animationLoop);
  }
}

function resize() {
  layoutSceneSections();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize);
layoutSceneSections();

document.querySelector(".top-nav")?.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  const href = link.getAttribute("href");
  if (!href?.startsWith("#")) return;
  event.preventDefault();
  event.stopPropagation();
  if (href === "#gallery") {
    jumpToElement(document.getElementById("gallery"));
    return;
  }
  if (href === "#visual-index") {
    jumpToElement(document.getElementById("visual-index"));
    return;
  }
  if (link.dataset.jump !== undefined) {
    jumpToIndex(Number(link.dataset.jump));
  }
}, { capture: true });

document.querySelectorAll("[data-gallery-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    jumpToIndex(Number(button.dataset.galleryJump));
  });
});

document.querySelectorAll("[data-archive-jump]").forEach((card) => {
  const open = () => jumpToIndex(Number(card.dataset.archiveJump));
  card.addEventListener("click", open);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
});

function updatePointerFromEvent(event) {
  pointerState.targetX = clamp((event.clientX / window.innerWidth - 0.5) * 2, -1, 1);
  pointerState.targetY = clamp((0.5 - event.clientY / window.innerHeight) * 2, -1, 1);
  pointerState.targetYaw = pointerState.targetX * 0.86;
  pointerState.targetPitch = pointerState.targetY * 0.24;
  pointerNdc.set(pointerState.targetX, pointerState.targetY);
}

function getGalleryHit() {
  if (getGalleryAmount() <= 0.08) return null;
  raycaster.setFromCamera(pointerNdc, camera);
  const hits = raycaster.intersectObjects(galleryClickable, false);
  return hits[0]?.object || null;
}

window.addEventListener("pointermove", (event) => {
  updatePointerFromEvent(event);
  const hit = getGalleryHit();
  galleryClickable.forEach((mesh) => {
    mesh.userData.hovered = mesh === hit;
  });
  renderer.domElement.classList.toggle("is-gallery-hovering", Boolean(hit));
});

window.addEventListener("click", (event) => {
  if (event.target?.closest?.("a, button, .archive-card, .audio-gate, .music-panel")) return;
  const hit = getGalleryHit();
  if (hit) jumpToIndex(hit.userData.index);
});

function setSoundUi(label, mode) {
  if (!soundButton) return;
  soundButton.querySelector(".sound-label").textContent = label;
  soundButton.classList.toggle("is-on", mode === "on");
  soundButton.classList.toggle("is-blocked", mode === "blocked");
  soundButton.setAttribute("aria-pressed", String(mode === "on"));
}

function createNoiseBuffer(ctx) {
  const length = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = last * 0.985 + white * 0.015;
    data[i] = last * 0.7;
  }
  return buffer;
}

function initSoundscape() {
  if (soundState.ctx) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    setSoundUi("No Audio", "blocked");
    return;
  }

  const ctx = new AudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const droneFilter = ctx.createBiquadFilter();
  droneFilter.type = "lowpass";
  droneFilter.frequency.value = 420;
  droneFilter.Q.value = 0.36;
  droneFilter.connect(master);

  [55, 82.41, 110].forEach((frequency, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = index === 0 ? "sine" : "triangle";
    osc.frequency.value = frequency;
    gain.gain.value = index === 0 ? 0.08 : 0.035;
    osc.connect(gain);
    gain.connect(droneFilter);
    osc.start();
  });

  const noise = ctx.createBufferSource();
  const noiseGain = ctx.createGain();
  const noiseFilter = ctx.createBiquadFilter();
  noise.buffer = createNoiseBuffer(ctx);
  noise.loop = true;
  noiseGain.gain.value = 0.08;
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 760;
  noiseFilter.Q.value = 0.48;
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(master);
  noise.start();

  soundState.ctx = ctx;
  soundState.master = master;
}

function playBell() {
  if (!soundState.ctx || !soundState.master || !soundState.isPlaying) return;
  const ctx = soundState.ctx;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const pan = ctx.createStereoPanner();
  const notes = [196, 246.94, 293.66, 329.63, 392];
  osc.type = "sine";
  osc.frequency.value = notes[Math.floor(Math.random() * notes.length)];
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.6);
  pan.pan.value = Math.random() * 1.2 - 0.6;
  osc.connect(gain);
  gain.connect(pan);
  pan.connect(soundState.master);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 3.7);
  soundState.bellTimer = window.setTimeout(playBell, 5200 + Math.random() * 5200);
}

async function startSoundscape(auto = false) {
  initSoundscape();
  if (!soundState.ctx || !soundState.master) return false;

  try {
    await soundState.ctx.resume();
  } catch {
    soundState.blocked = true;
  }

  if (soundState.ctx.state !== "running") {
    soundState.blocked = true;
    setSoundUi(auto ? "Click Sound" : "Audio Blocked", "blocked");
    return false;
  }

  soundState.isPlaying = true;
  soundState.blocked = false;
  soundState.master.gain.cancelScheduledValues(soundState.ctx.currentTime);
  soundState.master.gain.setTargetAtTime(0.24, soundState.ctx.currentTime, 0.8);
  setSoundUi("Sound On", "on");
  if (!soundState.bellTimer) {
    soundState.bellTimer = window.setTimeout(playBell, 900);
  }
  return true;
}

function stopSoundscape() {
  if (!soundState.ctx || !soundState.master) return;
  soundState.isPlaying = false;
  window.clearTimeout(soundState.bellTimer);
  soundState.bellTimer = 0;
  soundState.master.gain.cancelScheduledValues(soundState.ctx.currentTime);
  soundState.master.gain.setTargetAtTime(0.0001, soundState.ctx.currentTime, 0.35);
  setSoundUi("Sound Off", "off");
}

if (soundButton && !window.__portfolioSound) {
  soundButton.addEventListener("click", () => {
    if (soundState.isPlaying) {
      stopSoundscape();
    } else {
      startSoundscape(false);
    }
  });

  const attemptAutoSound = () => {
    window.setTimeout(() => startSoundscape(true), 420);
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    attemptAutoSound();
  } else {
    window.addEventListener("load", attemptAutoSound, { once: true });
  }

  window.setTimeout(() => {
    if (!soundState.isPlaying && !soundState.blocked) startSoundscape(true);
  }, 1200);

  ["pointerdown", "keydown", "touchstart", "wheel"].forEach((eventName) => {
    window.addEventListener(eventName, () => {
      if (!soundState.isPlaying && soundState.blocked) startSoundscape(true);
    }, { passive: true });
  });
}

if (cursor && !window.matchMedia("(pointer: coarse)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll("a, button, .archive-card").forEach((item) => {
    item.addEventListener("pointerenter", () => cursor.classList.add("is-hovering"));
    item.addEventListener("pointerleave", () => cursor.classList.remove("is-hovering"));
  });
}

window.__portfolioBoot.scriptEnd = true;
requestAnimationFrame(animationLoop);
