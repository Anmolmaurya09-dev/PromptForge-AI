import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, Pause, Play, Repeat, Volume2, VolumeX } from 'lucide-react';
import { SCENE_DURATIONS } from './VideoTemplate';
import VideoTemplate from './VideoTemplate';
import { useSceneControls } from './useSceneControls';

const PROGRESS_TICK_MS = 60;
const SCENE_DETAILS: Record<string, { title: string; filePath: string }> = {
  thought: { title: 'The rough idea', filePath: 'src/components/video/video_scenes/Scene1.tsx' },
  shape: { title: 'Shape the signal', filePath: 'src/components/video/video_scenes/Scene2.tsx' },
  structure: { title: 'Thought to framework', filePath: 'src/components/video/video_scenes/Scene3.tsx' },
  proof: { title: 'Local product proof', filePath: 'src/components/video/video_scenes/Scene4.tsx' },
  signature: { title: 'Brand signature', filePath: 'src/components/video/video_scenes/Scene5.tsx' },
};

function announceSceneSelection(index: number, sceneKeys: string[]) {
  const key = sceneKeys[index];
  const details = SCENE_DETAILS[key];
  if (!details?.filePath) return;
  window.parent.postMessage({
    type: 'REPLIT_VIDEO_SCENE_SELECTED',
    payload: { sceneIndex: index, sceneCount: sceneKeys.length, sceneTitle: details.title || key, filePath: details.filePath, lineNumber: 1 },
  }, '*');
}

export default function VideoWithControls() {
  const isIframed = typeof window !== 'undefined' && window.self !== window.top;
  const {
    sceneKeys, activeIndex, locked, paused, mountKey, tick, durations, activeDuration,
    activeStartTime, totalDuration, onSceneChange, jumpTo, toggleLock, togglePause,
  } = useSceneControls(SCENE_DURATIONS);
  const [muted, setMuted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tapPinned, setTapPinned] = useState(false);
  const sensorRef = useRef<HTMLDivElement | null>(null);

  const handleJumpTo = useCallback((index: number) => {
    jumpTo(index);
    announceSceneSelection(index, sceneKeys);
  }, [jumpTo, sceneKeys]);

  useEffect(() => {
    if (!paused) return;
    const frozen = document.getAnimations().filter((animation) => animation.playState === 'running');
    frozen.forEach((animation) => animation.pause());
    return () => frozen.forEach((animation) => animation.play());
  }, [paused]);

  useEffect(() => {
    if (!(collapsed && tapPinned)) return;
    const onDocPointerDown = (event: globalThis.PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      if (sensorRef.current && !sensorRef.current.contains(event.target as Node)) setTapPinned(false);
    };
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, [collapsed, tapPinned]);

  const handlePointerEnter = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setHovering(true);
  }, []);
  const handlePointerLeave = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setHovering(false);
  }, []);
  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' && collapsed) setTapPinned(true);
  }, [collapsed]);
  const handleToggleCollapsed = useCallback(() => {
    setCollapsed((value) => {
      if (!value) { setHovering(false); setTapPinned(false); }
      return !value;
    });
  }, []);

  if (!isIframed) return <VideoTemplate />;
  const barVisible = !collapsed || hovering || tapPinned;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <VideoTemplate
        key={mountKey}
        durations={durations}
        loop
        paused={paused}
        muted={muted}
        onSceneChange={onSceneChange}
      />
      <div
        ref={sensorRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '25%', zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
      >
        <div style={{ flex: 1, width: '100%' }} aria-hidden="true" />
        <ControlBar
          visible={barVisible}
          collapsed={collapsed}
          locked={locked}
          paused={paused}
          muted={muted}
          sceneKeys={sceneKeys}
          activeIndex={activeIndex}
          activeDuration={activeDuration}
          activeStartTime={activeStartTime}
          totalDuration={totalDuration}
          tick={tick}
          onTogglePause={togglePause}
          onToggleLock={toggleLock}
          onToggleMute={() => setMuted((value) => !value)}
          onJumpTo={handleJumpTo}
          onToggleCollapsed={handleToggleCollapsed}
        />
      </div>
    </div>
  );
}

