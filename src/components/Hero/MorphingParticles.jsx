import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

// Device detection for performance scaling
const getIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

// Reduced particle counts for better performance
// Desktop: 20K (was 40K), Mobile: 5K
const IS_MOBILE = getIsMobile();
const MORPH_COUNT = IS_MOBILE ? 5000 : 20000;
const TOTAL_COUNT = MORPH_COUNT;

// --- Helper Functions ---

const randomPointOnSphere = (r) => {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  ];
};

const randomPointOnCylinder = (radius, height, axis = "y") => {
  const theta = Math.random() * Math.PI * 2;
  const h = (Math.random() - 0.5) * height;
  if (axis === "x")
    return [h, radius * Math.cos(theta), radius * Math.sin(theta)];
  if (axis === "z")
    return [radius * Math.cos(theta), radius * Math.sin(theta), h];
  return [radius * Math.cos(theta), h, radius * Math.sin(theta)];
};

const randomPointInBoxShell = (x, y, z, thickness = 0.1) => {
  const axis = Math.floor(Math.random() * 3);
  const sign = Math.random() > 0.5 ? 1 : -1;
  let px = (Math.random() - 0.5) * x;
  let py = (Math.random() - 0.5) * y;
  let pz = (Math.random() - 0.5) * z;
  if (axis === 0) px = (x / 2) * sign;
  if (axis === 1) py = (y / 2) * sign;
  if (axis === 2) pz = (z / 2) * sign;
  return [
    px + (Math.random() - 0.5) * thickness,
    py + (Math.random() - 0.5) * thickness,
    pz + (Math.random() - 0.5) * thickness,
  ];
};

const rotateX = (x, y, z, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x, y * cos - z * sin, y * sin + z * cos];
};

const rotateY = (x, y, z, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos + z * sin, y, -x * sin + z * cos];
};

const rotateZ = (x, y, z, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos - y * sin, x * sin + y * cos, z];
};

// --- Shape Generators ---

// DRONE - MASSIVE SCALE
const PROP_START_INDEX = Math.floor(MORPH_COUNT * 0.5);
const PROP_COUNT = Math.floor((MORPH_COUNT - PROP_START_INDEX) / 4);

const generateDroneStaticParts = () => {
  const points = [];
  const tiltAngle = -Math.PI / 8;

  const addPoint = (x, y, z) => {
    const p = rotateX(x, y, z, tiltAngle);
    points.push(...p);
  };

  // Body (Upscaled x1.3)
  const bodyPoints = Math.floor(PROP_START_INDEX * 0.4);
  for (let i = 0; i < bodyPoints; i++) {
    const p = randomPointInBoxShell(3.0, 1.0, 5.5, 0.1); // Standard Scale
    if (Math.abs(p[2]) > 2.6) {
      p[0] *= 0.8;
      p[1] *= 0.7;
    }
    addPoint(p[0], p[1], p[2]);
  }

  // ... rest of drone scaled similarly ...
  // For brevity, using simplified scaling logic inline or assume logic handles it
  // Re-generating full drone logic with scale 1.3
  const scale = 1.3;

  // Gimbal
  // Gimbal REMOVED
  // const camPoints = ...
  // Arms
  const armLen = 4.2; 
  const armCount = Math.floor((PROP_START_INDEX - bodyPoints) / 4); // Adjusted count
  const armOffsets = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ];
  for (let k = 0; k < 4; k++) {
    const dirX = armOffsets[k][0];
    const dirZ = armOffsets[k][1];
    const startX = 1.0 * dirX;
    const startZ = 1.2 * dirZ;
    const endX = 4.2 * dirX;
    const endZ = 4.2 * dirZ;
    for (let i = 0; i < armCount * 0.6; i++) {
      const t = Math.random();
      addPoint(
        startX + (endX - startX) * t + (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        startZ + (endZ - startZ) * t + (Math.random() - 0.5) * 0.3,
      );
    }
    for (let i = 0; i < armCount * 0.2; i++) {
      const p = randomPointOnCylinder(0.9, 1.0, "y");
      addPoint(endX + p[0], p[1] + 0.4, endZ + p[2]);
    }
    for (let i = 0; i < armCount * 0.2; i++) {
      const p = randomPointOnCylinder(0.3, 2.0, "y");
      addPoint(endX + p[0], -1.0 + p[1], endZ + p[2]);
    }
  }
  while (points.length < PROP_START_INDEX * 3) points.push(0, 0, 0);
  return new Float32Array(points);
};

