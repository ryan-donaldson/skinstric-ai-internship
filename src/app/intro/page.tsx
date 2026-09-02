"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type FormStep = "name" | "location" | "processing" | "success";

const submissionEndpoint =
  "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne";
const storageKey = "skinstric-phase-one";
const validValue = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

export default function IntroPage() {
  const [step, setStep] = useState<FormStep>("name");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  function validate(input: string, label: string) {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return `Please enter your ${label}.`;
    }

    if (!validValue.test(trimmedInput)) {
      return `Please enter a valid ${label} using letters only.`;
    }

    return "";
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedValue = value.trim();
    const label = step === "name" ? "name" : "city";
    const validationError = validate(trimmedValue, label);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    if (step === "name") {
      setName(trimmedValue);
      setValue("");
      setStep("location");
      return;
    }

    const payload = { name, location: trimmedValue };
    localStorage.setItem(storageKey, JSON.stringify(payload));
    setStep("processing");

    try {
      const response = await fetch(submissionEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setStep("success");
    } catch {
      setStep("location");
      setError("Something went wrong. Please press enter to try again.");
    }
  }

  const isProcessing = step === "processing";
  const isSuccess = step === "success";

  return (
    <main className="intro-page">
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

      <section
        className={`intro-prompt ${isSuccess ? "intro-prompt-success" : ""}`}
        aria-live="polite"
        aria-labelledby="intro-title"
      >
        <div className="intro-diamonds" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="intro-prompt-content">
          {isProcessing ? (
            <>
              <p className="processing-label">PROCESSING SUBMISSION</p>
              <div className="loading-dots" aria-label="Processing">
                <span />
                <span />
                <span />
              </div>
            </>
          ) : isSuccess ? (
            <>
              <p className="success-message">Thank you!</p>
              <p className="success-instruction">Proceed for the next step</p>
            </>
          ) : (
            <form onSubmit={submitForm} noValidate>
              <label htmlFor="intro-value">CLICK TO TYPE</label>
              <input
                ref={inputRef}
                id="intro-value"
                name={step}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={
                  step === "name" ? "Introduce Yourself" : "Your City Name"
                }
                aria-describedby={error ? "intro-error" : undefined}
                autoComplete={step === "name" ? "name" : "address-level2"}
                spellCheck="false"
              />
              {error ? (
                <p id="intro-error" className="form-error">
                  {error}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </section>

      <Link className="back-link" href="/">
        <span className="diamond diamond-left" aria-hidden="true">
          <span />
        </span>
        <span>BACK</span>
      </Link>

      {isSuccess ? (
        <Link className="proceed-link" href="/analysis">
          PROCEED
          <span className="diamond diamond-right" aria-hidden="true">
            <span />
          </span>
        </Link>
      ) : null}
    </main>
  );
}
