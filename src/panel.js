import { encodeFrame, parseAnthropicStream, sanitizeMarkdown } from './utils.js';
const $ = (s) => document.querySelector(s);
const video = $('#preview'), status = $('#status'), answer = $('#answer'), ask = $('#ask');
let stream, cropRect = null, selecting = false, dragStart = null, messages = [];
chrome.storage.local.get(['apiKey'], ({ apiKey }) => { if (apiKey) $('#key').value = apiKey; });
$('#save-key').onclick = async () => { await chrome.storage.local.set({ apiKey: $('#key').value.trim() }); status.textContent = 'Key saved in this browser.'; };
$('#close').onclick = () => window.close();
$('#share').onclick = async () => {
  try {
    stream?.getTracks().forEach((track) => track.stop());
    stream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: 'always' }, audio: false });
    video.srcObject = stream;
    $('#video-empty').hidden = true;
    $('#clear').disabled = false;
    ask.disabled = false;
    stream.getVideoTracks()[0].addEventListener('ended', stopCapture, { once: true });
    status.textContent = 'Sharing is active. Choose a prompt or write your own.';
  } catch (error) { status.textContent = error.name === 'NotAllowedError' ? 'Screen sharing was cancelled.' : error.message; }
};
function stopCapture() { stream?.getTracks().forEach((track) => track.stop()); stream = null; video.srcObject = null; cropRect = null; $('#selection').hidden = true; $('#video-empty').hidden = false; $('#clear').disabled = true; $('#crop').disabled = true; ask.disabled = true; status.textContent = 'Screen sharing stopped.'; }
$('#clear').onclick = stopCapture;
$('#crop').onclick = () => { selecting = !selecting; $('#crop').classList.toggle('active', selecting); status.textContent = selecting ? 'Drag across the preview to select a region.' : 'Region selection cancelled.'; };
for (const button of document.querySelectorAll('[data-prompt]')) button.onclick = () => { $('#question').value = button.dataset.prompt; ask.click(); };
const selection = $('#selection');
video.addEventListener('pointerdown', (e) => { if (!selecting) return; const r=video.getBoundingClientRect(); dragStart={x:e.clientX-r.left,y:e.clientY-r.top}; selection.hidden=false; selection.style.left=`${dragStart.x}px`; selection.style.top=`${dragStart.y}px`; selection.style.width='0'; selection.style.height='0'; video.setPointerCapture(e.pointerId); });
video.addEventListener('pointermove', (e) => { if (!dragStart) return; const r=video.getBoundingClientRect(), x=e.clientX-r.left,y=e.clientY-r.top; selection.style.left=`${Math.min(x,dragStart.x)}px`; selection.style.top=`${Math.min(y,dragStart.y)}px`; selection.style.width=`${Math.abs(x-dragStart.x)}px`; selection.style.height=`${Math.abs(y-dragStart.y)}px`; });
video.addEventListener('pointerup', (e) => { if (!dragStart) return; const r=video.getBoundingClientRect(), x=e.clientX-r.left,y=e.clientY-r.top; cropRect={x:Math.min(x,dragStart.x)/r.width,y:Math.min(y,dragStart.y)/r.height,w:Math.abs(x-dragStart.x)/r.width,h:Math.abs(y-dragStart.y)/r.height}; dragStart=null; selecting=false; $('#crop').classList.remove('active'); $('#crop').disabled=false; status.textContent='Region selected. Ask to send this frame to Anthropic.'; });
ask.onclick = async () => {
  const {apiKey} = await chrome.storage.local.get('apiKey');
  if (!apiKey) { status.textContent='Save your API key first.'; $('#key').focus(); return; }
  if (!stream || video.readyState < 2) { status.textContent='Choose a screen to share first.'; return; }
  const prompt=$('#question').value.trim(); if (!prompt) { status.textContent='Write a question or choose a quick action.'; $('#question').focus(); return; }
  ask.disabled=true; status.textContent='Waiting for a response…';
  try {
    const image=await encodeFrame(video,cropRect);
    const model=$('#model').value;
    const history=messages.slice(-8);
    const response=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model,max_tokens:900,stream:true,messages:[...history,{role:'user',content:[{type:'image',source:{type:'base64',media_type:'image/jpeg',data:image}},{type:'text',text:prompt}]}]})});
    if(!response.ok) throw new Error(`Anthropic returned ${response.status}: ${(await response.text()).slice(0,220)}`);
    let text=''; answer.textContent=''; status.textContent='';
    for await (const event of parseAnthropicStream(response.body)) { if (event.type==='content_block_delta' && event.delta?.type==='text_delta') { text+=event.delta.text; answer.innerHTML=sanitizeMarkdown(text); } }
    messages=[...history,{role:'user',content:[{type:'image',source:{type:'base64',media_type:'image/jpeg',data:image}},{type:'text',text:prompt}]},{role:'assistant',content:text}];
    $('#question').value='';
  } catch(error) { status.textContent=error.message || 'The request failed.'; }
  finally { ask.disabled=!stream; }
};
