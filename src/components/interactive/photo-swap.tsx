"use client";

import Image from "next/image";
import { useState } from "react";

export function PhotoSwap() {
  const [alternate, setAlternate] = useState(false);

  return (
    <div className="photo-swap-wrap">
      <button
        type="button"
        className={alternate ? "photo-swap is-alternate" : "photo-swap"}
        onClick={() => setAlternate((value) => !value)}
        aria-pressed={alternate}
        aria-label="Switch between the two placeholder portraits"
      >
        <Image
          src="/images/profile/portrait-main.svg"
          width={720}
          height={900}
          sizes="(max-width: 640px) 80vw, 320px"
          alt="Placeholder for Abdulwahid’s primary portrait; replace with a 4 by 5 photo"
          className="photo-main"
          priority
        />
        <Image
          src="/images/profile/portrait-alt.svg"
          width={720}
          height={900}
          sizes="(max-width: 640px) 80vw, 320px"
          alt="Alternate placeholder portrait with a playful game-menu pose"
          className="photo-alt"
        />
        <span className="photo-corner" aria-hidden="true">ALT</span>
      </button>
      <p>tap or hover to swap · replace both 720×900 SVGs with real photos</p>
    </div>
  );
}
