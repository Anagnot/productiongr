"use client";

import { useState } from "react";

type Chip = { label: string; count?: string };

type Props = {
  typeTitle: string;
  materialTitle: string;
  channelTitle: string;
  typeChips: Chip[];
  materialChips: Chip[];
  channelChips: Chip[];
  countPill: string;
};

export function PortfolioFilters({
  typeTitle,
  materialTitle,
  channelTitle,
  typeChips,
  materialChips,
  channelChips,
  countPill,
}: Props) {
  const [activeType, setActiveType] = useState<string>(typeChips[0]?.label ?? "");
  const [activeMaterial, setActiveMaterial] = useState<string | null>(null);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);

  return (
    <div className="filter-bar">
      <div className="container">
        <div className="group">
          <h6>{typeTitle}</h6>
          {typeChips.map((c) => (
            <span
              key={c.label}
              className={`chip${activeType === c.label ? " active" : ""}`}
              onClick={() => setActiveType(c.label)}
            >
              {c.label}
              {c.count ? <span className="count">{c.count}</span> : null}
            </span>
          ))}
        </div>
        <div className="group">
          <h6>{materialTitle}</h6>
          {materialChips.map((c) => (
            <span
              key={c.label}
              className={`chip${activeMaterial === c.label ? " active" : ""}`}
              onClick={() =>
                setActiveMaterial(activeMaterial === c.label ? null : c.label)
              }
            >
              {c.label}
            </span>
          ))}
        </div>
        <div className="group">
          <h6>{channelTitle}</h6>
          {channelChips.map((c) => (
            <span
              key={c.label}
              className={`chip${activeChannel === c.label ? " active" : ""}`}
              onClick={() =>
                setActiveChannel(activeChannel === c.label ? null : c.label)
              }
            >
              {c.label}
            </span>
          ))}
        </div>
        <div className="count-pill">{countPill}</div>
      </div>
    </div>
  );
}
