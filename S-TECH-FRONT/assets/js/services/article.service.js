import { $ } from '../core/dom.js';
import { apiUrl } from '../config.js';

export async function getArticleById(id) {
  try {
    const res = await fetch(apiUrl(`/posts/${id}`));
    if (!res.ok) throw new Error('Artículo no encontrado');
    return await res.json();
  } catch (err) {
    console.error('Error fetching article:', err);
    return null;
  }
}

export async function getRecommendedPosts(currentId, limit = 3) {
  try {
    const res = await fetch(apiUrl('/posts'));
    if (!res.ok) return [];
    const posts = await res.json();
    return posts
      .filter(p => p._id !== currentId)
      .slice(0, limit);
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    return [];
  }
}
