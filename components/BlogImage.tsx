import Image from "next/image";

export type BlogCategory =
  | 'overtime'
  | 'minimum-wage'
  | 'tipped'
  | 'classification'
  | 'paycheck'
  | 'time-off'
  | 'compliance'
  | 'recovery';

interface BlogImageProps {
  slug: string;
  className?: string;
  showCredit?: boolean;
  priority?: boolean;
}

export function BlogImage({ slug, className = '', showCredit = false, priority = false }: BlogImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={`/blog/posts/${slug}.jpg`}
        alt=""
        fill
        priority={priority}
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
      />
      {showCredit && (
        <a
          href="https://www.pexels.com"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-1.5 right-2 text-[10px] text-white/60 hover:text-white/90 transition-colors"
        >
          Photo · Pexels
        </a>
      )}
    </div>
  );
}
