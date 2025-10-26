// pages/insurance/[slug].js
import fs from "fs";
import path from "path";
import { NextSeo } from "next-seo";

export default function InsuranceTaxDetail({ post }) {
  if (!post) {
    return (
      <div>
        <h1 className="text-3xl font-semibold mb-6">404 - Not Found</h1>
        <p>The article you are looking for does not exist.</p>
      </div>
    );
  }

  const url = `https://www.finnews247.com/insurance/${post.slug}`;

  return (
    <article className="prose lg:prose-xl max-w-none">
      <NextSeo
        title={`${post.title} | FinNews247`}
        description={post.excerpt}
        canonical={url}
        openGraph={{
          title: `${post.title} | FinNews247`,
          description: post.excerpt,
          url: url,
        }}
      />

      <h1>{post.title}</h1>
      <p className="text-sm text-gray-500">{post.date}</p>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="my-4 rounded-lg shadow"
        />
      )}

      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      
    </article>
  );
}

export async function getServerSideProps({ params }) {
  const read = (f) =>
    JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", f), "utf8"));

  const insurance = read("insurance.json");
  const tax = read("tax.json");

  // Gộp insurance + tax để mở được cả hai nhóm bài dưới hub /insurance
  const posts = [...insurance, ...tax];
  const post = posts.find((p) => p.slug === params.slug) || null;

  return { props: { post } };
}
