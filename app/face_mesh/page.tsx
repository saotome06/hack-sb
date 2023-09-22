"use client"

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

function range(start: number, end: number) {
  return Array.from({ length: end - start }, (_, i) => start + i);
}

const base_point = 6;
const left_eye_indices = range(33, 46);
const right_eye_indices = range(263, 276);
const mouth_indices = [...range(0, 17), ...range(61, 69)];
const eyebrow_indices = [...range(17, 33), ...range(246, 263)];

const __FACEMESH_CONTOURS = [
  [178, 87], [181, 84], [82, 13], [283, 282], [136, 172], [381, 382], [105, 66], 
  [311, 310], [70, 63], [300, 293], [87, 14], [39, 37], [382, 362], [145, 153], 
  [160, 159], [251, 389], [282, 295], [159, 158], [296, 336], [334, 296], [148, 176], 
  [80, 81], [144, 145], [67, 109], [52, 65], [390, 373], [263, 249], [153, 154], 
  [46, 53], [374, 380], [246, 161], [310, 415], [276, 283], [267, 269], [387, 386], 
  [61, 146], [317, 402], [78, 191], [380, 381], [377, 152], [191, 80], [249, 390], 
  [466, 388], [158, 157], [293, 334], [375, 291], [66, 107], [93, 234], [37, 0], 
  [163, 144], [400, 377], [84, 17], [314, 405], [13, 312], [373, 374], [270, 409], 
  [365, 379], [157, 173], [312, 311], [318, 324], [378, 400], [324, 308], [332, 284], 
  [356, 454], [63, 105], [21, 54], [384, 398], [162, 21], [288, 397], [173, 133], 
  [263, 466], [386, 385], [33, 7], [61, 185], [161, 160], [132, 93], [103, 67], 
  [53, 52], [78, 95], [91, 181], [321, 375], [454, 323], [0, 267], [323, 361], 
  [176, 149], [155, 133], [409, 291], [295, 285], [109, 10], [14, 317], [234, 127], 
  [379, 378], [88, 178], [95, 88], [40, 39], [284, 251], [17, 314], [415, 308], 
  [185, 40], [385, 384], [338, 297], [297, 332], [152, 148], [81, 82], [7, 163], 
  [389, 356], [398, 362], [154, 155], [33, 246], [361, 288], [65, 55], [269, 270], 
  [405, 321], [397, 365], [149, 150], [146, 91], [172, 58], [10, 338], [54, 103], 
  [150, 136], [388, 387], [58, 132], [127, 162], [402, 318]
];

const MOUTH = [[80, 81],[311, 310],[178, 87],[181, 84],[181, 84],[82, 13], 
               [87, 14],[39, 37],[310, 415],[267, 269],[61, 146],[317, 402],
               [78, 191],[191, 80],[375, 291],[37, 0],[84, 17], [314, 405],
               [13, 312],[270, 409],[312, 311],[318, 324],[324, 308],[61, 185],
               [78, 95],[91, 181],[321, 375], [0, 267],[409, 291],  [14, 317],
               [88, 178], [95, 88],[40, 39],[17, 314],[415, 308],[185, 40],
               [81, 82],[269, 270],[405, 321],[146, 91], [402, 318]
              ]

const L_EYE = [[145, 153],[160, 159],[159, 158], [144, 145],[153, 154],[246, 161],
               [158, 157],[163, 144],[173, 133],[33, 7],[161, 160],[155, 133], [7, 163],
               [154, 155],[33, 246],]
const L_MAYU = [[105, 66],[52, 65],[46, 53],[66, 107],[157, 173],[63, 105], 
                [53, 52],[65, 55],]

const R_EYE = [[381, 382],[382, 362],[390, 373],[263, 249],[374, 380],[387, 386],
               [380, 381],[249, 390],[466, 388],[373, 374],[384, 398],[263, 466], 
               [386, 385],[398, 362],[388, 387],[385, 384],]
const R_MAYU = [[283, 282], [300, 293],[282, 295],[296, 336],[334, 296],[276, 283],[293, 334],
                [295, 285]]

const MOUTH_INDEX = Array.from(new Set(MOUTH.flat())).sort((a, b) => a - b);
const L_EYE_INDEX = Array.from(new Set(L_EYE.flat())).sort((a, b) => a - b);
const L_MAYU_INDEX = Array.from(new Set(L_MAYU.flat())).sort((a, b) => a - b);
const R_EYE_INDEX = Array.from(new Set(R_EYE.flat())).sort((a, b) => a - b);
const R_MAYU_INDEX = Array.from(new Set(R_MAYU.flat())).sort((a, b) => a - b);


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
    console.log(canvas);
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
          const ctx = canvasRef.current.getContext('2d');

          ctx.arc(landmarks[base_point].x * canvas.width, landmarks[base_point].y * canvas.height, 2, 0, 2 * Math.PI);
          ctx.fillStyle = '#00FF00';
          ctx.fill();
    
          // 各インデックス配列をループして特徴点を描画
          // for (const index of [...left_eye_indices, ...right_eye_indices, ...mouth_indices, ...eyebrow_indices]) {
          for (const index of [...MOUTH_INDEX, ...L_EYE_INDEX, ...R_EYE_INDEX, ...L_MAYU_INDEX, ...R_MAYU_INDEX]) {
            const point = landmarks[index];
            ctx.beginPath();
            //ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
            ctx.arc(point.x * canvas.width, point.y * canvas.height, 2, 0, 2 * Math.PI);
            ctx.fillStyle = '#FF0000';
            ctx.fill();
          }
        }
      }
    });


    // faceMesh.onResults((results: { multiFaceLandmarks: any; }) => {
    //   if (results.multiFaceLandmarks) {
    //     for (const landmarks of results.multiFaceLandmarks) {
    //       const ctx = canvasRef.current.getContext('2d');
      
    //       // ペアごとにランドマークをループして線で結びます
    //       for (const pair of FACEMESH_CONTOURS) {
    //         const start = landmarks[pair[0]];
    //         const end = landmarks[pair[1]];
    
    //         ctx.beginPath();
    //         ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
    //         ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
    //         ctx.strokeStyle = '#FF0000';
    //         ctx.lineWidth = 1;
    //         ctx.stroke();
    //       }
    //     }
    //   }
    // });
  
    try {
      await faceMesh.send({ image: canvas });
    } catch (error) {
      console.error("Error processing the image:", error);
    }
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

