import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Wrapper from "./Wrapper";
import type { Session } from "@auth/core/types";
import type { Chat } from "@lib/types";

function Experience({ session, chats }: { session: Session; chats: Chat[] }) {
  const texture = useTexture("textures/avatarbg.jpg");
  const viewport = useThree((state) => state.viewport);

  return (
    <>
      <Wrapper session={session} chats={chats} />
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
}

export default Experience;
