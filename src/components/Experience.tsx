import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Wrapper from "./Wrapper";

function Experience() {
  const texture = useTexture("textures/avatarbg.jpg");
  const viewport = useThree((state) => state.viewport);

  return (
    <>
      <Wrapper />
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
}

export default Experience;
