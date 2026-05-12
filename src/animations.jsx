import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

export const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 10) + 1;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
      setProgress(current);
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#050505",
        color: "#fff",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <div style={{ fontSize: "4rem", fontWeight: "bold", letterSpacing: "-0.05em" }}>
        Loading {progress}%
      </div>
      <motion.div
        style={{
          width: "200px",
          height: "2px",
          background: "rgba(255,255,255,0.2)",
          marginTop: "20px",
          overflow: "hidden"
        }}
      >
        <motion.div
          style={{ width: `${progress}%`, height: "100%", background: "#fff" }}
        />
      </motion.div>
    </motion.div>
  );
};

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);

    const handleMouseOver = (e) => {
      if (
        e.target.tagName === "A" ||
        e.target.tagName === "BUTTON" ||
        e.target.closest("a") ||
        e.target.closest("button") ||
        e.target.closest(".project-card")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        backgroundColor: "rgba(40, 217, 173, 0.8)",
        pointerEvents: "none",
        zIndex: 10000,
        mixBlendMode: "difference"
      }}
      animate={{
        x: mousePosition.x - 10,
        y: mousePosition.y - 10,
        scale: isHovered ? 2.5 : 1,
        backgroundColor: isHovered ? "rgba(255, 255, 255, 1)" : "rgba(40, 217, 173, 0.8)",
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.5
      }}
    />
  );
};

export const Reveal = ({ children, delay = 0, y = 80, width = "100%", className = "" }) => {
  return (
    <div style={{ width }} className={className}>
      <motion.div
        initial={{ y, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, delay, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const ParallaxImage = ({ src, alt, className }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div ref={ref} style={{ overflow: "hidden", position: "relative" }} className={className}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale: 1.15, width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

export const StaggerText = ({ text }) => {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.1 }
    }
  };

  const child = {
    hidden: { y: "100%" },
    visible: {
      y: "0%",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
    }
  };

  return (
    <motion.div
      style={{ display: "flex", flexWrap: "wrap" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false}}
    >
      {words.map((word, index) => (
        <span key={index} style={{ overflow: "hidden", display: "inline-block", paddingBottom: "0.1em" }}>
          <motion.span variants={child} style={{ display: "inline-block" }}>
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};

export const FadeIn = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 1, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.div>
  );
};

export const ImageReveal = ({ children, className, style }) => {
  return (
    <motion.div
      className={className}
      style={{ overflow: "hidden", position: "relative", height: "100%", width: "100%", ...style }}
      initial={{ clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }}
      whileInView={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      viewport={{ once: false }}
    >
      <motion.div
        style={{ height: "100%", width: "100%" }}
        initial={{ scale: 1.3 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        viewport={{ once: false }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const ExpandCollapse = ({ isOpen, children, className }) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          className={className}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
