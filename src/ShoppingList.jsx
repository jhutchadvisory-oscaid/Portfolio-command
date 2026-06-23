import { useState } from "react";
import { useShoppingList } from "./useStore";
import { S, CSS } from "./styles.js";

export default function ShoppingList() {
  const { items, addItem, toggleItem, removeItem, clearChecked, clearAll } = useShoppingList();
  const [text, setText] = useState("");

  const submit = () => {
    const v = text.trim();
    if (!v) return;
    addItem(v);
    setText("");
  };

  const outstanding = (items || []).filter((i) => !i.checked).length;
  const checkedCount = (items || []).filter((i) => i.checked).length;

  if (items === null) {
    return (
      <div style={{ ...S.app, display: "grid", placeItems: "center" }}>
        <style>{CSS}</style>
        <div style={{ color: "#BEF264", fontWeight: 800, letterSpacing: ".2em", fontSize: 13 }}>LOADING…</div>
      </div>
    );
  }

  return (
    <div style={S.app}>
      <style>{CSS}</style>
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

        <div style={S.shopItems}>
          {items.length === 0 && (
            <div style={S.shopEmpty}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🛒</div>
              List's empty. Add the first thing above.
            </div>
          )}
          {items.map((it) => (
            <div
              key={it.id}
              style={{ ...S.shopItem, ...(it.checked ? S.shopItemDone : {}) }}
            >
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
          ))}
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
    </div>
  );
}
