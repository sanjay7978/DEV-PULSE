"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreInfoHoverCardProps {
  title: string;
  description: string;
}

interface PopupPosition {
  left: number;
  top: number;
}

const CARD_WIDTH = 320;
const CARD_HEIGHT = 180;
const VIEWPORT_GUTTER = 12;
const CARD_GAP = 10;

export function ScoreInfoHoverCard({ title, description }: ScoreInfoHoverCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<PopupPosition>({ left: VIEWPORT_GUTTER, top: -CARD_HEIGHT });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipId = useId();

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rectangle = trigger.getBoundingClientRect();
    const renderedWidth = Math.min(CARD_WIDTH, window.innerWidth - VIEWPORT_GUTTER * 2);
    const preferredLeft = rectangle.left + rectangle.width / 2 - renderedWidth / 2;
    const left = Math.min(
      window.innerWidth - renderedWidth - VIEWPORT_GUTTER,
      Math.max(VIEWPORT_GUTTER, preferredLeft),
    );
    const hasRoomAbove = rectangle.top >= CARD_HEIGHT + CARD_GAP + VIEWPORT_GUTTER;
    const top = hasRoomAbove
      ? rectangle.top - CARD_HEIGHT - CARD_GAP
      : Math.min(rectangle.bottom + CARD_GAP, window.innerHeight - CARD_HEIGHT - VIEWPORT_GUTTER);

    setPosition({ left, top: Math.max(VIEWPORT_GUTTER, top) });
  }, []);

  const open = useCallback(() => {
    updatePosition();
    setIsOpen(true);
  }, [updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, updatePosition]);

  return (
    <span className="inline-flex" onMouseEnter={open} onMouseLeave={() => setIsOpen(false)}>
      <button
        ref={triggerRef}
        type="button"
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-expanded={isOpen}
        className="inline-flex items-center gap-1 rounded-sm text-left font-medium underline decoration-dotted underline-offset-4 outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
        onFocus={open}
        onBlur={() => setIsOpen(false)}
        onClick={open}
      >
        {title}
        <Info aria-hidden="true" className="size-3.5 text-muted-foreground" />
      </button>
      <span
        id={tooltipId}
        role="tooltip"
        aria-hidden={!isOpen}
        className={cn(
          "fixed z-50 flex h-[11.25rem] w-[min(20rem,calc(100vw-1.5rem))] origin-bottom-left flex-col overflow-hidden rounded-xl border border-border bg-card p-5 text-left shadow-2xl shadow-black/35 transition-all duration-200 ease-out",
          isOpen ? "visible scale-100 opacity-100" : "invisible pointer-events-none scale-95 opacity-0",
        )}
        style={{ left: position.left, top: position.top }}
      >
        <span className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary"><Info aria-hidden="true" className="size-4" /></span>
          {title}
        </span>
        <span className="text-sm leading-6 text-muted-foreground">{description}</span>
      </span>
    </span>
  );
}