function ControlBar({
  visible, collapsed, locked, paused, muted, sceneKeys, activeIndex, activeDuration,
  activeStartTime, totalDuration, tick, onTogglePause, onToggleLock, onToggleMute,
  onJumpTo, onToggleCollapsed,
}: {
  visible: boolean;
  collapsed: boolean;
  locked: boolean;
  paused: boolean;
  muted: boolean;
  sceneKeys: string[];
  activeIndex: number;
  activeDuration: number;
  activeStartTime: number;
  totalDuration: number;
  tick: number;
  onTogglePause: () => void;
  onToggleLock: () => void;
  onToggleMute: () => void;
  onJumpTo: (index: number) => void;
  onToggleCollapsed: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '1.2vmin', padding: '1.2vmin 2vmin',
        background: 'rgba(7,9,15,.78)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(207,201,255,.16)', color: '#f0edff',
        fontFamily: 'var(--font-mono)', transition: 'transform 200ms ease, opacity 200ms ease',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none',
      }}
      aria-hidden={!visible}
    >
      <ControlButton onClick={onTogglePause} title={paused ? 'Play' : 'Pause'} ariaLabel={paused ? 'Play' : 'Pause'}>
        {paused ? <Play /> : <Pause />}
      </ControlButton>
      <ControlButton onClick={onToggleLock} title={locked ? 'Loop current scene: on' : 'Loop current scene: off'} ariaLabel="Toggle scene loop" pressed={locked}>
        <Repeat />
      </ControlButton>
      <ControlButton onClick={onToggleMute} title={muted ? 'Unmute' : 'Mute'} ariaLabel={muted ? 'Unmute' : 'Mute'} pressed={muted}>
        {muted ? <VolumeX /> : <Volume2 />}
      </ControlButton>
      <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(255,255,255,.18)' }} />
      <PlaybackStatus
        sceneKeys={sceneKeys}
        activeIndex={activeIndex}
        activeDuration={activeDuration}
        activeStartTime={activeStartTime}
        totalDuration={totalDuration}
        tick={tick}
        paused={paused}
        onJumpTo={onJumpTo}
      />
      <ControlButton onClick={onToggleCollapsed} title={collapsed ? 'Show controls' : 'Hide controls'} ariaLabel={collapsed ? 'Show controls' : 'Hide controls'} expanded={!collapsed}>
        {collapsed ? <ChevronUp /> : <ChevronDown />}
      </ControlButton>
    </div>
  );
}

function ControlButton({
  children, onClick, title, ariaLabel, pressed, expanded,
}: {
  children: ReactNode;
  onClick: () => void;
  title: string;
  ariaLabel: string;
  pressed?: boolean;
  expanded?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      aria-expanded={expanded}
      style={{
        flex: '0 0 auto', width: '5.2vmin', height: '5.2vmin', minWidth: 38, minHeight: 38,
        display: 'grid', placeItems: 'center', border: 0, borderRadius: 9,
        color: pressed ? '#c2b5ff' : 'rgba(240,237,255,.76)',
        background: pressed ? 'rgba(138,115,255,.15)' : 'transparent',
        cursor: 'pointer',
      }}
    >
      <span style={{ width: '2.6vmin', height: '2.6vmin', minWidth: 18, minHeight: 18, display: 'flex' }}>{children}</span>
    </button>
  );
}

function PlaybackStatus({
  sceneKeys, activeIndex, activeDuration, activeStartTime, totalDuration, tick, paused, onJumpTo,
}: {
  sceneKeys: string[];
  activeIndex: number;
  activeDuration: number;
  activeStartTime: number;
  totalDuration: number;
  tick: number;
  paused: boolean;
  onJumpTo: (index: number) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const elapsedBaseRef = useRef(0);

  useEffect(() => {
    setElapsed(0);
    elapsedBaseRef.current = 0;
  }, [tick]);

  useEffect(() => {
    if (paused) return;
    const start = performance.now();
    const id = window.setInterval(() => setElapsed(elapsedBaseRef.current + performance.now() - start), PROGRESS_TICK_MS);
    return () => {
      window.clearInterval(id);
      elapsedBaseRef.current += performance.now() - start;
    };
  }, [tick, paused]);

  const progress = activeDuration > 0 ? Math.min(1, elapsed / activeDuration) : 0;
  const totalElapsed = Math.min(totalDuration, activeStartTime + Math.min(elapsed, activeDuration));
  return (
    <>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
        {sceneKeys.map((key, index) => (
          <button
            key={key}
            type="button"
            onClick={() => onJumpTo(index)}
            aria-label={`Jump to scene ${index + 1}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            style={{ position: 'relative', flex: 1, height: 10, minWidth: 8, border: 0, padding: 0, borderRadius: 99, background: 'rgba(255,255,255,.23)', overflow: 'hidden', cursor: 'pointer' }}
          >
            {index < activeIndex && <span style={{ position: 'absolute', inset: 0, background: 'rgba(240,237,255,.76)' }} />}
            {index === activeIndex && <span style={{ position: 'absolute', inset: '0 auto 0 0', width: `${progress * 100}%`, background: '#b7aaff', borderRadius: 99 }} />}
          </button>
        ))}
      </div>
      <span style={{ flex: '0 0 auto', minWidth: '4ch', textAlign: 'center', color: 'rgba(240,237,255,.7)', fontSize: '1.8vmin', fontVariantNumeric: 'tabular-nums' }}>{activeIndex + 1}/{sceneKeys.length}</span>
      <span role="timer" aria-label={`Playback time ${formatPlaybackTime(totalElapsed)} of ${formatPlaybackTime(totalDuration)}`} style={{ flex: '0 0 auto', minWidth: '11ch', textAlign: 'right', color: 'rgba(240,237,255,.8)', fontSize: '1.65vmin', fontVariantNumeric: 'tabular-nums' }}>
        {formatPlaybackTime(totalElapsed)} / {formatPlaybackTime(totalDuration)}
      </span>
    </>
  );
}

function formatPlaybackTime(durationMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  return `${Math.floor(totalSeconds / 60)}:${(totalSeconds % 60).toString().padStart(2, '0')}`;
}
