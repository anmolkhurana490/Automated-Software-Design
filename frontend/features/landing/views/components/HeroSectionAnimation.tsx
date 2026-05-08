"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { type Group } from "three";

const c = {
  blue: "#3b82f6",
  orange: "#f97316",
  green: "#22c55e",
  red: "#ef4444",
  light: "#e2e8f0",
  dark: "#1f2937",
  panel: "#0f172a",
};

function RobotAgent() {
  const group = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const head = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.5) * 0.2;
      group.current.position.y = Math.sin(t * 1.3) * 0.05;
    }
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.9) * 0.1;
    }
    if (leftArm.current && rightArm.current) {
      leftArm.current.rotation.z = -0.35 + Math.sin(t * 1.8) * 0.07;
      rightArm.current.rotation.z = 0.35 - Math.sin(t * 1.8) * 0.07;
    }
  });

  return (
    <group ref={group} position={[0, -0.35, 0]}>
      <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.7}>
        <group ref={head} position={[0, 1.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.28, 0.98, 0.95]} />
            <meshStandardMaterial color={c.blue} metalness={0.35} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.1, 0.5]}>
            <boxGeometry args={[0.98, 0.7, 0.08]} />
            <meshStandardMaterial color={c.panel} metalness={0.55} roughness={0.28} />
          </mesh>
          <mesh position={[-0.3, 0.1, 0.56]}>
            <sphereGeometry args={[0.08, 22, 22]} />
            <meshStandardMaterial color={c.orange} emissive={c.orange} emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[0.3, 0.1, 0.56]}>
            <sphereGeometry args={[0.08, 22, 22]} />
            <meshStandardMaterial color={c.orange} emissive={c.orange} emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[0, -0.22, 0.56]}>
            <boxGeometry args={[0.46, 0.06, 0.05]} />
            <meshStandardMaterial color={c.green} emissive={c.green} emissiveIntensity={0.65} />
          </mesh>
          <mesh position={[0, 0.77, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.32, 12]} />
            <meshStandardMaterial color={c.light} />
          </mesh>
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.1, 20, 20]} />
            <meshStandardMaterial color={c.red} emissive={c.red} emissiveIntensity={0.9} />
          </mesh>
        </group>

        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.7, 1.56, 1.06]} />
          <meshStandardMaterial color={c.dark} metalness={0.33} roughness={0.38} />
        </mesh>

        <mesh position={[0, 0.14, 0.55]}>
          <boxGeometry args={[1.08, 0.84, 0.08]} />
          <meshStandardMaterial color={c.panel} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.22, 0.58]}>
          <boxGeometry args={[0.72, 0.2, 0.08]} />
          <meshStandardMaterial color={c.green} emissive={c.green} emissiveIntensity={0.8} />
        </mesh>

        <group ref={leftArm} position={[-1.0, 0.15, 0]}>
          <mesh position={[0, 0.34, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.13, 0.86, 16]} />
            <meshStandardMaterial color={c.blue} metalness={0.3} roughness={0.35} />
          </mesh>
          <mesh position={[0, -0.17, 0.02]} castShadow>
            <sphereGeometry args={[0.18, 20, 20]} />
            <meshStandardMaterial color={c.light} metalness={0.3} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.58, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.11, 0.56, 16]} />
            <meshStandardMaterial color={c.orange} metalness={0.25} roughness={0.4} />
          </mesh>
        </group>

        <group ref={rightArm} position={[1.0, 0.15, 0]}>
          <mesh position={[0, 0.34, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.13, 0.86, 16]} />
            <meshStandardMaterial color={c.blue} metalness={0.3} roughness={0.35} />
          </mesh>
          <mesh position={[0, -0.17, 0.02]} castShadow>
            <sphereGeometry args={[0.18, 20, 20]} />
            <meshStandardMaterial color={c.light} metalness={0.3} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.58, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.11, 0.56, 16]} />
            <meshStandardMaterial color={c.orange} metalness={0.25} roughness={0.4} />
          </mesh>
        </group>

        <mesh position={[-0.48, -1.16, 0.06]} castShadow>
          <cylinderGeometry args={[0.18, 0.21, 0.96, 16]} />
          <meshStandardMaterial color={c.dark} metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0.48, -1.16, 0.06]} castShadow>
          <cylinderGeometry args={[0.18, 0.21, 0.96, 16]} />
          <meshStandardMaterial color={c.dark} metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[-0.48, -1.74, 0.04]} castShadow>
          <boxGeometry args={[0.42, 0.2, 0.32]} />
          <meshStandardMaterial color={c.red} metalness={0.2} roughness={0.42} />
        </mesh>
        <mesh position={[0.48, -1.74, 0.04]} castShadow>
          <boxGeometry args={[0.42, 0.2, 0.32]} />
          <meshStandardMaterial color={c.red} metalness={0.2} roughness={0.42} />
        </mesh>
      </Float>
    </group>
  );
}

export function HeroSectionAnimation() {
  return (
    <div className="h-112 rounded-2xl">
      <Canvas shadows={{ type: 1 }} dpr={[1, 1.5]} camera={{ position: [0, -0.5, 4.9], fov: 50 }}>
        <color attach="background" args={["#0f172a"]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 5, 4]} intensity={2.1} color="#ffffff" castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={1.0} color="#60a5fa" />
        <pointLight position={[0, 2.2, 1.8]} intensity={1.6} color="#f97316" />
        <RobotAgent />
        <ContactShadows opacity={0.55} scale={8} blur={2.8} far={4.8} resolution={256} color="#020617" />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
