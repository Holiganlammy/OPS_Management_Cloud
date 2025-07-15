import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function SafeImage({
  src,
  alt = "image",
  width = 200,
  height = 200,
}: Props) {
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;

    img.onload = () => setValid(true);
    img.onerror = () => setValid(false);

    // cleanup (optional)
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (valid === null) {
    return (
      <div className="flex items-center justify-center space-x-4 p-6 max-w-xs mx-auto">
        <div className="flex-shrink-0">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-black rounded-full"></div>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-700">กำลังโหลดรูปภาพ...</p>
        </div>
      </div>
    );
  }

  return valid ? (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="rounded"
    />
  ) : (
    <div className="flex items-center justify-center space-x-4 p-6 bg-gray-100 rounded-md shadow-sm max-w-xs mx-auto">
      <div className="flex-shrink-0">
        <ImageOff className="w-24 h-24 text-gray-400" />
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-700">No Image</p>
        <p className="text-sm font-semibold text-gray-700">Image error !!!</p>
        <span className="sr-only">No Image available</span>
      </div>
    </div>
  );
}
