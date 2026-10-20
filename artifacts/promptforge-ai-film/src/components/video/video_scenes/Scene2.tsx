import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;
const RAILS = [
  { title: 'TASK', top: '29%', left: '13%', rotate: -8, delay: 0.72 },
  { title: 'GUIDANCE', top: '45%', left: '34%', rotate: 7, delay: 1.45 },
  { title: 'OUTPUT FORMAT', top: '61%', left: '57%', rotate: -4, delay: 2.18 },
];

export function SceneTwo() {
  return (
    <motion.section
      className="film-scene"
      initial={{ opacity: 0, clipPath: 'polygon(0 0,100% 0,100% 0,0 0)', rotateX: 8 }}
      animate={{ opacity: 1, clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)', rotateX: 0 }}
      exit={{ opacity: 0, scale: 1.12, filter: 'blur(6px)' }}
      transition={{ duration: 0.44, ease: EASE }}
      style={{ background: '#121522', perspective: 1200 }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(116deg,#211c41 0 24%,transparent 24% 74%,#161a2a 74%)' }} />
      <motion.div
        initial={{ scaleX: 0, rotate: -11 }}
        animate={{ scaleX: [0, 1, 1], rotate: [-11, 0, 0], x: ['-5%', '0%', '8%'] }}
        transition={{ duration: 3.5, times: [0, 0.4, 1], ease: EASE }}
        style={{
          position: 'absolute', top: '48%', left: '-2%', width: '104%', height: '0.34vmin',
          background: 'linear-gradient(90deg,#67e3b4,#8a73ff,#526bff)', transformOrigin: 'left',
          boxShadow: '0 0 2vmin #8a73ff55',
        }}
      />
      <motion.div
        className="outline-type"
        initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
        animate={{ opacity: 1, clipPath: 'inset(0 0 0 0)' }}
        transition={{ delay: 0.18, duration: 0.62, ease: EASE }}
        style={{
          position: 'absolute', left: '7%', top: '7%', font: '700 23vmin/.85 var(--font-display)',
          letterSpacing: '-.09em', whiteSpace: 'nowrap', '--outline-color': '#a595ff66',
        } as CSSProperties}
      >
        SHAPE
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, duration: 0.45 }}
        style={{ position: 'absolute', top: '16%', right: '8%', color: '#b8adff', font: '500 2vmin var(--font-mono)', letterSpacing: '.15em' }}
      >
        THE SIGNAL
      </motion.div>
      {RAILS.map((rail, i) => (
        <motion.div
          key={rail.title}
          initial={{ opacity: 0, x: 80, rotate: rail.rotate, scale: 0.82, z: -160 }}
          animate={{ opacity: 1, x: 0, rotate: 0, scale: 1, z: 0 }}
          transition={{ delay: rail.delay, duration: 0.56, ease: EASE }}
          style={{
            position: 'absolute', left: rail.left, top: rail.top, width: i === 2 ? '36%' : '25%',
            height: '11vmin', border: '1px solid #7465bd80',
            background: i === 1 ? 'rgba(39,35,68,.88)' : 'rgba(19,23,35,.91)',
            display: 'flex', alignItems: 'center', paddingLeft: '2vmin',
            color: '#e8e5ff', font: '500 2vmin var(--font-mono)', letterSpacing: '.12em',
            boxShadow: '0 1.5vmin 4vmin #07091155', transformStyle: 'preserve-3d',
          }}
        >
          <span style={{ color: i === 2 ? '#67e3b4' : '#9c8aff', marginRight: '1.3vmin' }}>0{i + 1}</span>
          {rail.title}
          <span style={{ position: 'absolute', right: '1.5vmin', width: '1vmin', height: '1vmin', borderRadius: '50%', background: '#67e3b4', boxShadow: '0 0 1.5vmin #67e3b4' }} />
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, scale: 0.84, y: 28 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.84, 1, 1, 1.08], y: [28, 0, 0, -20] }}
        transition={{ delay: 2.85, duration: 1.18, times: [0, 0.22, 0.82, 1], ease: EASE }}
        style={{
          position: 'absolute', left: '20%', bottom: '10%', color: '#f0edff',
          font: '500 3.2vmin var(--font-display)', letterSpacing: '-.035em',
        }}
      >
        one clear direction
      </motion.div>
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: [0.4, 1, 3.1], opacity: [0, 0.72, 0] }}
        transition={{ delay: 3.8, duration: 0.45, times: [0, 0.22, 1], ease: EASE }}
        style={{
          position: 'absolute', left: '44%', top: '38%', width: '12vmin', height: '12vmin',
          border: '.28vmin solid #8a73ff', borderRadius: '1vmin', transform: 'rotate(45deg)',
        }}
      />
    </motion.section>
  );
}
