import { useState, useMemo, useEffect } from "react";
import { ALL_ITEMS, CATEGORIES, CATEGORY_META } from "./data.js";

const STORAGE_KEY = "charlotte-bucket-list-visited";

function loadVisited() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveVisited(visitedMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitedMap));
  } catch {}
}

export default function App() {
  const [visitedMap, setVisitedMap] = useState(() => {
    const saved = loadVisited();
    // Seed with items that are visited: true in data
    const seeded = {};
    ALL_ITEMS.forEach(item => {
      if (item.id in saved) {
        seeded[item.id] = saved[item.id];
      } else {
        seeded[item.id] = item.visited;
      }
    });
    return seeded;
  });

  const [activeCategory, setActiveCategory] = useState("All");
  const [showVisited, setShowVisited] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    saveVisited(visitedMap);
  }, [visitedMap]);

  const toggleVisited = (id) => {
    setVisitedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const items = useMemo(() =>
    ALL_ITEMS.map(item => ({ ...item, visited: visitedMap[item.id] ?? item.visited })),
    [visitedMap]
  );

  const totalVisited = items.filter(i => i.visited).length;
  const progress = Math.round((totalVisited / items.length) * 100);

  const filtered = useMemo(() => {
    return items.filter(item => {
      const catMatch = activeCategory === "All" || item.category === activeCategory;
      const visitedMatch =
        showVisited === "all" ||
        (showVisited === "visited" ? item.visited : !item.visited);
      const searchMatch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return catMatch && visitedMatch && searchMatch;
    });
  }, [items, activeCategory, showVisited, search]);

  const grouped = useMemo(() => {
    const cats = activeCategory === "All" ? CATEGORIES : [activeCategory];
    return cats
      .map(cat => ({ cat, items: filtered.filter(i => i.category === cat) }))
      .filter(g => g.items.length > 0);
  }, [filtered, activeCategory]);

  return (
    <div style={{ fontFamily: "'Georgia','Times New Roman',serif", minHeight: "100vh", background: "#F7F3EE", paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#1B4332 0%,#2D6A4F 50%,#40916C 100%)", padding: "40px 24px 32px", color: "white" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ fontSize: 13, letterSpacing: 4, opacity: 0.7, textTransform: "uppercase", marginBottom: 8 }}>
            Charlotte, NC
          </div>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 700, letterSpacing: -1, lineHeight: 1.1 }}>
            Manue's Bucket List 🌿
          </h1>
          <p style={{ margin: "10px 0 24px", opacity: 0.8, fontSize: 15 }}>
            {totalVisited} of {items.length} adventures completed
          </p>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 99, height: 8, maxWidth: 400, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "#95D5B2", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ fontSize: 12, opacity: 0.65, marginTop: 6 }}>{progress}% complete · progress saves automatically</div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px" }}>
        {/* Filters */}
        <div style={{ background: "white", borderRadius: 16, padding: 20, marginTop: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            placeholder="🔍  Search activities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: "1.5px solid #E0DDD8", borderRadius: 10, padding: "10px 14px", fontSize: 15, outline: "none", background: "#FAFAF8", width: "100%" }}
          />

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["all", "unvisited", "visited"].map(v => (
              <FilterBtn key={v} active={showVisited === v} onClick={() => setShowVisited(v)} color="#2D6A4F">
                {v === "all" ? "All" : v === "unvisited" ? "To Do" : "✅ Done"}
              </FilterBtn>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <FilterBtn active={activeCategory === "All"} onClick={() => setActiveCategory("All")} color="#2D6A4F">
              All Categories
            </FilterBtn>
            {CATEGORIES.map(cat => {
              const meta = CATEGORY_META[cat] || { icon: "📍", accent: "#555" };
              return (
                <FilterBtn key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)} color={meta.accent}>
                  {meta.icon} {cat}
                </FilterBtn>
              );
            })}
          </div>
        </div>

        {/* Items */}
        <div style={{ marginTop: 24 }}>
          {grouped.map(({ cat, items: catItems }) => {
            const meta = CATEGORY_META[cat] || { icon: "📍", accent: "#555" };
            const catVisited = catItems.filter(i => i.visited).length;
            return (
              <div key={cat} style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>{meta.icon}</span>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: meta.accent, letterSpacing: -0.3 }}>{cat}</h2>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#888" }}>{catVisited}/{catItems.length} done</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {catItems.map(item => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      expanded={expandedId === item.id}
                      onToggleExpand={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      onToggleVisited={() => toggleVisited(item.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p>No items match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, color, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 16px",
        borderRadius: 99,
        border: `1.5px solid ${active ? color : "#E0DDD8"}`,
        background: active ? color : "white",
        color: active ? "white" : "#555",
        cursor: "pointer",
        fontSize: 13,
        whiteSpace: "nowrap",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function ItemCard({ item, expanded, onToggleExpand, onToggleVisited }) {
  return (
    <div style={{
      background: item.visited ? "#F0FFF4" : "white",
      borderRadius: 14,
      border: `1.5px solid ${item.visited ? "#95D5B2" : "#EAE6E0"}`,
      overflow: "hidden",
      boxShadow: expanded ? "0 4px 20px rgba(0,0,0,0.09)" : "0 1px 4px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s",
    }}>
      <div onClick={onToggleExpand} style={{ display: "flex", alignItems: "center", padding: "14px 16px", cursor: "pointer", gap: 12 }}>
        <button
          onClick={e => { e.stopPropagation(); onToggleVisited(); }}
          style={{
            width: 26, height: 26, borderRadius: "50%",
            border: `2px solid ${item.visited ? "#2D6A4F" : "#CBD5CA"}`,
            background: item.visited ? "#2D6A4F" : "white",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "all 0.2s", color: "white", fontSize: 14,
          }}
        >
          {item.visited ? "✓" : ""}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 600, fontSize: 15,
            color: item.visited ? "#2D6A4F" : "#1a1a1a",
            textDecoration: item.visited ? "line-through" : "none",
            opacity: item.visited ? 0.7 : 1,
          }}>
            {item.name}
            {item.tip && (
              <span style={{ marginLeft: 6, fontSize: 11, background: "#FFF3CD", color: "#856404", padding: "1px 6px", borderRadius: 99, fontWeight: 500 }}>
                📌 Note
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
            📍 {item.location} · 🚗 {item.drive}
          </div>
        </div>
        <span style={{ fontSize: 12, color: "#AAA" }}>{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div style={{ padding: "0 16px 16px 54px", fontSize: 14, color: "#444", lineHeight: 1.6, borderTop: "1px solid #F0EDE8", paddingTop: 12 }}>
          <p style={{ margin: "0 0 8px" }}>{item.description}</p>
          {item.tip && (
            <div style={{ background: "#FFF3CD", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#856404" }}>
              ⚡ {item.tip}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
