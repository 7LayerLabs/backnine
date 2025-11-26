import Image from 'next/image';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt?: string;
}

export default function PageHeader({ title, subtitle, imageSrc, imageAlt = "Header Image" }: PageHeaderProps) {
  return (
    <div className="relative h-[40vh] w-full flex items-center justify-center overflow-hidden bg-b9-navy">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-4 drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto text-gray-200">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

