<p align="center"><img src="assets/icon.svg" width="72" alt="Peekpane 標誌"><br><strong>Peekpane</strong></p>

<p align="center">留在原本的視窗，也能詢問畫面上的內容。</p>

<p align="center"><a href="README.md">English</a> · <a href="https://arthur031221.github.io/Peekpane/">功能導覽</a></p>

## 只問一句，不必切換視窗

想問網頁上的內容時，通常要先截圖，再切到聊天視窗貼上圖片和問題。Peekpane 會把提問面板浮在旁邊。選擇畫面、視窗或分頁後，可以框選範圍、使用快速提問，並即時閱讀回答。

**目前預覽版：** Chrome 與 Edge 擴充功能，支援手動分享畫面、框選範圍、快速提問、追問，以及透過 model service API 串流回答。浮動面板使用 Document Picture-in-Picture。

[查看操作導覽](https://arthur031221.github.io/Peekpane/)

## 開始使用

1. 下載此專案的 `peekpane-0.1.0.zip` 並解壓縮。
2. 開啟 `chrome://extensions`，啟用開發人員模式，點選「載入未封裝項目」並選擇解壓縮的資料夾。
3. 開啟 Peekpane，輸入自己的 model service API 金鑰，再選擇「開啟浮動面板」。
4. 在瀏覽器的權限視窗選擇要分享的螢幕、視窗或分頁。接著框選範圍或詢問目前畫面。

也可以在 Edge 的 `edge://extensions` 載入相同資料夾。Document Picture-in-Picture 需要 Chrome 或 Edge 116 以上版本，不支援 Firefox 和 Safari。

## 畫面資料如何處理

按下瀏覽器權限視窗中的選擇後，才會開始分享畫面。Peekpane 將串流保留在面板中，只有送出問題時才會把單張 JPEG 畫面傳到設定的模型服務。API 金鑰只儲存在本機瀏覽器，不會由 Peekpane 同步。服務會收到畫面和問題，API 使用費由使用者的帳戶支付。停止分享或關閉面板即可結束擷取。

這個預覽版尚未提供背景監看、整頁拼接、網頁元素選取、敏感區域遮罩、本機歷史記錄、本機程式編輯工作階段橋接、剪貼簿流程或其他介面語言，也不會自動操作聊天網頁。

## 開發

需要 Node.js 18 以上，不必安裝套件。

```sh
npm test
npm run build
```

建置結果位於 `dist/`，可作為未封裝擴充功能載入。測試涵蓋串流事件解析與安全顯示模型文字，不會呼叫模型服務。

## 授權

MIT

Assisted by Claude/Codex.
