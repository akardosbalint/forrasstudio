"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function CrmNav({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4 text-sm">
      {items.map((item) => {
        const isActive =
          item.href === "/crm"
            ? pathname === "/crm"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`border-b-2 pb-0.5 transition-colors ${
              isActive
                ? "border-amber text-ink"
                : "border-transparent text-ink/70 hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
