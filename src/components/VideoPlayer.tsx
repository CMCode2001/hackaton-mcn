import { useTranslation } from 'react-i18next';
import { Video } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg">
      {title && (
        <div className="p-4 bg-gray-900/50">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Video className="w-5 h-5" />
            {title}
          </h3>
        </div>
      )}

      <div className="relative aspect-video bg-black">
        <video
          controls
          className="w-full h-full"
          preload="metadata"
          controlsList="nodownload"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <p className="text-white p-4">{t('video.unavailable')}</p>
        </video>
      </div>
    </div>
  );
}
