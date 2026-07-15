'use client';

import { useState, useEffect, useCallback } from 'react';

export default function Typewriter({ texts, typeSpeed = 80, deleteSpeed = 40, pauseDuration = 2000, className }) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentText = texts[textIndex];

  useEffect(() => {
    if (!currentText) return;

    if (!isDeleting && charIndex < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, typeSpeed);
      return () => clearTimeout(timer);
    }

    if (!isDeleting && charIndex === currentText.length) {
      const timer = setTimeout(() => setIsDeleting(true), pauseDuration);
      return () => clearTimeout(timer);
    }

    if (isDeleting && charIndex > 0) {
      const timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      }, deleteSpeed);
      return () => clearTimeout(timer);
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTextIndex(prev => (prev + 1) % texts.length);
    }
  }, [charIndex, isDeleting, currentText, texts, textIndex, typeSpeed, deleteSpeed, pauseDuration]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
