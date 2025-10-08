// components/SimpleViewer3D.jsx
import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";

// Composant modèle ultra-simplifié
function SimpleModel({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

// Fallback de chargement
function ModelPlaceholder() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#D4AF37" wireframe />
    </mesh>
  );
}

export function SimpleViewer3D({ modelUrl, className = "h-96" }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative bg-[#1a120b] rounded-xl overflow-hidden border border-[#D4AF37]/30 ${className}`}
    >
      <Canvas
        gl={{ antialias: true }}
        camera={{ position: [5, 5, 5], fov: 50 }}
      >
        <color attach="background" args={["#342308"]} />

        <ambientLight intensity={0.9} />
        <pointLight position={[10, 10, 10]} />

        <Suspense fallback={<ModelPlaceholder />}>
          {!hasError ? <SimpleModel url={modelUrl} /> : <ModelPlaceholder />}
        </Suspense>

        <OrbitControls />
        <Environment preset="city" />
      </Canvas>

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-center text-[#D4AF37]">
            <p className="text-lg font-semibold">Modèle 3D non disponible</p>
            <p className="text-sm mt-2">Utilisation du placeholder</p>
          </div>
        </div>
      )}
    </div>
  );
}
