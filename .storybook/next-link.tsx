import type { ComponentProps, ReactNode } from "react";

type LinkProps = ComponentProps<"a"> & {
  href?: string | { pathname?: string; query?: Record<string, string> };
  children?: ReactNode;
};

export default function Link({ href, children, ...props }: LinkProps) {
  const resolvedHref = typeof href === "string" ? href : href?.pathname ?? "#";
  return (
    <a href={resolvedHref} {...props}>
      {children}
    </a>
  );
}
