export function TechList({ items, limit }: { items: string[]; limit?: number }) {
  const visible = typeof limit === "number" ? items.slice(0, limit) : items;
  return (
    <ul className="tech-list" aria-label="Technologies">
      {visible.map((item) => (
        <li key={item}>{item}</li>
      ))}
      {limit && items.length > limit ? <li>+{items.length - limit}</li> : null}
    </ul>
  );
}
