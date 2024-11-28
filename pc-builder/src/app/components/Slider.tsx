"use client";
import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

type SliderProps = {
  value: number[];
  onChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
};

export const Slider = ({ value, onChange, min, max, step }: SliderProps) => {
  return (
    <SliderPrimitive.Root
      className="relative flex items-center select-none touch-none w-full h-5"
      value={value}
      onValueChange={onChange}
      min={min}
      max={max}
      step={step}
    >
      <SliderPrimitive.Track className="bg-gray-200 dark:bg-gray-700 relative grow rounded-full h-2">
        <SliderPrimitive.Range className="absolute bg-blue-500 rounded-full h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block w-5 h-5 bg-white border-2 border-blue-500 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Price range minimum"
      />
      <SliderPrimitive.Thumb
        className="block w-5 h-5 bg-white border-2 border-blue-500 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Price range maximum"
      />
    </SliderPrimitive.Root>
  );
};