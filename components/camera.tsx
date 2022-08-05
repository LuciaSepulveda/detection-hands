export const Camera = () => {
  if (typeof window !== "undefined") {
    const video: any = document.getElementById("video")
    const canvas: any = document.getElementById("canvas")
    const ctx: any = canvas?.getContext("2d")

    const setupCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log(
          "Browser API navigator.mediaDevices.getUserMedia not available"
        )
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          frameRate: {
            ideal: 60,
          },
        },
      })

      const camera = Camera()

      if (camera !== undefined && camera !== null) {
        camera.video.srcObject = stream

        await new Promise((resolve) => {
          camera.video.onloadedmetadata = () => {
            resolve(video)
          }
        })

        camera.video.play()

        const videoWidth = camera.video.videoWidth
        const videoHeight = camera.video.videoHeight
        // Must set below two lines, otherwise video element doesn't show.
        camera.video.width = videoWidth
        camera.video.height = videoHeight

        camera.canvas.width = videoWidth
        camera.canvas.height = videoHeight
        const canvasContainer: any = document.querySelector(".canvas-wrapper")
        if (canvasContainer !== null)
          canvasContainer.style = `width: ${videoWidth}px; height: ${videoHeight}px`

        // Because the image from camera is mirrored, need to flip horizontally.
        camera.ctx.translate(video.videoWidth, 0)
        camera.ctx.scale(-1, 1)
      }

      return camera
    }

    return { video, canvas, ctx, setupCamera }
  }
  return null
}
