"use client";

import type { AnchorHTMLAttributes } from "react";
import { pushClickCtaEvent } from "@/lib/gtm-events";

type GtmTrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  trackingLocation: string;
};

export function GtmTrackedLink({
  trackingLocation,
  onClick,
  ...props
}: GtmTrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        pushClickCtaEvent(trackingLocation);
        onClick?.(event);
      }}
    />
  );
}
