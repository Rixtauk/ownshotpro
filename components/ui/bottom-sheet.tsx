"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(
  ({ open, onClose, title, children, className }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragY, setDragY] = React.useState(0);

    const handleDragEnd = React.useCallback(
      (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
        setIsDragging(false);
        // Close if dragged down significantly or with high velocity
        if (info.offset.y > 100 || info.velocity.y > 500) {
          onClose();
        }
        setDragY(0);
      },
      [onClose]
    );

    // Use regular Dialog on desktop (md and above)
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

    return (
      <DialogPrimitive.Root open={open} onOpenChange={onClose}>
        <DialogPrimitive.Portal>
          <AnimatePresence>
            {open && (
              <>
                {/* Backdrop */}
                <DialogPrimitive.Overlay asChild>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                  />
                </DialogPrimitive.Overlay>

                {/* Content */}
                <DialogPrimitive.Content asChild>
                  {isDesktop ? (
                    // Desktop: Regular dialog
                    <motion.div
                      ref={ref}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className={cn(
                        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%]",
                        "glass-card p-6 shadow-lg sm:rounded-2xl",
                        className
                      )}
                    >
                      {/* Close button */}
                      <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </button>

                      {/* Title */}
                      {title && (
                        <div className="mb-4">
                          <h2 className="text-lg font-semibold leading-none tracking-tight">
                            {title}
                          </h2>
                        </div>
                      )}

                      {/* Content */}
                      <div>{children}</div>
                    </motion.div>
                  ) : (
                    // Mobile: Bottom sheet
                    <motion.div
                      ref={ref}
                      drag="y"
                      dragConstraints={{ top: 0, bottom: 0 }}
                      dragElastic={{ top: 0, bottom: 0.5 }}
                      onDragStart={() => setIsDragging(true)}
                      onDrag={(_, info) => setDragY(info.offset.y)}
                      onDragEnd={handleDragEnd}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      className={cn(
                        "fixed bottom-0 left-0 right-0 z-50",
                        "glass-card rounded-t-3xl pb-safe",
                        "max-h-[90vh] overflow-hidden",
                        className
                      )}
                      style={{
                        y: isDragging ? dragY : 0,
                      }}
                    >
                      {/* Drag handle */}
                      <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                        <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
                      </div>

                      {/* Title */}
                      {title && (
                        <div className="px-6 pb-4">
                          <h2 className="text-lg font-semibold leading-none tracking-tight">
                            {title}
                          </h2>
                        </div>
                      )}

                      {/* Content with scroll */}
                      <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                        {children}
                      </div>
                    </motion.div>
                  )}
                </DialogPrimitive.Content>
              </>
            )}
          </AnimatePresence>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  }
);

BottomSheet.displayName = "BottomSheet";

export { BottomSheet };
