
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { DrawingData, Stroke, Point } from '../../types/exam';

interface DrawingCanvasProps {
  onDataChange: (data: DrawingData) => void;
  initialData?: DrawingData;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  onDataChange,
  initialData
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(2);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>(initialData?.strokes || []);

  useEffect(() => {
    redrawCanvas();
  }, [strokes]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    strokes.forEach(stroke => {
      if (stroke.points.length > 1) {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
      }
    });
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    setCurrentStroke([pos]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    setCurrentStroke(prev => [...prev, pos]);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    const prevPoints = currentStroke;
    if (prevPoints.length > 0) {
      const lastPoint = prevPoints[prevPoints.length - 1];
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing && currentStroke.length > 1) {
      const newStroke: Stroke = {
        points: currentStroke,
        color: penColor,
        width: penWidth
      };
      const newStrokes = [...strokes, newStroke];
      setStrokes(newStrokes);
      onDataChange({ strokes: newStrokes });
    }
    setIsDrawing(false);
    setCurrentStroke([]);
  };

  const clearCanvas = () => {
    setStrokes([]);
    onDataChange({ strokes: [] });
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const colors = ['#000000', '#ff0000', '#0000ff', '#00ff00', '#ffff00', '#800080'];

  return (
    <div className="flex flex-col h-full">
      {/* Drawing Tools */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4">
        <div className="flex gap-2">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => setPenColor(color)}
              className={`w-6 h-6 rounded border-2 ${
                penColor === color ? 'border-gray-800' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Size:</span>
          <Slider
            value={[penWidth]}
            onValueChange={(value) => setPenWidth(value[0])}
            max={10}
            min={1}
            step={1}
            className="w-20"
          />
          <span className="text-sm w-6">{penWidth}</span>
        </div>

        <Button
          onClick={clearCanvas}
          variant="outline"
          size="sm"
        >
          Clear
        </Button>
      </div>

      {/* Canvas */}
      <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
};

export default DrawingCanvas;
