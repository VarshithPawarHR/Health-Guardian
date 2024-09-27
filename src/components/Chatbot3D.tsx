import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Experience from "./Experience";
import type { Session } from '@auth/core/types';
import type { Chat } from "@lib/types";

function Chatbot3D({session,chats}:{session:Session,chats:Chat[]}) {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 42 }}
        className="w-full !h-screen"
      >
        <color attach="background" args={["#ececec"]} />
        <Experience session={session} chats={chats}/>
        <Environment preset="sunset" />
      </Canvas>
    </>
  );
}

export default Chatbot3D;
