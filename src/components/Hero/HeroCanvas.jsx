import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useLocation } from "react-router-dom";

// ============================================
// LARGE REALISTIC QUADCOPTER DRONE
// ============================================
const RealisticDrone = () => {
  const droneRef = useRef();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (droneRef.current) {
      timeRef.current += delta;
      const t = timeRef.current * 0.3; // Speed

      // Constrained Hover Path (Visible Screen Area)
      // x range approx +/- 4.0
      const x = Math.sin(t) * 3 + Math.cos(t * 1.5) * 1.0; 
      const y = Math.max(0.5, Math.cos(t * 0.7) * 1.0 + 1.5); // Altitude 0.5 - 2.5
      const z = Math.sin(t * 0.5) * 2; // Shallow depth

      droneRef.current.position.set(x, y, z);

      // Realistic Banking based on movement
      const vx = 3 * Math.cos(t) - 1.5 * Math.sin(t * 1.5);
      const vz = 1.0 * Math.cos(t * 0.5);
      
      droneRef.current.rotation.z = -vx * 0.05; 
      droneRef.current.rotation.x = vz * 0.1; 
      droneRef.current.rotation.y = -vx * 0.02;
    }
  });

  return (
    <group ref={droneRef} scale={0.7}>
      {/* ========== MAIN BODY ========== */}
      <group>
        {/* Central body - WHITE */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 0.22, 1]} />
          <meshStandardMaterial
            color="#f0f0f0"
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>

        {/* Top shell - sleek WHITE cover */}
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.9, 0.12, 0.9]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.2}
            roughness={0.15}
          />
        </mesh>

        {/* Glowing LED strip around body */}
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.52, 0.025, 6, 4]} />
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#00E5FF"
            emissiveIntensity={3}
          />
        </mesh>

        {/* Front direction arrow LED */}
        <mesh position={[0.55, 0.1, 0]}>
          <coneGeometry args={[0.06, 0.18, 3]} />
          <meshStandardMaterial
            color="#00FF88"
            emissive="#00FF88"
            emissiveIntensity={4}
          />
        </mesh>

        {/* Battery compartment */}
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.55, 0.14, 0.35]} />
          <meshStandardMaterial
            color="#e0e0e0"
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>

        {/* Battery indicator LEDs */}
        {[-0.15, -0.05, 0.05, 0.15].map((x, i) => (
          <mesh key={i} position={[x, -0.08, 0.18]}>
            <boxGeometry args={[0.06, 0.03, 0.01]} />
            <meshStandardMaterial
              color={i < 3 ? "#00FF00" : "#333"}
              emissive={i < 3 ? "#00FF00" : "#000"}
              emissiveIntensity={i < 3 ? 2 : 0}
            />
          </mesh>
        ))}
      </group>

      {/* ========== FOUR ARMS WITH MOTORS ========== */}
      {[
        { x: 1, z: 1, angle: Math.PI / 4, frontLED: true },
        { x: -1, z: 1, angle: -Math.PI / 4, frontLED: true },
        { x: 1, z: -1, angle: -Math.PI / 4, frontLED: false },
        { x: -1, z: -1, angle: Math.PI / 4, frontLED: false },
      ].map((arm, i) => (
        <DroneArm
          key={i}
          armX={arm.x}
          armZ={arm.z}
          angle={arm.angle}
          index={i}
          frontLED={arm.frontLED}
        />
      ))}

      {/* ========== 4K CAMERA GIMBAL ========== */}
      <CameraGimbal />

      {/* ========== GPS & SENSORS ========== */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={2}
        />
      </mesh>

      {/* ========== LANDING GEAR ========== */}
      <LandingGear />

      {/* ========== ANTENNAS ========== */}
      {[-0.25, 0.25].map((x, i) => (
        <group key={i} position={[x, 0.25, -0.35]}>
          <mesh>
            <cylinderGeometry args={[0.012, 0.012, 0.25, 8]} />
            <meshStandardMaterial
              color="#c0c0c0"
              metalness={0.6}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial
              color="#d0d0d0"
              metalness={0.7}
              roughness={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Drone Arm with Motor and Spinning Propeller
const DroneArm = ({ armX, armZ, angle, index, frontLED }) => {
  const propRef = useRef();
  const armLength = 1.15;
  const endX = armX * armLength;
  const endZ = armZ * armLength;

  useFrame(() => {
    if (propRef.current) {
      propRef.current.rotation.y += index % 2 === 0 ? 0.6 : -0.6;
    }
  });

  const ledColor = frontLED ? "#00E5FF" : "#FF6B35";

  return (
    <group>
      {/* WHITE arm tube */}
      <mesh position={[endX / 2, 0.02, endZ / 2]} rotation={[0, -angle, 0]}>
        <boxGeometry args={[armLength * 1.4, 0.055, 0.07]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.2} roughness={0.2} />
      </mesh>

      {/* Arm LED strip */}
      <mesh position={[endX / 2, 0.055, endZ / 2]} rotation={[0, -angle, 0]}>
        <boxGeometry args={[armLength * 1.2, 0.015, 0.025]} />
        <meshStandardMaterial
          color={ledColor}
          emissive={ledColor}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Motor assembly at end of arm */}
      <group position={[endX, 0.05, endZ]}>
        {/* Motor base - LIGHT GRAY */}
        <mesh>
          <cylinderGeometry args={[0.16, 0.19, 0.12, 24]} />
          <meshStandardMaterial
            color="#d8d8d8"
            metalness={0.4}
            roughness={0.15}
          />
        </mesh>

        {/* Motor top cap - SILVER */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.1, 0.14, 0.04, 24]} />
          <meshStandardMaterial
            color="#c0c0c0"
            metalness={0.6}
            roughness={0.1}
          />
        </mesh>

        {/* Bright LED ring */}
        <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.17, 0.025, 8, 20]} />
          <meshStandardMaterial
            color={ledColor}
            emissive={ledColor}
            emissiveIntensity={4}
          />
        </mesh>

        {/* Propeller group */}
        <group ref={propRef} position={[0, 0.12, 0]}>
          {/* Propeller hub - SILVER */}
          <mesh>
            <cylinderGeometry args={[0.045, 0.045, 0.035, 16]} />
            <meshStandardMaterial
              color="#b0b0b0"
              metalness={0.7}
              roughness={0.15}
            />
          </mesh>

          {/* Four blade propeller */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((rot, j) => (
            <mesh key={j} rotation={[0, rot, 0.05]} position={[0, 0.015, 0]}>
              <boxGeometry args={[0.55, 0.012, 0.055]} />
              <meshStandardMaterial
                color="#E8E8E8"
                transparent
                opacity={0.85}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}

          {/* Motion blur disc */}
          <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.08, 0.32, 32]} />
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={0.18}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// 4K Camera Gimbal
const CameraGimbal = () => {
  const gimbalRef = useRef();

  useFrame((state) => {
    if (gimbalRef.current) {
      gimbalRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      gimbalRef.current.rotation.z =
        Math.cos(state.clock.elapsedTime * 1.2) * 0.04;
    }
  });

  return (
    <group ref={gimbalRef} position={[0.38, -0.22, 0]}>
      {/* Gimbal mount bracket */}
      <mesh>
        <boxGeometry args={[0.14, 0.1, 0.12]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Camera housing */}
      <mesh position={[0.08, -0.08, 0]}>
        <boxGeometry args={[0.18, 0.14, 0.14]} />
        <meshStandardMaterial color="#e8e8e8" metalness={0.4} roughness={0.2} />
      </mesh>

      {/* Camera lens barrel */}
      <mesh position={[0.2, -0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.06, 0.08, 24]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.1} />
      </mesh>

      {/* Lens glass with reflection */}
      <mesh position={[0.25, -0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <circleGeometry args={[0.05, 24]} />
        <meshStandardMaterial
          color="#001133"
          metalness={0.6}
          roughness={0}
          emissive="#001166"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Recording indicator LED */}
      <mesh position={[0.04, -0.02, 0.08]}>
        <sphereGeometry args={[0.02, 10, 10]} />
        <meshStandardMaterial
          color="#FF0000"
          emissive="#FF0000"
          emissiveIntensity={5}
        />
      </mesh>
    </group>
  );
};

// Landing Gear
const LandingGear = () => {
  return (
    <group>
      {[
        [-0.55, 0],
        [0.55, 0],
      ].map(([x, z], i) => (
        <group key={i} position={[x, -0.15, z]}>
          {/* Support strut */}
          <mesh rotation={[0, 0, x > 0 ? -0.25 : 0.25]}>
            <cylinderGeometry args={[0.025, 0.025, 0.28, 8]} />
            <meshStandardMaterial
              color="#d0d0d0"
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
          {/* Landing skid */}
          <mesh
            position={[x > 0 ? 0.06 : -0.06, -0.14, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <capsuleGeometry args={[0.018, 0.55, 4, 8]} />
            <meshStandardMaterial
              color="#c8c8c8"
              metalness={0.4}
              roughness={0.3}
            />
          </mesh>
          {/* Shock absorber */}
          <mesh position={[x > 0 ? 0.03 : -0.03, -0.05, 0]}>
            <cylinderGeometry args={[0.015, 0.02, 0.1, 8]} />
            <meshStandardMaterial
              color="#FF6B35"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Floating Tech Debris (Nuts, Bolts, Chips)
const FloatingDebris = ({ count = 120 }) => {
  const { mouse, viewport } = useThree();
  
  // Initialize with refs for manual animation control
  const groupRef = useRef();
  
  // Create stable initial data
  const initialData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      // Wider distribution for "evenness"
      x: (Math.random() - 0.5) * 28, // Wider X
      y: (Math.random() - 0.5) * 16, // Wider Y
      z: (Math.random() - 0.5) * 8 - 2, // Shallow depth
      
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      type: i % 3, // Perfectly even distribution: 0, 1, 2, 0, 1, 2...
      speed: Math.random() * 0.1 + 0.05, // Much Slower drift
      color: Math.random() > 0.5 ? "#b0b0b0" : "#d0d0d0",
      
      // Random rotation axis
      rotSpeed: [(Math.random()-0.5)*0.01, (Math.random()-0.5)*0.01], // Slower rotation
      scale: Math.random() * 0.3 + 0.5, // Random scale 0.5-0.8
    }));
  }, [count]);

  // Use refs for performance - creating an array of refs
  const itemsRef = useRef([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Mouse Interaction
    const mx = (state.mouse.x * state.viewport.width) / 2;
    const my = (state.mouse.y * state.viewport.height) / 2;

    itemsRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const data = initialData[i];

      // Base Floating Motion (Slower)
      let newX = data.x + Math.sin(time * data.speed + i) * 0.3;
      let newY = data.y + Math.cos(time * data.speed * 0.8 + i) * 0.3;
      let newZ = data.z + Math.sin(time * 0.1 + i) * 0.5;

      // Mouse Interaction (Gentle Repulsion)
      const dx = mx - newX;
      const dy = my - newY;
      const distSq = dx*dx + dy*dy;
      const minDist = 2.5; // Slightly smaller interaction radius

      if (distSq < minDist * minDist) {
        const dist = Math.sqrt(distSq);
        const force = (minDist - dist) / minDist; // 0 to 1
        
        // Push away gently
        const ang = Math.atan2(dy, dx);
        const pushX = -Math.cos(ang) * force * 0.8; // Reduced push force
        const pushY = -Math.sin(ang) * force * 0.8;

        newX += pushX;
        newY += pushY;
        
        // Spin faster when interacting
        mesh.rotation.x += 0.05;
        mesh.rotation.y += 0.05;
      } else {
        // Normal rotation
        mesh.rotation.x += data.rotSpeed[0];
        mesh.rotation.y += data.rotSpeed[1];
      }

      mesh.position.set(newX, newY, newZ);
    });
  });

  return (
    <group ref={groupRef}>
      {initialData.map((d, i) => (
        <group key={i} ref={el => itemsRef.current[i] = el} position={[d.x, d.y, d.z]} rotation={d.rotation} scale={d.scale}>
            {d.type === 0 && ( /* Hex Nut */
              <mesh>
                <cylinderGeometry args={[0.14, 0.14, 0.1, 6]} />
                <meshStandardMaterial color={d.color} metalness={0.7} roughness={0.3} />
                {/* Hole */}
                <mesh position={[0, 0, 0]}>
                   <cylinderGeometry args={[0.07, 0.07, 0.11, 16]} />
                   <meshBasicMaterial color="#000" />
                </mesh>
              </mesh>
            )}
            {d.type === 1 && ( /* Bolt */
              <group>
                <mesh position={[0, 0.1, 0]}>
                  <cylinderGeometry args={[0.1, 0.1, 0.06, 6]} />
                  <meshStandardMaterial color={d.color} metalness={0.7} roughness={0.3} />
                </mesh>
                <mesh position={[0, -0.06, 0]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.3, 12]} />
                  <meshStandardMaterial color="#888" metalness={0.6} roughness={0.4} />
                </mesh>
              </group>
            )}
            {d.type === 2 && ( /* Microchip */
              <group>
                <mesh>
                  <boxGeometry args={[0.22, 0.03, 0.22]} />
                  <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.5} />
                </mesh>
                <mesh position={[0, 0.016, 0]}>
                  <planeGeometry args={[0.12, 0.12]} />
                  <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Pins */}
                <mesh position={[0.13, 0, 0]}>
                   <boxGeometry args={[0.03, 0.015, 0.15]} />
                   <meshStandardMaterial color="#aaa" metalness={0.8} />
                </mesh>
                <mesh position={[-0.13, 0, 0]}>
                   <boxGeometry args={[0.03, 0.015, 0.15]} />
                   <meshStandardMaterial color="#aaa" metalness={0.8} />
                </mesh>
              </group>
            )}
        </group>
      ))}
    </group>
  );
};

// ============================================
// ROBOTIC ARM
// ============================================
// ============================================
// ROBOTIC ARM - Articulated Industrial Arm
// ============================================
const RoboticArm = () => {
  const armRef = useRef();
  const joint1Ref = useRef();
  const joint2Ref = useRef();
  const gripperRef = useRef();
  const finger1Ref = useRef();
  const finger2Ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Base: Scans wide
    if (armRef.current) {
      armRef.current.rotation.y = Math.sin(t * 0.4) * 1.0;
    }
    // Shoulder: Reach sequence
    if (joint1Ref.current) {
      joint1Ref.current.rotation.z = Math.sin(t * 0.6) * 0.4 + 0.3;
    }
    // Elbow: Articulate
    if (joint2Ref.current) {
      joint2Ref.current.rotation.z = Math.sin(t * 0.6 + 2.5) * 0.6 + 0.5;
    }
    // Gripper: Rotate slowly for inspection (Not spinning)
    if (gripperRef.current) {
      gripperRef.current.rotation.x = Math.sin(t * 1.0) * 0.5; 
      gripperRef.current.rotation.z = Math.sin(t * 5) * 0.05; // Micro-adjustments
    }
    
    // Fingers: Open/Close Pinching Animation
    const pinch = (Math.sin(t * 4) + 1) / 2; // 0 to 1 oscilation
    if (finger1Ref.current && finger2Ref.current) {
      // Left Finger (Starts at -0.1, moves to -0.03)
      finger1Ref.current.position.x = -0.1 + (pinch * 0.07);
      // Right Finger (Starts at 0.1, moves to 0.03)
      finger2Ref.current.position.x = 0.1 - (pinch * 0.07);
    }
  });

  return (
    <group ref={armRef} position={[-5.8, -3.8, -1]} scale={1.1}>
      {/* Base Platform */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.7, 0.8, 0.3, 32]} />
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Rotating Turret */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.4, 32]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Turret Light Ring */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.51, 0.51, 0.05, 32]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Shoulder Joint */}
      <group ref={joint1Ref} position={[0, 0.8, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.6, 32]} />
          <meshStandardMaterial
            color="#d0d0d0"
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>

        {/* Lower Arm */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.25, 1.4, 0.25]} />
          <meshStandardMaterial
            color="#f5f5f5"
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>

        {/* Elbow Joint */}
        <group ref={joint2Ref} position={[0, 1.6, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.5, 32]} />
            <meshStandardMaterial
              color="#c0c0c0"
              metalness={0.6}
              roughness={0.2}
            />
          </mesh>

          {/* Upper Arm */}
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[0.2, 1.0, 0.2]} />
            <meshStandardMaterial
              color="#e8e8e8"
              metalness={0.3}
              roughness={0.2}
            />
          </mesh>

          {/* Wrist/Gripper Mechanism */}
          <group ref={gripperRef} position={[0, 1.2, 0]}>
            <mesh>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial
                color="#333"
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>

            {/* Fingers with Refs for Animation */}
            <mesh ref={finger1Ref} position={[-0.1, 0.3, 0]}>
              <boxGeometry args={[0.05, 0.4, 0.1]} />
              <meshStandardMaterial color="#FF6B35" />
            </mesh>
            <mesh ref={finger2Ref} position={[0.1, 0.3, 0]}>
              <boxGeometry args={[0.05, 0.4, 0.1]} />
              <meshStandardMaterial color="#FF6B35" />
            </mesh>

            {/* Sensor Light */}
            <mesh position={[0, 0.15, 0.16]}>
              <circleGeometry args={[0.05, 16]} />
              <meshStandardMaterial
                color="#00E5FF"
                emissive="#00E5FF"
                emissiveIntensity={3}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};

