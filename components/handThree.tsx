import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { pointsInfo, connections } from "../utils/utils"
import * as THREE from "three"

interface PropsPoints {
  points: {
    x: number
    y: number
    z: number
  }[]
}

const HandThree = ({ points }: PropsPoints) => {
  const mesh0 = useRef<THREE.Mesh>(null!)
  const mesh1 = useRef<THREE.Mesh>(null!)
  const mesh2 = useRef<THREE.Mesh>(null!)
  const mesh3 = useRef<THREE.Mesh>(null!)
  const mesh4 = useRef<THREE.Mesh>(null!)
  const mesh5 = useRef<THREE.Mesh>(null!)
  const mesh6 = useRef<THREE.Mesh>(null!)
  const mesh7 = useRef<THREE.Mesh>(null!)
  const mesh8 = useRef<THREE.Mesh>(null!)
  const mesh9 = useRef<THREE.Mesh>(null!)
  const mesh10 = useRef<THREE.Mesh>(null!)
  const mesh11 = useRef<THREE.Mesh>(null!)
  const mesh12 = useRef<THREE.Mesh>(null!)
  const mesh13 = useRef<THREE.Mesh>(null!)
  const mesh14 = useRef<THREE.Mesh>(null!)
  const mesh15 = useRef<THREE.Mesh>(null!)
  const mesh16 = useRef<THREE.Mesh>(null!)
  const mesh17 = useRef<THREE.Mesh>(null!)
  const mesh18 = useRef<THREE.Mesh>(null!)
  const mesh19 = useRef<THREE.Mesh>(null!)
  const mesh20 = useRef<THREE.Mesh>(null!)

  const line0 = useRef<any>(null!)
  const line1 = useRef<any>(null!)
  const line2 = useRef<any>(null!)
  const line3 = useRef<any>(null!)
  const line4 = useRef<any>(null!)
  const line5 = useRef<any>(null!)
  const line6 = useRef<any>(null!)
  const line7 = useRef<any>(null!)
  const line8 = useRef<any>(null!)
  const line9 = useRef<any>(null!)
  const line10 = useRef<any>(null!)
  const line11 = useRef<any>(null!)
  const line12 = useRef<any>(null!)
  const line13 = useRef<any>(null!)
  const line14 = useRef<any>(null!)
  const line15 = useRef<any>(null!)
  const line16 = useRef<any>(null!)
  const line17 = useRef<any>(null!)
  const line18 = useRef<any>(null!)
  const line19 = useRef<any>(null!)
  const line20 = useRef<any>(null!)

  useFrame((state, delta) => {
    pointsInfo.map((point, index) => {
      const ref = eval(point.mesh)

      if (ref.current) {
        ref.current.position.x = points[index].x * 30
        ref.current.position.y = points[index].y * -30
        ref.current.position.z = points[index].z * 30
      }
    })

    connections.map((connection, index) => {
      const ref1 = eval(
        `line${
          connection[0] === 0 && index === 0
            ? "0"
            : connection[0] === 0 && index === 4
            ? "4"
            : connection[0] === 0 && index === 8
            ? "8"
            : connection[0] === 0 && index === 12
            ? "12"
            : connection[0] === 0 && index === 16
            ? "16"
            : connection[0]
        }`
      )

      if (ref1.current) {
        ref1.current.setFromPoints([
          new THREE.Vector3(
            30 * points[connection[0]].x,
            -30 * points[connection[0]].y,
            30 * points[connection[0]].z
          ),
          new THREE.Vector3(
            30 * points[connection[1]].x,
            -30 * points[connection[1]].y,
            30 * points[connection[1]].z
          ),
        ])
      }
    })
  })

  return (
    <>
      {pointsInfo.map((point) => (
        <mesh key={point.mesh} ref={eval(point.mesh)} position={[0, 0, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="red" />
        </mesh>
      ))}
      {pointsInfo.map((point) => (
        <lineSegments key={point.line}>
          <bufferGeometry ref={eval(point.line)}>
            <bufferAttribute />
          </bufferGeometry>
          <lineBasicMaterial linewidth={1} attach="material" color="#ffffff" />
        </lineSegments>
      ))}
    </>
  )
}

export default HandThree
