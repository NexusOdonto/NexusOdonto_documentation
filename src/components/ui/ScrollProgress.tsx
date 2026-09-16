import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div className="scroll-progress-container visible" aria-hidden="true">
      <motion.div
        className="scroll-progress-bar"
        style={{ scaleX, transformOrigin: "0%" }}
      />
    </div>
  );
}
