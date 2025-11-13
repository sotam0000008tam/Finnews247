export default function CategoryIntro({ title, description }) {
  if (!description) return null;
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold mb-3">{title}</h1>
      <p className="text-base leading-7 opacity-90">{description}</p>
    </div>
  );
}
