"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AnalysisPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<
    "camera" | "gallery" | null
  >(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    setShowCameraModal(true);
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      setSelectedOption("gallery");

      try {
        const base64String = await convertToBase64(file);

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
        router.push("/demographics");
      } catch (error) {
        console.error("Error:", error);
        setIsProcessing(false);
        setSelectedOption(null);
      }
    }
  };

  const handleCameraAllow = () => {
    setShowCameraModal(false);
    setSelectedOption("camera");
    router.push("/camera-setup");
  };

  const handleCameraDeny = () => {
    setShowCameraModal(false);
  };

  return (
    <main className="analysis-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Skinstric home">
          sKINsTRIC
        </Link>
        <span className="header-divider" aria-hidden="true">
          [
        </span>
        <span className="header-section">INTRO</span>
        <span className="header-divider" aria-hidden="true">
          ]
        </span>
        <a className="code-link" href="#enter-code">
          ENTER CODE
        </a>
      </header>

      <p className="analysis-label">TO START ANALYSIS</p>

      {isProcessing ? (
        <section className="processing-state">
          <div className="processing-diamonds" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="processing-text">PREPARING YOUR ANALYSIS ...</p>
        </section>
      ) : (
        <section className="analysis-options">
          <div className="analysis-option-group">
            {/* Camera Option */}
            <button
              ref={cameraButtonRef}
              className={`analysis-option camera-option ${selectedOption === "camera" ? "selected" : ""}`}
              onClick={handleCameraClick}
              aria-pressed={selectedOption === "camera"}
            >
              <div className="option-diamond" aria-hidden="true">
                <span />
              </div>
              <div className="option-content">
                <Image
                  src="/camera-icon.png"
                  alt=""
                  width={80}
                  height={80}
                  priority
                />
                <p>
                  ALLOW A.I.
                  <br />
                  TO SCAN YOUR FACE
                </p>
              </div>
            </button>

            {/* Gallery Option */}
            <button
              className={`analysis-option gallery-option ${selectedOption === "gallery" ? "selected" : ""}`}
              onClick={handleGalleryClick}
              aria-pressed={selectedOption === "gallery"}
            >
              <div className="option-diamond" aria-hidden="true">
                <span />
              </div>
              <div className="option-content">
                <Image
                  src="/gallery-icon.png"
                  alt=""
                  width={80}
                  height={80}
                  priority
                />
                <p>
                  ALLOW A.I.
                  <br />
                  ACCESS GALLERY
                </p>
              </div>
            </button>
          </div>

          {/* Camera Permission Popup */}
          {showCameraModal && (
            <div className="camera-popup">
              <p>Allow A.I. to access your camera to scan your face?</p>
              <div className="popup-buttons">
                <button
                  className="popup-button deny-button"
                  onClick={handleCameraDeny}
                >
                  DENY
                </button>
                <button
                  className="popup-button allow-button"
                  onClick={handleCameraAllow}
                >
                  ALLOW
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Hidden file input for gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        aria-hidden="true"
      />

      {!isProcessing && (
        <Link href="/intro" className="back-link" aria-label="Go back">
          <div className="diamond diamond-left">
            <span />
          </div>
          <span>BACK</span>
        </Link>
      )}
    </main>
  );
}
