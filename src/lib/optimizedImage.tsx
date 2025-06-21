// src/lib/optimizedImage.tsx

import Image from 'next/image';
import { urlFor } from '@/lib/image';

interface OptimizedImageProps {
  image: any;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function OptimizedImage({
  image,
  alt,
  width,
  height,
  className,
  priority = false
}: OptimizedImageProps) {
  const imageUrl = urlFor(image).width(width).height(height).url();
  
  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className || ""}
      priority={priority}
      quality={90}
    />
  );
}