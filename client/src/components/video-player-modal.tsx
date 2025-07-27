import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { fetchMovieDetails, getVidSrcUrl } from "../lib/tmdb-api";

interface VideoPlayerModalProps {
  movieId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoPlayerModal({ movieId, isOpen, onClose }: VideoPlayerModalProps) {
  const { data: movieDetails } = useQuery({
    queryKey: ["/api/movies", movieId],
    queryFn: () => fetchMovieDetails(movieId!),
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000,
  });

  const videoUrl = movieDetails?.imdb_id ? getVidSrcUrl(movieDetails.imdb_id) : "";

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
              src={videoUrl}
              className="w-full h-full min-h-[80vh]"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={`Watch ${movieDetails?.title}`}
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
