import { useState, useMemo } from "react";
import { useShoppingList } from "./useStore";
import { S, CSS } from "./styles.js";
import { categorise, SHOP_CATEGORY_ORDER } from "./shared.js";

// The shared list UI body — used both on the standalone /list page
// and inside the dashboard's Shopping tab. No outer app wrapper here.
export function ShoppingListBody() {
  const { items, addItem, toggleItem, removeItem, clearChecked, clearAll } = useShoppingList();
  const [text, setText] = useState("");
  const [grouped, setGrouped] = useState(true);

  const submit = () => {
    const v = text.trim();
    if (!v) return;
    addItem(v);
    setText("");
  };

  const outstanding = (items || []).filter((i) => !i.checked).length;
  const checkedCount = (items || []).filter((i) => i.checked).length;

  // Build category groups in shop-aisle order; only include non-empty ones.
  const groups = useMemo(() => {
    if (!items) return [];
    const byKey = {};
    items.forEach((it) => {
      const cat = categorise(it.name);
      (byKey[cat.key] = byKey[cat.key] || { label: cat.label, items: [] }).items.push(it);
    });
    return SHOP_CATEGORY_ORDER
      .filter((k) => byKey[k])
      .map((k) => byKey[k]);
  }, [items]);

  if (items === null) {
    return <div style={S.shopLoading}>LOADING…</div>;
  }

  const Item = ({ it }) => (
    <div style={{ ...S.shopItem, ...(it.checked ? S.shopItemDone : {}) }}>
      <button
        onClick={() => toggleItem(it.id, !it.checked)}
        style={{
          ...S.shopCheck,
          borderColor: it.checked ? "#4ADE80" : "#22D3EE",
          background: it.checked ? "#4ADE80" : "transparent",
        }}
        aria-label={it.checked ? "Untick" : "Tick off"}
      >{it.checked ? "✓" : ""}</button>
      <span style={{ ...S.shopItemName, textDecoration: it.checked ? "line-through" : "none" }}>
        {it.name}
      </span>
      <button
        style={S.shopItemKill}
        className="iconBtn"
        onClick={() => removeItem(it.id)}
        aria-label="Remove"
      >×</button>
    </div>
  );

  return (
    <div style={S.shop}>
      <div style={S.kicker}>SHARED LIST</div>
      <h1 style={S.shopH1}>The shop<span style={S.h1dot}>.</span></h1>
      <div style={S.shopSub}>
        {outstanding === 0 ? "All done — nothing to get" : `${outstanding} to get`}
        {checkedCount > 0 ? ` · ${checkedCount} in the trolley` : ""}
      </div>

      <div style={S.shopAddRow}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          placeholder="Add an item…"
          style={S.shopInput}
        />
        <button style={S.shopAddBtn} className="addChipGo" onClick={submit}>Add</button>
      </div>

      {items.length > 0 && (
        <div style={S.shopViewToggle}>
          <button
            className="seg"
            style={{ ...S.shopSeg, ...(grouped ? S.shopSegOn : {}) }}
            onClick={() => setGrouped(true)}
          >By aisle</button>
          <button
            className="seg"
            style={{ ...S.shopSeg, ...(!grouped ? S.shopSegOn : {}) }}
            onClick={() => setGrouped(false)}
          >Simple list</button>
        </div>
      )}

      <div style={S.shopItems}>
        {items.length === 0 && (
          <div style={S.shopEmpty}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🛒</div>
            List's empty. Add the first thing above.
          </div>
        )}

        {items.length > 0 && grouped && groups.map((g) => (
          <div key={g.label} style={S.shopGroup}>
            <div style={S.shopGroupHead}>{g.label} <span style={S.shopGroupN}>{g.items.length}</span></div>
            <div style={S.shopGroupItems}>
              {g.items.map((it) => <Item key={it.id} it={it} />)}
            </div>
          </div>
        ))}

        {items.length > 0 && !grouped && items.map((it) => <Item key={it.id} it={it} />)}
      </div>

      {items.length > 0 && (
        <div style={S.shopActions}>
          {checkedCount > 0 && (
            <button style={S.shopClearTicked} className="manageBtn" onClick={clearChecked}>
              Clear ticked ({checkedCount})
            </button>
          )}
          <button
            style={S.shopClearAll}
            className="deleteBtn"
            onClick={() => { if (confirm("Wipe the whole list?")) clearAll(); }}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

// Standalone public page (reached from Lucy's schedule toggle, or /list directly).
export default function ShoppingList() {
  return (
    <div style={S.app}>
      <style>{CSS}</style>
      <ShoppingListBody />
    </div>
  );
}
