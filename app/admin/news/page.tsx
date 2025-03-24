"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Layout from "@/app/components/layout/Layout";
import { PlusCircle, Edit2, Trash2, Save, X } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

interface NewsItem {
  id: string;
  heading: string;
  content: string;
  createdAt: any;
}

export default function NewsManagement() {
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const newsRef = collection(db, "news");
      const q = query(newsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const news: NewsItem[] = [];
      querySnapshot.forEach((doc) => {
        news.push({ id: doc.id, ...doc.data() } as NewsItem);
      });
      setNewsItems(news);
      toast.success("News articles loaded successfully!");
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Failed to load news items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heading.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        const newsRef = doc(db, "news", editingId);
        await updateDoc(newsRef, {
          heading,
          content,
          updatedAt: serverTimestamp(),
        });
        toast.success("News article updated successfully!");
        setEditingId(null);
      } else {
        const newsRef = collection(db, "news");
        await addDoc(newsRef, {
          heading,
          content,
          createdAt: serverTimestamp(),
        });
        toast.success("News article published successfully!");
      }
      setHeading("");
      setContent("");
      fetchNews();
    } catch (error) {
      console.error("Error saving news:", error);
      toast.error("Failed to save news item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setHeading(item.heading);
    setContent(item.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "news", id));
        toast.success("News article deleted successfully!");
        fetchNews();
      } catch (error) {
        console.error("Error deleting news:", error);
        toast.error("Failed to delete news item. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setHeading("");
    setContent("");
  };

  return (
    <Layout>
      {/* Add the Toaster container */}
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
          <p className="mt-2 text-gray-600">Create and manage news articles for your site</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8 border border-gray-100">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              {editingId ? (
                <>
                  <Edit2 size={20} className="mr-2" />
                  Edit News Article
                </>
              ) : (
                <>
                  <PlusCircle size={20} className="mr-2" />
                  Create News Article
                </>
              )}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heading
              </label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                placeholder="Enter descriptive news headline"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                placeholder="Enter the full news content here..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 bg-gradient-to-r from-green-600 to-green-600 text-white font-medium rounded-lg flex items-center justify-center hover:from-green-700 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "Processing..."
                ) : editingId ? (
                  <>
                    <Save size={18} className="mr-2" />
                    Update Article
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} className="mr-2" />
                    Publish Article
                  </>
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg flex items-center hover:bg-gray-200 transition-all"
                >
                  <X size={18} className="mr-2" />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-green-800 to-green-900 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">News Articles</h2>
            <span className="bg-white text-xl bg-opacity-20 text-black py-1 px-3 rounded-full">
              {newsItems.length} {newsItems.length === 1 ? "Article" : "Articles"}
            </span>
          </div>
          <div className="p-6">
            {loading && newsItems.length === 0 ? (
              <div className="flex justify-center py-12">
                <div className="animate-pulse text-gray-400">Loading news articles...</div>
              </div>
            ) : newsItems.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                <div className="text-gray-400 mb-2">No news articles yet</div>
                <p className="text-sm text-gray-500">Create your first news article above</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {newsItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.heading}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{item.content}</p>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {item.createdAt?.toDate().toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="inline-flex items-center text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 bg-green-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="inline-flex items-center text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}