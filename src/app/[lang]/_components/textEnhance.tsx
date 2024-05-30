import React from "react";

type TextEnhance = {
  text: string;
};

const TextEnhance = ({ text = "" }: TextEnhance) => {
  // 正则表达式，用于匹配 URL
  const urlPattern =
    /(https?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

  // 使用正则表达式分割文本
  const parts = text.split(urlPattern);

  return (
    <p>
      {parts.map((part, index) =>
        urlPattern.test(part) ? (
          <a
            className="text-blue-400"
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </p>
  );
};

export default TextEnhance;
