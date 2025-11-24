"use client";

import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import {
    MousePointer2, Square, Circle, Diamond, ArrowRight, Minus,
    Type, Pencil, Undo2, Redo2, Trash2,
    ZoomIn, ZoomOut, Hand, Menu, X, GripVertical, Grid3x3,
    LayoutGrid, Scan, Spline, Bold, Italic, Underline,
    AlignLeft, AlignCenter, AlignRight, Type as TypeIcon,
    MousePointer, Hash, Slash, Contrast
} from 'lucide-react';
import { useTheme } from 'next-themes';

// --- Constants & Utilities ---

const TOOLS = {
    SELECTION: 'selection',
    RECTANGLE: 'rectangle',
    DIAMOND: 'diamond',
    ELLIPSE: 'ellipse',
    ARROW: 'arrow',
    LINE: 'line',
    FREE_DRAW: 'freedraw',
    TEXT: 'text',
    PAN: 'pan'
};

const PALETTE = {
    stroke: ['neutral', '#000000', '#343a40', '#495057', '#c92a2a', '#a61e4d', '#862e9c', '#5f3dc4', '#364fc7', '#1864ab', '#0b7285', '#087f5b', '#2b8a3e', '#5c940d', '#e67700', '#d9480f'],
    background: ['transparent', 'neutral', '#ffffff', '#f8f9fa', '#ced4da', '#ffc9c9', '#fcc2d7', '#eebefa', '#d0bfff', '#bac8ff', '#a5d8ff', '#99e9f2', '#66d9e8', '#8ce99a', '#b2f2bb', '#d8f5a2', '#ffec99', '#ffc078']
};

const FONT_FAMILIES = {
    1: '"Caveat", cursive',     // Hand-drawn
    2: 'sans-serif',            // Normal
    3: 'monospace'              // Code
};

const DEFAULT_THEME_COLORS = {
    light: {
        background: '#ffffff',
        foreground: '#0f172a',
        card: '#ffffff',
        border: '#e4e4e7',
        muted: '#f4f4f5',
        accent: '#f8fafc',
        primary: '#0f172a',
    },
    dark: {
        background: '#0b0f17',
        foreground: '#f8fafc',
        card: '#18181b',
        border: '#3f3f46',
        muted: '#27272a',
        accent: '#1f1f23',
        primary: '#f8fafc',
    },
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const resolveColor = (color, themeColors) => {
    if (color === 'transparent') {
        return 'transparent';
    }
    if (color === 'neutral' || !color) {
        return themeColors.foreground;
    }
    return color;
};

// --- Geometry Helpers for Binding ---

const getNormalizedBox = (element) => {
    const x = element.width < 0 ? element.x + element.width : element.x;
    const y = element.height < 0 ? element.y + element.height : element.y;
    const w = Math.abs(element.width);
    const h = Math.abs(element.height);
    return { x, y, w, h };
};

const getElementBounds = (element) => {
    const { x, y, w, h } = getNormalizedBox(element);
    return { x1: x, y1: y, x2: x + w, y2: y + h, cx: x + w / 2, cy: y + h / 2 };
};

// Simplified AABB Intersection (finds where line segment from p1 to p2 hits the boundary of a box)
const getIntersection = (p1, p2, bounds) => {
    const { x1, y1, x2, y2 } = bounds;

    // Line intersection function
    const lineIntersect = (l1, l2) => {
        const det = (l1.end.x - l1.start.x) * (l2.end.y - l2.start.y) - (l2.end.x - l2.start.x) * (l1.end.y - l1.start.y);
        if (det === 0) return null;

        const t = ((l2.start.x - l1.start.x) * (l2.end.y - l2.start.y) - (l2.start.y - l1.start.y) * (l2.end.x - l2.start.x)) / det;
        const u = ((l2.start.x - l1.start.x) * (l1.end.y - l1.start.y) - (l2.start.y - l1.start.y) * (l1.end.x - l1.start.x)) / det;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: l1.start.x + t * (l1.end.x - l1.start.x),
                y: l1.start.y + t * (l1.end.y - l1.start.y),
            };
        }
        return null;
    };

    // Define the bounding box edges
    const lines = [
        [{ x: x1, y: y1 }, { x: x2, y: y1 }], // Top
        [{ x: x2, y: y1 }, { x: x2, y: y2 }], // Right
        [{ x: x2, y: y2 }, { x: x1, y: y2 }], // Bottom
        [{ x: x1, y: y2 }, { x: x1, y: y1 }], // Left
    ];

    const lineSegment = { start: p1, end: p2 };
    const intersections = lines.map(l => lineIntersect(lineSegment, { start: l[0], end: l[1] })).filter(i => i !== null);

    // Find the intersection closest to p2 (the target end of the arrow)
    if (intersections.length === 0) return null;

    const closest = intersections.reduce((min, current) => {
        const distSq = (p, x, y) => Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2);
        const distCurrent = distSq(p2, current.x, current.y);
        const distMin = min ? distSq(p2, min.x, min.y) : Infinity;
        return distCurrent < distMin ? current : min;
    }, null);

    return closest;
};

// Calculates the actual point on the bound shape's boundary where the arrow should stop.
const getBoundPoint = (arrowElement, boundElement, isStart) => {
    if (!boundElement) return null;

    // The 'other' end of the arrow is the point from which the binding line is calculated.
    let otherX, otherY;
    if (isStart) {
        otherX = arrowElement.x + arrowElement.width;
        otherY = arrowElement.y + arrowElement.height;
    } else {
        otherX = arrowElement.x;
        otherY = arrowElement.y;
    }

    const boundBounds = getElementBounds(boundElement);
    const center = { x: boundBounds.cx, y: boundBounds.cy };

    // Use the center of the bound shape as the starting point for the ray trace to find the intersection.
    const intersection = getIntersection(center, { x: otherX, y: otherY }, boundBounds);

    return intersection;
};

// --- Randomness & Geometry Helpers ---

const createPRNG = (seed) => {
    let state = seed || 1;
    return () => {
        state = (state * 16807) % 2147483647;
        return (state - 1) / 2147483646;
    };
};

const getResizeHandles = (element) => {
    const { x, y, w, h } = getNormalizedBox(element);
    return [
        { type: 'nw', x, y, cursor: 'nwse-resize' },
        { type: 'n', x: x + w / 2, y, cursor: 'ns-resize' },
        { type: 'ne', x: x + w, y, cursor: 'nesw-resize' },
        { type: 'e', x: x + w, y: y + h / 2, cursor: 'ew-resize' },
        { type: 'se', x: x + w, y: y + h, cursor: 'nwse-resize' },
        { type: 's', x: x + w / 2, y: y + h, cursor: 'ns-resize' },
        { type: 'sw', x, y: y + h, cursor: 'nesw-resize' },
        { type: 'w', x, y: y + h / 2, cursor: 'ew-resize' }
    ];
};

// --- Text Wrapping Helper ---
const getWrappedLines = (ctx, text, maxWidth) => {
    if (!text) return [];

    const paragraphs = text.split('\n');
    const wrappedLines = [];

    paragraphs.forEach(paragraph => {
        if (paragraph === '') {
            wrappedLines.push('');
            return;
        }

        const words = paragraph.split(' ');
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                wrappedLines.push(currentLine);
                currentLine = word;
            }
        }
        wrappedLines.push(currentLine);
    });

    return wrappedLines;
};

// --- Drawing Functions ---

