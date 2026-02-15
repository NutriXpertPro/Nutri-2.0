import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface YesNoSelectorProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export const YesNoSelector: React.FC<YesNoSelectorProps> = ({
  value,
  onChange,
  className,
  disabled = false,
}) => {
  return (
    <RadioGroup
      value={value === null ? "" : value ? "yes" : "no"}
      onValueChange={(val) => onChange(val === "yes")}
      className={`flex items-center gap-4 ${className || ""}`}
      disabled={disabled}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="yes" id="yes" disabled={disabled} />
        <Label htmlFor="yes" className="cursor-pointer">Sim</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="no" id="no" disabled={disabled} />
        <Label htmlFor="no" className="cursor-pointer">Não</Label>
      </div>
    </RadioGroup>
  );
};