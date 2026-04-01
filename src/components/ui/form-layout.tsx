import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label> & { error?: boolean }
>(({ className, error, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn(
        "text-sm font-bold tracking-tight",
        error && "text-rose-600 dark:text-rose-400",
        className
      )}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  if (!children) return null;

  return (
    <p
      ref={ref}
      className={cn("text-[12px] font-bold text-rose-600 dark:text-rose-400 animate-in fade-in slide-in-from-top-1 duration-300", className)}
      {...props}
    >
      {children}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-xs text-zinc-500 dark:text-zinc-400 font-sans italic", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

export { FormItem, FormLabel, FormMessage, FormDescription };
