import { Recipe } from "@/lib/recipes";

export function CubesMeter({ count, size = 15 }: { count: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${count} מנות`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="cube"
          style={{ width: Math.round(size * 1.5), height: size, borderRadius: Math.round(size * 0.32) }}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function RecipePhoto({ recipe, className }: { recipe: Recipe; className: string }) {
  if (recipe.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={recipe.image} alt={recipe.name} className={`${className} object-cover`} />;
  }
  return (
    <div className={`photo-slot ${className}`} role="img" aria-label={recipe.name}>
      📷 תמונה אמיתית
      <br />
      (יום צילום)
    </div>
  );
}

export default function RecipeCard({ recipe, onOpen }: { recipe: Recipe; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group text-right bg-white rounded-card border border-brand-line/70 shadow-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(21,64,72,.16)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green"
    >
      <div className="relative">
        <RecipePhoto
          recipe={recipe}
          className="h-28 md:h-36 w-full transition-transform duration-300 group-hover:scale-[1.04]"
        />
        {/* scrim עדין — כדי שתג הזמן יישאר קריא בשפת ה-hero */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-green/25 via-transparent to-transparent"
          aria-hidden
        />
        <span className="absolute top-2 right-2 inline-flex items-center gap-1.5 bg-brand-green/80 text-white rounded-full px-2.5 py-1 text-[11px] font-extrabold ring-1 ring-white/15 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" aria-hidden />
          {recipe.timeLabel}
        </span>
      </div>
      <div className="p-3">
        <div className="font-extrabold text-[15px] leading-tight text-brand-green">{recipe.name}</div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-brand-soft font-medium">
          <CubesMeter count={recipe.cubes} size={13} />
          <span>
            {recipe.cubes === 1 ? "מנה" : `${recipe.cubes} מנות`} · {recipe.meal}
          </span>
        </div>
      </div>
    </button>
  );
}
