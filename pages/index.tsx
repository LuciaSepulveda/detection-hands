import type { NextPage } from "next"
import Head from "next/head"
import { useEffect, useRef, useState } from "react"
import Webcam from "react-webcam"
import "@tensorflow/tfjs-backend-cpu"
//new
import "@mediapipe/face_detection"
import "@tensorflow/tfjs-core"
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl"
import * as faceDetection from "@tensorflow-models/face-detection"
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection"
import * as tf from "@tensorflow/tfjs-core"
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl"
import { Button, chakra, Heading, Text } from "@chakra-ui/react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { pointsInitial, pointsInfo, connections } from "../utils/utils"
import {
  Canvas,
  extend,
  ReactThreeFiber,
  useFrame,
  useThree,
} from "@react-three/fiber"

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

interface PropsBox {
  points: {
    x: number
    y: number
    z: number
  }[]
}

const Box = ({ points }: PropsBox) => {
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

    if (line5.current) {
      line5.current.setFromPoints([
        new THREE.Vector3(
          30 * points[5].x,
          -30 * points[5].y,
          30 * points[5].z
        ),
        new THREE.Vector3(
          30 * points[6].x,
          -30 * points[6].y,
          30 * points[6].z
        ),
      ])
    }
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

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree()

  const controls: any = useRef()

  useFrame((state) => controls.current.update())

  return <orbitControls ref={controls} args={[camera, domElement]} />
}

interface Points3d {
  x: number
  y: number
  z: number
  name: string
}

const Home: NextPage = () => {
  const [model, setModel] = useState<any>()
  const [midPoint, setMidPoint] = useState<any>()
  const [rateState, setRate] = useState<any>()
  const prevMidPoint = usePrevious(midPoint)
  const [direction, setDirection] = useState<number>()
  const [section, setSection] = useState<number>(0)
  const [points, setPoints] = useState<Points3d[]>(pointsInitial)

  const loadModel = async () => {
    try {
      const modelHands = await handPoseDetection.SupportedModels.MediaPipeHands
      const detectorHands = await handPoseDetection.createDetector(modelHands, {
        runtime: "tfjs",
        maxHands: 1,
      })

      setModel(detectorHands)
    } catch (err) {
      console.error("err ", err)
    }
  }

  useEffect(() => {
    tf.ready().then(() => {
      loadModel()
    })
  }, [])

  const webcamRef = useRef<any>(null) as React.MutableRefObject<any>

  const makeLines = (prediction: any, ctx: CanvasRenderingContext2D) => {
    connections.forEach((elem) => {
      ctx.beginPath()
      ctx.strokeStyle = "#ff000090"
      ctx.moveTo(
        prediction.keypoints[elem[0]].x,
        prediction.keypoints[elem[0]].y
      )
      ctx.lineTo(
        prediction.keypoints[elem[1]].x,
        prediction.keypoints[elem[1]].y
      )
      ctx.stroke()
    })
  }

  const detectHands = async () => {
    if (
      typeof window !== undefined &&
      webcamRef.current !== null &&
      canvasRef.current !== null
    ) {
      const predictions = await model.estimateHands(webcamRef.current.video)
      if (predictions) {
        predictionFunction(predictions)
        requestAnimationFrame(() => detectHands())
      }
    }
  }

  const predictionFunction = async (predictions: any) => {
    if (
      typeof window !== undefined &&
      webcamRef.current !== null &&
      canvasRef.current !== null
    ) {
      const cnvs = canvasRef.current
      //cnvs.width = window.innerWidth
      var ctx = cnvs.getContext("2d")
      if (cnvs !== null && ctx !== null) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.drawImage(webcamRef.current.video, 0, 0, 300, 300)

        if (model !== null) {
          //const predictions = await model.estimateHands(webcamRef.current.video)
          if (predictions.length > 0) {
            const finger1 = predictions[0].keypoints[4]
            const finger2 = predictions[0].keypoints[12]
            const finger3 = predictions[0].keypoints[20]
            setPoints(predictions[0].keypoints3D)

            if (finger1 && finger2 && finger3) {
              let midval: number = (finger1.x + finger2.x + finger3.x) / 3
              setMidPoint({ val: midval, time: new Date().getTime() })
            }

            predictions.forEach((prediction: any) => {
              if (ctx !== null) makeLines(prediction, ctx)
              prediction.keypoints.map((elem: any) => {
                const x = elem.x
                const y = elem.y

                if (ctx !== null) {
                  ctx.strokeStyle = "#ff0000"
                  ctx.lineWidth = 2
                  ctx.strokeRect(x, y, 1, 1)
                }
              })
            })
          }
        }
      }
    }
  }

  useEffect(() => {
    if (!midPoint && !prevMidPoint) return

    if (midPoint && prevMidPoint) {
      const rate =
        (midPoint.val - prevMidPoint.val) / (midPoint.time - prevMidPoint.time)
      setRate(rate)

      if (Math.abs(rate) > 1) {
        setDirection(rate)
      }
    }
  }, [midPoint])

  useEffect(() => {
    if (direction) {
      if (direction < 0 && section > -3) {
        setSection(section - 1)
      }
      if (direction > 0 && section < 3) setSection(section + 1)
    }
  }, [direction])

  let videoConstraints = {
    height: 300,
    width: 300,
    facingMode: "user",
    frameRate: { ideal: 60 },
  }

  const videoRef =
    useRef<HTMLVideoElement>() as React.MutableRefObject<HTMLVideoElement>
  const canvasRef =
    useRef<HTMLCanvasElement>() as React.MutableRefObject<HTMLCanvasElement>

  const imageRef =
    useRef<HTMLImageElement>() as React.MutableRefObject<HTMLImageElement>

  return (
    <div className="App">
      <Head>
        <title>TensorFlow</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <chakra.main
        display="flex"
        flexDirection="column"
        justifyContent="center"
        bg={
          section > 0 && section !== 0
            ? `green.${section * 2}00`
            : section !== 0
            ? `red.${section * 2 * -1}00`
            : "white"
        }
        h="100vh"
        transition="all 0.5s ease"
      >
        <Heading as="h1" m="auto" my="20px">
          Prueba tensor flow hands detection
        </Heading>

        {model !== null && webcamRef.current !== null && (
          <>
            <Text m="auto" fontSize="xl" mb="10px">
              {section > 2
                ? "Move your hand in right direction"
                : section < -2
                ? "Move your hand in left direction"
                : section >= -2 && section <= 2
                ? "Move your hand in right or left direction to change the background"
                : ""}
            </Text>
            <Button m="auto" mb="20px" w="100px" onClick={() => detectHands()}>
              Comenzar
            </Button>
          </>
        )}
        <div
          style={{
            width: "100%",
            height: "100%",
            margin: "auto",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Webcam
            audio={false}
            id="img"
            ref={webcamRef}
            videoConstraints={videoConstraints}
            width={300}
            height={300}
            style={{
              visibility: "hidden",
              position: "absolute",
              right: 0,
              bottom: 0,
            }}
          />
          <video
            autoPlay
            ref={videoRef}
            hidden
            width="400"
            height="400"
          ></video>
          <canvas
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
            }}
            id="canvas"
            width={300}
            height={300}
            ref={canvasRef}
          ></canvas>
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              background: "black",
              width: "400px",
              height: "400px",
            }}
          >
            <Canvas
              camera={{ fov: 75, near: 0.1, far: 5000, position: [0, 0, 5] }}
            >
              <CameraControls />
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Box points={points} />
            </Canvas>
          </div>
        </div>
      </chakra.main>
    </div>
  )
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export default Home