// ROVER - CURIOSITY STYLE (Detailed & Solid)
const generateRover = () => {
  const points = [];
  const rotAngle = Math.PI / 6;
  const tiltX = 0.1;
  const scale = 1.6;
  const offsetY = -2.5;

  const addPoint = (x, y, z) => {
    let sx = x * scale;
    let sy = y * scale;
    let sz = z * scale;
    let p = rotateY(sx, sy, sz, rotAngle);
    p = rotateX(p[0], p[1], p[2], tiltX);
    points.push(p[0], p[1] + offsetY, p[2]);
  };

  const chassisCount = Math.floor(MORPH_COUNT * 0.25);
  for (let i = 0; i < chassisCount; i++) {
    const p = randomPointInBoxShell(2.2, 0.6, 3.5, 0.1);
    addPoint(p[0], p[1] + 0.5, p[2]);
  }
  const rtgCount = Math.floor(MORPH_COUNT * 0.05);
  for (let i = 0; i < rtgCount; i++) {
    const p = randomPointOnCylinder(0.4, 1.2, "y");
    const tilted = rotateX(p[0], p[1], p[2], -Math.PI / 4);
    addPoint(tilted[0], tilted[1] + 1.0, tilted[2] + 1.8);
  }
  const mastCount = Math.floor(MORPH_COUNT * 0.1);
  for (let i = 0; i < mastCount; i++) {
    if (i < mastCount * 0.7) {
      const h = Math.random() * 2.2;
      addPoint(
        0.8 + (Math.random() - 0.5) * 0.15,
        1.0 + h,
        -1.2 + (Math.random() - 0.5) * 0.15,
      );
    } else {
      const p = randomPointInBoxShell(0.8, 0.5, 0.6);
      addPoint(0.8 + p[0], 3.3 + p[1], -1.2 + p[2]);
    }
  }
  // Arm Removed
  const armCount = 0;

  const remaining =
    MORPH_COUNT - chassisCount - rtgCount - mastCount - armCount;
  const wheelPositions = [
    [-1.8, -1.2, -1.6],
    [-1.8, -1.2, 0.2],
    [-1.8, -1.2, 2.0],
    [1.8, -1.2, -1.6],
    [1.8, -1.2, 0.2],
    [1.8, -1.2, 2.0],
  ];
  const pPerWheel = Math.floor((remaining * 0.8) / 6);
  let pForStruts = remaining - pPerWheel * 6;

  for (let wp of wheelPositions) {
    for (let j = 0; j < pPerWheel; j++) {
      const type = Math.random();
      let px = 0,
        py = 0,
        pz = 0;
      const radius = 0.9;
      const width = 0.8;
      if (type < 0.6) {
        const theta = Math.random() * Math.PI * 2;
        px = (Math.random() - 0.5) * width;
        py = radius * Math.cos(theta);
        pz = radius * Math.sin(theta);
      } else {
        const r = Math.sqrt(Math.random()) * radius;
        const theta = Math.random() * Math.PI * 2;
        const side = Math.random() > 0.5 ? 1 : -1;
        px = (width / 2) * side;
        py = r * Math.cos(theta);
        pz = r * Math.sin(theta);
      }
      addPoint(wp[0] + px, wp[1] + py, wp[2] + pz);
    }
  }

  // Helper for thick lines
  const addThickStrut = (p1, p2, count) => {
    for (let k = 0; k < count; k++) {
      const t = Math.random();
      const r = 0.15;
      addPoint(
        p1[0] + (p2[0] - p1[0]) * t + (Math.random() - 0.5) * r,
        p1[1] + (p2[1] - p1[1]) * t + (Math.random() - 0.5) * r,
        p1[2] + (p2[2] - p1[2]) * t + (Math.random() - 0.5) * r,
      );
    }
  };
  const strutPointsPerLeg = Math.floor(pForStruts / 6);
  for (let i = 0; i < 6; i++) {
    const wp = wheelPositions[i];
    const side = wp[0] > 0 ? 1 : -1;
    const cp = [1.1 * side, 0.5, wp[2]];
    const knee = [wp[0], wp[1] + 1.2, wp[2]];
    addThickStrut(wp, knee, strutPointsPerLeg * 0.5);
    addThickStrut(knee, cp, strutPointsPerLeg * 0.5);
  }
  while (points.length < MORPH_COUNT * 3) points.push(0, 0, 0);
  return new Float32Array(points);
};

