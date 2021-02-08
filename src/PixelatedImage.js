import React from "react";
import "./PixelatedImage.css";

function PixelatedImage({ className, intrinsicSize, url, width }) {
  const urlObject = new URL(url);

  urlObject.searchParams.set("s", intrinsicSize.toString());

  return (
    <img
      alt=""
      className={`pixelated-image ${className ? className : ""}`}
      src={urlObject.toString()}
      style={{ width }}
    />
  );
}

export default PixelatedImage;
