import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

export function SceneOne() {
  return (
    <motion.section
      className="film-scene"
      initial={{ opacity: 0, scale: 1.035 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(7px)' }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{ background: 'radial-gradient(ellipse at 75% 45%, #1c1a35 0%, #0b0e15 54%)' }}
    >
      <div className="scene-grain" />
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: '-20%', opacity: 0.25,
          backgroundImage: 'linear-gradient(rgba(138,115,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(138,115,255,.12) 1px, transparent 1px)',
          backgroundSize: '7vmin 7vmin',
        }}
        animate={{ x: [0, -18], y: [0, 12] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
      <div style={{ position: 'absolute', top: '15%', left: '8%', color: '#a99aff' }} className="micro">
        <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.36 }}>
          ROUGH IS RIGHT
        </motion.span>
      </div>
      <motion.div
        initial={{ x: '-110%', scaleX: 0.35 }}
        animate={{ x: ['-110%', '0%', '0%', '132%'], scaleX: [0.35, 1, 1, 1] }}
        transition={{ duration: 3.7, times: [0, 0.44, 0.84, 1], ease: EASE }}
        style={{
          position: 'absolute', left: '9%', top: '60%', width: '44%', height: '0.25vmin',
          background: 'linear-gradient(90deg,#8a73ff,#526bff,#67e3b4)', transformOrigin: 'left',
          boxShadow: '0 0 2.5vmin #8a73ff75',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 1.28, x: 28, filter: 'blur(12px)' }}
        animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.12, duration: 0.62, ease: EASE }}
        style={{
          position: 'absolute', left: '8%', top: '30%', width: '88%',
          color: '#f2f2fb', font: '600 24vmin/.82 var(--font-display)',
          letterSpacing: '-.095em', whiteSpace: 'nowrap',
          textShadow: '0 1.5vmin 5vmin #6652d84a',
        }}
      >
        launch email
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.02, duration: 0.42, ease: EASE }}
        style={{
          position: 'absolute', left: '9%', top: '69%', color: '#a5abc0',
          font: '400 3.1vmin/1.2 var(--font-body)', letterSpacing: '-.02em',
        }}
      >
        Start anywhere.
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 22 }}
        animate={{ opacity: [0, 1, 1, 0], x: [22, 0, 0, -28] }}
        transition={{ delay: 2.12, duration: 1.38, times: [0, 0.2, 0.78, 1], ease: EASE }}
        style={{
          position: 'absolute', right: '8%', top: '17%', color: '#737d96',
          font: '500 1.8vmin var(--font-mono)', letterSpacing: '.1em',
        }}
      >
        01 / THE PROMPT WORKSHOP
      </motion.div>
      <motion.div
        initial={{ opacity: 0, rotate: -18, scale: 0.4 }}
        animate={{ opacity: [0, 1, 1, 0], rotate: [0, 0, 18, 38], scale: [0.4, 1, 1.04, 1.3] }}
        transition={{ delay: 2.42, duration: 1.1, times: [0, 0.2, 0.7, 1], ease: EASE }}
        style={{
          position: 'absolute', left: '80%', top: '59%', width: '9vmin', height: '9vmin',
          border: '.22vmin solid #8a73ff', borderRadius: '50%',
          boxShadow: 'inset 0 0 3vmin #8a73ff30, 0 0 3vmin #8a73ff4a',
        }}
      />
      <motion.div
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 1, 0], opacity: [0, 0.8, 0] }}
        transition={{ delay: 3.12, duration: 0.58, ease: EASE }}
        style={{ position: 'absolute', left: '8%', top: '84%', width: '84%', height: 1, background: '#d8d1ff', transformOrigin: 'left' }}
      />
    </motion.section>
  );
}
