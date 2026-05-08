"use client";

/* SiteLogo
   Fixed top-left wrapper around <SpinningLogo />. Lives at the root
   layout so the 3D mark is visible on every page, mirroring the way
   <Menu /> sits at the top-right corner. The wrapper is a Next.js
   <Link> to "/", so clicking the logo always returns the user to the
   top of the homepage. Hover/tap still triggers the SpinningLogo's
   own spin animation (it listens for mouseenter / touchstart, not
   click), so the click-to-navigate behaviour layers cleanly on top. */

import Link from "next/link";
import SpinningLogo from "./SpinningLogo";

const OFFSET_TOP = 24;
const OFFSET_LEFT = 24;
const LOGO_SIZE = 80;

export default function SiteLogo() {
  // If we're already on the homepage, a same-route link click is a no-op
  // by default. Force a smooth scroll-to-top in that case so the
  // affordance ("click logo → home/top") always feels responsive.
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      aria-label="Haz. — back to top"
      style={{
        position: "fixed",
        top: OFFSET_TOP,
        left: OFFSET_LEFT,
        zIndex: 9998,
        display: "inline-block",
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <SpinningLogo size={LOGO_SIZE} />
    </Link>
  );
}
