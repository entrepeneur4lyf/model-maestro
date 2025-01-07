import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface ModelPreferences {
  prioritizeSpeed: boolean;
  costSensitivity: number;
  reliabilityThreshold: number;
  contextWindowImportance: number;
}

interface Props {
  preferences: ModelPreferences;
  onChange: (preferences: ModelPreferences) => void;
}

export function ModelPreferences({ preferences, onChange }: Props) {
  const handleSliderChange = (key: keyof ModelPreferences) => (value: number[]) => {
    onChange({
      ...preferences,
      [key]: value[0],
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    onChange({
      ...preferences,
      prioritizeSpeed: checked,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Selection Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="prioritize-speed">Prioritize Speed</Label>
          <Switch
            id="prioritize-speed"
            checked={preferences.prioritizeSpeed}
            onCheckedChange={handleSwitchChange}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Cost Sensitivity</Label>
            <Slider
              value={[preferences.costSensitivity]}
              onValueChange={handleSliderChange('costSensitivity')}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Reliability Threshold</Label>
            <Slider
              value={[preferences.reliabilityThreshold]}
              onValueChange={handleSliderChange('reliabilityThreshold')}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Context Window Importance</Label>
            <Slider
              value={[preferences.contextWindowImportance]}
              onValueChange={handleSliderChange('contextWindowImportance')}
              max={100}
              step={1}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