// ============================================
// MOON ROVER
// ============================================
// ============================================
// MOON ROVER - Space Exploration Vehicle
// ============================================
const MoonRover = () => {
  const roverRef = useRef();
  const wheelsRef = useRef([]);

  const targetRef = useRef({ x: 2, z: 0 }); // Current target destination
  const roverState = useRef({ heading: 0, speed: 0 }); // Current heading/speed

  useFrame((state, delta) => {
    // Limits
    const BOUNDS_X = 2.5; // Constrained local X ( +/- 2.5 )
    const BOUNDS_Z = 1.6; // Deep range
    const SPEED = 0.25 * delta;
    const TURN_SPEED = 0.2 * delta;

    if (roverRef.current) {
      const pos = roverRef.current.position;
      
      // distance to target
      const dx = targetRef.current.x - pos.x;
      const dz = targetRef.current.z - pos.z;
      const dist = Math.sqrt(dx*dx + dz*dz);

      // If reached target (or close enough), pick new one
      if (dist < 0.5) {
         // Pick a new target
         let newX, newZ, newDist;
         let attempts = 0;
         do {
             newX = (Math.random() - 0.5) * 2 * BOUNDS_X;
             newZ = (Math.random() - 0.5) * 2 * BOUNDS_Z;
             const ddx = newX - pos.x;
             const ddz = newZ - pos.z;
             newDist = Math.sqrt(ddx*ddx + ddz*ddz);
             attempts++;
         } while(newDist < 2.5 && attempts < 10); // Min distance
         
         targetRef.current.x = newX;
         targetRef.current.z = newZ;
      }

      // Desired Heading
      const targetHeading = Math.atan2(dx, dz);
      
      // Smooth Turn
      // Find shortest angle diff
      let angleDiff = targetHeading - roverState.current.heading;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      // Apply turn
      if (Math.abs(angleDiff) > 0.05) {
         roverState.current.heading += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), TURN_SPEED);
      } else {
         roverState.current.heading = targetHeading;
      }
      
      roverRef.current.rotation.y = roverState.current.heading;

      // Move Forward only if roughly facing target (tank control feel? or just move)
      // "Go straight... unorthodixically" -> maybe add some noise?
      // Let's just move forward in current heading direction
      // But only if angle diff is small, so it turns THEN moves (or curves)
      // Allowing curve:
      const moveSpeed = SPEED * Math.max(0, 1 - Math.abs(angleDiff)); // Slow down on hard turns
      
      pos.x += Math.sin(roverState.current.heading) * moveSpeed;
      pos.z += Math.cos(roverState.current.heading) * moveSpeed;

      // Bobbing motion for "terrain"
      pos.y = Math.sin(state.clock.elapsedTime * 10) * 0.015;
      
      // Bank slightly on turns
      roverRef.current.rotation.z = -angleDiff * 0.1;
      roverRef.current.rotation.x = -moveSpeed * 0.2; // Pitch forward slightly when moving
    }
    
    // Spin wheels if moving
    wheelsRef.current.forEach((w) => {
       if (w) w.rotation.x += 0.8 * delta; // Slower spin matching crawling speed
    });
  });

  return (
    <group ref={roverRef} scale={1.2}>
      <group position={[0, 0.3, 0]}>
        {/* Chassis - Detailed & Modern (White/Cyan Theme) */}
        {/* Main Body Lower */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.1, 0.3, 2.0]} />
          <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.2} />
        </mesh>
        {/* Main Body Upper (Sloped) */}
        <mesh position={[0, 0.25, -0.1]}>
          <boxGeometry args={[0.9, 0.25, 1.6]} />
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.2} />
        </mesh>
        
        {/* Cyan Strip Accents */}
        <mesh position={[0, 0.26, 0.5]}>
          <planeGeometry args={[0.8, 0.4]} rotation={[-Math.PI/2, 0, 0]} />
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.8} />
        </mesh>

        {/* --- SOLAR PANEL ARRAY (Deployed) --- */}
        <group position={[0, 0.38, -0.5]} rotation={[0.2, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.4, 0.05, 1.0]} />
            <meshStandardMaterial color="#1a237e" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Solar Grid Overlay */}
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI/2, 0, 0]}>
             <planeGeometry args={[1.3, 0.9, 4, 3]} />
             <meshBasicMaterial color="#00E5FF" wireframe opacity={0.3} transparent />
          </mesh>
        </group>

        {/* --- SENSOR MAST / CAMERA --- */}
        <group position={[0, 0.4, 0.8]} rotation={[-0.1, 0, 0]}>
          {/* Mast Pole */}
          <mesh position={[0, 0.25, 0]}>
             <cylinderGeometry args={[0.04, 0.05, 0.5]} />
             <meshStandardMaterial color="#e0e0e0" />
          </mesh>
          {/* Camera Head Box */}
          <mesh position={[0, 0.55, 0]}>
             <boxGeometry args={[0.3, 0.15, 0.2]} />
             <meshStandardMaterial color="#ffffff" metalness={0.5} />
          </mesh>
          {/* Main Lens */}
          <mesh position={[0, 0.55, 0.11]}>
             <cylinderGeometry args={[0.06, 0.06, 0.05]} rotation={[Math.PI/2, 0, 0]} />
             <meshStandardMaterial color="#111" metalness={1} roughness={0} />
          </mesh>
          <mesh position={[0, 0.55, 0.14]}>
             <sphereGeometry args={[0.04, 16, 16, 0, 6.28, 0, 1.5]} rotation={[Math.PI/2, 0, 0]} />
             <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1} transparent opacity={0.6} />
          </mesh>
          {/* Side Eyes */}
          <mesh position={[0.12, 0.55, 0.1]}>
             <cylinderGeometry args={[0.03, 0.03, 0.05]} rotation={[Math.PI/2, 0, 0]} />
             <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={3} />
          </mesh>
           <mesh position={[-0.12, 0.55, 0.1]}>
             <cylinderGeometry args={[0.03, 0.03, 0.05]} rotation={[Math.PI/2, 0, 0]} />
             <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={3} />
          </mesh>
        </group>

        {/* --- MINI ROBOT ARM (Deployed Front) --- */}
        <group position={[0.45, 0.2, 0.9]} rotation={[0, -0.5, 0]}>
           {/* Shoulder */}
           <mesh>
              <sphereGeometry args={[0.12]} />
              <meshStandardMaterial color="#7f8c8d" />
           </mesh>
           {/* Upper Arm */}
           <group rotation={[0, 0, -0.5]}>
              <mesh position={[0, 0.25, 0]}>
                 <cylinderGeometry args={[0.04, 0.04, 0.5]} />
                 <meshStandardMaterial color="#e0e0e0" />
              </mesh>
              {/* Elbow */}
              <group position={[0, 0.5, 0]} rotation={[0, 0, 1.2]}>
                  <mesh>
                    <sphereGeometry args={[0.09]} />
                    <meshStandardMaterial color="#7f8c8d" />
                  </mesh>
                  {/* Forearm */}
                  <mesh position={[0, 0.25, 0]}>
                     <cylinderGeometry args={[0.03, 0.03, 0.5]} />
                     <meshStandardMaterial color="#e0e0e0" />
                  </mesh>
                  {/* Claw Hand */}
                  <group position={[0, 0.5, 0]}>
                     <mesh position={[0.05, 0.05, 0]} rotation={[0, 0, -0.5]}>
                        <boxGeometry args={[0.02, 0.15, 0.05]} />
                        <meshStandardMaterial color="#333" />
                     </mesh>
                     <mesh position={[-0.05, 0.05, 0]} rotation={[0, 0, 0.5]}>
                        <boxGeometry args={[0.02, 0.15, 0.05]} />
                        <meshStandardMaterial color="#333" />
                     </mesh>
                  </group>
              </group>
           </group>
        </group>

        {/* RTG / Power Source (Rear) */}
        <group position={[0, 0.3, -0.9]} rotation={[Math.PI/4, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
            <meshStandardMaterial color="#d0d0d0" metalness={0.6} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI/2]}>
             <torusGeometry args={[0.16, 0.02, 8, 16]} />
             <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={2} />
          </mesh>
        </group>
      </group>

      {/* 6 Wheels Rocker-Bogie System (REVERTED TO STEEL/DETAILED) */}
      {[
        [-0.75, 0, 0.8],  // Front L
        [0.75, 0, 0.8],   // Front R
        [-0.85, 0, 0],    // Mid L
        [0.85, 0, 0],     // Mid R
        [-0.75, 0, -0.8], // Rear L
        [0.75, 0, -0.8],  // Rear R
      ].map((pos, i) => (
        <group key={i} position={pos}>
          {/* Suspension Strut */}
          <mesh
            position={[pos[0] > 0 ? -0.2 : 0.2, 0.3, 0]}
            rotation={[0, 0, pos[0] > 0 ? -0.5 : 0.5]}
          >
            <cylinderGeometry args={[0.03, 0.03, 0.6]} />
            <meshStandardMaterial color="#7f8c8d" />
          </mesh>
          {/* Hub */}
          <mesh
            position={[pos[0] > 0 ? -0.05 : 0.05, 0.1, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
             <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
             <meshStandardMaterial color="#555" />
          </mesh>
          {/* Detailed Wheel (Reverted Style) */}
          <mesh
            ref={(el) => (wheelsRef.current[i] = el)}
            rotation={[0, 0, Math.PI / 2]}
          >
            {/* Rim - Steel Blue */}
            <cylinderGeometry args={[0.22, 0.22, 0.18, 32]} />
            <meshStandardMaterial
              color="#b0c4de"
              metalness={0.6}
              roughness={0.5}
            /> 
            {/* Treads - Spiraled Dark */}
             <mesh rotation={[0, 1, 0]} scale={[1.02, 1, 1.02]}>
               <cylinderGeometry args={[0.22, 0.22, 0.12, 12]} />
               <meshStandardMaterial color="#2c3e50" wireframe />
             </mesh>
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ============================================
// PLANE
// ============================================
// ============================================
// PLANE - Fixed Wing Aircraft
// ============================================
const Plane = () => {
  const planeRef = useRef();
  const propRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.15; // Even Slower flight speed for smoothness

    // Wide, Smooth Flight Path
    // Lissajous-like but very wide arcs
    const x = Math.sin(t) * 7; 
    const y = 2.0 + Math.sin(t * 2) * 0.5; // Slight altitude wobble
    const z = -5.0 + Math.cos(t * 0.5) * 4; // Long depth traversal

    if (planeRef.current) {
      planeRef.current.position.set(x, y, z);

      // Derivatives for smooth banking/orientation
      const dx = 7 * Math.cos(t);
      const dy = 1.0 * Math.cos(t * 2);
      const dz = -2.0 * Math.sin(t * 0.5);

      // Yaw
      const yaw = Math.atan2(dx, dz) + Math.PI;
      planeRef.current.rotation.y = yaw;

      // Pitch
      planeRef.current.rotation.x = -dy * 0.1;

      // Roll (Banking)
      // Limit banking angle to avoid "hard" turns feeling
      planeRef.current.rotation.z = -dx * 0.05;
    }

    // Spin Propeller - Faster
    if (propRef.current) propRef.current.rotation.z += 2.0;
  });

  return (
    <group ref={planeRef} scale={1.0}>
      <group rotation={[0, Math.PI, 0]}>
        
        {/* === FUSELAGE (White Drone-Style) === */}
        <group>
           {/* Main Body */}
           <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.2]}>
             <cylinderGeometry args={[0.14, 0.08, 2.0, 16]} />
             <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.2} />
           </mesh>
           {/* Nose Cone */}
           <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.3]}>
             <coneGeometry args={[0.14, 0.4, 16]} />
             <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.2} />
           </mesh>
           {/* Tail Cone */}
           <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.9]}>
             <coneGeometry args={[0.08, 0.3, 16]} />
             <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.2} />
           </mesh>

           {/* Canopy - Dark Glass with Cyan Hint */}
           <mesh position={[0, 0.12, 0.5]} rotation={[0.2, 0, 0]}>
             <capsuleGeometry args={[0.09, 0.4, 4, 8]} />
             <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} emissive="#002233" />
           </mesh>
        </group>

        {/* === WINGS (White) === */}
        <group position={[0, 0.05, 0.4]}>
           {/* Left Wing */}
           <mesh position={[1.2, 0, -0.4]} rotation={[0, 0.4, 0]}>
             <boxGeometry args={[2.4, 0.04, 0.6]} />
             <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.2} />
           </mesh>
           {/* Right Wing */}
           <mesh position={[-1.2, 0, -0.4]} rotation={[0, -0.4, 0]}>
             <boxGeometry args={[2.4, 0.04, 0.6]} />
             <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.2} />
           </mesh>
           
           {/* Winglets - White Accent (No Blue) */}
           <mesh position={[2.3, 0.1, -0.8]} rotation={[0, 0.4, 0.5]}>
              <boxGeometry args={[0.1, 0.3, 0.4]} />
              <meshStandardMaterial color="#ffffff" emissive="#bbbbbb" emissiveIntensity={0.2} />
           </mesh>
           <mesh position={[-2.3, 0.1, -0.8]} rotation={[0, -0.4, -0.5]}>
              <boxGeometry args={[0.1, 0.3, 0.4]} />
              <meshStandardMaterial color="#ffffff" emissive="#bbbbbb" emissiveIntensity={0.2} />
           </mesh>
        </group>

        {/* === V-TAIL === */}
        <group position={[0, 0.1, -0.8]}>
           <mesh position={[0.4, 0.4, 0]} rotation={[0, 0, 0.6]}>
             <boxGeometry args={[0.8, 0.04, 0.5]} />
             <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.2} />
           </mesh>
           <mesh position={[-0.4, 0.4, 0]} rotation={[0, 0, -0.6]}>
             <boxGeometry args={[0.8, 0.04, 0.5]} />
             <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.2} />
           </mesh>
        </group>

        {/* === PROPELLER (White/Grey) === */}
        <group ref={propRef} position={[0, 0, 1.51]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.14, 0.15]} />
            <meshStandardMaterial color="#d0d0d0" />
          </mesh>
          {[0, (2*Math.PI)/3, (4*Math.PI)/3].map((r, i) => (
            <mesh key={i} rotation={[0, 0, r]} position={[0, 0, 0.05]}>
              <boxGeometry args={[1.4, 0.08, 0.02]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.95} />
            </mesh>
          ))}
          {/* Propeller Blur Disc */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
            <circleGeometry args={[0.75, 32]} />
            <meshBasicMaterial color="#fff" transparent opacity={0.08} side={THREE.DoubleSide} />
          </mesh>
        </group>
        
      </group>
    </group>
  );
};


