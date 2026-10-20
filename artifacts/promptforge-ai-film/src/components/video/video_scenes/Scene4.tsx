import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const LINES = [
  { label: 'TASK', text: 'A launch email for a small ceramics shop.', top: '18%', delay: 0.32 },
  { label: 'GUIDANCE', text: 'Use a warm, direct tone. Keep it concise.', top: '43%', delay: 1.65 },
  { label: 'OUTPUT FORMAT', text: 'Clear headings. Practical example.', top: '68%', delay: 2.88 },
];

export function SceneFour() {
  return (
    <motion.section
      className="film-scene"
      initial={{ opacity: 0, clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ opacity: 1, clipPath: 'circle(115% at 50% 50%)' }}
      exit={{ opacity: 0, scale: 1.12, filter: 'blur(8px)' }}
      transition={{ duration: 0.66, ease: EASE }}
      style={{ background: 'radial-gradient(ellipse at 50% 42%,#22213d,#0b0e15 71%)' }}
    >
      <div className="scene-grain" />
      <motion.div
        initial={{ scale: 0.25, opacity: 0, rotate: -12 }}
        animate={{ scale: [0.25, 1.04, 1], opacity: 1, rotate: [ -12, 1, 0] }}
        transition={{ duration: 1.06, ease: EASE }}
        style={{
          position: 'absolute', left: '22%', top: '12%', width: '56%', height: '76%',
          borderRadius: '1.4vmin', background: 'linear-gradient(145deg,#eeecff,#dcd8f8)',
          border: '1px solid #ffffff99', overflow: 'hidden',
          boxShadow: '0 4vmin 12vmin #05070ca8',
          color: '#202033',
        }}
      >
        <div style={{ position: 'absolute', inset: '0 0 auto', height: '1.1vmin', background: 'linear-gradient(90deg,#8a73ff,#526bff)' }} />
        <div style={{ position: 'absolute', left: '6%', top: '5%', font: '500 1.45vmin var(--font-mono)', color: '#7867cf', letterSpacing: '.12em' }}>PROMPT PREVIEW / READY</div>
        {LINES.map((line) => (
          <motion.div
            key={line.label}
            initial={{ opacity: 0, x: -34, clipPath: 'inset(0 100% 0 0)' }}
            animate={{ opacity: 1, x: 0, clipPath: 'inset(0 0 0 0)' }}
            transition={{ delay: line.delay, duration: 0.52, ease: EASE }}
            style={{
              position: 'absolute', left: '6%', top: line.top, width: '88%',
              borderBottom: '1px solid #b7b2d7', paddingBottom: '2.4vmin',
            }}
          >
            <div style={{ color: '#7566be', font: '500 1.55vmin var(--font-mono)', letterSpacing: '.12em', marginBottom: '1.2vmin' }}>{line.label}</div>
            <div style={{ color: '#242538', font: '500 2.5vmin/1.24 var(--font-display)', letterSpacing: '-.03em' }}>{line.text}</div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 35 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 4.15, duration: 0.56, ease: EASE }}
        style={{
          position: 'absolute', left: '8%', bottom: '15%', width: '32%',
          color: '#f2f2fb', font: '600 5vmin/.97 var(--font-display)', letterSpacing: '-.07em',
        }}
      >
        READY FOR<br />ITS NEXT STEP.
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.4, rotate: -45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 4.45, duration: 0.64, type: 'spring', stiffness: 220, damping: 18 }}
        style={{
          position: 'absolute', right: '8%', top: '20%', width: '13vmin', height: '13vmin',
          border: '.24vmin solid #67e3b4', borderRadius: '50%',
          display: 'grid', placeItems: 'center', color: '#67e3b4',
          font: '500 1.65vmin var(--font-mono)', letterSpacing: '.1em',
          boxShadow: '0 0 3vmin #67e3b426, inset 0 0 3vmin #67e3b419',
        }}
      >
        LOCAL
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 18, scaleX: 0.5 }}
        animate={{ opacity: 1, y: 0, scaleX: 1 }}
        transition={{ delay: 4.92, duration: 0.44, ease: EASE }}
        style={{ position: 'absolute', right: '7.5%', top: '41%', color: '#b5becf', font: '500 1.6vmin var(--font-mono)', letterSpacing: '.075em', transformOrigin: 'left' }}
      >
        YOUR PROMPTS STAY ON THIS DEVICE
      </motion.div>
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: [0.3, 1, 3.4], opacity: [0, 0.65, 0] }}
        transition={{ delay: 5.44, duration: 0.21, times: [0, 0.24, 1], ease: EASE }}
        style={{
          position: 'absolute', right: '12%', top: '21%', width: '9vmin', height: '9vmin',
          border: '.22vmin solid #67e3b4', borderRadius: '50%',
        }}
      />
    </motion.section>
  );
}
