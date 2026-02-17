"use client";

import React from "react";

export default function Logo() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12"
    >
      <circle cx="24" cy="24" r="22" stroke="#10b981" strokeWidth="2" fill="none" />
      <path
        d="M24 12C24 12 18 18 18 24C18 30 24 36 24 36C24 36 30 30 30 24C30 18 24 12 24 12Z"
        fill="#10b981"
      />
      <path
        d="M24 16V32M16 24H32"
        stroke="#050505"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
