// 文字复制
export const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text ?? "");
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = text ?? "";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};

// 图片复制
export const copyImage = async (url: string) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const img = new Image();

  img.crossOrigin = "Anonymous";
  img.src = url;

  return new Promise<void>((resolve, reject) => {
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(img, 0, 0);
      // 将canvas转为blob
      const blob: Blob | PromiseLike<Blob> = await new Promise((resolve) => {
        canvas.toBlob(resolve as BlobCallback);
      });
      const clipboardItems = [
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ];
      try {
        await navigator.clipboard.write(clipboardItems);
        return resolve();
      } catch (error) {
        return reject(error);
      }
    };
  });
};

/**
 * 格式化文件大小
 *
 * @param {number} bytes - The size of the file in bytes
 * @return {string} The formatted file size
 */
export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function askNotificationPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // 让我们检查一下浏览器是否支持通知
      if (!(window && "Notification" in window)) {
        console.log("此浏览器不支持通知。");
        resolve(false);
      } else {
        void Notification.requestPermission()
          .then((permission: NotificationPermission) => {
            resolve(permission === "granted");
          })
          .catch((res) => {
            resolve(false);
          });
      }
    } catch (error) {
      resolve(false);
    }
  });
}
