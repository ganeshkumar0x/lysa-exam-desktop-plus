
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(2);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>(initialData?.strokes || []);

  useEffect(() => {
    initializeCanvas();
    redrawCanvas();
  }, [strokes]);

  useEffect(() => {
    const handleResize = () => {
      initializeCanvas();
      redrawCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size to match container
    canvas.width = rect.width * dpr;
    canvas.height = 400 * dpr;
    
    // Scale canvas back down using CSS
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '400px';
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, rect.width, 400);
    }
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, 400);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, rect.width, 400);

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
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX / (window.devicePixelRatio || 1),
      y: (e.clientY - rect.top) * scaleY / (window.devicePixelRatio || 1)
    };
  };

  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches.length) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.touches[0].clientX - rect.left) * scaleX / (window.devicePixelRatio || 1),
      y: (e.touches[0].clientY - rect.top) * scaleY / (window.devicePixelRatio || 1)
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getMousePos(e);
    setCurrentStroke([pos]);
  };

  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getTouchPos(e);
    setCurrentStroke([pos]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
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

    if (currentStroke.length > 0) {
      const lastPoint = currentStroke[currentStroke.length - 1];
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const pos = getTouchPos(e);
    setCurrentStroke(prev => [...prev, pos]);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentStroke.length > 0) {
      const lastPoint = currentStroke[currentStroke.length - 1];
      ctx.beginPath();
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
    initializeCanvas();
  };

  const undoLastStroke = () => {
    if (strokes.length > 0) {
      const newStrokes = strokes.slice(0, -1);
      setStrokes(newStrokes);
      onDataChange({ strokes: newStrokes });
    }
  };

  const colors = ['#000000', '#ff0000', '#0000ff', '#00ff00', '#ffff00', '#800080', '#ffa500', '#ff69b4'];

  return (
    <div className="flex flex-col h-full">
      {/* Drawing Tools */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium">Colors:</span>
          {colors.map(color => (
            <button
              key={color}
              onClick={() => setPenColor(color)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                penColor === color ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-500'
              }`}
              style={{ backgroundColor: color }}
              title={`Select ${color}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Size:</span>
          <Slider
            value={[penWidth]}
            onValueChange={(value) => setPenWidth(value[0])}
            max={20}
            min={1}
            step={1}
            className="w-24"
          />
          <span className="text-sm w-8 text-center">{penWidth}px</span>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={undoLastStroke}
            variant="outline"
            size="sm"
            disabled={strokes.length === 0}
          >
            Undo
          </Button>
          <Button
            onClick={clearCanvas}
            variant="outline"
            size="sm"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className="flex-1 border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-inner"
        style={{ minHeight: '400px' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawingTouch}
          onTouchMove={drawTouch}
          onTouchEnd={stopDrawing}
          style={{ touchAction: 'none' }}
        />
      </div>

      <div className="mt-2 text-xs text-gray-500 text-center">
        Click and drag to draw • Touch and drag on mobile devices
      </div>
    </div>
  );
};

export default DrawingCanvas;
