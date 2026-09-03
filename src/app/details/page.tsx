"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

type Category = "race" | "age" | "gender";

interface Score {
  label: string;
  confidence: number;
}

type Predictions = Record<Category, Score[]>;

const categories: { id: Category; label: string; sidebarLabel: string }[] = [
  { id: "race", label: "RACE", sidebarLabel: "RACE" },
  { id: "age", label: "AGE", sidebarLabel: "AGE" },
  { id: "gender", label: "SEX", sidebarLabel: "SEX" },
];

const emptyPredictions: Predictions = { race: [], age: [], gender: [] };

const ageRanges = [
  "0-9",
  "10-19",
  "20-29",
  "30-39",
  "40-49",
  "50-59",
  "60-69",
  "70+",
];

function formatLabel(label: string) {
  return label.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function toConfidence(value: unknown) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  return numericValue <= 1 ? numericValue * 100 : numericValue;
}

function scoreEntries(value: unknown): Score[] {
  if (!value || typeof value !== "object") return [];

  return Object.entries(value as Record<string, unknown>)
    .map(([label, confidence]) => ({
      label: formatLabel(label),
      confidence: toConfidence(confidence),
    }))
    .sort(
      (firstScore, secondScore) =>
        secondScore.confidence - firstScore.confidence,
    );
}

function ageScoreEntries(value: unknown): Score[] {
  const confidences = new Map(
    scoreEntries(value).map((score) => [score.label, score.confidence]),
  );

  return ageRanges
    .map((label) => ({ label, confidence: confidences.get(label) ?? 0 }))
    .sort(
      (firstScore, secondScore) =>
        secondScore.confidence - firstScore.confidence,
    );
}

function getPredictions(data: unknown): Predictions {
  const response = data as Record<string, unknown>;
  const values =
    response && typeof response === "object" && response.data
      ? (response.data as Record<string, unknown>)
      : response;

  return {
    race: scoreEntries(values?.race),
    age: ageScoreEntries(values?.age),
    gender: scoreEntries(values?.gender),
  };
}

function initialSelections(predictions: Predictions) {
  return categories.reduce<Record<Category, string>>(
    (selections, category) => ({
      ...selections,
      [category.id]: predictions[category.id][0]?.label ?? "Not available",
    }),
    { race: "Not available", age: "Not available", gender: "Not available" },
  );
}

export default function DetailsPage() {
  const router = useRouter();
  const [predictions, setPredictions] = useState<Predictions | null>(null);
  const [selectedValues, setSelectedValues] = useState<
    Record<Category, string>
  >({ race: "Not available", age: "Not available", gender: "Not available" });
  const [activeCategory, setActiveCategory] = useState<Category>("race");

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      try {
        const stored = sessionStorage.getItem("demographics");
        const parsedPredictions = stored
          ? getPredictions(JSON.parse(stored))
          : emptyPredictions;

        setPredictions(parsedPredictions);
        setSelectedValues(initialSelections(parsedPredictions));
      } catch (error) {
        console.error("Failed to load demographics:", error);
        setPredictions(emptyPredictions);
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const activeScores = predictions?.[activeCategory] ?? [];
  const selectedScore = activeScores.find(
    (score) => score.label === selectedValues[activeCategory],
  );

  const selectValue = (value: string) => {
    setSelectedValues((currentValues) => ({
      ...currentValues,
      [activeCategory]: value,
    }));
  };

  const resetSelections = () => {
    if (predictions) setSelectedValues(initialSelections(predictions));
  };

  const confirmSelections = () => {
    sessionStorage.setItem(
      "actualDemographics",
      JSON.stringify(selectedValues),
    );
    router.push("/");
  };

  return (
    <main className="details-page">
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

      <section className="details-introduction">
        <p>A. I. ANALYSIS</p>
        <h1>DEMOGRAPHICS</h1>
        <span>PREDICTED RACE, AGE &amp; SEX</span>
      </section>

      <section className="details-workspace" aria-label="Demographics review">
        <aside className="selection-sidebar" aria-label="Selected attributes">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`selection-card ${activeCategory === category.id ? "is-active" : ""}`}
              type="button"
              onClick={() => setActiveCategory(category.id)}
            >
              <strong>{selectedValues[category.id].toUpperCase()}</strong>
              <span>{category.sidebarLabel}</span>
            </button>
          ))}
        </aside>

        <section className="details-visualization" aria-live="polite">
          <h2>{selectedValues[activeCategory]}</h2>
          <div
            className="confidence-circle"
            style={
              {
                "--progress": selectedScore?.confidence ?? 0,
              } as CSSProperties
            }
          >
            <strong>{selectedScore?.confidence.toFixed(2) ?? "0.00"}</strong>
            <span>%</span>
          </div>
        </section>

        <section
          className="confidence-list"
          aria-label={`${activeCategory} confidence scores`}
        >
          <div className="confidence-heading">
            <span>
              {
                categories.find((category) => category.id === activeCategory)
                  ?.label
              }
            </span>
            <span>A. I. CONFIDENCE</span>
          </div>
          {predictions === null ? (
            <p className="confidence-empty">Loading analysis...</p>
          ) : activeScores.length ? (
            <div className="confidence-options">
              {activeScores.map((score) => (
                <button
                  key={score.label}
                  className={
                    score.label === selectedValues[activeCategory]
                      ? "is-selected"
                      : ""
                  }
                  type="button"
                  onClick={() => selectValue(score.label)}
                >
                  <span>{score.label}</span>
                  <strong>{score.confidence.toFixed(2)} %</strong>
                </button>
              ))}
            </div>
          ) : (
            <p className="confidence-empty">No results available.</p>
          )}
        </section>
      </section>

      <p className="details-instruction">
        If A.I. estimate is wrong, select the correct one.
      </p>

      <Link href="/demographics" className="back-link" aria-label="Go back">
        <span className="diamond diamond-left" aria-hidden="true">
          <span />
        </span>
        <span>BACK</span>
      </Link>
      <div className="details-actions">
        <button
          type="button"
          className="reset-button"
          onClick={resetSelections}
        >
          RESET
        </button>
        <button
          type="button"
          className="confirm-button"
          onClick={confirmSelections}
        >
          CONFIRM
        </button>
      </div>
    </main>
  );
}