// PLANE - VINTAGE BIPLANE (Solid, 3-Wheels, 3D Tilted, Connected Tail)
// Range for Propeller Points
const PLANE_PROP_OFFSET = Math.floor(MORPH_COUNT * 0.85);
const PLANE_PROP_COUNT = MORPH_COUNT - PLANE_PROP_OFFSET;

const generatePlane = () => {
  const points = [];
  const scale = 1.75; // MASSIVE SCALE
  const tiltX = 0.2;
  const tiltY = -0.6;
  const tiltZ = 0.2;
  const offsetY = 0.5; // Lower it a bit as it's huge

  // Helper: 3D Rotate
  const transform = (x, y, z) => {
    let px = x * scale;
    let py = y * scale;
    let pz = z * scale;
    let p = rotateY(px, py, pz, tiltY);
    p = rotateX(p[0], p[1], p[2], tiltX);
    p = rotateZ(p[0], p[1], p[2], tiltZ);
    return [p[0], p[1] + offsetY, p[2]];
  };

  const addPoint = (x, y, z) => {
    const p = transform(x, y, z);
    points.push(p[0], p[1], p[2]);
  };

  // Helper: Solid Box
  const addBox = (w, h, d, count, cx = 0, cy = 0, cz = 0) => {
    for (let i = 0; i < count; i++) {
      addPoint(
        cx + (Math.random() - 0.5) * w,
        cy + (Math.random() - 0.5) * h,
        cz + (Math.random() - 0.5) * d,
      );
    }
  };

  // Helper: Solid Cylinder
  const addCyl = (r, len, count, cx = 0, cy = 0, cz = 0, axis = "z") => {
    for (let i = 0; i < count; i++) {
      const p = randomPointOnCylinder(r * Math.sqrt(Math.random()), len, axis);
      addPoint(cx + p[0], cy + p[1], cz + p[2]);
    }
  };

  // 1. FUSELAGE (Extended to connect Tail)
  const fusePoints = Math.floor(MORPH_COUNT * 0.35); // More points
  for (let i = 0; i < fusePoints; i++) {
    // Z Range: -2.0 (Nose) to 4.0 (Tail) -> Length 6.0
    const z = -2.0 + Math.random() * 6.0;

    // Radius Function
    let r = 0.8;
    if (z < -1.0) r *= 1.0 - (-z - 1.0) / 1.5; // Nose rounded
    if (z > 1.0) r *= 1.0 - (z - 1.0) / 4.0; // Slow taper to tail

    // Ensure minimum thickness at tail to connect
    if (z > 3.0) r = Math.max(r, 0.25);

    const rad = r * Math.sqrt(Math.random());
    const ang = Math.random() * 6.28;
    // Cockpit
    if (z > -0.5 && z < 0.5 && rad * Math.sin(ang) > 0.4) continue;
    addPoint(rad * Math.cos(ang), rad * Math.sin(ang), z);
  }

  // 2. WINGS
  const wingPoints = Math.floor(MORPH_COUNT * 0.35);
  const upperCount = Math.floor(wingPoints / 2);
  addBox(7.0, 0.15, 1.4, wingPoints - upperCount, 0, -0.2, 0.5);
  addBox(7.2, 0.15, 1.4, upperCount, 0, 1.3, 0.3);

  // 3. STRUTS & GEAR
  const miscPoints = Math.floor(MORPH_COUNT * 0.15);

  // Struts
  const postCount = Math.floor(miscPoints * 0.2);
  addBox(0.15, 1.5, 0.15, Math.floor(postCount / 4), 2.5, 0.55, 0.5);
  addBox(0.15, 1.5, 0.15, Math.floor(postCount / 4), -2.5, 0.55, 0.5);
  addBox(0.15, 1.5, 0.15, Math.floor(postCount / 4), 1.0, 0.55, 0.3);
  addBox(0.15, 1.5, 0.15, Math.floor(postCount / 4), -1.0, 0.55, 0.3);

  // Gear (Thicker)
  const gearPoints = miscPoints - postCount;
  const wheelPoints = Math.floor(gearPoints * 0.4);
  const legPoints = gearPoints - wheelPoints;
  const legCount = Math.floor(legPoints / 2);

  // Legs
  addCyl(0.12, 1.2, legCount, 0.8, -1.0, 0.8, "y");
  addCyl(0.12, 1.2, legCount, -0.8, -1.0, 0.8, "y");

  // Wheels (3 Wheels)
  const wp = Math.floor(wheelPoints / 3);
  addCyl(0.35, 0.25, wp, 0.8, -1.6, 0.8, "x");
  addCyl(0.35, 0.25, wp, -0.8, -1.6, 0.8, "x");
  addCyl(0.2, 0.15, wp, 0, -0.6, 3.8, "x"); // Tail Wheel attached at Z=3.8

  // 4. TAIL (Connected at Z=3.8)
  const tailPoints = Math.floor(MORPH_COUNT * 0.1);
  // Horizontal Stabilizer
  addBox(2.8, 0.12, 1.4, Math.floor(tailPoints * 0.6), 0, 0.2, 3.9);
  // Vertical Stabilizer (Taller and thicker)
  addBox(0.2, 2.0, 1.4, Math.floor(tailPoints * 0.4), 0, 1.2, 3.9);

  // 5. PROPELLER PLACEHOLDERS
  for (let i = 0; i < PLANE_PROP_COUNT; i++) {
    addPoint(0, 0, 0);
  }

  while (points.length < MORPH_COUNT * 3) points.push(0, 0, 0);
  return new Float32Array(points.slice(0, MORPH_COUNT * 3));
};

