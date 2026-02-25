import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-violet-600 via-purple-500 to-violet-600 text-white shadow-lg shadow-violet-900/30 hover:shadow-xl hover:shadow-violet-800/40 hover:from-violet-500 hover:via-purple-400 hover:to-violet-500 border border-violet-400/20",
        destructive:
          "bg-gradient-to-r from-red-600 to-rose-500 text-white hover:from-red-500 hover:to-rose-400 shadow-lg shadow-red-900/25",
        outline:
          "border border-violet-600/50 bg-violet-950/30 text-violet-200 hover:bg-violet-900/40 hover:text-white hover:border-violet-500/80 backdrop-blur-sm",
        secondary:
          "bg-violet-900/40 text-violet-200 hover:bg-violet-800/50 border border-violet-700/50",
        ghost:
          "hover:bg-violet-800/40 hover:text-white text-violet-300",
        link:
          "text-violet-300 underline-offset-4 hover:underline hover:text-white",
        neon:
          "bg-transparent border border-cyan-500/60 text-cyan-300 hover:bg-cyan-900/30 hover:border-cyan-400/80 hover:text-white backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]",
        glass:
          "bg-violet-900/20 backdrop-blur-2xl border border-violet-600/30 text-white hover:bg-violet-800/30 hover:border-violet-500/40 shadow-lg shadow-black/10",
        premium:
          "bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 text-white font-bold shadow-xl shadow-violet-900/40 hover:shadow-2xl hover:shadow-purple-700/50 hover:from-violet-500 hover:via-purple-400 hover:to-fuchsia-400 border border-violet-400/30 button-3d shadow-glow",
        gold:
          "bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-500 text-amber-900 font-semibold border border-amber-300/40 hover:shadow-lg hover:shadow-amber-400/30 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-400",
        titanium:
          "bg-gradient-to-br from-violet-900 via-violet-800 to-violet-900 text-white border border-violet-600/30 hover:shadow-lg hover:shadow-violet-500/20 hover:border-violet-500/40",
        chrome:
          "bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 text-white border border-purple-500/40 shadow-chrome hover:via-purple-500 hover:border-purple-400/50",
        metallic:
          "bg-gradient-to-br from-violet-700 to-purple-800 text-violet-100 border border-purple-500/30 shadow-glow-md hover:from-violet-600 hover:to-purple-700 hover:text-white",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
