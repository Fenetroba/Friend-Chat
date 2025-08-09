import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props} />
  );
}

function AvatarImage({
  className,
  onError,
  src,
  ...props
}) {
  // If the image fails to load (e.g., provider 502), hide the image element so Radix shows the Fallback.
  const handleError = React.useCallback((e) => {
    if (e?.currentTarget) {
      e.currentTarget.style.display = "none";
    }
  }, []);

  // Avoid calling unreliable/external hosts that frequently 502.
  // When detected, do not set a src so <AvatarFallback> renders immediately.
  const blockedHosts = ["avatar.iran.liara.run"]; // add more if needed
  const shouldBlock = typeof src === "string" && blockedHosts.some((h) => src.includes(h));
  const finalSrc = shouldBlock ? undefined : src;

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      onError={onError || handleError}
      src={finalSrc}
      loading="lazy"
      {...props} />
  );
}

function AvatarFallback({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props} />
  );
}

export { Avatar, AvatarImage, AvatarFallback }
