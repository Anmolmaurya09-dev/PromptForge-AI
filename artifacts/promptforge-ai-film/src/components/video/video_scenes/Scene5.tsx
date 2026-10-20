import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSceneTimer } from '@/lib/video';

const EASE = [0.22, 1, 0.36, 1] as const;
const WORDS = ['CLEAR.', 'LOCAL.', 'YOURS.'];

export function SceneFive() {
  const [wordIndex, setWordIndex] = useState(0);
  const [wordActive, setWordActive] = useState(true);
  const [brandVisible, setBrandVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  useSceneTimer([
    { time: 760, callback: () => setWordIndex(1) },
    { time: 1300, callback: () => setWordIndex(2) },
    { time: 2500, callback: () => { setWordActive(false); setBrandVisible(true); } },
    { time: 3570, callback: () => setPrivacyVisible(true) },
  ]);

  return (
    <motion.section
      className="film-scene"
      initial={{ opacity: 0, backgroundColor: '#0b0e15' }}
      animate={{ opacity: 1, backgroundColor: '#f0edff' }}
      exit={{ opacity: 1, backgroundColor: '#0b0e15' }}
      transition={{ duration: 0.44, ease: EASE }}
      style={{ color: '#191827' }}
    >
      <motion.div
        initial={{ x: '-105%', rotate: 6 }}
        animate={{ x: 0, rotate: 0 }}
        transition={{ duration: 0.56, ease: EASE }}
        style={{ position: 'absolute', inset: '-20% 45% -20% -5%', background: '#e2def6', transformOrigin: 'left', clipPath: 'polygon(0 0,100% 0,82% 100%,0 100%)' }}
      />
      <motion.div
        initial={{ x: '105%', rotate: -5 }}
        animate={{ x: 0, rotate: 0 }}
        transition={{ duration: 0.62, delay: 0.05, ease: EASE }}
        style={{ position: 'absolute', inset: '-20% -8% -20% 59%', background: '#faf9ff', clipPath: 'polygon(18% 0,100% 0,100% 100%,0 100%)' }}
      />
      <AnimatePresence mode="sync">
        {wordActive && (
          <motion.div
            key={wordIndex}
            initial={{ opacity: 0, scale: 1.24, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, scale: 0.74, filter: 'blur(6px)', y: -18 }}
            transition={{ duration: 0.34, delay: 0.22, ease: EASE }}
            style={{
              position: 'absolute', left: '8%', top: '34%', width: '72%',
              color: '#201d35', font: '700 27vmin/.82 var(--font-display)',
              letterSpacing: '-.09em', whiteSpace: 'nowrap',
            }}
          >
            {WORDS[wordIndex]}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: [0.15, 0.7, 0], scale: [0.4, 1.2, 3.1], rotate: [0, 45, 85] }}
        transition={{ delay: 1.94, duration: 0.62, times: [0, 0.24, 1], ease: EASE }}
        style={{
          position: 'absolute', left: '82%', top: '30%', width: '11vmin', height: '11vmin',
          border: '.25vmin solid #8a73ff', borderRadius: '50%',
        }}
      />
      {brandVisible && (
        <motion.div
          initial={{ opacity: 0, x: 22, clipPath: 'inset(0 100% 0 0)' }}
          animate={{ opacity: 1, x: 0, clipPath: 'inset(0 0 0 0)' }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{
            position: 'absolute', left: '32%', top: '38%', color: '#201d35',
            font: '700 8.2vmin/1 var(--font-display)', letterSpacing: '-.075em',
            whiteSpace: 'nowrap',
          }}
        >
          PromptForge <span style={{ color: '#7963e9' }}>AI</span>
        </motion.div>
      )}
      {brandVisible && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 1, 0.18] }}
          transition={{ duration: 2.5, times: [0, 0.22, 0.83, 1], ease: EASE }}
          style={{ position: 'absolute', left: '32.3%', top: '51%', width: '37%', height: '.3vmin', background: 'linear-gradient(90deg,#8a73ff,#526bff)', transformOrigin: 'left' }}
        />
      )}
      {brandVisible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45, ease: EASE }}
          style={{ position: 'absolute', left: '32.5%', top: '56%', color: '#77748d', font: '500 2.5vmin var(--font-body)' }}
        >
          A small tool for big ideas.
        </motion.div>
      )}
      {privacyVisible && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: EASE }}
          style={{
            position: 'absolute', left: '32.5%', top: '69%', color: '#45445d',
            font: '500 2vmin var(--font-mono)', letterSpacing: '.035em',
          }}
        >
          Everything happens locally in this browser.
        </motion.div>
      )}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 1] }}
        transition={{ delay: 2.22, duration: 2.95, times: [0, 0.12, 0.82, 1], ease: EASE }}
        style={{
          position: 'absolute', left: '28.5%', top: '47%', width: '1.2vmin', height: '1.2vmin',
          borderRadius: '50%', background: '#8a73ff',
          boxShadow: '0 0 2vmin #8a73ff99',
        }}
      />
      <motion.div
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 1, 1, 0] }}
        transition={{ delay: 4.18, duration: 0.78, times: [0, 0.15, 0.72, 1], ease: EASE }}
        style={{ position: 'absolute', left: '7%', bottom: '14%', width: '86%', height: 1, background: '#c6c0e2', transformOrigin: 'left' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5, x: 20 }}
        animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1, 1.25], x: [20, 0, -24] }}
        transition={{ delay: 4.55, duration: 0.43, ease: EASE }}
        style={{ position: 'absolute', right: '5%', top: '11%', width: '8vmin', height: '8vmin', border: '.2vmin solid #8a73ff', borderRadius: '50%' }}
      />
    </motion.section>
  );
}
