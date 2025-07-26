import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Smartphone, Layers } from 'lucide-react';

export type FilterType = 'Region' | 'Operator' | 'Both';

interface FilterTypeSelectorProps {
  value: FilterType;
  onChange: (value: FilterType) => void;
  disabled?: boolean;
}

export const FilterTypeSelector: React.FC<FilterTypeSelectorProps> = ({
  value,
  onChange,
  disabled
}) => {
  const options: Array<{ value: FilterType; label: string; icon: React.ReactNode; description: string }> = [
    {
      value: 'Region',
      label: 'By Region',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Group numbers by geographical regions'
    },
    {
      value: 'Operator',
      label: 'By Operator',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Group numbers by mobile operators'
    },
    {
      value: 'Both',
      label: 'Region & Operator',
      icon: <Layers className="w-5 h-5" />,
      description: 'Group by both region and operator'
    }
  ];

  return (
    <div className="w-full">
      <Label className="block text-sm font-medium text-foreground mb-3">
        How would you like to filter?
      </Label>
      
      <RadioGroup
        value={value}
        onValueChange={(newValue) => onChange(newValue as FilterType)}
        disabled={disabled}
        className="space-y-3"
      >
        {options.map((option) => (
          <div
            key={option.value}
            className="flex items-center space-x-3 p-4 rounded-lg border bg-gradient-card hover:bg-accent/50 transition-colors"
          >
            <RadioGroupItem
              value={option.value}
              id={option.value}
              disabled={disabled}
            />
            <div className="flex items-center space-x-3 flex-1">
              <div className="text-primary">
                {option.icon}
              </div>
              <div className="flex-1">
                <Label
                  htmlFor={option.value}
                  className="font-medium text-foreground cursor-pointer"
                >
                  {option.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};