//"use client"

import { useState, useRef } from 'react';
import { LandmarkConnectionArray, drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

let FaceLandmarker: { FACE_LANDMARKS_TESSELATION: LandmarkConnectionArray | undefined; };
if (typeof window !== 'undefined') {
  FaceLandmarker = require('@mediapipe/tasks-vision').FaceLandmarker;
}

let FaceMesh: new (arg0: { locateFile: (file: any) => string; }) => any;
if (typeof window !== 'undefined') {
  FaceMesh = require('@mediapipe/face_mesh').FaceMesh;
}

export default function FaceMesher() {
  const [landmarks, setLandmarks] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const processCameraFrame = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  
    const faceMesh = new FaceMesh({ locateFile: (file: any) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }});
    
    faceMesh.onResults((results: { multiFaceLandmarks: any; }) => {
      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          drawConnectors(
            ctx, 
            landmarks, 
            FaceLandmarker.FACE_LANDMARKS_TESSELATION,
            { color: '#C0C0C070', fillColor:'#C0C0C070', lineWidth: 1}
          );
          drawLandmarks(
            ctx, 
            landmarks, 
            { color: '#FF0000', lineWidth: 1, radius:1 }
          );
          
          setLandmarks([...landmarks]);
        }
      }
    });
  
    // MediaPipe にキャンバスの画像データを送信
    await faceMesh.send({ image: canvas });
  };

  return (
    <div>
      <button onClick={startCamera}>カメラを起動</button>
      <video ref={videoRef} width="600" height="400" autoPlay></video>
      <button onClick={processCameraFrame}>写真を撮る</button>
      <canvas ref={canvasRef} id="output"></canvas>
    </div>
  );
}