const drawRoughLine = (ctx, x1, y1, x2, y2, color, width, roughness, roundness, prng) => {
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    if (length < 1) return;
    const randomize = () => (prng() - 0.5) * roughness * 2;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (roundness === 'round') {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const cpX = midX - dy * 0.2;
        const cpY = midY + dx * 0.2;

        ctx.moveTo(x1 + randomize(), y1 + randomize());
        ctx.quadraticCurveTo(cpX + randomize(), cpY + randomize(), x2 + randomize(), y2 + randomize());
        if (roughness > 0) {
            ctx.moveTo(x1 + randomize(), y1 + randomize());
            ctx.quadraticCurveTo(cpX + randomize(), cpY + randomize(), x2 + randomize(), y2 + randomize());
        }
    } else {
        ctx.moveTo(x1 + randomize(), y1 + randomize());
        ctx.lineTo(x2 + randomize(), y2 + randomize());
        if (roughness > 0) {
            ctx.moveTo(x1 + randomize(), y1 + randomize());
            ctx.lineTo(x2 + randomize(), y2 + randomize());
        }
    }
    ctx.stroke();
};

const drawRoughFill = (ctx, element, themeColors, prng) => {
    if (element.fill === 'transparent') return;

    const fill = resolveColor(element.fill, themeColors);
    const { x, y, w, h } = getNormalizedBox(element);

    ctx.beginPath();
    if (element.type === TOOLS.RECTANGLE) {
        if (element.roundness === 'round') {
            const radius = Math.min(w, h) * 0.2;
            ctx.roundRect(x, y, w, h, radius);
        } else {
            ctx.rect(x, y, w, h);
        }
    } else if (element.type === TOOLS.ELLIPSE) {
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
    } else if (element.type === TOOLS.DIAMOND) {
        if (element.roundness === 'round') {
            const top = { x: x + w / 2, y: y };
            const right = { x: x + w, y: y + h / 2 };
            const bottom = { x: x + w / 2, y: y + h };
            const left = { x: x, y: y + h / 2 };
            const cornerRadius = Math.min(w, h) * 0.1;
            const getLinePoint = (p1, p2, distFromP1) => {
                const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                return { x: p1.x + distFromP1 * Math.cos(angle), y: p1.y + distFromP1 * Math.sin(angle) };
            };
            const t1 = getLinePoint(top, left, cornerRadius);
            const t2 = getLinePoint(top, right, cornerRadius);
            const r1 = getLinePoint(right, top, cornerRadius);
            const r2 = getLinePoint(right, bottom, cornerRadius);
            const b1 = getLinePoint(bottom, right, cornerRadius);
            const b2 = getLinePoint(bottom, left, cornerRadius);
            const l1 = getLinePoint(left, bottom, cornerRadius);
            const l2 = getLinePoint(left, top, cornerRadius);

            ctx.moveTo(t2.x, t2.y);
            ctx.lineTo(r1.x, r1.y);
            ctx.quadraticCurveTo(right.x, right.y, r2.x, r2.y);
            ctx.lineTo(b1.x, b1.y);
            ctx.quadraticCurveTo(bottom.x, bottom.y, b2.x, b2.y);
            ctx.lineTo(l1.x, l1.y);
            ctx.quadraticCurveTo(left.x, left.y, l2.x, l2.y);
            ctx.lineTo(t1.x, t1.y);
            ctx.quadraticCurveTo(top.x, top.y, t2.x, t2.y);
        } else {
            ctx.moveTo(x + w / 2, y);
            ctx.lineTo(x + w, y + h / 2);
            ctx.lineTo(x + w / 2, y + h);
            ctx.lineTo(x, y + h / 2);
        }
        ctx.closePath();
    } else {
        return;
    }

    if (element.fillStyle === 'solid') {
        ctx.fillStyle = fill;
        ctx.fill();
    } else if (element.fillStyle === 'hachure' || element.fillStyle === 'cross-hatch') {
        ctx.save();
        ctx.clip();
        const gap = 8;
        const diagonal = Math.sqrt(w * w + h * h);
        const extended = Math.max(w, h, diagonal);

        for (let i = -extended; i < extended * 2; i += gap) {
            const x1 = x + i;
            drawRoughLine(ctx, x1, y - extended, x1 - h, y + extended * 2, fill, 1, 1, 'sharp', prng);
        }
        if (element.fillStyle === 'cross-hatch') {
            for (let i = -extended; i < extended * 2; i += gap) {
                const x1 = x + i;
                drawRoughLine(ctx, x1, y - extended, x1 + h, y + extended * 2, fill, 1, 1, 'sharp', prng);
            }
        }
        ctx.restore();
    }
};

const drawRoughEllipse = (ctx, x, y, w, h, stroke, fill, width, roughness, prng) => {
    const randomize = () => (prng() - 0.5) * roughness * 2;
    const rx = w / 2;
    const ry = h / 2;
    const cx = x + rx;
    const cy = y + ry;
    const k = 0.55228;

    ctx.beginPath();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;

    for (let i = 0; i < 2; i++) {
        const oRx = rx;
        const oRy = ry;
        const ox = (val) => val + randomize();
        const oy = (val) => val + randomize();
        ctx.moveTo(ox(cx + oRx), oy(cy));
        ctx.bezierCurveTo(ox(cx + oRx), oy(cy + k * oRy), ox(cx + k * oRx), oy(cy + oRy), ox(cx), oy(cy + oRy));
        ctx.bezierCurveTo(ox(cx - k * oRx), oy(cy + oRy), ox(cx - oRx), oy(cy + k * oRy), ox(cx - oRx), oy(cy));
        ctx.bezierCurveTo(ox(cx - oRx), oy(cy - k * oRy), ox(cx - k * oRx), oy(cy - oRy), ox(cx), oy(cy - oRy));
        ctx.bezierCurveTo(ox(cx + k * oRx), oy(cy - oRy), ox(cx + oRx), oy(cy - k * oRy), ox(cx + oRx), oy(cy));
        if (roughness === 0) break;
    }
    ctx.stroke();
};

const drawRoughRect = (ctx, x, y, w, h, stroke, fill, width, roughness, roundness, prng) => {
    if (roundness === 'round') {
        const radius = Math.min(Math.abs(w), Math.abs(h)) * 0.2;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 0; i < 2; i++) {
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(x, y, w, h, radius);
            else ctx.rect(x, y, w, h);
            ctx.stroke();
            if (roughness === 0) break;
        }
    } else {
        drawRoughLine(ctx, x, y, x + w, y, stroke, width, roughness, 'sharp', prng);
        drawRoughLine(ctx, x + w, y, x + w, y + h, stroke, width, roughness, 'sharp', prng);
        drawRoughLine(ctx, x + w, y + h, x, y + h, stroke, width, roughness, 'sharp', prng);
        drawRoughLine(ctx, x, y + h, x, y, stroke, width, roughness, 'sharp', prng);
    }
};

