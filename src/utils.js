export async function encodeFrame(video, region = null) {
  const canvas = document.createElement('canvas');
  const width = video.videoWidth, height = video.videoHeight;
  if (!width || !height) throw new Error('The shared frame is not ready yet.');
  const sx = region ? Math.round(region.x * width) : 0;
  const sy = region ? Math.round(region.y * height) : 0;
  const sw = region ? Math.max(1, Math.round(region.w * width)) : width;
  const sh = region ? Math.max(1, Math.round(region.h * height)) : height;
  canvas.width = Math.min(sw, 1600);
  canvas.height = Math.max(1, Math.round(sh * canvas.width / sw));
  canvas.getContext('2d').drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.82).split(',')[1];
}

export async function* parseAnthropicStream(body) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
    let cut;
    while ((cut = buffer.indexOf('\n\n')) !== -1) {
      const block = buffer.slice(0, cut);
      buffer = buffer.slice(cut + 2);
      const data = block.split('\n').filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trim()).join('\n');
      if (data && data !== '[DONE]') {
        try { yield JSON.parse(data); } catch { /* Ignore non-JSON event payloads. */ }
      }
    }
    if (done) break;
  }
}

export function sanitizeMarkdown(source) {
  const escaped = source.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  return escaped.split(/\n{2,}/).map((block) => `<p>${block.replace(/\n/g, '<br>')}</p>`).join('');
}
