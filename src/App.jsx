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

  const searchFields = [
    "ITEM NAME",
    "SHOP POLICY",
    "IPOD POLICY",
    "REMARKS",
  ];

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return data.filter((item) =>
      searchFields.some((f) => (item[f] + "").toLowerCase().includes(q))
    );
  }, [data, query]);

  useEffect(() => {
    if (results.length > 0) {
      setSelected(results[0]);
    }
  }, [results]);

  const dropdownSuggestions = searchText
    ? data.filter((item) =>
        item["ITEM NAME"]?.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">
          SEARCH ENGINE
        </h1>

        <div className="bg-white p-5 rounded-xl shadow border relative">
          <label className="text-sm font-medium text-gray-600">Search</label>

          <input
            className="mt-2 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Search ITEM NAME..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setShowDropdown(true);
              setActiveIndex(-1);
            }}
            onKeyDown={(e) => {
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
                  setSearchText(item["ITEM NAME"]);
                  setQuery(item["ITEM NAME"]);
                } else {
                  setQuery(searchText);
                }
                setShowDropdown(false);
              }
            }}
          />

          {showDropdown && searchText && (
            <div className="absolute left-0 right-0 bg-white shadow-lg border rounded-lg mt-1 max-h-80 overflow-auto z-50">
              {dropdownSuggestions.length === 0 && (
                <div className="px-4 py-2 text-gray-500 text-sm">
                  No matches
                </div>
              )}

              {dropdownSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSearchText(item["ITEM NAME"]);
                    setQuery(item["ITEM NAME"]);
                    setShowDropdown(false);
                  }}
                  className={`px-4 py-2 cursor-pointer text-sm ${
                    idx === activeIndex
                      ? "bg-indigo-100"
                      : "hover:bg-indigo-50"
                  }`}
                >
                  {item["ITEM NAME"]}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              setQuery(searchText);
              setShowDropdown(false);
            }}
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Search
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="bg-white rounded-xl shadow border p-6 mt-6 min-h-[300px]">
          {!query ? (
            <p className="text-gray-500 text-center">Search to see result</p>
          ) : !selected ? (
            <p className="text-gray-500 text-center">No result found</p>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-indigo-700">
                {selected["ITEM NAME"]}
              </h2>

              <div className="mt-4">
                <h3 className="font-medium">Shop Policy</h3>
                <p>{selected["SHOP POLICY"]}</p>
              </div>

              <div className="mt-4">
                <h3 className="font-medium">IPOD Policy</h3>
                <p>{selected["IPOD POLICY"] || "—"}</p>
              </div>

              <div className="mt-4">
                <h3 className="font-medium">Remarks</h3>
                <p>{selected["REMARKS"] || "—"}</p>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center text-sm text-gray-500 mt-6">
          Created by PRATHAM
        </footer>
      </div>
    </div>
  );
}