// ============================================
// ADVANCED CAR
// ============================================
// ============================================
// ADVANCED CAR - Futuristic Autonomous Vehicle
// ============================================
const AdvancedCar = () => {
  const carRef = useRef();
  const wheelsRef = useRef([]);

  useFrame((state) => {
    // Subtle suspension bounce
    if (carRef.current) {
      carRef.current.position.y = -4.5 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }

    // Spin wheels (idling or dyno mode)
    wheelsRef.current.forEach((w) => {
      if (w) w.rotation.x += 0.2;
    });
  });

  return (
    <group ref={carRef} scale={1.5}>
      {/* Chassis Body - Aerodynamic Shape */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.1, 0.4, 1.8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Hood - Low Profile */}
      <mesh position={[0, 0.28, 1.2]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[1.05, 0.25, 0.9]} />
        <meshStandardMaterial color="#ffffff" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Trunk - Rounded */}
      <mesh position={[0, 0.35, -1.1]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[1.05, 0.35, 0.6]} />
        <meshStandardMaterial color="#ffffff" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Side Skirts */}
      <mesh position={[0.6, 0.15, 0]}>
        <boxGeometry args={[0.1, 0.15, 2.8]} />
        <meshStandardMaterial color="#ccc" metalness={0.8} />
      </mesh>
      <mesh position={[-0.6, 0.15, 0]}>
        <boxGeometry args={[0.1, 0.15, 2.8]} />
        <meshStandardMaterial color="#ccc" metalness={0.8} />
      </mesh>

      {/* Cabin / Greenhouse */}
      <mesh position={[0, 0.65, -0.1]}>
        <boxGeometry args={[0.95, 0.4, 1.3]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 0.85, -0.15]}>
        <boxGeometry args={[0.96, 0.05, 1.0]} />
        <meshStandardMaterial color="#ddd" metalness={0.6} />
      </mesh>

      {/* Headlights - Aggressive Strips */}
      <mesh position={[0.35, 0.3, 1.62]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.1]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={4}
        />
      </mesh>
      <mesh position={[-0.35, 0.3, 1.62]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.1]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Taillights - Full Width Bar */}
      <mesh position={[0, 0.4, -1.35]}>
        <boxGeometry args={[1.0, 0.1, 0.1]} />
        <meshStandardMaterial
          color="#FF0000"
          emissive="#FF0000"
          emissiveIntensity={3}
        />
      </mesh>

      {/* LIDAR / Sensor Dome */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.15, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.05, 16]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Wheels */}
      {[
        [-0.65, 0.2, 0.7],
        [0.65, 0.2, 0.7], // Front
        [-0.65, 0.2, -0.8],
        [0.65, 0.2, -0.8], // Rear
      ].map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => (wheelsRef.current[i] = el)}
          position={pos}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.22, 0.22, 0.25, 24]} />
          <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
          {/* Rim */}
          <mesh position={[0, 0.13, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
            <meshStandardMaterial color="#fff" />
          </mesh>
        </mesh>
      ))}
    </group>
  );
};

