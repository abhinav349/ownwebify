"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  avatarUrl: string | null;
  rating: number | null;
  published: boolean;
  featured: boolean;
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const fetchItems = async () => {
    const response = await fetch("/api/admin/testimonials");
    const data = await response.json();
    setItems(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Only published testimonials appear on the homepage.
          </p>
        </div>
        <Button onClick={() => { setEditingItem(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {showForm && (
        <TestimonialForm
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
            <p className="text-muted-foreground">No testimonials yet. Add your first one above.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.role && (
                        <span className="text-xs text-muted-foreground">{item.role}</span>
                      )}
                      {item.featured && <Badge>Featured</Badge>}
                      <Badge variant={item.published ? "default" : "secondary"}>
                        {item.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">&ldquo;{item.quote}&rdquo;</p>
                    {item.rating && (
                      <div className="flex items-center gap-0.5">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                        ))}
                      </div>
                    )}
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

function TestimonialForm({
  item,
  onClose,
  onSave,
}: {
  item: Testimonial | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: item?.name || "",
    role: item?.role || "",
    quote: item?.quote || "",
    avatarUrl: item?.avatarUrl || "",
    rating: item?.rating?.toString() || "5",
    published: item?.published || false,
    featured: item?.featured || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      rating: formData.rating ? Number(formData.rating) : null,
    };

    const url = item ? `/api/testimonials/${item.id}` : "/api/testimonials";
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
        <CardTitle>{item ? "Edit" : "Add"} Testimonial</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label>Role / Company</Label>
            <Input
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Founder, Acme Co."
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Quote</Label>
            <Textarea
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              required
              rows={3}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Avatar URL</Label>
            <Input
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Rating (1-5)</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="published">Published (visible on homepage)</Label>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="featured">Featured testimonial</Label>
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
