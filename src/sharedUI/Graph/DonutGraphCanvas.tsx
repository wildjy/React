'use client';
import { VariantProps } from 'class-variance-authority';
import { useRef, useState, useEffect, HTMLAttributes } from 'react';
import { cn } from "../common/cn";
import { cva } from 'class-variance-authority';

interface DonutGraphCanvasProps {
  size?: {
    size: number;
    depth: number;
  };
  color?: [string, string];
  min?: number;
  max?: number;
  score?: number;
  addClass?: string;
  disabled?: boolean;
}

export const DonutGraphCanvas: React.FC<DonutGraphCanvasProps> = ({
  size = { size: 100, depth: 10 },
  min = 0,
  max = 0,
  color = ['#A4BEF0', '#dddddd'],
  score = 0,
  addClass,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [percent, setPercent] = useState<number>(0);
  const graphSize = `${size.size / 16}rem`;


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log(canvasRef.current);

    const centerX = size.size / 2;
    const centerY = size.size / 2;
    const padding = 0;
    const lineWidth = size.depth;
    const radius = (size.size - lineWidth - padding * 2) / 2;

    // donut size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.size * dpr;
    canvas.height = size.size * dpr;
    canvas.style.width = graphSize;
    canvas.style.height = graphSize;

    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    ctx.scale(dpr, dpr);

    // donut base
    ctx.clearRect(0, 0, size.size, size.size);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = color[1];
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // active donut
    const endAngle = (score / max) * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(
      centerX,
      centerY,
      radius,
      -Math.PI / 2,
      disabled ? -Math.PI / 2 + 0 : -Math.PI / 2 + endAngle
    );
    ctx.strokeStyle = color[0];
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }, [score, min, max, color, size, disabled]);

  return (
    <div
      className={`${cn('relative', addClass)}`}
      style={{ width: graphSize, height: graphSize }}
    >
      <canvas
        ref={canvasRef}
        width={graphSize}
        height={graphSize}
        data-size={size.depth}
        data-min={min}
        data-max={max}
      ></canvas>
      <div className="absolute flex flex-col flex-wrap items-center justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-[1]">
        <span className="leading-none">
          <b>{score}</b>
        </span>
        <span className="leading-none">/{max}</span>
      </div>
    </div>
  );
};
