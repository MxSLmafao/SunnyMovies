import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { fetchMovieDetails, getVidSrcUrl } from "../lib/tmdb-api";
import { useEffect, useRef } from "react";
import { AdBlocker, blockAdRequests } from "../lib/ad-blocker";

interface VideoPlayerModalProps {
  movieId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoPlayerModal({ movieId, isOpen, onClose }: VideoPlayerModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const { data: movieDetails } = useQuery({
    queryKey: ["/api/movies", movieId],
    queryFn: () => fetchMovieDetails(movieId!),
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000,
  });

  const videoUrl = movieDetails?.imdb_id ? getVidSrcUrl(movieDetails.imdb_id) : "";

  // Initialize comprehensive ad blocking
  useEffect(() => {
    if (isOpen) {
      const adBlocker = AdBlocker.getInstance();
      
      // Activate ad blocking when video modal opens
      adBlocker.activate();
      blockAdRequests();
      
      // Prevent page navigation and popups
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? The video will stop playing.';
        return e.returnValue;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        // Deactivate ad blocking when modal closes
        adBlocker.deactivate();
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isOpen]);

  if (!isOpen || !movieId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-full max-h-screen p-0 bg-black border-none">
        <div className="relative w-full h-full">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:text-light-grey z-10 bg-black bg-opacity-50 rounded-full"
          >
            <X size={24} />
          </Button>

          {videoUrl ? (
            <iframe
              ref={iframeRef}
              src={videoUrl}
              className="w-full h-full min-h-[80vh]"
              frameBorder="0"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={`Watch ${movieDetails?.title}`}
              onLoad={() => {
                // Additional iframe-level protection
                const iframe = iframeRef.current;
                if (iframe && iframe.contentWindow) {
                  try {
                    // Try to inject popup blocking script into iframe
                    const script = iframe.contentDocument?.createElement('script');
                    if (script) {
                      script.textContent = `
                        // Block popups from within iframe
                        window.open = function() { return null; };
                        // Block navigation attempts
                        window.location.assign = function() {};
                        window.location.replace = function() {};
                        // Block target="_blank" links
                        document.addEventListener('click', function(e) {
                          if (e.target.tagName === 'A' && e.target.target === '_blank') {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }, true);
                      `;
                      iframe.contentDocument?.head?.appendChild(script);
                    }
                  } catch (e) {
                    // Cross-origin restrictions prevent script injection, but sandbox will still help
                    console.log('Cross-origin iframe detected, relying on sandbox restrictions');
                  }
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-white text-lg mb-4">
                  Sorry, this movie is not available for streaming.
                </p>
                <p className="text-light-grey">
                  IMDB ID not found or streaming source unavailable.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