// --- Texture Helper ---
const getCircleTexture = () => {
  if (typeof document === "undefined") return null; // SSR Safety
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(16, 16, 14, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

const MorphingScene = () => {
  const meshRef = useRef();
  const { clock, mouse, viewport } = useThree(); // Get viewport
  const circleTex = useMemo(() => getCircleTexture(), []);

  // ... (keep static generation memoization)
  const droneStatic = useMemo(() => generateDroneStaticParts(), []);
  const [geo2] = useState(generateRover());
  const planeStatic = useMemo(() => generatePlane(), []);

  // ... (keep props offsets memoization)
  const propOffsets = useMemo(() => {
    const offsets = new Float32Array(PROP_COUNT * 4 * 3);
    for (let k = 0; k < 4; k++) {
      for (let i = 0; i < PROP_COUNT; i++) {
        const r = Math.random() * 3.0;
        const blade = Math.random() > 0.5 ? 0 : Math.PI;
        const idx = (k * PROP_COUNT + i) * 3;
        offsets[idx] = r;
        offsets[idx + 1] = blade + (Math.random() - 0.5) * 0.15;
        offsets[idx + 2] = (Math.random() - 0.5) * 0.1;
      }
    }
    return offsets;
  }, []);

  const planePropOffsets = useMemo(() => {
    const arr = new Float32Array(PLANE_PROP_COUNT * 3);
    for (let i = 0; i < PLANE_PROP_COUNT; i++) {
      arr[i * 3] = Math.random() * 2.0; // Radius
      arr[i * 3 + 1] = Math.random() > 0.5 ? 0 : Math.PI; // Blade
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.3; // Width jitter
    }
    return arr;
  }, []);

  const currentPositions = useMemo(() => new Float32Array(TOTAL_COUNT * 3), []);
  const droneCurrent = useMemo(() => new Float32Array(MORPH_COUNT * 3), []);
  const planeCurrent = useMemo(() => new Float32Array(MORPH_COUNT * 3), []);

  useEffect(() => {
    droneCurrent.set(droneStatic, 0);
    planeCurrent.set(planeStatic, 0);
  }, [droneStatic, droneCurrent, planeStatic, planeCurrent, currentPositions]);

  useFrame((state) => {
    // Skip updates when tab is hidden for performance
    if (document.hidden) return;
    
    const time = clock.getElapsedTime();
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    let scrollPct = 0;
    if (maxScroll > 10) {
        scrollPct = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    }

    // ... (Animation Loops - No Change Needed here)
    // DRONE Prop Animation
    if (scrollPct < 0.6) {
      const tiltAngle = -Math.PI / 8;
      const armOffsets = [
        [4.2, 4.2],
        [-4.2, 4.2],
        [4.2, -4.2],
        [-4.2, -4.2],
      ];
      const propSpeed = 20.0;
      for (let k = 0; k < 4; k++) {
        const cx = armOffsets[k][0];
        const cz = armOffsets[k][1];
        for (let i = 0; i < PROP_COUNT; i++) {
          const offIdx = (k * PROP_COUNT + i) * 3;
          const r = propOffsets[offIdx];
          const angleBase = propOffsets[offIdx + 1];
          const j = propOffsets[offIdx + 2];
          const theta = angleBase + time * propSpeed;
          const lx = r * Math.cos(theta);
          const lz = r * Math.sin(theta);
          const ly = 0.8 + j;
          const p = rotateX(cx + lx, ly, cz + lz, tiltAngle);
          const ptIdx = (PROP_START_INDEX + k * PROP_COUNT + i) * 3;
          droneCurrent[ptIdx] = p[0];
          droneCurrent[ptIdx + 1] = p[1];
          droneCurrent[ptIdx + 2] = p[2];
        }
      }
    }

    // PLANE Prop Animation (Structured Blades)
    if (scrollPct > 0.4) {
      const scale = 1.75;
      const offsetY = 0.5;
      const tiltX = 0.2;
      const tiltY = -0.6;
      const tiltZ = 0.2;
      const propSpeed = 15.0;
      const bladePoints = Math.max(1, Math.floor(PLANE_PROP_COUNT / 2));

      for (let i = 0; i < PLANE_PROP_COUNT; i++) {
        // Determine which blade (0 or 1)
        const blade = i < bladePoints ? 0 : 1;
        const bladeOffset = blade * Math.PI;

        // Generate Blade Shape (Oval) dynamically
        const t = (i % bladePoints) / bladePoints;
        // Radius 0..2.2
        const r = t * 2.2;
        // Width taper (thick in middle, thin at tip/root)
        const width = 0.3 * Math.sin(t * Math.PI);

        // Rotate by Time
        const theta = bladeOffset + time * propSpeed;

        // Local Coords (Blade is flat on XY, at Z=-2.1)
        // Add width jitter
        const wOffset = (Math.random() - 0.5) * width;

        // Spin
        let px = r * Math.cos(theta) - wOffset * Math.sin(theta);
        let py = r * Math.sin(theta) + wOffset * Math.cos(theta);
        let pz = -2.1 + (Math.random() - 0.5) * 0.05; // Thin prop

        // Transform
        let psx = px * scale;
        let psy = py * scale;
        let psz = pz * scale;
        let p = rotateY(psx, psy, psz, tiltY);
        p = rotateX(p[0], p[1], p[2], tiltX);
        p = rotateZ(p[0], p[1], p[2], tiltZ);

        const idx = (PLANE_PROP_OFFSET + i) * 3;
        planeCurrent[idx] = p[0];
        planeCurrent[idx + 1] = p[1] + offsetY;
        planeCurrent[idx + 2] = p[2];
      }
    }

    // Morphing
    if (scrollPct < 0.5) {
      const t = Math.min(scrollPct * 2, 1);
      for (let i = 0; i < MORPH_COUNT * 3; i++) {
        currentPositions[i] +=
          (droneCurrent[i] * (1 - t) + geo2[i] * t - currentPositions[i]) *
          0.15;
      }
    } else {
      // Finish morph by 0.8
      const t = Math.min((scrollPct - 0.5) * 3.5, 1);
      for (let i = 0; i < MORPH_COUNT * 3; i++) {
        // Blend to planeCurrent (Dynamic)
        currentPositions[i] +=
          (geo2[i] * (1 - t) + planeCurrent[i] * t - currentPositions[i]) *
          0.15;
      }
    }

    if (meshRef.current) {
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      meshRef.current.rotation.y = time * 0.1 + state.mouse.x * 0.2;
      meshRef.current.rotation.x = 0.1 + state.mouse.y * 0.1;

      // --- SMOOTH TRAVEL ANIMATION (RESPONSIVE) ---
      const isMobile = viewport.width < 15;
      // Mobile: Straight and Middle (0 Travel)
      // Desktop: Wide Travel (10 Travel)
      const maxTravel = isMobile ? 0 : 10;

      // 0.0 - 0.20: Right (+Travel)
      // 0.35 - 0.60: Left (-Travel)
      // 0.80 - 1.00: Right (+Travel)

      const getKeyframeX = (s) => {
        if (s < 0.2) return maxTravel;
        if (s < 0.35) {
          // Transit R -> L
          const t = (s - 0.2) / 0.15;
          return maxTravel * (1 - t) + -maxTravel * t;
        }
        if (s < 0.6) return -maxTravel;
        if (s < 0.8) {
          // Transit L -> R
          const t = (s - 0.6) / 0.2;
          return -maxTravel * (1 - t) + maxTravel * t;
        }
        return maxTravel;
      };

      const targetX = getKeyframeX(scrollPct);

      // Interpolate (Damping)
      meshRef.current.position.x +=
        (targetX - meshRef.current.position.x) * 0.08;

      // Responsive Scale
      // Default 1.0, Mobile 0.6
      const targetScale = isMobile ? 0.6 : 1.0;
      // Smooth scale transition not strictly needed but good for resize
      meshRef.current.scale.setScalar(targetScale);
    }
  });

  return (
    <points ref={meshRef} position={[10, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={TOTAL_COUNT}
          array={currentPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12} // Slightly larger for circles
        color="#00e5ff"
        map={circleTex} // Round Texture
        alphaTest={0.5}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Animated 'Pretty' Starfield - reduced count for performance
const StarField = () => {
  const mesh = useRef();
  const circleTex = useMemo(() => getCircleTexture(), []);
  // Reduced star count: 1500 desktop, 500 mobile (was 4000)
  const count = IS_MOBILE ? 500 : 1500;

  // Generate Positions and Colors
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorPalette = [
      new THREE.Color("#ffffff"), // White
      new THREE.Color("#00e5ff"), // Cyan
      new THREE.Color("#0066ff"), // Blue
      new THREE.Color("#88ccff"), // Pale Blue
    ];

    for (let i = 0; i < count; i++) {
      // Position
      const r = 10 + Math.random() * 100; // Keep away from center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Color
      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state, delta) => {
    // Skip when tab is hidden
    if (document.hidden) return;
    if (mesh.current) {
      mesh.current.rotation.y -= delta * 0.05;
      mesh.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        vertexColors
        map={circleTex}
        alphaTest={0.5}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const MorphingParticles = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        background: "#0a0a14",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 22], fov: 50 }}
        gl={{ 
          antialias: false,  // Disable for better performance
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}  // Cap pixel ratio
      >
        <color attach="background" args={["#0a0a14"]} />
        <MorphingScene />
        <StarField />
      </Canvas>
    </div>
  );
};

export default MorphingParticles;
