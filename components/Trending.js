// components/Trending.js
import Link from 'next/link'

export default function Trending({ posts = [] }) {
  // ưu tiên post.trending === true, nếu không có thì lấy 6 đầu
  let trending = posts.filter(p => p.trending)
  if (trending.length === 0) trending = posts.slice(0, 6)

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-bold mb-3">Trending</h3>
      <ul className="text-sm space-y-3">
        {trending.map(p => (
          <li key={p.id} className="flex gap-3">
            <img src={p.image || '/images/placeholder.jpg'} alt={p.title} className="w-16 h-10 object-cover rounded" />
            <div>
              <Link href={`/news/${p.slug}`}><span className="font-medium hover:text-sky-600">{p.title}</span></Link>
              <div className="text-xs text-gray-500">{p.date}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
