"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const requirements = [
  "NEUTRAL EXPRESSION",
  "FRONTAL POSE",
  "ADEQUATE LIGHTING",
];

export default function CameraSetupPage() {
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.push("/camera");
    }, 3500);

    return () => clearTimeout(timeoutId);
  }, [router]);

  return (
    <main className="camera-setup-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Skinstric home">
          sKINsTRIC
        </Link>
        <span className="header-divider" aria-hidden="true">
          [
        </span>
        <span className="header-section">ANALYSIS</span>
        <span className="header-divider" aria-hidden="true">
          ]
        </span>
        <a className="code-link" href="#enter-code">
          ENTER CODE
        </a>
      </header>

      <section className="camera-setup-state">
        <div className="processing-diamonds" aria-hidden="true">
          <span />
          <span />
          <span />
          <Image
            className="camera-setup-icon"
            src="/camera-icon.png"
            alt=""
            width={80}
            height={80}
            priority
          />
        </div>
        <p className="camera-setup-text">SETTING UP CAMERA ...</p>
      </section>

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
    </main>
  );
}
