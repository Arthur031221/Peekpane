import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAnthropicStream, sanitizeMarkdown } from '../src/utils.js';
const streamOf=(s)=>new ReadableStream({start(c){c.enqueue(new TextEncoder().encode(s));c.close();}});
test('parses streamed Anthropic text events and ignores malformed frames',async()=>{const raw='event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Hello"}}\n\ndata: nope\n\ndata: {"type":"message_stop"}\n\n';const out=[];for await(const e of parseAnthropicStream(streamOf(raw)))out.push(e.type);assert.deepEqual(out,['content_block_delta','message_stop']);});
test('renders model text as inert HTML',()=>{assert.equal(sanitizeMarkdown('<img src=x onerror=alert(1)>'),'<p>&lt;img src=x onerror=alert(1)&gt;</p>');});
