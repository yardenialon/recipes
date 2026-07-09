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
      className="text-right bg-white rounded-card shadow-card overflow-hidden transition-transform active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green"
    >
      <div className="relative">
        <RecipePhoto recipe={recipe} className="h-24 md:h-32 w-full" />
        <span className="absolute top-2 right-2 bg-white/90 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold">
          {recipe.timeLabel}
        </span>
      </div>
      <div className="p-3">
        <div className="font-extrabold text-[15px] leading-tight">{recipe.name}</div>
        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-brand-soft font-medium">
          <CubesMeter count={recipe.cubes} size={13} />
          <span>
            {recipe.cubes === 1 ? "מנה" : `${recipe.cubes} מנות`} · {recipe.meal}
          </span>
        </div>
      </div>
    </button>
  );
}
