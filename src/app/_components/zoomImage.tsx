import React, { type CSSProperties, useRef, useState } from "react";
import { default as Image, type ImageProps } from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

/**
 * Zoom component
 *
 */
export const ZoomImage = (props: ImageProps) => {
  return (
    <Zoom>
      <div style={{ height: "150px" }}>
        <Image {...props} />
      </div>
    </Zoom>
  );
};

export default ZoomImage;
