"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
}

const directionStyles: Record<string, string> = {
  up:    "translate-y-8",
  down:  "-translate-y-8",
  left:  "translate-x-8",
  right: "-translate-x-8",
  none:  "",
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: "-40px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const offset = directionStyles[direction];

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] ${visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${offset}`} ${className ?? ""}`}
      style={{ transitionDuration: `${duration * 1000}ms`, transitionDelay: `${delay * 1000}ms`, transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)", willChange: visible ? "auto" : "opacity, transform" }}
    >
      {children}
    </div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className, staggerDelay = 0.1 }: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: "-40px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-visible={visible} data-stagger={staggerDelay}>
      {React.Children.map(children, (child, i) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, { "data-stagger-index": i, "data-visible": visible, "data-stagger-delay": staggerDelay })
          : child
      )}
    </div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  "data-stagger-index"?: number;
  "data-visible"?: boolean;
  "data-stagger-delay"?: number;
}

export function StaggerItem({ children, className, direction = "up", ...props }: StaggerItemProps) {
  const visible = props["data-visible"] ?? false;
  const index = props["data-stagger-index"] ?? 0;
  const staggerDelay = props["data-stagger-delay"] ?? 0.1;
  const offset = directionStyles[direction];

  return (
    <div
      className={`transition-[opacity,transform] ${visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${offset}`} ${className ?? ""}`}
      style={{ transitionDuration: "400ms", transitionDelay: `${index * staggerDelay * 1000}ms`, transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)", willChange: visible ? "auto" : "opacity, transform" }}
    >
      {children}
    </div>
  );
}
