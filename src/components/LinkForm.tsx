import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Star } from "lucide-react";
import { addLink } from "#/server/add-link";
import { toast } from "sonner";

interface AddLinkFormProps {
  onSuccess?: () => void;
}

export default function AddLinkForm({ onSuccess }: AddLinkFormProps) {
  const [loading, setLoading] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    category: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCategory = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

    const data =   await addLink({
        data: {
          title: formData.title,
          url: formData.url,
          description: formData.description || undefined,
          category: formData.category || undefined,
          favorite,
        },
      });

      console.log("from linkform", data)

      toast.success("Link added successfully! 🎉");

      setFormData({ title: "", url: "", description: "", category: "" });
      setFavorite(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-white/10 bg-zinc-900 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Plus className="h-6 w-6 text-blue-500" />
          Add New Link
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Title *</label>
            <Input
              name="title"
              placeholder="Enter link title"
              value={formData.title}
              onChange={handleChange}
              required
              className="border-white/10 bg-zinc-950 text-white placeholder:text-zinc-600"
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">URL *</label>
            <Input
              name="url"
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={handleChange}
              required
              className="border-white/10 bg-zinc-950 text-white placeholder:text-zinc-600"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Category</label>
            <Select onValueChange={handleCategory} value={formData.category}>
              <SelectTrigger className="border-white/10 bg-zinc-950 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/10 text-white">
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Description</label>
            <Textarea
              name="description"
              placeholder="Write a short description..."
              value={formData.description}
              onChange={handleChange}
              className="min-h-[100px] border-white/10 bg-zinc-950 text-white placeholder:text-zinc-600"
            />
          </div>

          {/* Favorite toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFavorite((f) => !f)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                favorite
                  ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                  : "border-white/10 bg-zinc-950 text-zinc-400 hover:border-yellow-500/30 hover:text-yellow-400"
              }`}
            >
              <Star
                className={`h-4 w-4 ${favorite ? "fill-yellow-400 text-yellow-400" : ""}`}
              />
              {favorite ? "Marked as Favorite" : "Mark as Favorite"}
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Link...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Link
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}