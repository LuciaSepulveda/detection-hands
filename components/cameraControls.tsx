import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { extend, ReactThreeFiber, useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
extend({ OrbitControls })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<
        OrbitControls,
        typeof OrbitControls
      >
    }
  }
}

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree()

  const controls: any = useRef()

  useFrame((state) => controls.current.update())

  return <orbitControls ref={controls} args={[camera, domElement]} />
}

export default CameraControls
