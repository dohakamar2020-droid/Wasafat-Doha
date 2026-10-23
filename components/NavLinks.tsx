"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Sparkles,
  House,
  CookingPot,
  LayoutGrid,
  ShoppingBasket,
} from "lucide-react";

// التنقل الرئيسي: نفس الأقسام في الهيدر وشريط الموبايل عشان اليوزر
// يلاقي كل حاجة من أي مكان، والرابط النشط واضح دايمًا.

export const MAIN_NAV = [
  { href: "/discover", label: "اكتشف" },
  { href: "/pick", label: "رشحلي 3" },
  { href: "/ingredients", label: "عندك إيه؟" },
  { href: "/meals", label: "السفرات" },
  { href: "/creators", label: "الشيفات" },
  { href: "/features", label: "كل المزايا" },
  { href: "/kitchen", label: "مطبخي" },
];

function isActive(path: string, href: string) {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

export function TopNav() {
  const path = usePathname();
  return (
    <nav className="topnav" aria-label="التنقل الرئيسي">
      {MAIN_NAV.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={isActive(path, l.href) ? "on" : ""}
          aria-current={isActive(path, l.href) ? "page" : undefined}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

export function BottomBar() {
  const path = usePathname();
  const items = [
    { href: "/", label: "الرئيسية", Icon: House },
    { href: "/discover", label: "اكتشف", Icon: Search },
    { href: "/pick", label: "رشحلي", Icon: Sparkles, pick: true },
    { href: "/ingredients", label: "عندك إيه؟", Icon: ShoppingBasket },
    { href: "/features", label: "المزايا", Icon: LayoutGrid },
    { href: "/kitchen", label: "مطبخي", Icon: CookingPot },
  ];
  return (
    <nav className="bottombar glass" aria-label="تنقل الموبايل">
      {items.map(({ href, label, Icon, pick }) => (
        <Link
          key={href}
          href={href}
          className={`${pick ? "bottom-pick" : ""} ${isActive(path, href) ? "on" : ""}`}
          aria-current={isActive(path, href) ? "page" : undefined}
        >
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
