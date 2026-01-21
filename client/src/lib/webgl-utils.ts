export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

export function isWebGL2Available(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch (e) {
    return false;
  }
}

export function getWebGLContext(
  canvas: HTMLCanvasElement,
  contextAttributes?: WebGLContextAttributes
): WebGLRenderingContext | WebGL2RenderingContext | null {
  try {
    let context: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    
    context = canvas.getContext('webgl2', contextAttributes) as WebGL2RenderingContext | null;
    
    if (!context) {
      context = canvas.getContext('webgl', contextAttributes) as WebGLRenderingContext | null;
    }
    
    if (!context) {
      context = canvas.getContext('experimental-webgl', contextAttributes) as WebGLRenderingContext | null;
    }
    
    return context;
  } catch (e) {
    return null;
  }
}

export const WEBGL_SUPPORTED = typeof window !== 'undefined' ? isWebGLAvailable() : false;
