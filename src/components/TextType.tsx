import { ElementType, useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';

interface TextTypeProps {
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string | React.ReactNode;
  cursorBlinkDuration?: number;
  cursorClassName?: string;
  text: string | string[];
  as?: ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
}

const TextType = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}: TextTypeProps & React.HTMLAttributes<HTMLElement>) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return undefined;
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!isVisible) return;

    const currentText = textArray[currentTextIndex];
    let timer: NodeJS.Timeout;

    if (initialDelay > 0 && currentCharIndex === 0 && !isDeleting) {
      timer = setTimeout(() => {
        setCurrentCharIndex(1);
      }, initialDelay);
      return () => clearTimeout(timer);
    }

    if (!isDeleting && currentCharIndex <= currentText.length) {
      if (currentCharIndex === currentText.length) {
        if (onSentenceComplete) {
          onSentenceComplete(currentText, currentTextIndex);
        }

        if (textArray.length > 1 || loop) {
          timer = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      } else {
        const speed = getRandomSpeed();
        timer = setTimeout(() => {
          setDisplayedText(currentText.substring(0, currentCharIndex + 1));
          setCurrentCharIndex(prev => prev + 1);
        }, speed);
      }
    } else if (isDeleting && currentCharIndex > 0) {
      const speed = reverseMode ? getRandomSpeed() : deletingSpeed;
      timer = setTimeout(() => {
        setDisplayedText(currentText.substring(0, currentCharIndex - 1));
        setCurrentCharIndex(prev => prev - 1);
      }, speed);
    } else if (isDeleting && currentCharIndex === 0) {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
    }

    return () => clearTimeout(timer);
  }, [
    currentCharIndex,
    isDeleting,
    currentTextIndex,
    textArray,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    initialDelay,
    loop,
    isVisible,
    getRandomSpeed,
    onSentenceComplete,
    reverseMode
  ]);

  const content = (
    <>
      <span style={{ color: getCurrentTextColor() }}>{displayedText}</span>
      {showCursor && (!hideCursorWhileTyping || isDeleting) && (
        <span ref={cursorRef} className={cursorClassName}>
          {cursorCharacter}
        </span>
      )}
    </>
  );

  return createElement(
    Component,
    {
      ref: containerRef,
      className,
      ...props
    },
    content
  );
};

export default TextType;
