import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Wrapper from "./Wrapper";
import type { Session } from '@auth/core/types';

function Experience({session}:{session:Session}) {
  const texture = useTexture("textures/avatarbg.jpg");
  const viewport = useThree((state) => state.viewport);

  return (
    <>
      <Wrapper session={session}/>
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
}

export default Experience;
