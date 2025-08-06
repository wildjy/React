import { useEffect, useState, RefObject  } from "react";

interface UseOutHandlerProps {
  targetRef: RefObject<HTMLElement>;
}

export function  useOutHandler ({ targetRef }: UseOutHandlerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openLayerEvent = (e: MouseEvent) => {
    if (targetRef.current && !targetRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  const closeFocusOut = (e: FocusEvent) => {
    if (targetRef.current && !targetRef.current.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const currentRef = targetRef.current;
    document.addEventListener('mousedown', openLayerEvent);
    if (currentRef) {
      currentRef.addEventListener('focusout', closeFocusOut);
    }

    return () => {
      document.removeEventListener('mousedown', openLayerEvent);
      if (currentRef) {
        currentRef.removeEventListener('focusout', closeFocusOut);
      }
    };
  }, [targetRef]);

  return { isOpen, setIsOpen };
}