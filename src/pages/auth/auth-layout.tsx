import { cn } from "@/lib/utils";
import { HorizontalGradient } from "@/components/horizontal-gradient";
import { FeaturedTestimonials } from "@/components/featured-testimonials";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
        {children}
        <div className="relative z-20 hidden w-full items-center justify-center overflow-hidden border-l border-neutral-100 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 md:flex">
          <div className="mx-auto max-w-sm">
            <FeaturedTestimonials />
            <p
              className={cn(
                "text-center text-xl font-semibold text-neutral-700 dark:text-neutral-300",
              )}
            >
              Join thousands of users already
            </p>
            <p
              className={cn(
                "mt-8 text-center text-base font-normal text-neutral-500 dark:text-neutral-400",
              )}
            >
              With lots of AI applications around, Desigcombo stands out with
              its state of the art Shitposting capabilities.
            </p>
          </div>
          <HorizontalGradient className="top-20" />
          <HorizontalGradient className="bottom-20" />
          <HorizontalGradient className="inset-y-0 -right-80 h-full rotate-90 scale-x-150 transform" />
          <HorizontalGradient className="inset-y-0 -left-80 h-full rotate-90 scale-x-150 transform" />
        </div>
      </div>
    </>
  );
}
