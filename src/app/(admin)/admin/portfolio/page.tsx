"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  techStack: string[];
  liveUrl: string | null;
  featured: boolean;
}

export default function AdminPortfolioPage() {
  const router = useRouter();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await fetch("/api/portfolio");
    const data = await response.json();
    setItems(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    fetchItems();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <Button onClick={() => { setEditingItem(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {showForm && (
        <PortfolioForm
          item={editingItem}
          onClose={() => { setShowForm(false); setEditingItem(null); }}
          onSave={() => { setShowForm(false); setEditingItem(null); fetchItems(); }}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No portfolio items yet. Add your first project above.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{item.title}</h3>
                      {item.featured && <Badge>Featured</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{item.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.techStack.join(", ")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setEditingItem(item); setShowForm(true); }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PortfolioForm({
  item,
  onClose,
  onSave,
}: {
  item: PortfolioItem | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: item?.title || "",
    slug: item?.slug || "",
    description: item?.description || "",
    category: item?.category || "",
    techStack: item?.techStack.join(", ") || "",
    liveUrl: item?.liveUrl || "",
    featured: item?.featured || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      techStack: formData.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    };

    const url = item ? `/api/portfolio/${item.id}` : "/api/portfolio";
    const method = item ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      onSave();
    }
    setIsLoading(false);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{item ? "Edit" : "Add"} Portfolio Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label>Slug</Label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="auto-generated from title"
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Category</Label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., E-Commerce, Web App"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label>Tech Stack (comma-separated)</Label>
            <Input
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
              placeholder="React, Next.js, PostgreSQL"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Live URL</Label>
            <Input
              value={formData.liveUrl}
              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              placeholder="https://example.com"
              className="mt-1"
            />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="featured">Featured project</Label>
          </div>
          <div className="md:col-span-2 flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : item ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