const drawRoughDiamond = (ctx, element, resolvedStroke, prng) => {
    const { x, y, w, h } = getNormalizedBox(element);
    const { strokeWidth: width, roughness, roundness } = element;
    const stroke = resolvedStroke;
    const top = { x: x + w / 2, y: y };
    const right = { x: x + w, y: y + h / 2 };
    const bottom = { x: x + w / 2, y: y + h };
    const left = { x: x, y: y + h / 2 };
    const randomize = () => (prng() - 0.5) * roughness * 2;

    if (roundness === 'round') {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const cornerRadius = Math.min(w, h) * 0.1;
        const getLinePoint = (p1, p2, distFromP1) => {
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            return { x: p1.x + distFromP1 * Math.cos(angle), y: p1.y + distFromP1 * Math.sin(angle) };
        };
        for (let i = 0; i < 2; i++) {
            const t1 = getLinePoint(top, left, cornerRadius);
            const t2 = getLinePoint(top, right, cornerRadius);
            const r1 = getLinePoint(right, top, cornerRadius);
            const r2 = getLinePoint(right, bottom, cornerRadius);
            const b1 = getLinePoint(bottom, right, cornerRadius);
            const b2 = getLinePoint(bottom, left, cornerRadius);
            const l1 = getLinePoint(left, bottom, cornerRadius);
            const l2 = getLinePoint(left, top, cornerRadius);

            ctx.beginPath();
            ctx.moveTo(t2.x + randomize(), t2.y + randomize());
            ctx.lineTo(r1.x + randomize(), r1.y + randomize());
            ctx.quadraticCurveTo(right.x + randomize(), right.y + randomize(), r2.x + randomize(), r2.y + randomize());
            ctx.lineTo(b1.x + randomize(), b1.y + randomize());
            ctx.quadraticCurveTo(bottom.x + randomize(), bottom.y + randomize(), b2.x + randomize(), b2.y + randomize());
            ctx.lineTo(l1.x + randomize(), l1.y + randomize());
            ctx.quadraticCurveTo(left.x + randomize(), left.y + randomize(), l2.x + randomize(), l2.y + randomize());
            ctx.lineTo(t1.x + randomize(), t1.y + randomize());
            ctx.quadraticCurveTo(top.x + randomize(), top.y + randomize(), t2.x + randomize(), t2.y + randomize());
            ctx.stroke();
            if (roughness === 0) break;
        }
    } else {
        drawRoughLine(ctx, top.x, top.y, right.x, right.y, stroke, width, roughness, 'sharp', prng);
        drawRoughLine(ctx, right.x, right.y, bottom.x, bottom.y, stroke, width, roughness, 'sharp', prng);
        drawRoughLine(ctx, bottom.x, bottom.y, left.x, left.y, stroke, width, roughness, 'sharp', prng);
        drawRoughLine(ctx, left.x, left.y, top.x, top.y, stroke, width, roughness, 'sharp', prng);
    }
};

const drawArrowHead = (ctx, x1, y1, x2, y2, color, width, roughness, roundness, prng) => {
    let angle;
    if (roundness === 'round') {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const cpX = midX - dy * 0.2;
        const cpY = midY + dx * 0.2;
        angle = Math.atan2(y2 - cpY, x2 - cpX);
    } else {
        angle = Math.atan2(y2 - y1, x2 - x1);
    }
    const headLength = 20;
    const px1 = x2 - headLength * Math.cos(angle - Math.PI / 6);
    const py1 = y2 - headLength * Math.sin(angle - Math.PI / 6);
    const px2 = x2 - headLength * Math.cos(angle + Math.PI / 6);
    const py2 = y2 - headLength * Math.sin(angle + Math.PI / 6);
    drawRoughLine(ctx, x2, y2, px1, py1, color, width, roughness, 'sharp', prng);
    drawRoughLine(ctx, x2, y2, px2, py2, color, width, roughness, 'sharp', prng);
};

const drawGrid = (ctx, width, height, scale, pan, type, isDark, themeColors) => {
    if (type === 'none') return;
    ctx.save();
    const strokeColor = themeColors.border || (isDark ? '#333' : '#e5e7eb');
    const fillColor = themeColors.muted || (isDark ? '#444' : '#cbd5e1');
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.lineWidth = 1 / scale;
    const gridSize = 20;
    const startX = Math.floor(-pan.x / scale / gridSize) * gridSize;
    const startY = Math.floor(-pan.y / scale / gridSize) * gridSize;
    const endX = startX + width / scale + gridSize;
    const endY = startY + height / scale + gridSize;
    if (type === 'line') {
        ctx.beginPath();
        for (let x = startX; x < endX; x += gridSize) { ctx.moveTo(x, startY); ctx.lineTo(x, endY); }
        for (let y = startY; y < endY; y += gridSize) { ctx.moveTo(startX, y); ctx.lineTo(endX, y); }
        ctx.stroke();
    } else if (type === 'dot') {
        const dotSize = 2 / scale;
        for (let x = startX; x < endX; x += gridSize) {
            for (let y = startY; y < endY; y += gridSize) {
                ctx.fillRect(x - dotSize / 2, y - dotSize / 2, dotSize, dotSize);
            }
        }
    }
    ctx.restore();
}

const drawElementText = (ctx, element, themeColors) => {
    if (!element.text) return;
    const { x, y, w, h } = getNormalizedBox(element);
    const cx = x + w / 2;
    const PADDING = 10;

    ctx.save();
    ctx.font = `${element.fontStyle || 'normal'} ${element.fontWeight || 'normal'} ${element.fontSize || 24}px ${FONT_FAMILIES[element.fontFamily || 1]}`;
    ctx.fillStyle = resolveColor(element.stroke, themeColors);
    ctx.textAlign = element.textAlign || 'center';
    ctx.textBaseline = 'top';

    let lines = [];
    if (element.type === TOOLS.TEXT) {
        lines = element.text.split('\n');
    } else {
        lines = getWrappedLines(ctx, element.text, Math.max(w - PADDING * 2, 0));
    }

    const lineHeight = (element.fontSize || 24) * 1.2;

    let startY;
    if (element.type === TOOLS.TEXT) {
        startY = y;
    } else {
        startY = y + PADDING;
    }

    let drawX;
    if (element.type === TOOLS.TEXT) {
        if (element.textAlign === 'left' || !element.textAlign) drawX = x;
        else if (element.textAlign === 'right') drawX = x + w;
        else drawX = x + w / 2;
    } else {
        if (element.textAlign === 'left' || !element.textAlign) drawX = x + PADDING;
        else if (element.textAlign === 'right') drawX = x + w - PADDING;
        else drawX = cx;
    }

    lines.forEach((line, i) => {
        ctx.fillText(line, drawX, startY + i * lineHeight);

        if (element.textDecoration === 'underline') {
            const metrics = ctx.measureText(line);
            const lw = metrics.width;
            const ly = startY + i * lineHeight + lineHeight * 0.9;
            ctx.beginPath();
            ctx.lineWidth = 1;

            let lineStartX, lineEndX;
            if (ctx.textAlign === 'center') { lineStartX = drawX - lw / 2; lineEndX = drawX + lw / 2; }
            else if (ctx.textAlign === 'right') { lineStartX = drawX - lw; lineEndX = drawX; }
            else { lineStartX = drawX; lineEndX = drawX + lw; }

            ctx.moveTo(lineStartX, ly);
            ctx.lineTo(lineEndX, ly);
            ctx.stroke();
        }
    });
    ctx.restore();
};

// --- Main Application ---

