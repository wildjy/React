/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';
import { VariantProps } from 'class-variance-authority';
import { useRef, useState, useEffect, HTMLAttributes } from 'react';
import { cn } from "../common/cn";
import { cva } from 'class-variance-authority';

interface DonutGraphCanvasProps {
  activeLine?: {
    show: boolean;
    label?: boolean;
  };
  half?: boolean;
  tick?: {
    show: boolean;
    length?: number;
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
  myscore?: {
    score: number;
    label?: string;
  };
  unit?: string;
  addClass?: string;
  disabled?: boolean;
}

export const DonutGraphCanvas: React.FC<DonutGraphCanvasProps> = ({
  activeLine = { show: false, label: false },
  half = false,
  tick = { show: false, length: 4, label: false },
  mark = false,
  size = { size: 100, depth: 10, p: 0 },
  min = 0,
  max = 0,
  color = ['#A4BEF0', '#dddddd'],
  score = 0,
  myscore = { score: 0 },
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
        ? size.p || 25
        : size.p || 10
      : size.p || 0;
    const lineDepth = size.depth;
    const calcRadius = (size.size - lineDepth - padding * 2) / 2;
    const radius = calcRadius > 0 ? calcRadius : 20;
    const dpr = window.devicePixelRatio || 1;
    const baseScore = Math.max(0, Math.min(1, (score - min) / (max - min)));
    const endAngle = baseScore * 2 * Math.PI;
    const startHalfAngle = Math.PI;
    const endHalfAngle = startHalfAngle + Math.PI;
    const halfBottomP = 10;

    // text position
    const textOffset = 10;
    const textStart = radius + lineDepth / 2;
    const textEnd = textOffset / 2;
    const textRadius = textStart + textEnd + textOffset;

    // donut size
    if (half) {
      canvas.width = size.size * dpr;
      canvas.height = (size.size / 2 + halfBottomP) * dpr;
      canvas.style.width = graphSize;
      canvas.style.height = `calc(${graphHalfSize} + ${halfBottomP / 16}rem)`;
      // ctx.lineCap = 'round';
    } else {
      canvas.width = size.size * dpr;
      canvas.height = size.size * dpr;
      canvas.style.width = graphSize;
      canvas.style.height = graphSize;
    }

    ctx.scale(dpr, dpr);

    // donut base
    ctx.clearRect(
      0,
      0,
      size.size,
      half ? size.size + halfBottomP / 2 : size.size
    );
    ctx.beginPath();
    half
      ? ctx.arc(centerX, centerY, radius, startHalfAngle, endHalfAngle)
      : ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = color[1];
    ctx.lineWidth = lineDepth;
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
      ctx.lineWidth = lineDepth;
      ctx.stroke(); // 게이지 채움
    }
    // ctx.strokeStyle = color[0];
    // ctx.lineWidth = 1;

    // tick 구간표시
    if (tick.show) {
      const tickLength = tick.show ? tick.length || 4 : 0;
      for (let i = half ? 0 : 1; i <= tickLength; i++) {
        const ratio = i / tickLength;
        const tickLabel = Math.round((i * (max - min)) / tickLength + min);
        const angle = half
          ? Math.PI + ratio * Math.PI
          : -Math.PI / 2 + ratio * (2 * Math.PI);

        const xStart = centerX + Math.cos(angle) * textStart;
        const yStart = centerY + Math.sin(angle) * textStart;
        const xEnd = centerX + Math.cos(angle) * (textStart + textEnd);
        const yEnd = centerY + Math.sin(angle) * (textStart + textEnd);

        const isActiveTick =
          score >= tickLabel && score < tickLabel + (max - min) / tickLength;
        // console.log(isActiveTick);

        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.stroke();

        const labelX = centerX + Math.cos(angle) * textRadius;
        const labelY = centerY + Math.sin(angle) * textRadius;
        if (tick.label) {
          ctx.fillStyle = '#888';
          ctx.font = '.7rem sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${tickLabel}`, labelX, labelY);
        }
      }
    }

    // active line 위치 (score 위치)
    const scoreRatio = (score - min) / (max - min);
    const angle = half
      ? Math.PI + scoreRatio * Math.PI
      : -Math.PI / 2 + scoreRatio * (2 * Math.PI);

    const gaugeStart = radius - lineDepth / 2;
    const gaugeEnd = gaugeStart + size.depth; // 눈금 길이 조정

    const gx1 = centerX + Math.cos(angle) * gaugeStart;
    const gy1 = centerY + Math.sin(angle) * gaugeStart;
    const gx2 = centerX + Math.cos(angle) * gaugeEnd;
    const gy2 = centerY + Math.sin(angle) * gaugeEnd;

    if (activeLine.show) {
      if (!disabled) {
        ctx.beginPath();
        ctx.moveTo(gx1, gy1);
        ctx.lineTo(gx2, gy2);
        ctx.strokeStyle = '#FF0048';
        ctx.lineWidth = 1;
        ctx.stroke();

        if (activeLine.label) {
          const labelX = centerX + Math.cos(angle) * textRadius;
          const labelY = centerY + Math.sin(angle) * textRadius;
          ctx.fillStyle = '#FF0048';
          ctx.font = '.8rem sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${score}${unit ? unit : ''}`, labelX - 5, labelY);
        }
      }
    }

    // my score padding값 조절해야함.
    if (myscore.score) {
      const myScoreRatio = (myscore.score - min) / (max - min);
      const myAngle = half
        ? Math.PI + myScoreRatio * Math.PI
        : -Math.PI / 2 + myScoreRatio * (2 * Math.PI);

      const myGaugeStart = radius - lineDepth / 2;
      const myGaugeEnd = gaugeStart + size.depth; // 눈금 길이 조정

      const my_gx1 = centerX + Math.cos(myAngle) * myGaugeStart;
      const my_gy1 = centerY + Math.sin(myAngle) * myGaugeStart;
      const my_gx2 = centerX + Math.cos(myAngle) * myGaugeEnd;
      const my_gy2 = centerY + Math.sin(myAngle) * myGaugeEnd;

      const markRadius = radius + lineDepth / 2 + textOffset * 1.5; // 도넛 바깥쪽에 표시
      const markX = centerX + Math.cos(myAngle) * markRadius;
      const markY = centerY + Math.sin(myAngle) * markRadius;
      if (!disabled) {
        ctx.beginPath();
        ctx.moveTo(my_gx1, my_gy1);
        ctx.lineTo(my_gx2, my_gy2);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.font = '.8rem sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`MY`, markX, markY); // ${myscore}
      }
    }

    if (mark) {
      const markScore = score;
      const textOffset = 15;
      const markAngle = half
        ? Math.PI + (Math.PI * (markScore - min)) / (max - min)
        : -Math.PI / 2 + (2 * Math.PI * (markScore - min)) / (max - min);

      // 점 위치 계산
      const markRadius = radius; // 도넛 바깥쪽에 표시
      const markStart = centerX + Math.cos(markAngle) * markRadius;
      const markEnd = centerY + Math.sin(markAngle) * markRadius;

      // 텍스트 그리기
      ctx.fillStyle = '#000';
      ctx.font = '.8rem sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${markScore}${unit}`, markStart, markEnd);
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
        flex flex-wrap justify-center text-center
        items-center z-[1]
        `}
      >
        <span className="leading-none">
          {myscore?.label && <b className="block mb-1">{myscore?.label}</b>}
          <b>
            {disabled ? '**' : myscore.score ? myscore.score : score}
            {unit}
          </b>
        </span>
        {!myscore.score && (
          <span className="leading-none">
            /{max}
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

