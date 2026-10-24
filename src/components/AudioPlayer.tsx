import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, ExternalLink } from 'lucide-react';
import { extractYouTubeVideoId } from '../utils/urlState';

interface AudioPlayerProps {
  queryOrUrl: string;
  songTitle?: string;
  autoPlay?: boolean;
  minimal?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  queryOrUrl,
  songTitle,
  autoPlay = false,
  minimal = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // When song changes, keep current playing state if user started it
    if (autoPlay && !hasInteracted) {
      setIsPlaying(true);
    }
  }, [queryOrUrl, autoPlay, hasInteracted]);

  if (!queryOrUrl || !queryOrUrl.trim()) {
    return null;
  }

  const videoId = extractYouTubeVideoId(queryOrUrl);
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&mute=${isMuted ? 1 : 0}`
    : `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(queryOrUrl)}&autoplay=${isPlaying ? 1 : 0}&loop=1&controls=0&mute=${isMuted ? 1 : 0}`;

  const displayName = songTitle || queryOrUrl;

  const handleTogglePlay = () => {
    setHasInteracted(true);
    setIsPlaying((prev) => !prev);
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  if (minimal) {
    return (
      <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-200/80 shadow-sm text-xs text-pink-700">
        {/* Hidden YouTube Iframe for audio streaming */}
        {isPlaying && (
          <div className="sr-only">
            <iframe
              title="YouTube Audio Player"
              width="200"
              height="200"
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              aria-hidden="true"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleTogglePlay}
          className="flex items-center gap-1.5 hover:text-pink-900 transition-colors font-medium"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span className="truncate max-w-[130px]">{displayName}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>Хөгжим тоглуулах</span>
            </>
          )}
        </button>

        {isPlaying && (
          <div className="flex items-center gap-0.5 ml-1">
            <span className="w-1 h-3 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-2 bg-pink-300 rounded-full animate-bounce" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative bg-white/80 backdrop-blur-md border border-pink-200/80 rounded-2xl p-3.5 shadow-sm">
      {/* Hidden iframe that plays the YouTube audio stream */}
      {isPlaying && (
        <div className="sr-only">
          <iframe
            title="YouTube Audio Player"
            width="200"
            height="200"
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            aria-hidden="true"
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
              isPlaying
                ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200'
                : 'bg-pink-100 text-pink-500'
            }`}
          >
            <Music className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-pink-500">
                Дэвсгэр хөгжим
              </span>
              {isPlaying && (
                <div className="flex items-center gap-0.5">
                  <span className="w-0.5 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-0.5 h-3 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-0.5 h-1.5 bg-pink-300 rounded-full animate-bounce" />
                </div>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-[260px]">
              {displayName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all shadow-sm ${
              isPlaying
                ? 'bg-pink-500 text-white hover:bg-pink-600'
                : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Зогсоох</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Тоглуулах</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? 'Дуу нээх' : 'Чимээгүй болгох'}
            className="p-1.5 rounded-lg text-slate-500 hover:text-pink-600 hover:bg-pink-50 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <a
            href={
              videoId
                ? `https://www.youtube.com/watch?v=${videoId}`
                : `https://www.youtube.com/results?search_query=${encodeURIComponent(queryOrUrl)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube дээр нээх"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
