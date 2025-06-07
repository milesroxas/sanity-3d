import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';

interface VideoModalProps {
  video?: Sanity.Video;
  onClose?: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), {
    ssr: true,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center rounded-md bg-black">
        <div className="text-gray-400">Loading video...</div>
      </div>
    ),
  });

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <Dialog defaultOpen={true} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="max-w-[90vw] overflow-hidden rounded-lg border-none bg-black p-0 shadow-2xl">
        <DialogTitle className="sr-only">
          Video: {video?.asset?.filename || 'Landing Page Video'}
        </DialogTitle>
        <div className="relative aspect-video w-full">
          <MuxPlayer
            playbackId={video?.asset?.playbackId}
            metadata={{
              videoTitle: video?.asset?.filename || 'Landing Page Video',
            }}
            theme="dark"
            autoPlay
            poster=""
            preload="auto" // Preload video data
            style={{
              height: '100%',
              width: '100%',
            }}
          />

          <DialogClose asChild>
            <button
              onClick={handleClose}
              className="absolute right-[-10rem] top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
