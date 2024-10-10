// src/lib/actions/debounceAction.ts
export function debounce(node: HTMLElement, params: { delay: number, callback: (event: MouseEvent) => void }) {
    let timeout: number | undefined;
  
    const handleEvent = (event: MouseEvent) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = window.setTimeout(() => {
        params.callback(event);
      }, params.delay);
    };
  
    node.addEventListener('mouseover', handleEvent);
    node.addEventListener('mouseout', handleEvent);
  
    return {
      destroy() {
        if (timeout) {
          clearTimeout(timeout);
        }
        node.removeEventListener('mouseover', handleEvent);
        node.removeEventListener('mouseout', handleEvent);
      }
    };
  }
  