export default function ExcalidrawClone() {
    const canvasRef = useRef(null);
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = useMemo(() => {
        if (resolvedTheme) return resolvedTheme;
        if (theme === 'dark' || theme === 'light') return theme;
        if (typeof document !== 'undefined') {
            return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        }
        return 'light';
    }, [theme, resolvedTheme]);
    const isDarkMode = currentTheme === 'dark';
    const [themeColors, setThemeColors] = useState(() => DEFAULT_THEME_COLORS[isDarkMode ? 'dark' : 'light']);
    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([[]]);
    const [historyStep, setHistoryStep] = useState(0);

    const [action, setAction] = useState('none');
    const [tool, setTool] = useState(TOOLS.SELECTION);
    const [selectedElement, setSelectedElement] = useState(null);
    const [resizeHandle, setResizeHandle] = useState(null);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const elementSnapshot = useRef(null);
    const [scale, setScale] = useState(1);
    const [isSpacePressed, setIsSpacePressed] = useState(false);
    const [gridType, setGridType] = useState('none');
    const [hideSystemCursor, setHideSystemCursor] = useState(false);
    const [hoverCursor, setHoverCursor] = useState(null);

    // Styling State
    const [strokeColor, setStrokeColor] = useState('neutral');
    const [backgroundColor, setBackgroundColor] = useState('transparent');
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [roughness, setRoughness] = useState(1);
    const [roundness, setRoundness] = useState('sharp');
    const [fillStyle, setFillStyle] = useState('hachure');

    // Typography State
    const [fontSize, setFontSize] = useState(24);
    const [fontFamily, setFontFamily] = useState(1);
    const [textAlign, setTextAlign] = useState('center');
    const [fontWeight, setFontWeight] = useState('normal');
    const [fontStyle, setFontStyle] = useState('normal');
    const [textDecoration, setTextDecoration] = useState('none');

    const cursorStyle = useMemo(() => {
        if (hideSystemCursor) return 'none';
        if (hoverCursor) return hoverCursor;
        if (tool === TOOLS.PAN || isSpacePressed) return 'grab';
        if (tool === TOOLS.SELECTION) return 'default';
        return 'crosshair';
    }, [tool, isSpacePressed, hideSystemCursor, hoverCursor]);

    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Virgil&family=Inter:wght@400;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    useEffect(() => {
        const mode = isDarkMode ? 'dark' : 'light';
        console.log("Mode: ", mode)
        if (typeof window === 'undefined') {
            setThemeColors(DEFAULT_THEME_COLORS[mode]);
            return;
        }

        const styles = getComputedStyle(document.documentElement);
        const readColor = (variable, fallback) => {
            const value = styles.getPropertyValue(variable)?.trim();
            return value ? `hsl(${value})` : fallback;
        };

        setThemeColors({
            background: readColor('--background', DEFAULT_THEME_COLORS[mode].background),
            foreground: readColor('--foreground', DEFAULT_THEME_COLORS[mode].foreground),
            card: readColor('--card', DEFAULT_THEME_COLORS[mode].card),
            border: readColor('--border', DEFAULT_THEME_COLORS[mode].border),
            muted: readColor('--muted', DEFAULT_THEME_COLORS[mode].muted),
            accent: readColor('--accent', DEFAULT_THEME_COLORS[mode].accent),
            primary: readColor('--primary', DEFAULT_THEME_COLORS[mode].primary),
        });
    }, [isDarkMode]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'TEXTAREA') {
                if (e.key === 'Escape') finishWriting();
                return;
            }

            if (e.code === 'Space') setIsSpacePressed(true);
            else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
                if (e.shiftKey) redo(); else undo();
            } else if (e.key === 'y' && (e.ctrlKey || e.metaKey)) redo();
            else if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedElement && action !== 'writing') {
                    const newElements = elements.filter(el => el.id !== selectedElement.id);
                    updateElements(newElements);
                    setSelectedElement(null);
                }
            } else if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(e.key) && action !== 'writing') {
                const toolMap = [null, TOOLS.SELECTION, TOOLS.RECTANGLE, TOOLS.DIAMOND, TOOLS.ELLIPSE, TOOLS.ARROW, TOOLS.LINE, TOOLS.FREE_DRAW, TOOLS.TEXT];
                setTool(toolMap[parseInt(e.key)]);
            }
        };
        const handleKeyUp = (e) => { if (e.code === 'Space') setIsSpacePressed(false); };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [elements, historyStep, selectedElement, action]);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = themeColors.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(panOffset.x, panOffset.y);
        ctx.scale(scale, scale);

        drawGrid(ctx, canvas.width, canvas.height, scale, panOffset, gridType, isDarkMode, themeColors);

        elements.forEach(element => {
            if (selectedElement?.id === element.id && action !== 'writing') {
                ctx.save();
                ctx.strokeStyle = themeColors.primary;
                ctx.lineWidth = 1 / scale;
                const padding = 4;
                const { x, y, w, h } = getNormalizedBox(element);

                // Draw Dashed Selection Box
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(x - padding, y - padding, w + padding * 2, h + padding * 2);
                ctx.setLineDash([]);

                // Draw 8 Handles
                const handleSize = 8 / scale;
                const handles = getResizeHandles(element);
                ctx.fillStyle = themeColors.card;
                ctx.strokeStyle = themeColors.primary;
                handles.forEach(handle => {
                    ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
                    ctx.strokeRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
                });

                ctx.restore();
            }

            // Use a stable PRNG seeded by the element's ID
            const seed = element.seed || 1;
            const fillPrng = createPRNG(seed);
            const strokePrng = createPRNG(seed + 1);

            drawRoughFill(ctx, element, themeColors, fillPrng);
            const stroke = resolveColor(element.stroke, themeColors);

            // Common points for Lines/Arrows (adjusted for binding)
            let finalX1 = element.x;
            let finalY1 = element.y;
            let finalX2 = element.x + element.width;
            let finalY2 = element.y + element.height;

            if (element.type === TOOLS.ARROW || element.type === TOOLS.LINE) {
                const startBound = element.startBindingId ? elements.find(el => el.id === element.startBindingId) : null;
                const endBound = element.endBindingId ? elements.find(el => el.id === element.endBindingId) : null;

                const boundStartPoint = getBoundPoint(element, startBound, true);
                const boundEndPoint = getBoundPoint(element, endBound, false);

                if (boundStartPoint) { finalX1 = boundStartPoint.x; finalY1 = boundStartPoint.y; }
                if (boundEndPoint) { finalX2 = boundEndPoint.x; finalY2 = boundEndPoint.y; }
            }

            switch (element.type) {
                case TOOLS.RECTANGLE: drawRoughRect(ctx, element.x, element.y, element.width, element.height, stroke, element.fill, element.strokeWidth, element.roughness, element.roundness, strokePrng); break;
                case TOOLS.DIAMOND: drawRoughDiamond(ctx, element, stroke, strokePrng); break;
                case TOOLS.ELLIPSE: drawRoughEllipse(ctx, element.x, element.y, element.width, element.height, stroke, element.fill, element.strokeWidth, element.roughness, strokePrng); break;
                case TOOLS.LINE:
                    drawRoughLine(ctx, finalX1, finalY1, finalX2, finalY2, stroke, element.strokeWidth, element.roughness, element.roundness, strokePrng);
                    break;
                case TOOLS.ARROW:
                    drawRoughLine(ctx, finalX1, finalY1, finalX2, finalY2, stroke, element.strokeWidth, element.roughness, element.roundness, strokePrng);
                    drawArrowHead(ctx, finalX1, finalY1, finalX2, finalY2, stroke, element.strokeWidth, element.roughness, element.roundness, strokePrng);
                    break;
                case TOOLS.FREE_DRAW:
                    if (element.points && element.points.length > 0) {
                        ctx.beginPath(); ctx.strokeStyle = stroke; ctx.lineWidth = element.strokeWidth;
                        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                        ctx.moveTo(element.points[0].x, element.points[0].y);
                        element.points.forEach(p => ctx.lineTo(p.x, p.y));
                        ctx.stroke();
                    }
                    break;
            }
            if (!(action === 'writing' && selectedElement?.id === element.id)) {
                drawElementText(ctx, element, themeColors);
            }
        });
        ctx.restore();
    }, [elements, panOffset, scale, selectedElement, gridType, isDarkMode, action, themeColors]);

    const updateElements = (newElements, saveHistory = true) => {
        setElements(newElements);
        if (saveHistory) {
            const newHistory = history.slice(0, historyStep + 1);
            newHistory.push(newElements);
            setHistory(newHistory);
            setHistoryStep(newHistory.length - 1);
        }
    };

    const undo = () => { if (historyStep > 0) { setHistoryStep(p => p - 1); setElements(history[historyStep - 1]); setSelectedElement(null); } };
    const redo = () => { if (historyStep < history.length - 1) { setHistoryStep(p => p + 1); setElements(history[historyStep + 1]); setSelectedElement(null); } };

    const getMousePos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return { x: (e.clientX - rect.left - panOffset.x) / scale, y: (e.clientY - rect.top - panOffset.y) / scale };
    };

    const isWithinElement = (x, y, element) => {
        if (element.type === TOOLS.FREE_DRAW) return element.points.some(p => Math.abs(p.x - x) < 10 && Math.abs(p.y - y) < 10);
        if (element.type === TOOLS.ARROW || element.type === TOOLS.LINE) {
            // Simple bounding box check for arrows/lines
            const { x: ex, y: ey, w, h } = getNormalizedBox(element);
            return x >= ex - 5 && x <= ex + w + 5 && y >= ey - 5 && y <= ey + h + 5;
        }
        const { x: ex, y: ey, w, h } = getNormalizedBox(element);
        return x >= ex && x <= ex + w && y >= ey && y <= ey + h;
    };

    const getElementAtPosition = (x, y) => {
        for (let i = elements.length - 1; i >= 0; i--) { if (isWithinElement(x, y, elements[i])) return elements[i]; }
        return null;
    };

    const SNAP_DISTANCE = 20;
    const snapPointToShape = (x, y, ignoreId) => {
        for (const element of elements) {
            if (element.id === ignoreId || element.type === TOOLS.ARROW || element.type === TOOLS.LINE || element.type === TOOLS.FREE_DRAW || element.type === TOOLS.TEXT) continue;

            const bounds = getElementBounds(element);

            // Check proximity to perimeter (simplified check)
            const { x: ex, y: ey, w, h } = getNormalizedBox(element);
            if (x >= ex - SNAP_DISTANCE && x <= ex + w + SNAP_DISTANCE &&
                y >= ey - SNAP_DISTANCE && y <= ey + h + SNAP_DISTANCE) {

                // Check proximity to corners (to prevent snapping to distant huge boxes)
                const corners = [
                    { x: ex, y: ey }, { x: ex + w, y: ey },
                    { x: ex, y: ey + h }, { x: ex + w, y: ey + h }
                ];
                const distSq = (p1, p2) => Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
                const isNearCorner = corners.some(c => distSq(c, { x, y }) < SNAP_DISTANCE * SNAP_DISTANCE);

                if (isNearCorner) return element.id;
            }
        }
        return null;
    };

    const handleMouseDown = (e) => {
        if (action === 'writing') return;
        const { x, y } = getMousePos(e);
        setStartPos({ x, y });

        if (isSpacePressed || e.button === 1 || tool === TOOLS.PAN) { setAction('panning'); return; }

        if (tool === TOOLS.SELECTION) {
            // Check handles first
            if (selectedElement) {
                const handles = getResizeHandles(selectedElement);
                const handleSize = 10 / scale;
                for (const handle of handles) {
                    if (Math.abs(x - handle.x) < handleSize && Math.abs(y - handle.y) < handleSize) {
                        setAction('resizing');
                        setResizeHandle(handle.type);
                        elementSnapshot.current = { ...selectedElement };
                        return;
                    }
                }
            }

            const element = getElementAtPosition(x, y);
            if (element) {
                setSelectedElement(element);
                elementSnapshot.current = { ...element };
                // Sync properties
                setStrokeColor(element.stroke); setBackgroundColor(element.fill);
                setStrokeWidth(element.strokeWidth); setRoughness(element.roughness);
                setRoundness(element.roundness || 'sharp'); setFillStyle(element.fillStyle || 'hachure');
                setFontSize(element.fontSize || 24); setFontFamily(element.fontFamily || 1);
                setTextAlign(element.textAlign || 'center'); setFontWeight(element.fontWeight || 'normal');
                setFontStyle(element.fontStyle || 'normal'); setTextDecoration(element.textDecoration || 'none');
                setAction('moving');
            } else {
                setSelectedElement(null);
                setAction('none');
            }
        } else {
            const id = generateId();
            let newElement = {
                id, type: tool, x, y, width: 0, height: 0,
                stroke: strokeColor, fill: backgroundColor, strokeWidth, roughness, roundness, fillStyle,
                text: '', fontSize, fontFamily, textAlign, fontWeight, fontStyle, textDecoration,
                seed: Math.floor(Math.random() * 2147483647),
                startBindingId: null, endBindingId: null // Binding properties
            };

            if (tool === TOOLS.TEXT) {
                e.preventDefault();
                setAction('writing');
                setSelectedElement(newElement);
                setTimeout(() => { document.getElementById('text-input-editor')?.focus(); }, 50);
            } else if (tool === TOOLS.FREE_DRAW) {
                newElement.points = [{ x, y }];
                setAction('drawing');
            } else {
                setAction('drawing');
            }
            setElements(prev => [...prev, newElement]);
            if (tool !== TOOLS.TEXT) setSelectedElement(newElement);
        }
    };

    const handleDoubleClick = (e) => {
        const { x, y } = getMousePos(e);
        const element = getElementAtPosition(x, y);
        if (element && tool === TOOLS.SELECTION) {
            setSelectedElement(element);
            setAction('writing');
            setFontSize(element.fontSize || 24);
            setFontFamily(element.fontFamily || 1);
            setTimeout(() => {
                const ta = document.getElementById('text-input-editor');
                if (ta) ta.focus();
            }, 10);
        }
    };

    const handleMouseMove = (e) => {
        const { x, y } = getMousePos(e);

        // Cursor updates
        if (tool === TOOLS.SELECTION) {
            let cursor = 'default';
            if (selectedElement) {
                const handles = getResizeHandles(selectedElement);
                const handleSize = 10 / scale;
                for (const handle of handles) {
                    if (Math.abs(x - handle.x) < handleSize && Math.abs(y - handle.y) < handleSize) {
                        cursor = handle.cursor;
                        break;
                    }
                }
            }
            setHoverCursor(cursor);
        }

        if (action === 'panning') { setPanOffset(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY })); return; }

        if (action === 'drawing') {
            const index = elements.length - 1;
            const element = elements[index];
            const updatedElement = { ...element };

            if (tool === TOOLS.FREE_DRAW) updatedElement.points = [...element.points, { x, y }];
            else { updatedElement.width = x - element.x; updatedElement.height = y - element.y; }

            const newElements = [...elements]; newElements[index] = updatedElement;
            setElements(newElements);
            if (tool !== TOOLS.TEXT) setSelectedElement(updatedElement);

        } else if (action === 'moving' && selectedElement && elementSnapshot.current) {
            const index = elements.findIndex(el => el.id === selectedElement.id);
            if (index === -1) return;
            const dx = x - startPos.x;
            const dy = y - startPos.y;

            const elementsToUpdate = new Set([selectedElement.id]);
            const boundElements = elements.filter(el =>
                (el.type === TOOLS.ARROW || el.type === TOOLS.LINE) &&
                (el.startBindingId === selectedElement.id || el.endBindingId === selectedElement.id)
            );
            boundElements.forEach(el => elementsToUpdate.add(el.id));

            const newElements = elements.map(el => {
                if (!elementsToUpdate.has(el.id)) return el;

                if (el.id === selectedElement.id) {
                    const elStart = elementSnapshot.current;
                    let newEl = { ...elStart, x: elStart.x + dx, y: elStart.y + dy };
                    if (elStart.type === TOOLS.FREE_DRAW) {
                        newEl.points = elStart.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
                    }
                    return newEl;
                } else if (el.type === TOOLS.ARROW || el.type === TOOLS.LINE) {
                    const isStartBound = el.startBindingId === selectedElement.id;
                    const isEndBound = el.endBindingId === selectedElement.id;

                    if (isStartBound || isEndBound) {
                        let updatedArrow = { ...el };
                        const originalStartX = el.x;
                        const originalStartY = el.y;
                        const originalEndX = el.x + el.width;
                        const originalEndY = el.y + el.height;

                        // Find the newly moved shape
                        const newShape = newElements.find(ne => ne.id === selectedElement.id);

                        // Case: Start is bound (and maybe end is too)
                        if (isStartBound) {
                            const anchorX = originalEndX;
                            const anchorY = originalEndY;

                            const newBoundPoint = getBoundPoint(el, newShape, true) || { x: originalStartX, y: originalStartY };

                            updatedArrow.x = newBoundPoint.x;
                            updatedArrow.y = newBoundPoint.y;
                            updatedArrow.width = anchorX - newBoundPoint.x;
                            updatedArrow.height = anchorY - newBoundPoint.y;
                        }

                        // Case: End is bound (and start is unbound, or both are bound)
                        if (isEndBound) {
                            const anchorX = originalStartX;
                            const anchorY = originalStartY;

                            const newBoundPoint = getBoundPoint(el, newShape, false) || { x: originalEndX, y: originalEndY };

                            // If start is *not* bound, the arrow's (x,y) remains the anchor point.
                            if (!isStartBound) {
                                updatedArrow.x = anchorX;
                                updatedArrow.y = anchorY;
                            }

                            // Arrow's (width, height) is relative to its (x,y)
                            updatedArrow.width = newBoundPoint.x - updatedArrow.x;
                            updatedArrow.height = newBoundPoint.y - updatedArrow.y;
                        }

                        return updatedArrow;
                    }
                }
                return el;
            });

            setElements(newElements);
            setSelectedElement(newElements.find(el => el.id === selectedElement.id));

        } else if (action === 'resizing' && selectedElement && elementSnapshot.current) {
            const index = elements.findIndex(el => el.id === selectedElement.id);
            const elStart = elementSnapshot.current;
            const { x: startX, y: startY, width: startW, height: startH } = elStart;

            let newX = startX;
            let newY = startY;
            let newW = startW;
            let newH = startH;

            const dx = x - startPos.x;
            const dy = y - startPos.y;

            if (resizeHandle.includes('n')) { newY += dy; newH -= dy; }
            if (resizeHandle.includes('s')) { newH += dy; }
            if (resizeHandle.includes('w')) { newX += dx; newW -= dx; }
            if (resizeHandle.includes('e')) { newW += dx; }

            // 1. Calculate the new dimensions of the resized shape
            const resizedShape = { ...elStart, x: newX, y: newY, width: newW, height: newH };

            const elementsToUpdate = new Set([selectedElement.id]);
            const boundElements = elements.filter(el =>
                (el.type === TOOLS.ARROW || el.type === TOOLS.LINE) &&
                (el.startBindingId === selectedElement.id || el.endBindingId === selectedElement.id)
            );
            boundElements.forEach(el => elementsToUpdate.add(el.id));

            // 2. Update all elements, including the resized one and its bound arrows
            const newElements = elements.map(el => {
                if (!elementsToUpdate.has(el.id)) return el;

                if (el.id === selectedElement.id) {
                    return resizedShape; // Return the newly resized shape
                } else if (el.type === TOOLS.ARROW || el.type === TOOLS.LINE) {
                    const isStartBound = el.startBindingId === selectedElement.id;
                    const isEndBound = el.endBindingId === selectedElement.id;

                    if (isStartBound || isEndBound) {
                        let updatedArrow = { ...el };
                        const originalStartX = el.x;
                        const originalStartY = el.y;
                        const originalEndX = el.x + el.width;
                        const originalEndY = el.y + el.height;

                        // Case 1: Start is bound
                        if (isStartBound) {
                            const unboundX = originalEndX;
                            const unboundY = originalEndY;
                            const newBoundPoint = getBoundPoint(el, resizedShape, true) || { x: originalStartX, y: originalStartY };

                            updatedArrow.x = newBoundPoint.x;
                            updatedArrow.y = newBoundPoint.y;
                            updatedArrow.width = unboundX - newBoundPoint.x;
                            updatedArrow.height = unboundY - newBoundPoint.y;
                        }

                        // Case 2: End is bound
                        if (isEndBound) {
                            const anchorX = originalStartX;
                            const anchorY = originalStartY;

                            const newBoundPoint = getBoundPoint(el, resizedShape, false) || { x: originalEndX, y: originalEndY };

                            if (!isStartBound) {
                                updatedArrow.x = anchorX;
                                updatedArrow.y = anchorY;
                            }

                            updatedArrow.width = newBoundPoint.x - updatedArrow.x;
                            updatedArrow.height = newBoundPoint.y - updatedArrow.y;
                        }

                        return updatedArrow;
                    }
                }
                return el;
            });

            setElements(newElements);
            setSelectedElement(newElements.find(el => el.id === selectedElement.id));
        }
    };

    const handleMouseUp = () => {
        if (action === 'drawing' && (tool === TOOLS.ARROW || tool === TOOLS.LINE)) {
            const index = elements.length - 1;
            const element = elements[index];

            let startBindingId = null;
            let endBindingId = null;

            // Snap Start Point: check if the start point is near a shape
            startBindingId = snapPointToShape(element.x, element.y, element.id);

            // Snap End Point: check if the end point is near a shape
            endBindingId = snapPointToShape(element.x + element.width, element.y + element.height, element.id);

            const newElements = [...elements];
            newElements[index] = { ...element, startBindingId, endBindingId };
            updateElements(newElements, true);

        } else if (['drawing', 'moving', 'resizing'].includes(action)) {
            updateElements(elements, true);
        }

        if (action !== 'writing') setAction('none');
        elementSnapshot.current = null;
    };

    const updateProperty = (key, value) => {
        if (key === 'stroke') setStrokeColor(value);
        if (key === 'fill') setBackgroundColor(value);
        if (key === 'width') setStrokeWidth(value);
        if (key === 'roughness') setRoughness(value);
        if (key === 'roundness') setRoundness(value);
        if (key === 'fillStyle') setFillStyle(value);
        if (key === 'fontSize') setFontSize(value);
        if (key === 'fontFamily') setFontFamily(value);
        if (key === 'textAlign') setTextAlign(value);
        if (key === 'fontWeight') setFontWeight(value);
        if (key === 'fontStyle') setFontStyle(value);
        if (key === 'textDecoration') setTextDecoration(value);

        if (selectedElement) {
            const index = elements.findIndex(el => el.id === selectedElement.id);
            if (index !== -1) {
                const newElements = [...elements];
                const updatedElement = {
                    ...elements[index],
                    [key === 'width' ? 'strokeWidth' : key]: value
                };
                newElements[index] = updatedElement;

                setElements(newElements);
                setSelectedElement(updatedElement);

                if (action === 'writing') {
                    setTimeout(() => {
                        document.getElementById('text-input-editor')?.focus();
                    }, 0);
                } else {
                    updateElements(newElements, true);
                }
            }
        }
    };

    const handleTextChange = (e) => {
        if (!selectedElement) return;
        const text = e.target.value;
        const index = elements.findIndex(el => el.id === selectedElement.id);

        const newElements = [...elements];
        let updatedElement = { ...selectedElement, text: text };

        if (selectedElement.type === TOOLS.TEXT) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.font = `${selectedElement.fontStyle || 'normal'} ${selectedElement.fontWeight || 'normal'} ${selectedElement.fontSize || 24}px ${FONT_FAMILIES[selectedElement.fontFamily || 1]}`;
            const lines = text.split('\n');
            let maxWidth = 0;
            lines.forEach(line => {
                const w = ctx.measureText(line).width;
                if (w > maxWidth) maxWidth = w;
            });
            const lineHeight = (selectedElement.fontSize || 24) * 1.2;
            const newHeight = Math.max(lines.length * lineHeight, lineHeight);
            const newWidth = Math.max(maxWidth + 20, 50);

            updatedElement.width = newWidth;
            updatedElement.height = newHeight;
        }

        newElements[index] = updatedElement;
        setElements(newElements);
        setSelectedElement(updatedElement);
    };

    const finishWriting = () => {
        if (selectedElement?.type === TOOLS.TEXT && !selectedElement.text.trim()) {
            const newElements = elements.filter(el => el.id !== selectedElement.id);
            setElements(newElements);
        } else {
            updateElements(elements, true);
        }

        setAction('none');
        setTool(TOOLS.SELECTION);
        setSelectedElement(null);
    };

    const ToolButton = ({ t, icon: Icon, label }) => (
        <button
            title={label}
            onClick={() => setTool(t)}
            className={`p-2 rounded-lg transition-all ${tool === t ? 'bg-primary/10 text-primary shadow-inner' : 'text-muted-foreground hover:bg-muted/80'}`}
        >
            <Icon size={20} />
        </button>
    );

    const getTextareaStyle = () => {
        if (!selectedElement) return {};
        const { x, y, w, h } = getNormalizedBox(selectedElement);
        const fontSize = (selectedElement.fontSize || 24) * scale;
        const lineHeight = fontSize * 1.2;
        const PADDING_PX = 10;
        const PADDING = PADDING_PX * scale;

        let top = y * scale + panOffset.y;
        let left = x * scale + panOffset.x;
        let width = w * scale;
        let textAlign = selectedElement.textAlign || 'center';

        if (selectedElement.type !== TOOLS.TEXT) {
            top += PADDING;
            left += PADDING;
            width = Math.max(width - PADDING * 2, 50 * scale);
        } else {
            width = w * scale;
        }

        return {
            position: 'absolute',
            top: top,
            left: left,
            width: width < 50 * scale ? 50 * scale : width,
            minHeight: lineHeight,
            fontSize: `${fontSize}px`,
            fontFamily: FONT_FAMILIES[selectedElement.fontFamily || 1],
            fontWeight: selectedElement.fontWeight || 'normal',
            fontStyle: selectedElement.fontStyle || 'normal',
            textDecoration: selectedElement.textDecoration || 'none',
            color: resolveColor(selectedElement.stroke, themeColors),
            background: 'transparent',
            border: 'none',
            outline: `2px solid ${themeColors.primary}`,
            textAlign: textAlign,
            resize: 'none',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            zIndex: 100,
            padding: '0',
            lineHeight: 1.2
        };
    };

    return (
        <div className="w-full relative h-screen overflow-hidden flex flex-col bg-background text-foreground">

            {/* Toolbar */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-1 p-1.5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border bg-card border-border">
                <ToolButton t={TOOLS.SELECTION} icon={MousePointer2} label="Selection (1)" />
                <div className="w-px h-6 bg-border mx-1"></div>
                <ToolButton t={TOOLS.RECTANGLE} icon={Square} label="Rectangle (2)" />
                <ToolButton t={TOOLS.DIAMOND} icon={Diamond} label="Diamond (3)" />
                <ToolButton t={TOOLS.ELLIPSE} icon={Circle} label="Ellipse (4)" />
                <ToolButton t={TOOLS.ARROW} icon={ArrowRight} label="Arrow (5)" />
                <ToolButton t={TOOLS.LINE} icon={Minus} label="Line (6)" />
                <ToolButton t={TOOLS.FREE_DRAW} icon={Pencil} label="Draw (7)" />
                <ToolButton t={TOOLS.TEXT} icon={TypeIcon} label="Text (8)" />
                <div className="w-px h-6 bg-border mx-1"></div>
                <ToolButton t={TOOLS.PAN} icon={Hand} label="Pan (Space)" />
            </div>

            {/* Properties Panel */}
            {(selectedElement || tool !== TOOLS.SELECTION) && (
                <div className="absolute top-20 left-4 z-20 p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border w-64 max-h-[80vh] overflow-y-auto bg-card border-border">
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-muted-foreground">Stroke</h3>
                    <div className="grid grid-cols-5 gap-1 mt-2">
                        {PALETTE.stroke.map(c => (
                            <button
                                key={c}
                                onClick={() => updateProperty('stroke', c)}
                                className={`w-6 h-6 rounded-md border border-border overflow-hidden flex items-center justify-center ${strokeColor === c ? 'ring-2 ring-primary' : ''}`}
                                style={{ backgroundColor: c === 'neutral' ? themeColors.foreground : c }}
                                title={c === 'neutral' ? 'Adaptive (Theme)' : c}
                            >
                                {c === 'neutral' && <Contrast size={14} className="text-muted-foreground mix-blend-difference" />}
                            </button>
                        ))}
                    </div>

                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3 mt-6 text-muted-foreground">Background</h3>
                    <div className="grid grid-cols-5 gap-1 mt-2">
                        {PALETTE.background.map(c => (
                            <button
                                key={c}
                                onClick={() => updateProperty('fill', c)}
                                className={`w-6 h-6 rounded-md border border-border flex items-center justify-center ${backgroundColor === c ? 'ring-2 ring-primary' : ''}`}
                                style={{ backgroundColor: c === 'neutral' ? themeColors.foreground : (c === 'transparent' ? 'transparent' : c) }}
                                title={c === 'neutral' ? 'Adaptive (Theme)' : c}
                            >
                                {c === 'transparent' && <span className="block w-full h-[1px] bg-red-500 rotate-45 transform translate-y-2.5"></span>}
                                {c === 'neutral' && <Contrast size={14} className="text-muted-foreground mix-blend-difference" />}
                            </button>
                        ))}
                    </div>

                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3 mt-6 text-muted-foreground">Fill</h3>
                    <div className="flex gap-1 bg-muted rounded-lg p-1">
                        <button onClick={() => updateProperty('fillStyle', 'hachure')} className={`flex-1 h-8 rounded-md flex items-center justify-center ${fillStyle === 'hachure' ? 'bg-card shadow text-primary' : 'text-muted-foreground'}`} title="Hachure"><Slash size={16} /></button>
                        <button onClick={() => updateProperty('fillStyle', 'cross-hatch')} className={`flex-1 h-8 rounded-md flex items-center justify-center ${fillStyle === 'cross-hatch' ? 'bg-card shadow text-primary' : 'text-muted-foreground'}`} title="Cross-Hatch"><Grid3x3 size={16} /></button>
                        <button onClick={() => updateProperty('fillStyle', 'solid')} className={`flex-1 h-8 rounded-md flex items-center justify-center ${fillStyle === 'solid' ? 'bg-card shadow text-primary' : 'text-muted-foreground'}`} title="Solid"><Square size={16} fill="currentColor" /></button>
                    </div>

                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3 mt-6 text-muted-foreground">Typography</h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-1 bg-muted rounded-lg p-1">
                            <button onClick={() => updateProperty('fontFamily', 1)} className={`flex-1 py-1 text-sm rounded ${fontFamily === 1 ? 'bg-card shadow text-primary' : 'text-muted-foreground'}`} style={{ fontFamily: '"Caveat", cursive' }}>A</button>
                            <button onClick={() => updateProperty('fontFamily', 2)} className={`flex-1 py-1 text-sm rounded ${fontFamily === 2 ? 'bg-card shadow text-primary' : 'text-muted-foreground'}`} style={{ fontFamily: 'sans-serif' }}>A</button>
                            <button onClick={() => updateProperty('fontFamily', 3)} className={`flex-1 py-1 text-sm rounded ${fontFamily === 3 ? 'bg-card shadow text-primary' : 'text-muted-foreground'}`} style={{ fontFamily: 'monospace' }}>A</button>
                        </div>

                        <div className="flex gap-1 bg-muted rounded-lg p-1">
                            <button onClick={() => updateProperty('fontSize', 16)} className={`flex-1 py-1 text-xs rounded ${fontSize === 16 ? 'bg-card shadow text-primary' : 'text-muted-foreground'}`}>S</button>
                            <button onClick={() => updateProperty('fontSize', 24)} className={`flex-1 py-1 text-sm rounded ${fontSize === 24 ? 'bg-card shadow text-primary' : 'text-muted-foreground'}`}>M</button>
                            <button onClick={() => updateProperty('fontSize', 36)} className={`flex-1 py-1 text-lg rounded ${fontSize === 36 ? 'bg-card shadow text-primary' : 'text-muted-foreground'}`}>L</button>
                            <button onClick={() => updateProperty('fontSize', 48)} className={`flex-1 py-1 text-xl rounded ${fontSize === 48 ? 'bg-card shadow text-primary' : 'text-muted-foreground'}`}>XL</button>
                        </div>

                        <div className="flex gap-1 mt-1">
                            <button onClick={() => updateProperty('textAlign', 'left')} className={`p-2 rounded hover:bg-muted/70 ${textAlign === 'left' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}><AlignLeft size={16} /></button>
                            <button onClick={() => updateProperty('textAlign', 'center')} className={`p-2 rounded hover:bg-muted/70 ${textAlign === 'center' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}><AlignCenter size={16} /></button>
                            <button onClick={() => updateProperty('textAlign', 'right')} className={`p-2 rounded hover:bg-muted/70 ${textAlign === 'right' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}><AlignRight size={16} /></button>
                            <div className="w-px bg-border mx-1"></div>
                            <button onClick={() => updateProperty('fontWeight', fontWeight === 'bold' ? 'normal' : 'bold')} className={`p-2 rounded hover:bg-muted/70 ${fontWeight === 'bold' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}><Bold size={16} /></button>
                            <button onClick={() => updateProperty('fontStyle', fontStyle === 'italic' ? 'normal' : 'italic')} className={`p-2 rounded hover:bg-muted/70 ${fontStyle === 'italic' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}><Italic size={16} /></button>
                            <button onClick={() => updateProperty('textDecoration', textDecoration === 'underline' ? 'none' : 'underline')} className={`p-2 rounded hover:bg-muted/70 ${textDecoration === 'underline' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}><Underline size={16} /></button>
                        </div>
                    </div>

                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3 mt-6 text-muted-foreground">Style</h3>
                    <div className="flex gap-2 bg-muted rounded-lg p-1 mb-2">
                        {[1, 2, 4].map(w => (
                            <button key={w} onClick={() => updateProperty('width', w)} className={`flex-1 h-8 rounded-md flex items-center justify-center ${strokeWidth === w ? 'bg-card shadow text-primary' : 'text-muted-foreground'}`}>
                                <div className="bg-current rounded-full" style={{ height: w, width: 20 }}></div>
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2 bg-muted rounded-lg p-1">
                        {[0, 1, 2].map(r => (
                            <button key={r} onClick={() => updateProperty('roughness', r)} className={`flex-1 h-8 rounded-md flex items-center justify-center ${roughness === r ? 'bg-card shadow text-primary' : 'text-muted-foreground'}`}>
                                {r === 0 ? <Minus size={16} /> : r === 1 ? <div className="font-serif italic">~</div> : <div className="font-serif italic font-bold">~~</div>}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2 bg-muted rounded-lg p-1 mt-2">
                        <button onClick={() => updateProperty('roundness', 'sharp')} className={`flex-1 h-8 rounded-md flex items-center justify-center ${roundness === 'sharp' ? 'bg-card shadow text-primary' : 'text-muted-foreground'}`}><Scan size={16} /></button>
                        <button onClick={() => updateProperty('roundness', 'round')} className={`flex-1 h-8 rounded-md flex items-center justify-center ${roundness === 'round' ? 'bg-card shadow text-primary' : 'text-muted-foreground'}`}><Spline size={16} /></button>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border flex gap-2">
                        <button onClick={() => {
                            const updated = elements.filter(el => el.id !== selectedElement?.id);
                            updateElements(updated);
                            setSelectedElement(null);
                        }} className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 text-sm font-medium">
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                </div>
            )}

            {/* Canvas */}
            <div className="relative w-full h-full">
                <canvas
                    ref={canvasRef}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onWheel={(e) => {
                        e.preventDefault();
                        if (e.ctrlKey || e.metaKey) setScale(s => Math.min(Math.max(s - e.deltaY * 0.001, 0.1), 5));
                        else setPanOffset(prev => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
                    }}
                    onDoubleClick={handleDoubleClick}
                    className="block touch-none"
                    style={{ cursor: cursorStyle }}
                />

                {action === 'writing' && selectedElement && (
                    <textarea
                        id="text-input-editor"
                        value={selectedElement.text}
                        onChange={handleTextChange}
                        onBlur={finishWriting}
                        style={getTextareaStyle()}
                        autoFocus
                        placeholder="Type here..."
                    />
                )}
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-4 flex gap-2 z-20">
                <div className="flex items-center gap-1 p-1 rounded-lg shadow-lg border bg-card border-border">
                    <button onClick={() => setScale(s => Math.max(s - 0.1, 0.1))} className="p-2 rounded-md text-muted-foreground hover:bg-muted/70"><ZoomOut size={16} /></button>
                    <span className="text-xs w-12 text-center font-mono">{(scale * 100).toFixed(0)}%</span>
                    <button onClick={() => setScale(s => Math.min(s + 0.1, 5))} className="p-2 rounded-md text-muted-foreground hover:bg-muted/70"><ZoomIn size={16} /></button>
                </div>
                <div className="flex items-center gap-1 p-1 rounded-lg shadow-lg border bg-card border-border">
                    <button onClick={undo} className="p-2 rounded-md text-muted-foreground hover:bg-muted/70 disabled:opacity-30" disabled={historyStep <= 0}><Undo2 size={16} /></button>
                    <button onClick={redo} className="p-2 rounded-md text-muted-foreground hover:bg-muted/70 disabled:opacity-30" disabled={historyStep >= history.length - 1}><Redo2 size={16} /></button>
                </div>
            </div>

            {/* Menu Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                <div className="flex items-center gap-1 p-1 rounded-lg shadow-lg border mr-2 bg-card border-border">
                    <button onClick={() => setGridType('none')} className={`p-2 rounded-md ${gridType === 'none' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/70'}`}><Square size={16} /></button>
                    <button onClick={() => setGridType('dot')} className={`p-2 rounded-md ${gridType === 'dot' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/70'}`}><LayoutGrid size={16} /></button>
                    <button onClick={() => setGridType('line')} className={`p-2 rounded-md ${gridType === 'line' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/70'}`}><Grid3x3 size={16} /></button>
                    <div className="w-px h-4 bg-border mx-1"></div>
                    <button onClick={() => setHideSystemCursor(!hideSystemCursor)} className={`p-2 rounded-md ${hideSystemCursor ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/70'}`} title="Toggle System Cursor"><MousePointer size={16} /></button>
                </div>
                <button className="p-3 rounded-full shadow-lg border transition-colors bg-primary text-primary-foreground border-primary">
                    <Menu size={20} />
                </button>
            </div>
        </div>
    );
}

