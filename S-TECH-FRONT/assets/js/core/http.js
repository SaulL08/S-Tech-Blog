import { apiUrl } from '../config.js';

const DATA_URL = "/S-TECH-FRONT/assets/data/posts.json";

function mapFromApi(post) {
  return {
    _id: post._id || post.id || "",
    title: post.title || "",
    cat: post.cat || post.category || "",
    excerpt: post.excerpt || post.description || "",
    author: post.author || "Saúl Turbi",
    date: post.date || "",
    read: post.read || post.readTime || ""
  };
}

export async function getPosts() {
  try {
    const res = await fetch(apiUrl('/posts'));
    if (res.ok) {
      const data = await res.json();
      return data.map(mapFromApi);
    }
  } catch (err) {
    console.warn("API not available, falling back to JSON:", err);
  }

  try {
    const res = await fetch(DATA_URL);
    const data = await res.json();
    return data.map(mapFromApi);
  } catch (err) {
    console.error("Error fetching posts:", err);
    return [];
  }
}