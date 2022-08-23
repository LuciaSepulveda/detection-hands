import type { NextPage } from "next"
import Head from "next/head"
import React, { useEffect, useRef, useState } from "react"
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
import HandThree from "../components/handThree"
import CameraControls from "../components/cameraControls"
import { AnimatePresence, motion } from "framer-motion"

const FlexMotion = motion(Flex)
const BoxMotion = motion(Box)

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

  const array = [-4, -3, -2, -1, 0, 1, 2, 3, 4]

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

      if (Math.abs(rate) > 0.85) {
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
                ? "Move your hand in left direction"
                : section < -3
                ? "Move your hand in right direction"
                : section >= -3 && section <= 3
                ? "Move your hand in right or left direction to change the background and move the squares"
                : ""}
            </Text>
            <Button m="auto" mb="20px" w="100px" onClick={() => detectHands()}>
              Start
            </Button>
          </>
        )}
        <Flex w="100%" h="100%" position="relative" flexDirection="row">
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
          <div
            style={{
              background: "black",
              width: "400px",
              height: "400px",
              alignSelf: "end",
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
          {model !== null && webcamRef.current !== null && wait && (
            <Flex
              ml="auto"
              mr="auto"
              width="100%"
              height="100%"
              flexDirection="column"
            >
              <Flex w="100%" h="100%" position="relative">
                <AnimatePresence>
                  {showArrow && (
                    <FlexMotion
                      mx="auto"
                      flexDirection="column"
                      h="100%"
                      position="relative"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ ease: "easeOut", duration: 0.5 }}
                    >
                      <Box
                        mx="auto"
                        my="auto"
                        transform={
                          direction && direction > 0
                            ? "rotate(180deg)"
                            : "rotate(0deg)"
                        }
                        w="100px"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 25 25"
                        >
                          <g id="Left-2" data-name="Left">
                            <polygon
                              points="24 12.001 2.914 12.001 8.208 6.706 7.501 5.999 1 12.501 7.5 19.001 8.207 18.294 2.914 13.001 24 13.001 24 12.001"
                              style={{ fill: "#232326" }}
                            />
                          </g>
                        </svg>
                      </Box>
                    </FlexMotion>
                  )}
                </AnimatePresence>
              </Flex>
              <Flex
                w="fit-content"
                h="60px"
                position="relative"
                justifyContent="center"
                p={4}
                m="auto"
                borderRadius={8}
              >
                {/* {array.map((elem) => (
                  <React.Fragment key={elem}>
                    <BoxMotion
                      marginX={1}
                      h="25px"
                      w="25px"
                      borderRadius="100%"
                      border="1.5px solid black"
                      animate={{
                        //rotateY: elem === section ? [0, 360] : 0,
                        scale: elem === section ? [1, 0.8, 1] : 1
                      }}
                      transition={{
                        repeat: elem === section && Infinity,
                        duration: elem === section && 2,
                        ease: elem === section && "easeInOut",
                      }}
                    />
                  </React.Fragment>
                ))} */}
                {array.map((elem) => (
                  <React.Fragment key={elem}>
                    <AnimatePresence mode="wait">
                      {elem === section - 1 && (
                        <BoxMotion
                          key={elem}
                          initial={{
                            opacity: 0,
                            x: -50,
                          }}
                          animate={{
                            opacity: 1,
                            x: -40,
                          }}
                          exit={{
                            opacity: 0,
                            x: 50,
                          }}
                          w="100px"
                          h="100px"
                          mt="-100px"
                          position="absolute"
                          boxShadow="2xl"
                          borderRadius="md"
                          bg={`blue.${Math.abs(elem * 2)}00`}
                          zIndex={1}
                        />
                      )}
                      {elem === section && (
                        <BoxMotion
                          key={elem}
                          initial={{
                            opacity: 0,
                            x: -10,
                            scale: 1,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            scale: 1.2,
                          }}
                          exit={{
                            opacity: 0,
                            x: 10,
                            scale: 1,
                          }}
                          w="100px"
                          h="100px"
                          mt="-100px"
                          position="absolute"
                          boxShadow="dark-lg"
                          borderRadius="md"
                          bg={`blue.${Math.abs(elem * 2)}00`}
                          zIndex={2}
                        />
                      )}
                      {elem === section + 1 && (
                        <BoxMotion
                          key={elem}
                          initial={{
                            opacity: 0,
                            x: 50,
                          }}
                          animate={{
                            opacity: 1,
                            x: 40,
                          }}
                          exit={{
                            opacity: 0,
                            x: -50,
                          }}
                          w="100px"
                          h="100px"
                          mt="-100px"
                          position="absolute"
                          boxShadow="2xl"
                          borderRadius="md"
                          bg={`blue.${Math.abs(elem * 2)}00`}
                          zIndex={1}
                        />
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </Flex>
            </Flex>
          )}
          <canvas
            id="canvas"
            width={300}
            height={300}
            ref={canvasRef}
            style={{ width: 400, height: 400, alignSelf: "end" }}
          ></canvas>
        </Flex>
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
