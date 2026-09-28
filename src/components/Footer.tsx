import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, Lock } from 'lucide-react';
import { Category } from '../types';

interface FooterProps {
  onSelectCategory: (cat: Category) => void;
  onOpenTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenTracker }) => {
  return (
    <footer className="border-t border-neutral-850 bg-neutral-950 text-neutral-400">
      {/* 4 Brand Value Pillars */}
      <div className="border-b border-neutral-850 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white">100% Genuine Devices</h4>
                <p className="mt-1 text-neutral-500">Official brand warranties with verified serial validation.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white">Encrypted Online Payment</h4>
                <p className="mt-1 text-neutral-500">256-bit SSL gateway supporting Visa, MasterCard, bKash &amp; Nagad.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white">Express Courier Delivery</h4>
                <p className="mt-1 text-neutral-500">24-48 hour delivery to Dhaka, Chittagong, and nationwide.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RotateCcw className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white">7-Day Replacement</h4>
                <p className="mt-1 text-neutral-500">Hassle-free replacement for any manufacturer defects.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-display text-xl font-bold tracking-tight text-white">
              ESHAN GADGETS
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Your trusted destination for premium audio hardware, smart wearables, GaN fast charging, and enthusiast desk gear.
            </p>
            <div className="text-xs text-neutral-500 pt-2">
              Dhaka Flagship Experience Center · Gulshan 2, Dhaka 1212
            </div>
          </div>

          {/* Quick Categories */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-neutral-200">Shop Collections</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onSelectCategory('Audio')} className="hover:text-cyan-400 transition">
                  Studio Audio &amp; ANC Earbuds
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Wearables')} className="hover:text-cyan-400 transition">
                  Titanium Smartwatches &amp; Rings
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Power')} className="hover:text-cyan-400 transition">
                  GaN 100W Chargers &amp; MagSafe
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Gaming & Desk')} className="hover:text-cyan-400 transition">
                  Mechanical Keyboards &amp; Drones
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Orders */}
          <div className="md:col-span-2 space-y-2 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-neutral-200">Client Service</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={onOpenTracker} className="hover:text-cyan-400 transition">
                  Track Consignment
                </button>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer">Warranty Claim Desk</span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer">Corporate Bulk Tech</span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer">Support Hotline: +880 9610-000000</span>
              </li>
            </ul>
          </div>

          {/* Accepted Online Payment Methods */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-neutral-200">Accepted Online Payments</h4>
            <p className="text-[11px] text-neutral-400">
              Instant settlement via Visa, MasterCard, Amex, bKash Direct, Nagad, and Digital Wallets.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-[10px] font-mono-data text-neutral-300">VISA</span>
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-[10px] font-mono-data text-neutral-300">MasterCard</span>
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-[10px] font-mono-data text-neutral-300">AMEX</span>
              <span className="px-2 py-1 bg-[#E2136E]/20 border border-[#E2136E]/40 rounded text-[10px] font-bold text-[#E2136E]">bKash</span>
              <span className="px-2 py-1 bg-amber-500/20 border border-amber-500/40 rounded text-[10px] font-bold text-amber-400">Nagad</span>
              <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-[10px] font-mono-data text-neutral-300">Apple Pay</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-neutral-850 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © 2026 Eshan Gadgets. All rights reserved. Precision technology &amp; smart devices.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-400 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-neutral-400 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-neutral-400 cursor-pointer">Refund Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
