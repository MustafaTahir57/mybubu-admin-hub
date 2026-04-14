import * as React from "react";
import { Input } from "@/components/ui/input";

const BLOCKED_KEYS = ["e", "E", "+", "-", " "];

type NumericInputProps = Omit<React.ComponentProps<typeof Input>, "type">;

export const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  (props, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (BLOCKED_KEYS.includes(e.key)) e.preventDefault();
      props.onKeyDown?.(e);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pasted = e.clipboardData.getData("text");
      if (!/^\d*\.?\d*$/.test(pasted)) e.preventDefault();
      props.onPaste?.(e);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="number"
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
    );
  }
);

NumericInput.displayName = "NumericInput";
