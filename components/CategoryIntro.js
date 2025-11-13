// components/CategoryIntro.js
export default function CategoryIntro({ title, description }) {
  if (!description) return null;
  return (
    <div className="mb-6">
      {title ? <h1 className="text-2xl font-semibold mb-3">{title}</h1> : null}
      <p className="text-base leading-7 opacity-90">
        {description}
      </p>
    </div>
  );
}
