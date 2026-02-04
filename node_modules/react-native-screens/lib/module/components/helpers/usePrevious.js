import { useEffect, useRef } from 'react';
export function usePrevious(state) {
  const ref = useRef();
  useEffect(() => {
    ref.current = state;
  });
  return ref.current;
}
//# sourceMappingURL=usePrevious.js.map