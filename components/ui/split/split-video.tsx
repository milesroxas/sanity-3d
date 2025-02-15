"use client";
import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useState } from "react";

export interface SplitVideoProps {
  video: {
    title?: string;
    video: {
      asset: {
        _id: string;
        playbackId: string;
        assetId: string;
        filename: string;
      };
    };
  };
}

export default function SplitVideo({ video }: Partial<SplitVideoProps>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !video?.video?.asset?.playbackId) return null;

  return (
    <div className="relative h-[25rem] sm:h-[30rem] md:h-[25rem] lg:h-full rounded-lg overflow-hidden">
      <MuxPlayer
        playbackId={video.video.asset.playbackId}
        metadata={{ video_title: video?.title }}
      />
    </div>
  );
}
