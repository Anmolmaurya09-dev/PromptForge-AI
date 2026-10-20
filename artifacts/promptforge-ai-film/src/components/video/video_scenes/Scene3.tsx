import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const PARTS = [
  { title: 'TASK', left: '8%', top: '24%', rotate: -4, delay: 0.78 },
  { title: 'GUIDANCE', left: '37%', top: '39%', rotate: 5, delay: 1.54 },
  { title: 'OUTPUT FORMAT', left: '65%', top: '54%', rotate: -3, delay: 2.3 },
];

export function SceneThree() {
  return (
    <motion.section
      className="film-scene"
      initial={{ opacity: 0, scale: 1.12, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.92, rotateY: -8 }}
      transition={{ duration: 0.48, ease: EASE }}
      style={{ background: 'radial-gradient(ellipse at 48% 42%,#22223a 0%,#111520 56%,#0b0e15 100%)', perspective: 1300 }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.13, backgroundImage: 'linear-gradient(90deg,transparent 49.9%,#a495ff 50%,transparent 50.1%),linear-gradient(0deg,transparent 49.9%,#a495ff 50%,transparent 50.1%)', backgroundSize: '10vmin 10vmin' }} />
      <motion.div
        initial={{ x: '-25%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.22, duration: 0.62, ease: EASE }}
        style={{ position: 'absolute', left: '7%', top: '10%', color: '#a99aff', font: '500 1.9vmin var(--font-mono)', letterSpacing: '.15em' }}
      >
        A THOUGHT / REFRAMED
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -48, rotate: -8 }}
        animate={{ opacity: 0.2, x: 0, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.56, ease: EASE }}
        style={{
          position: 'absolute', left: '5%', top: '29%', font: '600 9vmin/.9 var(--font-display)',
          color: '#dad5ff', letterSpacing: '-.08em', whiteSpace: 'nowrap',
        }}
      >
        launch email
      </motion.div>
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.38, duration: 0.65, ease: EASE }}
        style={{ position: 'absolute', left: '31%', top: '22%', width: '1px', height: '56%', background: 'linear-gradient(transparent,#8a73ff,#67e3b4,transparent)', transformOrigin: 'top' }}
      />
      {PARTS.map((part, index) => (
        <motion.div
          key={part.title}
          initial={{ opacity: 0, y: 65, rotate: part.rotate, rotateY: -28, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, rotate: 0, rotateY: 0, scale: 1 }}
          transition={{ delay: part.delay, duration: 0.66, ease: EASE }}
          style={{
            position: 'absolute', left: part.left, top: part.top, width: index === 2 ? '30%' : '27%',
            minHeight: '12vmin', display: 'flex', alignItems: 'center',
            padding: '2vmin', borderTop: '1px solid #927fff', borderBottom: '1px solid #38344e',
            background: 'linear-gradient(110deg,rgba(138,115,255,.13),rgba(17,21,32,.83))',
            color: '#a99aff', font: '500 1.7vmin var(--font-mono)', letterSpacing: '.12em',
            transformStyle: 'preserve-3d',
          }}
        >
          <span style={{ position: 'absolute', top: '-1.2vmin', left: '1.5vmin', color: '#747d96', fontSize: '1.4vmin' }}>0{index + 1}</span>
          {part.title}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1, 1] }}
            transition={{ delay: part.delay + 0.25, duration: 0.48, ease: EASE }}
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '1px', background: '#67e3b4', transformOrigin: 'left' }}
          />
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)', y: 16 }}
        animate={{ opacity: 1, clipPath: 'inset(0 0 0 0)', y: 0 }}
        transition={{ delay: 3.06, duration: 0.52, ease: EASE }}
        style={{
          position: 'absolute', left: '38%', top: '72%', width: '56%', color: '#f2f2fb',
          font: '500 3.8vmin/1.15 var(--font-display)', letterSpacing: '-.04em',
        }}
      >
        A launch email for a small ceramics shop.
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: [0, 1, 1, 0], x: [24, 0, 0, -22] }}
        transition={{ delay: 3.9, duration: 0.92, times: [0, 0.2, 0.78, 1], ease: EASE }}
        style={{ position: 'absolute', left: '38%', top: '84%', color: '#67e3b4', font: '500 1.8vmin var(--font-mono)', letterSpacing: '.08em' }}
      >
        STRUCTURED. NOT GENERATED.
      </motion.div>
      <motion.div
        initial={{ scale: 0.65, opacity: 0, rotate: 45 }}
        animate={{ scale: [0.65, 1, 2.9], opacity: [0, 0.8, 0], rotate: [45, 0, -18] }}
        transition={{ delay: 4.48, duration: 0.52, times: [0, 0.36, 1], ease: EASE }}
        style={{ position: 'absolute', left: '81%', top: '21%', width: '14vmin', height: '14vmin', border: '.2vmin solid #8a73ff', borderRadius: '2.3vmin' }}
      />
    </motion.section>
  );
}
