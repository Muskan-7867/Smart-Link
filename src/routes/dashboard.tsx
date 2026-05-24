import { useState, useMemo } from "react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { getLinks } from "#/server/get-links";
import LinkCard from "#/components/LinkCard";
import AddLinkForm from "#/components/LinkForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Link2,
  Plus,
  Search,
  Star,
  LayoutGrid,
  X,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context }: any) => {
    // If no session, redirect to login
    // if (context && !context.session) {
    //   throw redirect({ to: "/login" });
    // }
  },
  loader: async () => {
    const links = await getLinks();
    return { links };
  },
  component: DashboardPage,
});

const CATEGORIES = [
  "all",
  "frontend",
  "backend",
  "ai",
  "design",
  "devops",
  "career",
  "other",
];

type Tab = "all" | "favorites";

function DashboardPage() {
  const { links: initialLinks } = Route.useLoaderData();
  const router = useRouter();

  const [links, setLinks] = useState(initialLinks);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // Derived filtered links
  const filtered = useMemo(() => {
    let result = [...links];

    if (activeTab === "favorites") {
      result = result.filter((l) => l.favorite);
    }

    if (activeCategory !== "all") {
      result = result.filter(
        (l) => (l.category ?? "other").toLowerCase() === activeCategory
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          (l.title ?? "").toLowerCase().includes(q) ||
          l.url.toLowerCase().includes(q) ||
          (l.description ?? "").toLowerCase().includes(q)
      );
    }

    return result;
  }, [links, activeTab, activeCategory, search]);

  const handleDeleted = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleFavoriteToggled = (id: string, fav: boolean) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, favorite: fav } : l))
    );
  };

  const handleLinkAdded = () => {
    setShowAddForm(false);
    // Refetch to get latest from server
    router.invalidate();
  };

  const favCount = links.filter((l) => l.favorite).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Page header */}
      <div className="border-b border-white/8 bg-zinc-900/60 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20">
                <Link2 className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">My Links</h1>
                <p className="text-xs text-zinc-400">
                  {links.length} link{links.length !== 1 ? "s" : ""} saved
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowAddForm(true)}
              className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Link
            </Button>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex gap-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              All Links
              <span className="ml-1 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                {links.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "favorites"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Star className="h-4 w-4" />
              Favorites
              <span className="ml-1 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                {favCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Search + Category filter row */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Search links by title, URL, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-white/10 bg-zinc-900 pl-10 text-white placeholder:text-zinc-600 focus-visible:ring-blue-500"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                activeCategory === cat
                  ? "border-blue-500/50 bg-blue-500/20 text-blue-400"
                  : "border-white/10 bg-zinc-900 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
              }`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        {/* Links Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
            <Link2 className="mb-4 h-10 w-10 text-zinc-700" />
            <p className="text-lg font-semibold text-zinc-400">
              {links.length === 0
                ? "No links yet"
                : "No links match your filters"}
            </p>
            <p className="mt-1 text-sm text-zinc-600">
              {links.length === 0
                ? 'Click "Add Link" to save your first resource.'
                : "Try changing your search or category filter."}
            </p>
            {links.length === 0 && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="mt-6 gap-2 rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Your First Link
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onDeleted={handleDeleted}
                onFavoriteToggled={handleFavoriteToggled}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Link Modal */}
      {showAddForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddForm(false);
          }}
        >
          <div className="w-full max-w-lg">
            <div className="mb-2 flex justify-end">
              <button
                onClick={() => setShowAddForm(false)}
                className="rounded-full bg-zinc-800 p-1.5 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <AddLinkForm onSuccess={handleLinkAdded} />
          </div>
        </div>
      )}
    </div>
  );
}
