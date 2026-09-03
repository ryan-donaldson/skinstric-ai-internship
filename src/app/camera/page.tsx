"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const requirements = [
  "NEUTRAL EXPRESSION",
  "FRONTAL POSE",
  "ADEQUATE LIGHTING",
];

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const isCameraActive = !cameraError;

  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setCameraError("UNABLE TO ACCESS CAMERA. PLEASE ALLOW CAMERA ACCESS.");
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const uploadPicture = async (base64String: string) => {
    try {
      const response = await fetch(
        "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64String }),
        },
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      sessionStorage.setItem("demographics", JSON.stringify(data));
      setIsReady(true);
    } catch (error) {
      console.error("Error:", error);
      setHasCaptured(false);
    }
  };

  const handleTakePicture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg");
    setCapturedImage(dataUrl);
    setHasCaptured(true);
    stopCamera();

    window.setTimeout(() => uploadPicture(dataUrl.split(",")[1]), 1200);
  };

  return (
    <main className={`camera-page${isCameraActive ? " camera-live" : ""}`}>
      {capturedImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="camera-page-background" src={capturedImage} alt="" />
      ) : (
        <video
          className="camera-page-background camera-page-video"
          ref={videoRef}
          autoPlay
          playsInline
          muted
        />
      )}

      <header className="site-header">
        <Link className="brand" href="/" aria-label="Skinstric home">
          sKINsTRIC
        </Link>
        <span className="header-divider" aria-hidden="true">
          [
        </span>
        <span className="header-section" />
        <span className="header-divider" aria-hidden="true">
          ]
        </span>
      </header>

      {cameraError && <p className="great-shot camera-error">{cameraError}</p>}

      {hasCaptured && <p className="great-shot">GREAT SHOT!</p>}

      {!hasCaptured && !cameraError && (
        <button
          type="button"
          className="take-picture-control"
          onClick={handleTakePicture}
        >
          <span>TAKE PICTURE</span>
          <span className="take-picture-button" aria-hidden="true">
            <Image src="/camera-icon.png" alt="" width={24} height={24} />
          </span>
        </button>
      )}

      <Link
        href="/camera-setup"
        className="camera-page-back"
        aria-label="Go back"
      >
        <span className="diamond diamond-left">
          <span />
        </span>
      </Link>

      <section className="capture-tips">
        <p>TO GET BETTER RESULTS MAKE SURE TO HAVE</p>
        <ul>
          {requirements.map((requirement) => (
            <li key={requirement}>
              <span className="tip-diamond" aria-hidden="true" />
              {requirement}
            </li>
          ))}
        </ul>
      </section>

      {isReady && (
        <Link className="proceed-link" href="/demographics">
          PROCEED
          <span className="diamond diamond-right" aria-hidden="true">
            <span />
          </span>
        </Link>
      )}
    </main>
  );
}
