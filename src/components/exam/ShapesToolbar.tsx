
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Square, Circle, Minus, Pencil, MousePointer } from 'lucide-react';

export type Tool = 'select' | 'pen' | 'line' | 'rectangle' | 'circle';

interface ShapesToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  penColor: string;
  onColorChange: (color: string) => void;
  penWidth: number;
  onWidthChange: (width: number) => void;
  onUndo: () => void;
  onClear: () => void;
  canUndo: boolean;
}

const ShapesToolbar: React.FC<ShapesToolbarProps> = ({
  activeTool,
  onToolChange,
  penColor,
  onColorChange,
  penWidth,
  onWidthChange,
  onUndo,
  onClear,
  canUndo
}) => {
  const colors = [
    '#000000', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#ff00ff', '#00ffff', '#800000',
    '#008000', '#000080', '#808000', '#800080',
    '#008080', '#c0c0c0', '#808080', '#ffffff'
  ];

  const tools = [
    { id: 'select' as Tool, icon: MousePointer, label: 'Select' },
    { id: 'pen' as Tool, icon: Pencil, label: 'Pen' },
    { id: 'line' as Tool, icon: Minus, label: 'Line' },
    { id: 'rectangle' as Tool, icon: Square, label: 'Rectangle' },
    { id: 'circle' as Tool, icon: Circle, label: 'Circle' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border">
      {/* Tools */}
      <div className="flex gap-1">
        {tools.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant={activeTool === id ? "default" : "outline"}
            size="sm"
            onClick={() => onToolChange(id)}
            className={`p-2 ${activeTool === id ? 'bg-blue-600 text-white' : ''}`}
            title={label}
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Colors */}
      <div className="flex flex-wrap gap-1">
        {colors.map(color => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-6 h-6 rounded border-2 transition-all ${
              penColor === color ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-500'
            }`}
            style={{ backgroundColor: color }}
            title={`Select ${color}`}
          />
        ))}
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Brush Size */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Size:</span>
        <input
          type="range"
          min="1"
          max="20"
          value={penWidth}
          onChange={(e) => onWidthChange(Number(e.target.value))}
          className="w-16"
        />
        <span className="text-sm w-8">{penWidth}px</span>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Actions */}
      <div className="flex gap-1">
        <Button
          onClick={onUndo}
          variant="outline"
          size="sm"
          disabled={!canUndo}
        >
          Undo
        </Button>
        <Button
          onClick={onClear}
          variant="outline"
          size="sm"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default ShapesToolbar;
