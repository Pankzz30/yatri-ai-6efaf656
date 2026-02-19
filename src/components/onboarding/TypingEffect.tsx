import { useEffect, useState } from "react";

interface TypingEffectProps {
  text: string;
  speed?: number;
  className?: string;
}

const TypingEffect = ({ text, speed = 38, className = "" }: TypingEffectProps) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      {!done && (
        <span className="ml-[1px] inline-block h-[1em] w-[2px] translate-y-[1px] bg-primary align-middle animate-[blink_1s_step-end_infinite]" />
      )}
    </span>
  );
};

export default TypingEffect;
