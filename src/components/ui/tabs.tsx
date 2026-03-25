import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  id: string;
}>({ id: "" })

function Tabs({
  className,
  orientation = "horizontal",
  defaultValue,
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const [value, setValue] = React.useState(controlledValue || defaultValue)
  const id = React.useId()

  const handleValueChange = React.useCallback((newValue: string) => {
    if (!controlledValue) {
      setValue(newValue)
    }
    controlledOnValueChange?.(newValue)
  }, [controlledValue, controlledOnValueChange])

  React.useEffect(() => {
    if (controlledValue) {
      setValue(controlledValue)
    }
  }, [controlledValue])

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange, id }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-orientation={orientation}
        value={value}
        onValueChange={handleValueChange}
        className={cn(
          "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
          className
        )}
        {...props}
      />
    </TabsContext.Provider>
  )
}

const tabsListVariants = cva(
  "group/tabs-list bg-background border-0 inline-flex w-fit items-center justify-center p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-10 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none relative rounded-full",
  {
    variants: {
      variant: {
        default: "",
        line: "gap-1 backdrop-blur-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const context = React.useContext(TabsContext)
  const isActive = context.value === value

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      value={value}
      className={cn(
        "relative inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium whitespace-nowrap text-foreground/50 transition-colors group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground/80 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground z-10",
        className
      )}
      {...props}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId={`active-tab-${context.id}`}
          className="absolute inset-0 bg-card rounded-full -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }

