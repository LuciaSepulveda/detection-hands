import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import * as cocoSSD from "@tensorflow-models/coco-ssd"
import Script from "next/script"
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
import { SupportedModels } from "@tensorflow-models/face-detection"
import { Button, chakra, Heading, Text } from "@chakra-ui/react"

const Home: NextPage = () => {
  const [model, setModel] = useState<any>()
  const [midPoint, setMidPoint] = useState<any>()
  const [rateState, setRate] = useState<any>()
  const prevMidPoint = usePrevious(midPoint)
  const [direction, setDirection] = useState<number>()
  const [section, setSection] = useState<number>(0)

  const loadModel = async () => {
    try {
      const modelHands = await handPoseDetection.SupportedModels.MediaPipeHands
      const detectorHands = await handPoseDetection.createDetector(modelHands, {
        runtime: "tfjs",
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

  const connections = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [0, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [0, 9],
    [9, 10],
    [10, 11],
    [11, 12],
    [0, 13],
    [13, 14],
    [14, 15],
    [15, 16],
    [0, 17],
    [17, 18],
    [18, 19],
    [19, 20],
  ]

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

            if (finger1 && finger2 && finger3) {
              let midval: number = (finger1.x + finger2.x + finger3.x) / 3
              setMidPoint({ val: midval, time: new Date().getTime() })
            }

            predictions.forEach((prediction: any) => {
              makeLines(prediction, ctx)
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

      console.log("RATE: ", rate)

      if (Math.abs(rate) > 0.6) {
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
        <Text m="auto" fontSize="xl" mb="10px">
          {section > 2
            ? "Move tu mano hacia la derecha"
            : section < -2
            ? "Move tu mano hacia la izquierda"
            : section >= -2 && section <= 2
            ? "Move tu mano a derecha o izquierda para cambiar el fondo"
            : ""}
        </Text>
        {model !== null && webcamRef.current !== null && (
          <Button m="auto" mb="20px" w="100px" onClick={() => detectHands()}>
            Comenzar
          </Button>
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
