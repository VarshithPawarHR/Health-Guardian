import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Experience from "./Experience";

function Chatbot3D() {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 42 }}
        className="w-full !h-screen"
      >
        <color attach="background" args={["#ececec"]} />
        <Experience />
        <Environment preset="sunset" />
      </Canvas>
    </>
  );
}

export default Chatbot3D;
