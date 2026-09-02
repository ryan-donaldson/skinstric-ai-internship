"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const requirements = [
  "NEUTRAL EXPRESSION",
  "FRONTAL POSE",
  "ADEQUATE LIGHTING",
];

export default function CameraPage() {
  const [hasCaptured, setHasCaptured] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const uploadPicture = async () => {
    try {
      const imageResponse = await fetch("/ai-face-2-blur%204.png");
      const blob = await imageResponse.blob();
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
      });

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
    setHasCaptured(true);
    window.setTimeout(uploadPicture, 1200);
  };

  return (
    <main className="camera-page">
      <Image
        className="camera-page-background"
        src="/ai-face-2-blur%204.png"
        alt=""
        fill
        priority
        sizes="100vw"
      />

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

      {hasCaptured && <p className="great-shot">GREAT SHOT!</p>}

      {!hasCaptured && (
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
