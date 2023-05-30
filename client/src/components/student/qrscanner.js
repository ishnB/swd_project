import React, { useRef, useEffect } from "react";
import { BrowserQRCodeReader } from "@zxing/library";
import Webcam from "react-webcam";
import QRCode from "react-qr-code";

const QrScanner = () => {
  //   const webcamRef = useRef(null);
  //   useEffect(() => {
  //     const codeReader = new BrowserQRCodeReader();
  //     const captureFrame = () => {
  //       const videoElement = webcamRef.current.video;
  //       const canvasElement = document.createElement("canvas");
  //       canvasElement.width = videoElement.videoWidth;
  //       canvasElement.height = videoElement.videoHeight;
  //       const canvasContext = canvasElement.getContext("2d");
  //       canvasContext.drawImage(
  //         videoElement,
  //         0,
  //         0,
  //         canvasElement.width,
  //         canvasElement.height
  //       );
  //       const imageData = canvasContext.getImageData(
  //         0,
  //         0,
  //         canvasElement.width,
  //         canvasElement.height
  //       );
  //       const luminanceSource = new ZXing.HTMLCanvasElementLuminanceSource(
  //         canvasElement
  //       );
  //       const binaryBitmap = new ZXing.BinaryBitmap(
  //         new ZXing.HybridBinarizer(luminanceSource)
  //       );
  //       try {
  //         const result = codeReader.decode(binaryBitmap);
  //         console.log("QR Code result:", result.getText());
  //         // Send the result to the backend for further processing
  //       } catch (error) {
  //         console.error("Error decoding QR code:", error);
  //       }
  //       requestAnimationFrame(captureFrame);
  //     };
  //     requestAnimationFrame(captureFrame);
  //   }, []);
  return (
    <>
      <QRCode
        size={256}
        style={{
          padding: "10%",
          height: "auto",
          maxWidth: "30%",
          width: "30%",
        }}
        value="hello"
        viewBox={`0 0 256 256`}
      />
      ;
    </>
  );
};

export default QrScanner;
