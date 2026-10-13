const open = document.querySelector('#open');
open.addEventListener('click', async () => {
  if (!('documentPictureInPicture' in window)) {
    open.textContent = 'Document PiP is unavailable in this browser';
    open.disabled = true;
    return;
  }
  try {
    const pip = await window.documentPictureInPicture.requestWindow({ width: 390, height: 650 });
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = chrome.runtime.getURL('src/ui.css');
    pip.document.head.append(style);
    const frame = pip.document.createElement('iframe');
    frame.src = chrome.runtime.getURL('src/panel.html');
    frame.title = 'Peekpane screen assistant';
    frame.allow = 'display-capture';
    frame.style.cssText = 'border:0;width:100%;height:100%;';
    pip.document.body.style.cssText = 'margin:0;height:100vh;overflow:hidden;background:#111820';
    pip.document.body.append(frame);
    window.close();
  } catch (error) {
    open.textContent = error.message || 'Could not open the floating panel';
  }
});
