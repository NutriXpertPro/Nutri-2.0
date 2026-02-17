"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileMenuV3() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const menuItems = [
    { href: "#ecosystem", label: "Ecossistema" },
    { href: "#productivity", label: "Produtividade" },
    { href: "#performance", label: "Performance" },
    { href: "#pricing", label: "Planos" },
  ];

  return (
    <>
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#020804] md:hidden">
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center mb-12">
              <span className="text-xl font-bold text-white">
                Nutri<span className="text-emerald-500">Xpert</span>Pro
              </span>
              <button
                onClick={toggleMenu}
                className="p-2 text-neutral-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="text-2xl font-bold text-white hover:text-emerald-500 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-4">
              <Link
                href="/auth"
                onClick={closeMenu}
                className="text-center py-3 text-neutral-400 hover:text-white transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/auth?tab=register"
                onClick={closeMenu}
                className="text-center py-3 bg-emerald-500 text-black font-bold rounded-full"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
