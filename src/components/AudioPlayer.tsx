import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, ExternalLink, Disc3, Sparkles } from 'lucide-react';
import { extractYouTubeVideoId, getSongDisplayTitle } from '../utils/urlState';

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
  const [showVideo, setShowVideo] = useState(false);

  // Fixed exclusively to Stephen Sanchez - Until I Found You as requested
  const videoId = 'GxldQ9eX2wo';
  const displayName = 'Stephen Sanchez - Until I Found You';

  const prevVideoIdRef = React.useRef(videoId);

  useEffect(() => {
    if (prevVideoIdRef.current !== videoId) {
      prevVideoIdRef.current = videoId;
      // User switched to another song: start playing it immediately!
      setIsPlaying(true);
    } else if (autoPlay) {
      setIsPlaying(true);
    }
  }, [videoId, autoPlay]);

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Safe YouTube embed URL with proper origins and parameters
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${
    isPlaying ? 1 : 0
  }&loop=1&playlist=${videoId}&controls=1&mute=${
    isMuted ? 1 : 0
  }&enablejsapi=1&origin=${encodeURIComponent(origin)}`;

  if (minimal) {
    return (
      <div className="relative inline-flex flex-col items-center">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-200/90 shadow-sm text-xs text-pink-700">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex items-center gap-2 hover:text-pink-900 transition-colors font-bold"
          >
            <div
              className={`w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center shrink-0 ${
                isPlaying ? 'animate-spin [animation-duration:4s]' : ''
              }`}
            >
              <Disc3 className="w-4 h-4 text-pink-600" />
            </div>

            {isPlaying ? (
              <span className="flex items-center gap-1.5">
                <Pause className="w-3.5 h-3.5 fill-pink-600 text-pink-600" />
                <span className="truncate max-w-[140px] text-[11px]">{displayName}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-pink-600 text-pink-600" />
                <span className="text-[11px]">Хөгжим тоглуулах</span>
              </span>
            )}
          </button>

          {isPlaying && (
            <div className="flex items-center gap-0.5 ml-1">
              <span className="w-0.5 h-2.5 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-0.5 h-3.5 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-0.5 h-2 bg-pink-300 rounded-full animate-bounce" />
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowVideo((prev) => !prev)}
            title="Видео тоглуулагч харах"
            className="text-[10px] px-1.5 py-0.5 rounded-md bg-pink-50 hover:bg-pink-100 text-pink-600 font-medium ml-1"
          >
            {showVideo ? 'Нуух' : 'Видео'}
          </button>
        </div>

        {/* Small Active YouTube Player - kept visible so browser never throttles audio */}
        <div
          className={`overflow-hidden transition-all duration-300 mt-2 rounded-2xl shadow-lg border border-pink-200 bg-black ${
            showVideo && isPlaying ? 'w-56 h-32 opacity-100' : 'w-[1px] h-[1px] opacity-0 pointer-events-none'
          }`}
        >
          {isPlaying && (
            <iframe
              key={videoId}
              title="YouTube Audio Stream"
              width="100%"
              height="100%"
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-md border border-pink-200 rounded-3xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Song info & vinyl animation */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
              isPlaying
                ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200 animate-spin [animation-duration:5s]'
                : 'bg-pink-100 text-pink-500'
            }`}
          >
            <Disc3 className="w-6 h-6" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600">
                YouTube Дэвсгэр Хөгжим
              </span>
              {isPlaying && (
                <div className="flex items-center gap-0.5">
                  <span className="w-0.5 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-0.5 h-3 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-0.5 h-1.5 bg-pink-300 rounded-full animate-bounce" />
                </div>
              )}
            </div>
            <p className="text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-[280px]">
              {displayName}
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-xs ${
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
            className="p-2 rounded-xl text-slate-500 hover:text-pink-600 hover:bg-pink-50 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowVideo((prev) => !prev)}
            title="Тоглуулагчийг дэлгэх"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              showVideo
                ? 'bg-pink-50 text-pink-700 border-pink-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showVideo ? 'Нуух' : 'Видео'}
          </button>

          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube дээр нээх"
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Embedded YouTube Iframe - smoothly expandable */}
      <div
        className={`overflow-hidden transition-all duration-300 rounded-2xl bg-black ${
          showVideo && isPlaying ? 'h-48 opacity-100 mt-2' : isPlaying ? 'h-1 opacity-20' : 'h-0 opacity-0'
        }`}
      >
        {isPlaying && (
          <iframe
            key={videoId}
            title="YouTube Audio Stream"
            width="100%"
            height="100%"
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-full h-full rounded-2xl"
          />
        )}
      </div>
    </div>
  );
};
