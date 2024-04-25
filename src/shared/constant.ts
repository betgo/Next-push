export enum MESSAGETYPE {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
}

/** response code */
export const UNAUTHORIZED = "UNAUTHORIZED";

export const ResponseCode = {
  // 无权限访问
  [UNAUTHORIZED]: {
    message: "密码错误，请设置访问密码",
  },
};
