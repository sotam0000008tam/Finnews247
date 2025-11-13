// components/CategoryIntro.js
export default function CategoryIntro({ title, description }) {
  if (!description) return null;
  return (
    <div className="mb-6">
      {title ? <h1 className="text-2xl md:text-3xl font-bold mb-3">{title}</h1> : null}
      <p className="text-base leading-7 opacity-90">
        {description}
      </p>
    </div>
  );
}
