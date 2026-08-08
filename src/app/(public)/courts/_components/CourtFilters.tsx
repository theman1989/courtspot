"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SPORTS = [
  { value: "basketball", label: "Basketball" },
  { value: "badminton",  label: "Badminton"  },
  { value: "tennis",     label: "Tennis"     },
  { value: "futsal",     label: "Futsal"     },
];

const CITIES = [
  { value: "",              label: "All Cities"   },
  { value: "BGC",           label: "BGC"          },
  { value: "Makati",        label: "Makati"       },
  { value: "Quezon City",   label: "Quezon City"  },
  { value: "Pasig",         label: "Pasig"        },
  { value: "Mandaluyong",   label: "Mandaluyong"  },
];

const PRICE_BRACKETS = [
  { value: "",          label: "Any Price"   },
  { value: "under-300", label: "Under ₱300"  },
  { value: "300-500",   label: "₱300–₱500"  },
  { value: "500-700",   label: "₱500–₱700"  },
  { value: "700-plus",  label: "₱700+"       },
];

const SPORT_ACTIVE: Record<string, string> = {
  basketball: "bg-[#FF6B35] text-white shadow-[0_4px_10px_0_rgb(255_107_53/0.35)]",
  badminton:  "bg-[#6366F1] text-white shadow-[0_4px_10px_0_rgb(99_102_241/0.35)]",
  tennis:     "bg-[#84CC16] text-white shadow-[0_4px_10px_0_rgb(132_204_22/0.35)]",
  futsal:     "bg-[#22C55E] text-white shadow-[0_4px_10px_0_rgb(34_197_94/0.35)]",
};

const SPORT_INACTIVE: Record<string, string> = {
  basketball: "bg-[#FFF1EB] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white",
  badminton:  "bg-[#EEF2FF] text-[#6366F1] hover:bg-[#6366F1] hover:text-white",
  tennis:     "bg-[#F0FBE4] text-[#65A30D] hover:bg-[#84CC16] hover:text-white",
  futsal:     "bg-[#DCFCE7] text-[#16A34A] hover:bg-[#22C55E] hover:text-white",
};

interface CourtFiltersProps {
  sport: string;
  city: string;
  priceRange: string;
}

export default function CourtFilters({ sport, city, priceRange }: CourtFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/courts?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Sport chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateFilter("sport", "")}
          className={`px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all duration-150 ${
            sport === ""
              ? "bg-[#0F172A] text-white shadow-[0_4px_10px_0_rgb(15_23_42/0.25)]"
              : "bg-[#F1F5F9] text-[#525252] hover:bg-[#E2E8F0]"
          }`}
        >
          All
        </button>
        {SPORTS.map((s) => (
          <button
            key={s.value}
            onClick={() => updateFilter("sport", s.value)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all duration-150 ${
              sport === s.value ? SPORT_ACTIVE[s.value] : SPORT_INACTIVE[s.value]
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="h-5 w-px bg-[#E2E8F0] hidden sm:block" />

      {/* City dropdown */}
      <select
        value={city}
        onChange={(e) => updateFilter("city", e.target.value)}
        className="h-8 px-3 pr-7 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#E84C1F]/20 focus:border-[#E84C1F] cursor-pointer appearance-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
      >
        {CITIES.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      {/* Price dropdown */}
      <select
        value={priceRange}
        onChange={(e) => updateFilter("price", e.target.value)}
        className="h-8 px-3 pr-7 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#E84C1F]/20 focus:border-[#E84C1F] cursor-pointer appearance-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
      >
        {PRICE_BRACKETS.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>
    </div>
  );
}
