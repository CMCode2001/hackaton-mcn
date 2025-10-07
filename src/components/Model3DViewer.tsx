import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Environment } from '@react-three/drei';
import { useTranslation } from 'react-i18next';
import { Box, AlertCircle, Loader } from 'lucide-react';

interface Model3DViewerProps {
  modelUrl: string;
  title?: string;
}

// Composant de chargement
function LoadingFallback() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-white">
        <Loader className="w-12 h-12 animate-spin mx-auto mb-3" />
        <p>{t('model3d.loading')}</p>
      </div>
    </div>
  );
}

// Composant pour le modèle 3D
function Model({ url, onError }: { url: string; onError?: () => void }) {
  try {
    const gltf = useGLTF(url, true); // suspense=true
    if (!gltf || !gltf.scene) return null;
    return <primitive object={gltf.scene} scale={1.5} />;
  } catch (e) {
    console.error('Error rendering 3D model:', e);
    if (onError) onError();
    return null;
  }
}

export function Model3DViewer({ modelUrl, title }: Model3DViewerProps) {
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // Vérifie si WebGL est supporté
  const checkWebGLSupport = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    setWebglSupported(checkWebGLSupport());
  }, []);

  // Si WebGL n'est pas supporté
  if (!webglSupported) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg">
        {title && (
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Box className="w-5 h-5" />
            {title}
          </h3>
        )}
        <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400 p-6">
            <AlertCircle className="w-12 h-12 mx-auto mb-3" />
            <p>{t('model3d.webglError')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Si le modèle 3D a une erreur
  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg">
        {title && (
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Box className="w-5 h-5" />
            {title}
          </h3>
        )}
        <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400 p-6">
            <AlertCircle className="w-12 h-12 mx-auto mb-3" />
            <p>{t('model3d.error')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Rendu principal
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg">
      {title && (
        <div className="p-4 bg-gray-900/50">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Box className="w-5 h-5" />
            {title}
          </h3>
        </div>
      )}

      <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 relative">
        <Canvas
          onCreated={({ gl }) => {
            gl.setClearColor('#1f2937');
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <Suspense fallback={<LoadingFallback />}>
            <Model url={modelUrl} onError={() => setError(true)} />
            <Environment preset="studio" />
          </Suspense>
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
            touches={{ ONE: 2, TWO: 0 }}
          />
        </Canvas>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pointer-events-none">
          <p className="text-white text-sm text-center">{t('model3d.controls')}</p>
        </div>
      </div>
    </div>
  );
}
