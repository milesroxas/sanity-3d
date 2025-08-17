import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useVideoModalStore } from '../store/videoModalStore';

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-black">
      <div className="text-gray-400">Loading video...</div>
    </div>
  ),
});

export default function FullscreenVideoModal() {
  const { isOpen, video, closeModal } = useVideoModalStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeModal();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, closeModal]);

  if (!mounted || !isOpen) {
    return null;
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        className="relative aspect-video w-[95vw] max-w-6xl overflow-hidden rounded-lg bg-black shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Close video"
        >
          <X size={20} />
        </button>

        {/* Video Player */}
        <div className="h-full w-full">
          <MuxPlayer
            playbackId={video?.asset?.playbackId}
            metadata={{
              videoTitle: video?.asset?.filename || 'Video',
            }}
            theme="dark"
            autoPlay
            poster=""
            preload="auto"
            streamType="on-demand"
            style={{
              height: '100%',
              width: '100%',
            }}
          />
        </div>
      </div>
    </div>
  );

  // Portal to document.body to escape R3F context completely
  return createPortal(modalContent, document.body);
}
