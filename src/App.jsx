import React, { useEffect, useState, useMemo } from "react";

export default function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [lastHash, setLastHash] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpjfP-KEtIQi6tHAIRm778RTwxrBWVIO2imWFB4EQNzu-m0S3x7jXdXqfPIJmRjQ/pub?output=csv";

  function hashCSV(text) {
    return text.length + "_" + (text.charCodeAt(0) || 0);
  }

  // ✅ FETCH GOOGLE SHEET
  useEffect(() => {
    function parseCSV(text) {
      const lines = text
        .replace(/\r/g, "")
        .split("\n")
        .filter((l) => l.trim() !== "");

      if (!lines.length) return [];

      const fieldRe = /"(?:[^"]|"")*"|[^,]+|(?<=,)(?=,)/g;

      return lines.map((line) => {
        const matches = line.match(fieldRe) || [];
        return matches.map((f) => {
          f = f.trim();
          if (f.startsWith('"') && f.endsWith('"')) {
            f = f.slice(1, -1).replace(/""/g, '"');
          }
          return f;
        });
      });
    }

    function normalizeHeaders(headers) {
      return headers.map((h) =>
        (h || "").replace(/\uFEFF/g, "").trim().toUpperCase()
      );
    }

    function mapRow(headers, row) {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = row[i] ?? ""));
      return obj;
    }

    function fetchSheet() {
      fetch(sheetURL + "&cache=" + Date.now())
        .then((res) => res.text())
        .then((csv) => {
          const newHash = hashCSV(csv);
          if (newHash === lastHash) return;
          setLastHash(newHash);

          const rows = parseCSV(csv);
          if (!rows.length) return;

          const headers = normalizeHeaders(rows[0]);
          const json = rows.slice(1).map((r) => mapRow(headers, r));
          setData(json);
        })
        .catch(() => setError("Failed to load Google Sheet"));
    }

    fetchSheet();
    const interval = setInterval(fetchSheet, 3000);
    return () => clearInterval(interval);
  }, [lastHash]);

  // ✅ SAFE ITEM KEY
  const itemKey = data.length > 0
    ? Object.keys(data[0]).find((k) =>
        k.toUpperCase().includes("ITEM")
      )
    : null;

  // ✅ SEARCH RESULTS
  const results = useMemo(() => {
    if (!query) return [];

    if (query.trim() === "") return data; // space = show all

    const q = query.toLowerCase();

    return data.filter((item) =>
      Object.values(item).some((val) =>
        (val + "").toLowerCase().includes(q)
      )
    );
  }, [data, query]);

  // ✅ SELECT LOGIC
  useEffect(() => {
    if (query.trim() === "") {
      setSelected(null);
      return;
    }

    if (results.length > 0) {
      setSelected(results[0]);
    } else {
      setSelected(null);
    }
  }, [results, query]);

  // ✅ DROPDOWN SUGGESTIONS
  const dropdownSuggestions =
    searchText && itemKey
      ? data.filter((item) =>
          (item[itemKey] || "")
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )
      : [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">
          SEARCH ENGINE
        </h1>

        {/* SEARCH BOX */}
        <div className="bg-white shadow-md rounded-xl p-5 mb-8 border border-gray-200 relative">
          <label className="text-sm font-medium text-gray-600">Search</label>

          <input
            className="mt-2 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
            placeholder="Search ITEM NAME..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setShowDropdown(true);
              setActiveIndex(-1);
            }}
            onKeyDown={(e) => {
              // 🔥 SPACEBAR SHOWS ALL
              if (e.key === " " && searchText.trim() === "") {
                setQuery(" ");
                setShowDropdown(false);
                return;
              }

              if (!dropdownSuggestions.length) return;

              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((prev) =>
                  prev < dropdownSuggestions.length - 1 ? prev + 1 : prev
                );
              }

              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
              }

              if (e.key === "Enter") {
                e.preventDefault();
                if (activeIndex >= 0) {
                  const item = dropdownSuggestions[activeIndex];
                  setSearchText(item[itemKey]);
                  setQuery(item[itemKey]);
                } else {
                  setQuery(searchText);
                }
                setShowDropdown(false);
              }
            }}
          />

          {/* DROPDOWN */}
          {showDropdown && searchText && (
            <div className="absolute left-0 right-0 bg-white shadow-lg border border-gray-200 rounded-lg mt-1 max-h-60 overflow-auto z-50">
              {dropdownSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSearchText(item[itemKey]);
                    setQuery(item[itemKey]);
                    setShowDropdown(false);
                  }}
                  className={`px-4 py-2 cursor-pointer text-sm ${
                    idx === activeIndex
                      ? "bg-indigo-100"
                      : "hover:bg-indigo-50"
                  }`}
                >
                  {item[itemKey]}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              setQuery(searchText);
              setShowDropdown(false);
            }}
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Search
          </button>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        {/* RESULT PANEL */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 min-h-[400px]">
          {!query ? (
            <p className="text-gray-500 text-center mt-24">
              Search to see result
            </p>
          ) : !selected ? (
            <p className="text-gray-500 text-center mt-24">
              No result found
            </p>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-indigo-700">
                {selected[itemKey]}
              </h2>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-medium text-gray-700">
                  IF Policy (Factory Rate)
                </h3>
                <p className="text-gray-600 mt-1">
                  {selected["SHOP POLICY"]}
                </p>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-medium text-gray-700">
                  IPOD Policy (Shop Rate)
                </h3>
                <p className="text-gray-600 mt-1">
                  {selected["IPOD POLICY"] || "—"}
                </p>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-medium text-gray-700">Remarks (IF Policy Only)</h3>
                <p className="text-gray-600 mt-1">
                  {selected["REMARKS"] || "—"}
                </p>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center text-sm text-gray-500 mt-8 mb-4">
          Created by PRATHAM
        </footer>
      </div>
    </div>
  );
}
