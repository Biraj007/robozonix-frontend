import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Simple drone animation for mobile - just up/down and slight twist
const MobileDroneModel = () => {
  const droneRef = useRef();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (droneRef.current) {
      timeRef.current += delta;
      const t = timeRef.current * 0.5;

      // Simple gentle movement for mobile
      const x = Math.sin(t * 0.8) * 0.5; // Slight left-right
      const y = Math.sin(t * 1.2) * 0.3; // Gentle up-down
      
      droneRef.current.position.set(x, y, 0);

      // Subtle tilt
      droneRef.current.rotation.z = Math.sin(t * 0.6) * 0.08;
      droneRef.current.rotation.x = Math.sin(t * 0.4) * 0.05;
    }
  });

  return (
    <group ref={droneRef} scale={0.5} position={[0, 0, 0]}>
      {/* ========== MAIN BODY ========== */}
      <group>
        {/* Central body - WHITE */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 0.22, 1]} />
          <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.2} />
        </mesh>

        {/* Top shell */}
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.9, 0.12, 0.9]} />
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.15} />
        </mesh>

        {/* Glowing LED strip */}
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.52, 0.025, 6, 4]} />
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={3} />
        </mesh>

        {/* Front direction LED */}
        <mesh position={[0.55, 0.1, 0]}>
          <coneGeometry args={[0.06, 0.18, 3]} />
          <meshStandardMaterial color="#00FF88" emissive="#00FF88" emissiveIntensity={4} />
        </mesh>

        {/* Battery */}
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.55, 0.14, 0.35]} />
          <meshStandardMaterial color="#e0e0e0" metalness={0.4} roughness={0.3} />
        </mesh>
      </group>

      {/* ========== FOUR ARMS ========== */}
      {[
        { x: 1, z: 1, angle: Math.PI / 4, front: true },
        { x: -1, z: 1, angle: -Math.PI / 4, front: true },
        { x: 1, z: -1, angle: -Math.PI / 4, front: false },
        { x: -1, z: -1, angle: Math.PI / 4, front: false },
      ].map((arm, i) => (
        <DroneArm key={i} armX={arm.x} armZ={arm.z} angle={arm.angle} index={i} front={arm.front} />
      ))}

      {/* GPS Dome */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={2} />
      </mesh>

      {/* Landing Gear */}
      {[-0.4, 0.4].map((z, i) => (
        <group key={i}>
          <mesh position={[0, -0.25, z]}>
            <boxGeometry args={[0.6, 0.03, 0.04]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          {[-0.25, 0.25].map((x, j) => (
            <mesh key={j} position={[x, -0.18, z]}>
              <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
              <meshStandardMaterial color="#444" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

// Arm with spinning propeller
const DroneArm = ({ armX, armZ, angle, index, front }) => {
  const propRef = useRef();
  const armLength = 1.15;
  const endX = armX * armLength;
  const endZ = armZ * armLength;
  const ledColor = front ? "#00E5FF" : "#FF6B35";

  useFrame(() => {
    if (propRef.current) {
      propRef.current.rotation.y += index % 2 === 0 ? 0.5 : -0.5;
    }
  });

  return (
    <group>
      {/* Arm */}
      <mesh position={[endX / 2, 0.02, endZ / 2]} rotation={[0, -angle, 0]}>
        <boxGeometry args={[armLength * 1.4, 0.055, 0.07]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.2} roughness={0.2} />
      </mesh>

      {/* Motor */}
      <group position={[endX, 0.05, endZ]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.19, 0.12, 16]} />
          <meshStandardMaterial color="#d8d8d8" metalness={0.4} roughness={0.15} />
        </mesh>

        {/* LED ring */}
        <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.17, 0.025, 8, 16]} />
          <meshStandardMaterial color={ledColor} emissive={ledColor} emissiveIntensity={4} />
        </mesh>

        {/* Propeller */}
        <group ref={propRef} position={[0, 0.12, 0]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
            <meshStandardMaterial color="#b0b0b0" metalness={0.7} roughness={0.15} />
          </mesh>
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((rot, j) => (
            <mesh key={j} rotation={[0, rot, 0.05]} position={[0, 0.015, 0]}>
              <boxGeometry args={[0.55, 0.012, 0.055]} />
              <meshStandardMaterial color="#E8E8E8" transparent opacity={0.85} side={THREE.DoubleSide} />
            </mesh>
          ))}
          {/* Blur disc */}
          <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.08, 0.32, 24]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

const MobileDrone = () => {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4], fov: 50 }}
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
        background: "var(--bg-primary)",
      }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#FFFFFF" />
      <pointLight position={[-3, 3, 3]} intensity={0.8} color="#00E5FF" />
      
      <MobileDroneModel />
    </Canvas>
  );
};

export default MobileDrone;
