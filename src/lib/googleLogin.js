// Translate provider failures without changing accounts, persistence, or stored data.
export function googleLoginMessage(code) {
  switch (code) {
    case 'auth/unauthorized-domain':
      return '這個網址尚未完成 Google 登入授權設定。請聯絡管理員，無須重新註冊帳號。';
    case 'auth/popup-blocked':
      return '登入視窗被瀏覽器擋住了。請用 Chrome 或 Safari 開啟此頁，允許此網站的彈出式視窗後重試。';
    case 'auth/popup-closed-by-user':
      return '登入視窗已關閉，尚未完成登入。你可以再試一次。';
    case 'auth/cancelled-popup-request':
      return '已有另一個登入視窗，請先完成或關閉它後再試。';
    case 'auth/network-request-failed':
      return '暫時無法連上 Google 登入服務，請檢查網路後重試。';
    case 'auth/operation-not-supported-in-this-environment':
    case 'auth/web-storage-unsupported':
      return '這個瀏覽器環境無法完成 Google 登入。請改用 Chrome 或 Safari 的一般視窗開啟。';
    case 'auth/operation-not-allowed':
      return 'Google 登入服務尚未啟用，請聯絡管理員。';
    default:
      return 'Google 登入未完成，請稍後重試；若在 App 內開啟，請改用 Chrome 或 Safari。';
  }
}

export async function runGoogleLogin(openPopup) {
  try {
    // Invoke immediately, before any await, to preserve the click's user gesture.
    await openPopup();
    return { success: true };
  } catch (error) {
    const code = typeof error?.code === 'string' ? error.code : 'auth/unknown';
    return { success: false, code, error: googleLoginMessage(code) };
  }
}
