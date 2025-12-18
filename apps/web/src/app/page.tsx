import React from "react";

const features = [
  {
    title: "Smart scanning",
    body: "Tag garments offline with color + category heuristics.",
  },
  {
    title: "80/20 analytics",
    body: "See which pieces drive most wears and what to release.",
  },
  {
    title: "Premium-ready",
    body: "Paywall hooks for resell, listing drafts, and packing lists.",
  },
];

export default function Page(): JSX.Element {
  return (
    <main className="hero">
      <p className="subtle">Local-first wardrobe OS</p>
      <h1>ClosetClear</h1>
      <p className="subtle">Clean luxury UI, offline-first, ready for premium unlocks.</p>
      <button className="button">Preview mobile</button>
      <div className="card-grid">
        {features.map((feature) => (
          <div key={feature.title} className="card">
            <h3>{feature.title}</h3>
            <p className="subtle">{feature.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
