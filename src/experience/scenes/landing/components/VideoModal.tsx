import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useCallback, useEffect } from 'react';

interface VideoModalProps {
  video?: Sanity.Video;
  onClose?: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), {
    ssr: false, // Avoid SSR hydration issues
    loading: () => (
      <div className="flex h-full w-full items-center justify-center rounded-md bg-black">
        <div className="text-gray-400">Loading video...</div>
      </div>
    ),
  });

  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleClose]);

  // Prevent backdrop click from bubbling
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-[90vw] overflow-hidden rounded-lg bg-black shadow-2xl">
        <div className="relative aspect-video w-full">
          {video?.asset?.playbackId && (
            <MuxPlayer
              playbackId={video.asset.playbackId}
              metadata={{
                videoTitle: video.asset.filename || 'Landing Page Video',
              }}
              theme="dark"
              autoPlay
              poster=""
              preload="auto"
              style={{
                height: '100%',
                width: '100%',
              }}
            />
          )}

          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
            aria-label="Close video"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
