let webcamVideo: HTMLVideoElement | null = null;
let programCanvas: HTMLCanvasElement | null = null;

export function setWebcamVideo(el: HTMLVideoElement | null) {
  webcamVideo = el;
}

export function getWebcamVideo() {
  return webcamVideo;
}

export function setProgramCanvas(el: HTMLCanvasElement | null) {
  programCanvas = el;
}

export function getProgramCanvas() {
  return programCanvas;
}
