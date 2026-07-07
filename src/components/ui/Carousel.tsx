"use client";

// ============================================================================
// Carousel
// ============================================================================
//
// shadcn-pattern carousel built on Embla Carousel. Same API surface
// shadcn ships (Carousel + CarouselContent + CarouselItem +
// CarouselPrevious + CarouselNext + useCarousel hook), styled with
// our DS tokens instead of shadcn's accent / popover defaults.
// CarouselPrevious / CarouselNext default to floating chips at the
// left / right of the content area, matching shadcn's reference.

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  /** Turn off the wheel-gestures plugin (free trackpad glide). Pair with
      CarouselWheelStep for discrete card-by-card wheel stepping that
      always settles on a snap point. */
  wheelGestures?: boolean;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  wheelGestures = true,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  // WheelGesturesPlugin translates Mac trackpad two-finger horizontal
  // swipes (and similar deltaX wheel events) into Embla's scroll API.
  // Only attached on horizontal carousels — on vertical ones the
  // plugin would watch deltaY and risk hijacking page scroll.
  const wheelPlugins = React.useMemo(
    () =>
      orientation === "horizontal" && wheelGestures
        ? [WheelGesturesPlugin()]
        : [],
    [orientation, wheelGestures],
  );

  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    [...wheelPlugins, ...(plugins ?? [])],
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel();
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = "outline",
  ...props
}: React.ComponentProps<"button"> & { variant?: "outline" | "ghost" }) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <button
      type="button"
      data-slot="carousel-previous"
      aria-label="Previous slide"
      className={cn(
        "absolute z-[2] grid size-10 place-items-center rounded-full border border-borderDefault bg-surface text-textDefault transition-colors hover:bg-[var(--ds-gray-100)] disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-[var(--ds-gray-100)]",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        variant === "ghost" && "border-transparent bg-transparent",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="size-4" aria-hidden />
    </button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  ...props
}: React.ComponentProps<"button"> & { variant?: "outline" | "ghost" }) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <button
      type="button"
      data-slot="carousel-next"
      aria-label="Next slide"
      className={cn(
        "absolute z-[2] grid size-10 place-items-center rounded-full border border-borderDefault bg-surface text-textDefault transition-colors hover:bg-[var(--ds-gray-100)] disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-[var(--ds-gray-100)]",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        variant === "ghost" && "border-transparent bg-transparent",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="size-4" aria-hidden />
    </button>
  );
}

// Discrete wheel stepping — a horizontal trackpad/wheel gesture advances
// exactly one snap per cooldown window, so the row always scrolls INTO
// PLACE instead of free-gliding on the momentum tail. Wrap the content
// area (arrows included) with this and pass wheelGestures={false} to the
// Carousel so the free-glide plugin doesn't fight it. Vertical deltas
// pass through untouched (page keeps scrolling); handled horizontal
// deltas are prevented so they can't trigger the browser's history
// swipe. Drag and touch keep Embla's native snap behaviour.
function CarouselWheelStep({
  stepCooldown = 500,
  threshold = 12,
  ...props
}: React.ComponentProps<"div"> & {
  /** Minimum ms between steps — swallows the momentum tail. */
  stepCooldown?: number;
  /** Minimum |deltaX| that counts as an intentional gesture. */
  threshold?: number;
}) {
  const { api } = useCarousel();
  const ref = React.useRef<HTMLDivElement>(null);
  const lockRef = React.useRef(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !api) return;
    const onWheel = (event: WheelEvent) => {
      // Dominantly-vertical scrolling belongs to the page.
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      const now = Date.now();
      if (now - lockRef.current < stepCooldown) return;
      if (Math.abs(event.deltaX) < threshold) return;
      lockRef.current = now;
      if (event.deltaX > 0) api.scrollNext();
      else api.scrollPrev();
    };
    // React attaches wheel passively — a native non-passive listener is
    // required for the preventDefault above.
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [api, stepCooldown, threshold]);

  return <div ref={ref} data-slot="carousel-wheel-step" {...props} />;
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselWheelStep,
  useCarousel,
};
