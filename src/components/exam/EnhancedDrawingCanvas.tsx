import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DrawingData, Stroke, Point } from '../../types/exam';
import ShapesToolbar, { Tool } from './ShapesToolbar';

interface EnhancedDrawingCanvasProps {
  onDataChange: (data: DrawingData) => void;
  initialData?: DrawingData;
  containerHeight?: string;
}

const EnhancedDrawingCanvas: React.FC<EnhancedDrawingCanvasProps> = ({
  onDataChange,
  initialData,
  containerHeight = 'calc(100vh - 300px)'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>('pen');
  const [penColor, setPenColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(2);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>(initialData?.strokes || []);
  const [startPoint, setStartPoint] = useState<Point | null>(null);

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

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 800;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = canvas.height + 'px';

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    strokes.forEach(stroke => {
      if (stroke.points.length === 0) return;

      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.type === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
      }

      if (stroke.type === 'rectangle' && stroke.points.length >= 2) {
        const [start, end] = [stroke.points[0], stroke.points[1]];
        ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
      } else if (stroke.type === 'circle' && stroke.points.length >= 2) {
        const [start, end] = [stroke.points[0], stroke.points[1]];
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (stroke.type === 'line' && stroke.points.length >= 2) {
        const [start, end] = [stroke.points[0], stroke.points[1]];
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
      }

      ctx.globalCompositeOperation = 'source-over'; // Reset after stroke
    });
  }, [strokes]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getCoordinates(e);
    setIsDrawing(true);
    setStartPoint(pos);

    if (activeTool === 'pen' || activeTool === 'eraser') {
      setCurrentStroke([pos]);
    } else {
      setCurrentStroke([pos, pos]);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !startPoint) return;

    const pos = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    if (activeTool === 'pen' || activeTool === 'eraser') {
      setCurrentStroke(prev => [...prev, pos]);

      ctx.lineWidth = penWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (activeTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = penColor;
      }

      const lastPoint = currentStroke[currentStroke.length - 1] || pos;
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      ctx.globalCompositeOperation = 'source-over';
    } else {
      redrawCanvas();

      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;

      if (activeTool === 'rectangle') {
        ctx.strokeRect(startPoint.x, startPoint.y, pos.x - startPoint.x, pos.y - startPoint.y);
      } else if (activeTool === 'circle') {
        const radius = Math.sqrt(Math.pow(pos.x - startPoint.x, 2) + Math.pow(pos.y - startPoint.y, 2));
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (activeTool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }

      setCurrentStroke([startPoint, pos]);
    }
  };

  const stopDrawing = () => {
    if (isDrawing && currentStroke.length > 0) {
      const newStroke: Stroke = {
        points: currentStroke,
        color: penColor,
        width: penWidth,
        type: activeTool
      };
      const newStrokes = [...strokes, newStroke];
      setStrokes(newStrokes);
      onDataChange({ strokes: newStrokes });
    }
    setIsDrawing(false);
    setCurrentStroke([]);
    setStartPoint(null);
  };

  const undoLastStroke = () => {
    if (strokes.length > 0) {
      const newStrokes = strokes.slice(0, -1);
      setStrokes(newStrokes);
      onDataChange({ strokes: newStrokes });
    }
  };

  const clearCanvas = () => {
    setStrokes([]);
    onDataChange({ strokes: [] });
    initializeCanvas();
  };

  return (
    <div className="flex flex-col h-full w-full">
      <ShapesToolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        penColor={penColor}
        onColorChange={setPenColor}
        penWidth={penWidth}
        onWidthChange={setPenWidth}
        onUndo={undoLastStroke}
        onClear={clearCanvas}
        canUndo={strokes.length > 0}
      />

      <ScrollArea
        className="flex-1 border-2 border-gray-300 rounded-lg overflow-auto bg-white shadow-inner mt-2"
        style={{ height: containerHeight }}
      >
        <div ref={containerRef} className="w-full">
          <canvas
            ref={canvasRef}
            className={`block touch-none w-full ${activeTool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'}`}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={(e) => startDrawing(e as any)}
            onTouchMove={(e) => draw(e as any)}
            onTouchEnd={stopDrawing}
            style={{
              touchAction: 'none',
              display: 'block'
            }}
          />
        </div>
      </ScrollArea>

      <div className="mt-2 text-xs text-gray-500 text-center">
        Use the toolbar to select tools and draw • Scroll to access more drawing space
      </div>
    </div>
  );
};

export default EnhancedDrawingCanvas;

