import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { Play, Pause, Volume2, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
}

export function AudioPlayer({ audioUrl, title }: AudioPlayerProps) {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    const sound = new Howl({
      src: [audioUrl],
      html5: true,
      volume: volume,
      onload: () => setLoading(false),
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => setIsPlaying(false),
      onloaderror: () => {
        setLoading(false);
        console.error('Audio loading error');
      },
      onplayerror: () => {
        setIsPlaying(false);
        console.error('Audio playback error');
      },
    });

    howlRef.current = sound;
    setLoading(true);

    return () => {
      sound.unload();
    };
  }, [audioUrl, volume]);

  const togglePlay = () => {
    const sound = howlRef.current;
    if (!sound) return;

    if (isPlaying) {
      sound.pause();
    } else {
      sound.play();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (howlRef.current) {
      howlRef.current.volume(newVolume);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg">
      {title && (
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          {title}
        </h3>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          disabled={loading}
          className="flex-shrink-0 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label={isPlaying ? t('audio.pause') : t('audio.play')}
        >
          {loading ? (
            <Loader className="w-6 h-6 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </button>

        <div className="flex-1 flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            aria-label={t('audio.volume')}
          />
          <span className="text-gray-400 text-sm w-10 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {loading && (
        <p className="text-gray-400 text-sm mt-3 text-center">
          {t('audio.loading')}
        </p>
      )}
    </div>
  );
}
