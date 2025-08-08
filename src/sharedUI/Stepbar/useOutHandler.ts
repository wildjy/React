import { useEffect, useState, RefObject  } from "react";

interface UseOutHandlerProps {
  refs: RefObject<HTMLElement>[];
}

export function  useOutHandler ({ refs }: UseOutHandlerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isOutSide = (target: EventTarget | null) => {
    return refs.every((ref) => {
      return ref.current && !ref.current.contains(target as Node);
    })
  }

  const openLayerEvent = (e: MouseEvent) => {
    if (isOutSide(e.target)) {
      setIsOpen(false);
    }
  };

  const closeFocusOut = (e: FocusEvent) => {
    if (isOutSide(e.relatedTarget)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', openLayerEvent);
    refs.forEach(ref => {
      if (ref.current) {
        ref.current.addEventListener('focusout', closeFocusOut);
      }
    })

    return () => {
      document.removeEventListener('mousedown', openLayerEvent);
      refs.forEach(ref => {
        if (ref.current) {
          ref.current.removeEventListener('focusout', closeFocusOut);
        }
      })
    };
  }, [refs]);

  return { isOpen, setIsOpen };
}