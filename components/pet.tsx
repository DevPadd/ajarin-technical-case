"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AURA_CONFIG: Record<
  number,
  { color: string; opacity: number; pulse: boolean }
> = {
  1: { color: "transparent", opacity: 0, pulse: false },
  2: { color: "#fed7aa", opacity: 0.45, pulse: true },
  3: { color: "#fdba74", opacity: 0.55, pulse: true },
  4: { color: "#fb923c", opacity: 0.65, pulse: true },
  5: { color: "#f97316", opacity: 0.75, pulse: true },
  6: { color: "#ea580c", opacity: 0.9, pulse: true },
};

export function AccessoryCap() {
  return (
    <g>
      <path
        d="M237 85.3878C237 103.038 204.159 119 174.797 119C145.435 119 111 84.8546 111 67.2041C111 49.5535 145.435 38 174.797 38C204.159 38 237 67.7372 237 85.3878Z"
        fill="#73CDFB"
      />
      <path
        d="M213 53.5324C200.796 77.3525 179.041 77.3525 147.204 84C117.313 84 109 83.1092 109 57.4101C109 31.711 128.987 7 158.878 7C188.769 7 213 27.8333 213 53.5324Z"
        fill="#45C1FF"
      />
    </g>
  );
}

export function AccessoryCrown() {
  return (
    <g>
      <path
        d="M106 5C100.5 6.5 97 68 97 68C97 68 117 79.5 163 83.5C209 87.5 223.5 83.5 223.5 83.5C223.5 83.5 234 7 227.5 5C221 3 182 63.5 182 63.5C182 63.5 172 5 166.5 5C161 5 145 62 145 62C145 62 111.5 3.5 106 5Z"
        fill="#FDD655"
      />
    </g>
  );
}

export function AccessoryBeanie() {
  return (
    <g>
      <path
        d="M232.5 86.5C232.5 112.181 201.962 108 174.757 108C147.553 108 87.0001 99.1812 87.0001 73.5C87.0001 47.8188 147.553 15 174.757 15C201.962 15 232.5 60.8188 232.5 86.5Z"
        fill="#D06363"
      />
      <path
        d="M193.5 17.5C193.5 23.0228 188.523 23 183 23C177.477 23 169.5 19.5228 169.5 14C169.5 8.47715 177.477 3 183 3C188.523 3 193.5 11.9772 193.5 17.5Z"
        fill="#FF7979"
      />
    </g>
  );
}

const ACCESSORY_MAP = {
  cap: AccessoryCap,
  crown: AccessoryCrown,
  beanie: AccessoryBeanie,
};

export default function Pet({
  stage,
  color = "#FB923C",
  blush = "#FFB374",
  accessory = "none",
}: {
  stage: number;
  color?: string;
  blush?: string;
  accessory?: string;
}) {
  const [isBlinking, setIsBlinking] = useState(false);
  const clampedStage = Math.min(6, Math.max(1, stage));
  const aura = AURA_CONFIG[clampedStage];
  const AccessoryComponent =
    accessory && accessory !== "none"
      ? ACCESSORY_MAP[accessory as keyof typeof ACCESSORY_MAP]
      : null;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function schedule() {
      const delay = 3000 + Math.random() * 4000;
      timeoutId = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          schedule();
        }, 150);
      }, delay);
    }

    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-48 h-48 mx-auto">
      {aura.color !== "transparent" && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${aura.color} 0%, transparent 70%)`,
            opacity: aura.opacity,
          }}
          animate={
            aura.pulse
              ? { opacity: [aura.opacity, aura.opacity + 0.15, aura.opacity] }
              : undefined
          }
          transition={
            aura.pulse
              ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
        />
      )}

      <motion.svg
        width="200"
        height="200"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ originX: "150px", originY: "150px" }}
      >
        <path
          d="M266.5 181.247C266.5 227.64 197.444 223.002 150.5 223.002C103.556 223.002 33 227.64 33 181.247C33 83 103.556 55 150.5 55C197.444 55 266.5 82.5 266.5 181.247Z"
          fill={color}
        />
        <ellipse
          cx="86.593"
          cy="103.481"
          rx="17.5"
          ry="26.5"
          transform="rotate(41 86.593 103.481)"
          fill={blush}
        />
        <motion.ellipse
          cx="151.5"
          cy="134.5"
          rx="10.5"
          ry="15.5"
          fill="black"
          animate={{ ry: isBlinking ? 0.5 : 15.5 }}
          transition={{ duration: 0.08 }}
        />
        <motion.ellipse
          cx="200.5"
          cy="134.5"
          rx="10.5"
          ry="15.5"
          fill="black"
          animate={{ ry: isBlinking ? 0.5 : 15.5 }}
          transition={{ duration: 0.08 }}
        />

        {AccessoryComponent && <AccessoryComponent />}
      </motion.svg>
    </div>
  );
}
