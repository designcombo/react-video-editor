import { RefObject, useEffect } from "react";

const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: () => void,
): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref, callback]);
};

export default useClickOutside;
