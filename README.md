<p align="center"><img src="assets/icon.svg" width="72" alt="Peekpane"><br><strong>Peekpane</strong></p>

<p align="center">Ask about your screen without switching windows.</p>

<p align="center"><a href="README.zh-TW.md">Traditional Chinese</a> | <a href="https://arthur031221.github.io/Peekpane/">Walkthrough</a> | <a href="#try-it">Try it</a></p>

## One question, one floating panel

Today, asking about a page often means taking a screenshot, switching to chat, pasting it, then typing. Peekpane puts a small question panel beside the thing you are looking at. Share a screen, window, or tab, select a region, choose a quick action, and read the answer as it arrives.

**Current preview:** Chrome and Edge extension for manual screen capture, region selection, quick prompts, follow-up questions, and streamed answers through the model service API. The floating panel uses Document Picture-in-Picture.

[Open the visual walkthrough](https://arthur031221.github.io/Peekpane/)

## Try it

1. Download `peekpane-0.1.0.zip` from this repository and extract it.
2. Open `chrome://extensions`, turn on Developer mode, then choose **Load unpacked** and select the extracted folder.
3. Open Peekpane, enter your API key, and choose **Open floating panel**.
4. Choose a screen, window, or tab in the browser prompt. Select a region or ask about the frame.

The same extension directory can be loaded in Edge at `edge://extensions`. Chrome and Edge 116 or newer are required for Document Picture-in-Picture. Firefox and Safari are not supported.

## What happens to a capture

Screen capture starts only after you choose a source in the browser's permission prompt. Peekpane keeps the active stream in the panel and sends one JPEG frame to its configured model service when you ask a question. The API key stays in local browser storage and is not synced by Peekpane. The service receives the frame and prompt. API use is billed to your account. Stop sharing or close the panel to end capture.

This first preview does not include passive monitoring, full-page stitching, element picking, redaction, local history, the local coding-session bridge, or automated interaction with chat pages. The clipboard flow and additional translations are also future work.

## Development

Requires Node.js 18 or newer. No package installation is needed.

```sh
npm test
npm run build
```

The build creates `dist/`, ready to load as an unpacked extension. The tests cover stream event parsing and safe rendering of model text. They do not call a model service.

## License

MIT

Assisted by Claude/Codex.
