import type { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  variant?: "center" | "left";
  sectionClassName?: string;
  contentClassName?: string;
  leading?: ReactNode;
  children?: ReactNode;
}

export function PageHero({
  title,
  variant = "center",
  sectionClassName = "md:py-20 py-10 bg-gradient-mesh",
  contentClassName,
  leading,
  children,
}: PageHeroProps) {
  const innerClass =
    variant === "center"
      ? "container mx-auto px-4 sm:px-6 text-center"
      : "container mx-auto px-4 sm:px-6";
  const content = (
    <>
      {leading}
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
        {title}
      </h1>
      {children}
    </>
  );

  return (
    <section className={sectionClassName}>
      <div className={innerClass}>
        {contentClassName ? (
          <div className={contentClassName}>{content}</div>
        ) : (
          content
        )}
      </div>
    </section>
  );
}
