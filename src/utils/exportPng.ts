// ==============================================================================
// Utility: 100% Client-Side SVG to PNG Map Exporter (Section 4.2 Extension)
// ==============================================================================

export async function exportMapAsPng(svgElementId: string, filename = 'smart-escape-map.png'): Promise<boolean> {
  const svg = document.getElementById(svgElementId) as SVGSVGElement | null;
  if (!svg) {
    console.error(`SVG element #${svgElementId} not found.`);
    return false;
  }

  try {
    // Clone SVG to modify without affecting the live DOM
    const clone = svg.cloneNode(true) as SVGSVGElement;

    // Ensure explicit width and height
    const bbox = svg.viewBox.baseVal;
    const width = bbox.width > 0 ? bbox.width * 2 : 1600;
    const height = bbox.height > 0 ? bbox.height * 2 : 1200;

    clone.setAttribute('width', width.toString());
    clone.setAttribute('height', height.toString());

    // Serialize XML
    const xml = new XMLSerializer().serializeToString(clone);
    const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // Draw background
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, width, height);

    // Draw SVG onto canvas
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(url);

    // Trigger download
    const pngUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    return true;
  } catch (err) {
    console.error('Failed to export map as PNG:', err);
    return false;
  }
}
