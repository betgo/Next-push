export enum MESSAGETYPE {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
}

export enum SHORTKEY {
  ENTER = "ENTER",
  CTRL_ENTER = "CTRL_ENTER",
}

// shortkeys
export const ShortKeys = [
  { key: SHORTKEY.ENTER, label: "Enter" },
  {
    key: SHORTKEY.CTRL_ENTER,
    label: "Ctrl+Enter",
  },
];

/** response code */
export const UNAUTHORIZED = "UNAUTHORIZED";

export const ResponseCode = {
  // 无权限访问
  [UNAUTHORIZED]: {
    message: "密码错误，请设置访问密码",
  },
};
