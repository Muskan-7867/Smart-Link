import { useState } from "react";
import { ExternalLink, Star, Trash2, Globe } from "lucide-react";
import { deleteLink } from "#/server/delete-link";
import { toggleFavorite } from "#/server/toggle-favorite";
import { toast } from "sonner";

interface Link {
  id: string;
  title: string | null;
  url: string;
  description: string | null;
  category: string | null;
  favorite: boolean | null;
  userId: string | null;
  createdAt: Date | null;
}

interface LinkCardProps {
  link: Link;
  onDeleted: (id: string) => void;
  onFavoriteToggled: (id: string, favorite: boolean) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  frontend: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  backend: "bg-green-500/15 text-green-400 border-green-500/20",
  ai: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  design: "bg-pink-500/15 text-pink-400 border-pink-500/20",
  devops: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  career: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  other: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

function getFavicon(url: string) {
  try {
    const { origin } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${origin}&sz=32`;
  } catch {
    return null;
  }
}

export default function LinkCard({
  link,
  onDeleted,
  onFavoriteToggled,
}: LinkCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [imgError, setImgError] = useState(false);

  const catKey = (link.category ?? "other").toLowerCase();
  const catClass =
    CATEGORY_COLORS[catKey] ?? CATEGORY_COLORS["other"];
  const favicon = getFavicon(link.url);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteLink({ data: { id: link.id } });
      onDeleted(link.id);
      toast.success("Link deleted");
    } catch {
      toast.error("Failed to delete link");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      setToggling(true);
      const newFav = !link.favorite;
      await toggleFavorite({ data: { id: link.id, favorite: newFav } });
      onFavoriteToggled(link.id, newFav);
      toast.success(newFav ? "Added to favorites ⭐" : "Removed from favorites");
    } catch {
      toast.error("Failed to update favorite");
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/8 bg-zinc-900 p-4 transition-all duration-200">
      {/* Top row: favicon + domain + actions */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {favicon && !imgError ? (
            <img
              src={favicon}
              alt=""
              width={18}
              height={18}
              className="rounded-sm flex-shrink-0"
              onError={() => setImgError(true)}
            />
          ) : (
            <Globe className="h-4 w-4 flex-shrink-0 text-zinc-500" />
          )}
          <span className="truncate text-xs text-zinc-500">
            {getDomain(link.url)}
          </span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Favorite */}
          <button
            onClick={handleToggleFavorite}
            disabled={toggling}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-yellow-500/10 hover:text-yellow-400 disabled:opacity-50"
            title={link.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              className={`h-4 w-4 transition-all ${
                link.favorite ? "fill-yellow-400 text-yellow-400" : ""
              }`}
            />
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
            title="Delete link"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Category badge */}
      {link.category && (
        <span
          className={`mb-3 inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${catClass}`}
        >
          {link.category}
        </span>
      )}

      {/* Title */}
      <h3 className="mb-1.5 line-clamp-2 text-sm font-semibold leading-snug text-white">
        {link.title || getDomain(link.url)}
      </h3>

      {/* Description */}
      {link.description && (
        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-zinc-400">
          {link.description}
        </p>
      )}

      {/* Open link */}
      <div className="mt-auto pt-3">
        <a
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors  hover:text-blue-400"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open Link
        </a>
      </div>
    </div>
  );
}
