// Visual "Browse by category" grid — inspired by the legacy ProductCategory.jsx,
// but the thumbnail comes from each category's own first product instead of a
// hand-picked, hardcoded image, so it works for any vendor's category set.
import React from "react";
import { Link } from "react-router-dom";

export default function CategoryTiles({ sections }) {
  const tiles = sections.filter((s) => s.products.length > 0);
  if (tiles.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-center mb-6">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
        {tiles.map(({ category, products }) => (
          <Link
            key={category}
            to={`/c/${encodeURIComponent(category)}`}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-full aspect-square  overflow-hidden mb-3 bg-gray-100">
              {products[0].thumbnail
                ? <img src={products[0].thumbnail} alt={category} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                : null}
            </div>
            <h3 className="uppercase text-xs font-semibold tracking-wide text-gray-700">{category}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
