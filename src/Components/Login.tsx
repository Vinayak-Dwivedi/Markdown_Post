import { FC, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Notification {
  message: string;
  type: "success" | "error";
  id: number;
}

const PostManager: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  const addNotification = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { message, type, id }]);
    // Remove notification after 3 seconds
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    }, 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchPosts();
    }
  }, []);

  const fetchPosts = async () => {
    try {
      // In a real app, this would be an API call
      const mockPosts: Post[] = [
        {
          id: "1",
          title: "Sample Post",
          content: "# Hello World\nThis is a sample post",
          createdAt: new Date().toISOString(),
        },
      ];
      setPosts(mockPosts);
    } catch (err) {
      setError("Failed to fetch posts");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("https://reqres.in/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      fetchPosts();
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    setCurrentPost(null);
    setTitle("");
    setContent("");
  };

  const handleEditPost = (post: Post) => {
    setCurrentPost(post);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleSavePost = () => {
    if (!title || !content) {
      addNotification("Title and content are required", "error");
      return;
    }

    try {
      const newPost: Post = {
        id: currentPost?.id || Date.now().toString(),
        title,
        content,
        createdAt: currentPost?.createdAt || new Date().toISOString(),
      };

      if (currentPost) {
        setPosts(posts.map((p) => (p.id === currentPost.id ? newPost : p)));
        addNotification("Post updated successfully!", "success");
      } else {
        setPosts([...posts, newPost]);
        addNotification("Post created successfully!", "success");
      }

      setCurrentPost(null);
      setTitle("");
      setContent("");
    } catch (err) {
      addNotification("Failed to save post. Please try again.", "error");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-lg shadow-md w-96"
        >
          <h2 className="text-xl font-bold mb-4 text-center font-serif">
            Login
          </h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 mb-3 border rounded"
          />
          <button
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 font-serif disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Markdown Posts</h1>
        <button
          onClick={handleCreatePost}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          New Post
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title"
            className="w-full p-2 border rounded"
          />
          <MDEditor
            value={content}
            onChange={(value) => setContent(value || "")}
            height={400}
          />
          <button
            onClick={handleSavePost}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {currentPost ? "Update Post" : "Save Post"}
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Preview</h2>
          <div className="border rounded p-4 min-h-[400px]">
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <p className="text-gray-500">Preview will appear here</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Posts</h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border rounded p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleEditPost(post)}
            >
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostManager;
