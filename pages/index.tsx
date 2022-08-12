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
import {
  Box,
  Button,
  Center,
  chakra,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react"
import { pointsInitial, connections } from "../utils/utils"
import { Canvas } from "@react-three/fiber"
import HandThree from "../components/HandThree"
import CameraControls from "../components/cameraControls"

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
  const [wait, setWait] = useState<boolean>(false)
  const [showArrow, setShowArrow] = useState<boolean>(false)

  const loadModel = async () => {
    try {
      const modelHands = await handPoseDetection.SupportedModels.MediaPipeHands
      const detectorHands = await handPoseDetection.createDetector(modelHands, {
        runtime: "tfjs",
        maxHands: 1,
      })

      setModel(detectorHands)
      setTimeout(() => setWait(true), 1500)
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

      if (Math.abs(rate) > 0.77) {
        setDirection(rate)
      } else {
        setShowArrow(false)
      }
    }
  }, [midPoint])

  useEffect(() => {
    if (direction) {
      setShowArrow(true)
      if (direction < 0 && section > -4) {
        setSection(section - 1)
      }
      if (direction > 0 && section < 4) setSection(section + 1)
    }
  }, [direction])

  let videoConstraints = {
    height: 300,
    width: 300,
    facingMode: "user",
    frameRate: { ideal: 60 },
  }

  const canvasRef =
    useRef<HTMLCanvasElement>() as React.MutableRefObject<HTMLCanvasElement>

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
          Test tensor flow hands detection
        </Heading>

        {model !== null && webcamRef.current !== null && wait && (
          <>
            <Text m="auto" fontSize="xl" mb="10px">
              {section > 3
                ? "Move your hand in right direction"
                : section < -3
                ? "Move your hand in left direction"
                : section >= -3 && section <= 3
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
              background: "gray",
              position: "absolute",
              top: 0,
              left: 400,
              width: "60%",
              height: "100%",
            }}
          >
            <Flex
              visibility={showArrow ? "visible" : "hidden"}
              mx="auto"
              flexDirection="column"
              h="100%"
              position="relative"
              transition="all 0.5s ease"
            >
              <Box
                mx="auto"
                my="auto"
                transform={
                  direction && direction > 0 ? "rotate(180deg)" : "rotate(0deg)"
                }
              >
                <Box
                  position="relative"
                  w="200px"
                  h="10px"
                  bg="yellow"
                  transform="rotate(-45deg)"
                  mb="55px"
                />
                <Box
                  position="relative"
                  w="400px"
                  h="10px"
                  bg="yellow"
                  ml="40px"
                />
                <Box
                  position="relative"
                  w="200px"
                  h="10px"
                  bg="yellow"
                  transform="rotate(45deg)"
                  mt="60px"
                />
              </Box>
            </Flex>
          </div>
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
              <HandThree points={points} />
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
