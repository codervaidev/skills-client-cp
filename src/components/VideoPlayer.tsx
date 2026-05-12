import React from "react";
import ReactYoutubePlayer from "./ReactYoutubePlayer";

interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
}

const TRUSTED_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "iframe.mediadelivery.net",
]);

export const getTrustedVideoUrl = (url: string): URL | null => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    if (!TRUSTED_HOSTS.has(parsed.hostname)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const toYoutubeEmbedUrl = (url: URL): string => {
  if (url.hostname === "youtu.be") {
    const videoId = url.pathname.replace("/", "");
    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.hostname.includes("youtube.com") && url.pathname === "/watch") {
    const videoId = url.searchParams.get("v");
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }

  return url.toString();
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, className = "" }) => {
  const safeUrl = getTrustedVideoUrl(videoUrl);

  if (!videoUrl || !safeUrl) {
    return null;
  }

  const isYouTubeUrl = safeUrl.hostname.includes("youtube.com") || safeUrl.hostname === "youtu.be";
  const isBunnyUrl = safeUrl.hostname === "iframe.mediadelivery.net";

  if (isYouTubeUrl) {
    return <ReactYoutubePlayer videoUrl={toYoutubeEmbedUrl(safeUrl)} />;
  }

  if (isBunnyUrl) {
    return (
      <iframe
        className={`rounded-xl w-full min-h-[260px] md:min-h-[400px] lg:min-h-[500px] ${className}`}
        src={safeUrl.toString()}
        loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-same-origin allow-scripts allow-presentation"
        allowFullScreen
      />
    );
  }

  return null;
};

export default VideoPlayer; 
