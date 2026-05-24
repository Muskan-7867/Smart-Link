import { useState, useMemo } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { getLinks } from "#/server/get-links";
import LinkCard from "#/components/LinkCard";
import AddLinkForm from "#/components/LinkForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  LayoutGrid,
  Star,
  X,
  Link2,
} from "lucide-react";

export const Route = createFileRoute("/")(({
  loader: async () => {
    const links = await getLinks();
    return { links };
  },
  component: HomePage,
} as any));

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

function HomePage() {
  const { links: initialLinks } = Route.useLoaderData() as any;
  const router = useRouter();

  const [links, setLinks] = useState<any[]>(initialLinks ?? []);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);

  const filtered = useMemo(() => {
    let result = [...links];
    if (activeTab === "favorites") result = result.filter((l) => l.favorite);
    if (activeCategory !== "all")
      result = result.filter(
        (l) => (l.category ?? "other").toLowerCase() === activeCategory
      );
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

  const handleDeleted = (id: string) =>
    setLinks((prev) => prev.filter((l) => l.id !== id));

  const handleFavoriteToggled = (id: string, fav: boolean) =>
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, favorite: fav } : l))
    );

  const handleLinkAdded = () => {
    setShowAddForm(false);
    router.invalidate();
  };

  const favCount = links.filter((l) => l.favorite).length;

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-black/10 dark:bg-black dark:text-white dark:selection:bg-white/20">
      
      {/* ── Minimal Header / Hero ── */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
            Smart Link
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            A minimal, fast way to save and manage your favorite resources.
          </p>

          {/* Global Search & Action */}
          <div className="mt-10 flex w-full max-w-2xl items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search your links..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-14 rounded-2xl border-zinc-200 bg-zinc-100 pl-12 text-base text-zinc-900 placeholder:text-zinc-500 focus-visible:border-zinc-300 focus-visible:bg-zinc-200 focus-visible:ring-0 dark:border-white/10 dark:bg-zinc-900/50 dark:text-white dark:focus-visible:border-white/20 dark:focus-visible:bg-zinc-900"
              />
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="h-14 rounded-2xl bg-zinc-200 px-6 font-medium text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Link
            </Button>
          </div>
        </div>
      </section>

      {/* ── Links Section ── */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        
        {/* Filters Header */}
        <div className="mb-8 flex flex-col gap-6 border-b border-zinc-200 pb-6 md:flex-row md:items-center md:justify-between dark:border-white/10">
          
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-zinc-200 text-zinc-900 dark:bg-white/10 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              All Links
              <span className="ml-1 text-xs text-zinc-500">{links.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "favorites"
                  ? "bg-zinc-200 text-zinc-900 dark:bg-white/10 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
              }`}
            >
              <Star className="h-4 w-4" />
              Favorites
              <span className="ml-1 text-xs text-zinc-500">{favCount}</span>
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  activeCategory === cat
                    ? "border-zinc-300 bg-zinc-200 text-zinc-900 dark:border-white/20 dark:bg-white/10 dark:text-white"
                    : "border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200"
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Links Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 py-32 text-center dark:border-white/10">
            <Link2 className="mb-4 h-8 w-8 text-zinc-600" />
            <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
              {links.length === 0 ? "You haven't saved any links yet." : "No links match your filters."}
            </p>
            {links.length === 0 && (
              <Button
                onClick={() => setShowAddForm(true)}
                variant="outline"
                className="mt-6 rounded-xl border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/10 dark:text-white dark:hover:bg-white/5 dark:hover:text-white"
              >
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
      </section>

      {/* ── Add Link Modal ── */}
      {showAddForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm dark:bg-black/80"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddForm(false);
          }}
        >
          <div className="w-full max-w-lg">
            <div className="mb-3 flex justify-end">
              <button
                onClick={() => setShowAddForm(false)}
                className="rounded-full bg-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-300 hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950">
              <AddLinkForm onSuccess={handleLinkAdded} />
            </div>
          </div>
        </div>
      )}
      {/* ── Minimal Footer ── */}
      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-white/10">
        <p>© {new Date().getFullYear()} SmartLink. Built with TanStack Start.</p>
      </footer>
    </div>
  );
}