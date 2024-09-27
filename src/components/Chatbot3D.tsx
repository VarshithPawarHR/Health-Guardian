import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Experience from "./Experience";
import type { Session } from '@auth/core/types';

function Chatbot3D({session}:{session:Session}) {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 42 }}
        className="w-full !h-screen"
      >
        <color attach="background" args={["#ececec"]} />
        <Experience session={session}/>
        <Environment preset="sunset" />
      </Canvas>
    </>
  );
}

export default Chatbot3D;
