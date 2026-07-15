"use client"

import { useId, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** Outer Kravio shell — muted tray; hierarchy from tone, not heavy shadow. */
export const KRAVIO_CARD_OUTER_CLASSNAME = cn(
  "flex min-h-0 min-w-0 flex-col rounded-xl px-1 pb-1 pt-3 sm:px-1.5 sm:pb-1.5 sm:pt-3.5",
  "border border-border/50 bg-muted/35"
)

/** Inner Kravio panel — card surface with a light, single-layer lift. */
export const KRAVIO_CARD_INNER_CLASSNAME = cn(
  "w-full rounded-lg border border-border/45 bg-card",
  "shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
)

/** Gap between outer header and inner card (Kravio reference). */
export const KRAVIO_CARD_INNER_OFFSET_CLASSNAME = "mt-2 sm:mt-2.5"

type KravioCardIconPosition = "left" | "right"

type KravioCardProps = {
  title: string
  description?: string
  icon?: LucideIcon
  /** Icon before title (left) or after title block (right). Default: left when description is set, else right. */
  iconPosition?: KravioCardIconPosition
  headerActions?: ReactNode
  children: ReactNode
  className?: string
  innerClassName?: string
  headerClassName?: string
  titleId?: string
}

export function KravioCard(props: KravioCardProps) {
  const {
    title,
    description,
    icon: Icon,
    headerActions,
    children,
    className,
    innerClassName,
    headerClassName,
    titleId,
    iconPosition,
  } = props

  const generatedId = useId()
  const headingId = titleId ?? generatedId
  const isSectionHeader = Boolean(description) || iconPosition !== undefined
  const resolvedIconPosition =
    iconPosition ?? (description ? "left" : "right")

  const iconElement = Icon ? (
    <Icon
      className="h-[1.125rem] w-[1.125rem] shrink-0 text-muted-foreground/80"
      strokeWidth={1.75}
      aria-hidden
    />
  ) : null

  const titleElement = (
    <h2
      id={headingId}
      className={cn(
        "min-w-0 flex-1",
        isSectionHeader
          ? "text-base font-semibold leading-snug text-foreground"
          : "text-sm font-medium text-muted-foreground"
      )}
    >
      {title}
    </h2>
  )

  const descriptionElement = description ? (
    <p
      className={cn(
        "text-sm leading-relaxed text-muted-foreground",
        isSectionHeader && resolvedIconPosition === "left" && Icon
          ? "pl-[calc(1.125rem+0.625rem)]"
          : null,
        isSectionHeader ? "mt-1" : null
      )}
    >
      {description}
    </p>
  ) : null

  return (
    <section
      className={cn(KRAVIO_CARD_OUTER_CLASSNAME, className)}
      aria-labelledby={headingId}
    >
      <div
        className={cn(
          "flex items-start justify-between gap-2 px-1 sm:px-1.5",
          headerClassName
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            {resolvedIconPosition === "left" ? iconElement : null}
            {titleElement}
            {resolvedIconPosition === "right" ? iconElement : null}
          </div>
          {descriptionElement}
        </div>
        {headerActions ? (
          <div className="flex shrink-0 items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div
        className={cn(
          KRAVIO_CARD_INNER_OFFSET_CLASSNAME,
          KRAVIO_CARD_INNER_CLASSNAME,
          innerClassName
        )}
      >
        {children}
      </div>
    </section>
  )
}
