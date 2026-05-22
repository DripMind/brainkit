'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

function ConnectionLine({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const geometry = useMemo(() => {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [start, end]);

  return (
    <primitive object={new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ color: '#6C47FF', transparent: true, opacity: 0.15 })
    )} />
  );
}

function FloatingNode({ position, color, scale, speed, offset }: {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
  offset: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(t * speed + offset) * 0.2;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.5 + Math.sin(t * speed * 1.5 + offset) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[scale, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

function NeuralNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  const nodes = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4,
    ] as [number, number, number],
    color: i % 2 === 0 ? '#6C47FF' : '#00D4FF',
    scale: 0.08 + Math.random() * 0.12,
    speed: 0.3 + Math.random() * 0.5,
    offset: Math.random() * Math.PI * 2,
  })), []);

  const connections = useMemo(() => {
    const lines: { start: [number, number, number]; end: [number, number, number] }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].position[0] - nodes[j].position[0];
        const dy = nodes[i].position[1] - nodes[j].position[1];
        if (Math.sqrt(dx * dx + dy * dy) < 4) {
          lines.push({ start: nodes[i].position, end: nodes[j].position });
        }
      }
    }
    return lines;
  }, [nodes]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.0008 + mouse.x * 0.0005;
    groupRef.current.rotation.x += 0.0003 + mouse.y * 0.0003;
  });

  return (
    <group ref={groupRef}>
      {connections.map((conn, i) => (
        <ConnectionLine key={`c-${i}`} start={conn.start} end={conn.end} />
      ))}
      {nodes.map((node, i) => (
        <FloatingNode key={`n-${i}`} {...node} />
      ))}
    </group>
  );
}

export default function NeuralCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ background: '#03010A', width: '100%', height: '100%' }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 3]} color="#6C47FF" intensity={3} />
      <pointLight position={[-3, -3, -3]} color="#00D4FF" intensity={2} />
      <Stars radius={80} depth={50} count={2500} factor={2} saturation={0.5} fade speed={0.3} />
      <NeuralNodes />
    </Canvas>
  );
}
