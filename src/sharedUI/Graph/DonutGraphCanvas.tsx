'use client';
import { VariantProps } from 'class-variance-authority';
import { useRef, useState, useEffect, HTMLAttributes } from 'react';
import { cn } from "../common/cn";
import { cva } from 'class-variance-authority';

interface DonutGraphCanvasProps {
  half?: boolean;
  tick?: {
    show: boolean;
    label?: boolean;
  };
  mark?: boolean;
  size?: {
    size: number;
    depth: number;
    p?: number;
  };
  color?: [string, string];
  min?: number;
  max?: number;
  score?: number;
  myscore?: number;
  unit?: string;
  addClass?: string;
  disabled?: boolean;
}

export const DonutGraphCanvas: React.FC<DonutGraphCanvasProps> = ({
  half = false,
  tick = { show: false, label: false },
  mark = false,
  size = { size: 100, depth: 10, p: 0 },
  min = 0,
  max = 0,
  color = ['#A4BEF0', '#dddddd'],
  score = 0,
  myscore = 0,
  unit,
  addClass,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphSize = `${size.size / 16}rem`;
  const graphHalfSize = `${size.size / 2 / 16}rem`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size.size / 2;
    const centerY = size.size / 2;
    const padding = tick.show
      ? tick.label
        ? size.p || 20
        : size.p || 10
      : size.p || 0;
    const lineWidth = size.depth;
    const radius = (size.size - lineWidth - padding * 2) / 2;
    const dpr = window.devicePixelRatio || 1;
    const baseScore = Math.max(0, Math.min(1, (score - min) / (max - min)));
    const endAngle = baseScore * 2 * Math.PI;
    const startHalfAngle = Math.PI;
    const endHalfAngle = startHalfAngle + Math.PI;
    console.log(endAngle);
    // donut size
    if (half) {
      canvas.width = size.size * dpr;
      canvas.height = (size.size / 2) * dpr + 10;
      canvas.style.width = graphSize;
      canvas.style.height = graphHalfSize + 10;
      // ctx.lineCap = 'round';
    } else {
      canvas.width = size.size * dpr;
      canvas.height = size.size * dpr;
      canvas.style.width = graphSize;
      canvas.style.height = graphSize;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    ctx.scale(dpr, dpr);

    // donut base
    ctx.clearRect(0, 0, size.size, size.size);
    ctx.beginPath();
    half
      ? ctx.arc(centerX, centerY, radius, startHalfAngle, endHalfAngle)
      : ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = color[1];
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // donut active
    if (!disabled) {
      ctx.beginPath();
      half
        ? ctx.arc(
            centerX,
            centerY,
            radius,
            startHalfAngle,
            startHalfAngle + Math.PI * baseScore
          )
        : ctx.arc(
            centerX,
            centerY,
            radius,
            -Math.PI / 2,
            -Math.PI / 2 + endAngle
          );
      ctx.strokeStyle = color[0];
      ctx.lineWidth = lineWidth;
      ctx.stroke(); // 게이지 채움
    }
    ctx.strokeStyle = color[0];
    ctx.lineWidth = 1;

    // 게이지 선 위치 (score 위치)
    const scoreRatio = (score - min) / (max - min);
    const angle = half
      ? Math.PI + scoreRatio * Math.PI
      : -Math.PI / 2 + scoreRatio * (2 * Math.PI);

    const gaugeStart = radius - lineWidth / 2;
    const gaugeEnd = gaugeStart + size.depth; // 눈금 길이 조정

    const gx1 = centerX + Math.cos(angle) * gaugeStart;
    const gy1 = centerY + Math.sin(angle) * gaugeStart;
    const gx2 = centerX + Math.cos(angle) * gaugeEnd;
    const gy2 = centerY + Math.sin(angle) * gaugeEnd;

    ctx.beginPath();
    ctx.moveTo(gx1, gy1);
    ctx.lineTo(gx2, gy2);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();

    // my score padding값 조절해야함.
    if (myscore) {
      const myScoreRatio = (myscore - min) / (max - min);
      const textOffset = 10;
      const myAngle = half
        ? Math.PI + myScoreRatio * Math.PI
        : -Math.PI / 2 + myScoreRatio * (2 * Math.PI);

      const myGaugeStart = radius - lineWidth / 2;
      const myGaugeEnd = gaugeStart + size.depth; // 눈금 길이 조정

      const my_gx1 = centerX + Math.cos(myAngle) * myGaugeStart;
      const my_gy1 = centerY + Math.sin(myAngle) * myGaugeStart;
      const my_gx2 = centerX + Math.cos(myAngle) * myGaugeEnd;
      const my_gy2 = centerY + Math.sin(myAngle) * myGaugeEnd;

      ctx.beginPath();
      ctx.moveTo(my_gx1, my_gy1);
      ctx.lineTo(my_gx2, my_gy2);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();

      const markRadius = radius + lineWidth / 2 + textOffset * 2; // 도넛 바깥쪽에 표시
      const markX = centerX + Math.cos(myAngle) * markRadius;
      const markY = centerY + Math.sin(myAngle) * markRadius;

      ctx.fillStyle = '#000';
      ctx.font = '.8rem sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`MY ${myscore}`, markX, markY);
    }

    // 구간
    if (tick.show) {
      const tickLength = 4;
      const textOffset = 10;
      for (let i = 0; i <= tickLength; i++) {
        const ratio = i / tickLength;
        const tickLabel = Math.round((i * (max - min)) / tickLength + min);
        const angle = half
          ? Math.PI + ratio * Math.PI
          : -Math.PI / 2 + ratio * (2 * Math.PI);

        const tickStart = radius + lineWidth / 2;
        const tickEnd = textOffset / 2;

        const xStart = centerX + Math.cos(angle) * tickStart;
        const yStart = centerY + Math.sin(angle) * tickStart;
        const xEnd = centerX + Math.cos(angle) * (tickStart + tickEnd);
        const yEnd = centerY + Math.sin(angle) * (tickStart + tickEnd);

        const isActiveTick =
          score >= tickLabel && score < tickLabel + (max - min) / tickLength;
        // console.log(isActiveTick);

        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;
        ctx.stroke();

        const labelRadius = tickStart + tickEnd + textOffset;
        const labelX = centerX + Math.cos(angle) * labelRadius;
        const labelY = centerY + Math.sin(angle) * labelRadius;
        if (tick.label) {
          ctx.fillStyle = '#666';
          ctx.font = '.8rem sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${tickLabel}`, labelX, labelY);
        }
      }
    }

    if (mark) {
      const markScore = score;
      const textOffset = 10;
      const markAngle = half
        ? Math.PI + (Math.PI * (markScore - min)) / (max - min)
        : -Math.PI / 2 + (2 * Math.PI * (markScore - min)) / (max - min);

      // 점 위치 계산
      const markRadius = radius + lineWidth / 2 + 5; // 도넛 바깥쪽에 표시
      const markStart = centerX + Math.cos(markAngle) * markRadius;
      const markEnd = centerY + Math.sin(markAngle) * markRadius;

      // 텍스트 그리기
      ctx.fillStyle = '#000';
      ctx.font = '.8rem sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${markScore}${unit}`, markStart, markEnd - textOffset);
    }
  }, [score, min, max, color, size, disabled]);

  return (
    <div
      className={`${cn('relative', addClass)}`}
      style={{
        width: graphSize,
        height: half ? graphHalfSize : graphSize,
      }}
    >
      <canvas
        ref={canvasRef}
        width={graphSize}
        height={graphSize}
        data-size={size.depth}
        data-min={min}
        data-max={max}
      ></canvas>
      <div
        className={`
        absolute
        ${half ? 'bottom-0' : 'top-1/2 -translate-y-1/2 flex-col'}
        left-1/2
        -translate-x-1/2
        flex flex-wrap justify-center
        items-center z-[1]
        `}
      >
        <span className="leading-none">
          <b>
            {disabled ? '**' : score}
            {unit}
          </b>
        </span>
        <span className="leading-none">
          /{max}
          {unit}
        </span>
      </div>
    </div>
  );
};