// Tech Grid Floor (Background)
const TechGrid = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
    <planeGeometry args={[60, 60, 40, 40]} />
    <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.08} />
  </mesh>
);

// Main Canvas with Scroll Blur Effect (Home) or Fixed Blur (Other Pages)
const HeroCanvas = () => {
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Home: scroll-based blur (0 to 6px). Other pages: fixed 8px blur
  const blurAmount = isHome ? Math.min(scrollY / 200, 6) : 8;
  const opacity = isHome ? Math.max(0.5, 1 - scrollY / 2000) : 0.5;

  return (
    <Canvas
      dpr={[1, 1.2]}
      performance={{ min: 0.3 }}
      camera={{ position: [0, 0, 10], fov: 45 }}
      gl={{ 
        antialias: false, 
        powerPreference: "high-performance",
        alpha: true,
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -1,
        filter: `blur(${blurAmount}px) brightness(${opacity})`,
        background: "var(--bg-primary)", 
      }}
    >
      {/* Reduced lighting for better performance */}
      <ambientLight intensity={0.6} />

      {/* Key lights - reduced count */}
      <pointLight position={[8, 8, 10]} intensity={1.5} color="#FFFFFF" />
      <pointLight position={[-8, 6, -8]} intensity={1} color="#9D4EDD" />
      
      {/* Single spotlight */}
      <spotLight
        position={[0, 12, 8]}
        angle={0.6}
        penumbra={1}
        intensity={1.5}
        color="#FFFFFF"
      />

      {/* Fill light */}
      <directionalLight position={[0, 10, 5]} intensity={0.8} color="#FFFFFF" />

      {/* THE BIG DRONE - Upper Right Mid */}
      <RealisticDrone />

      {/* ROBOTIC ARM - Left Mid */}
      <RoboticArm />

      {/* MOON ROVER - Grounded and Positioned on Right Side */}
      <group position={[6.5, -2.5, -4.0]} rotation={[0, 0, 0]} scale={0.9}>
        <MoonRover />
      </group>

      {/* PLANE - High Altitude Background */}
      <Plane />

      {/* Floating Tech Debris - Reduced count for performance */}
      <FloatingDebris count={60} />

      {/* Grid */}
      <TechGrid />

    </Canvas>
  );
};

export default HeroCanvas;
