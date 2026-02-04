"use strict";

import * as React from 'react';
/**
 * Render content lazily based on visibility.
 *
 * When enabled:
 * - If content is visible, it will render immediately
 * - If content is not visible, it won't render until it becomes visible
 *
 * Otherwise:
 * - If content is visible, it will render immediately
 * - If content is not visible, it will defer rendering until idle
 *
 * Once rendered, the content remains rendered.
 */
export function Lazy({
  enabled,
  visible,
  children
}) {
  const [rendered, setRendered] = React.useState(enabled ? visible : false);
  const shouldRenderInIdle = !(enabled || visible || rendered);
  React.useEffect(() => {
    if (shouldRenderInIdle === false) {
      return;
    }
    const id = requestIdleCallback(() => {
      setRendered(true);
    });
    return () => cancelIdleCallback(id);
  }, [shouldRenderInIdle]);
  if (visible && rendered === false) {
    setRendered(true);
    return children;
  }
  if (rendered) {
    return children;
  }
  return null;
}
//# sourceMappingURL=Lazy.js.map