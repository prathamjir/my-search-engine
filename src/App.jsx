import React, { useEffect, useState, useMemo } from "react";

export default function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastHash, setLastHash] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);

  const sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpjfP-KEtIQi6tHAIRm778RTwxrBWVIO2imWFB4EQNzu-m0S3x7jXdXqfPIJmRjQ/pub?output=csv";

  function hashCSV(text) {
    return text.length + "_" + (text.charCodeAt(0) || 0);
  }

  useEffect(() => {
    function parseCSV(text) {
      const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.trim() !== "");
      if (lines.length === 0) return [];

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

    function rowToObject(headers, row) {
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
          const json = rows.slice(1).map((r) => rowToObject(headers, r));

          setData(json);
          setLoading(false);
        })
        .catch(() => setError("Failed to load Google Sheet"));
    }

    fetchSheet();
    const interval = setInterval(fetchSheet, 3000);
    return () => clearInterval(interval);
  }, [lastHash]);

  const searchFields = ["ITEM NAME", "SHOP POLICY", "IPOD POLICY", "REMARKS"];

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();

    return data.filter((item) =>
      searchFields.some((f) =>
        (item[f] + "").toLowerCase().includes(q)
      )
    );
  }, [data, query]);

  const dropdownSuggestions = searchText
    ? data.filter((item) =>
        item["ITEM NAME"]?.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (results.length > 0 && !results.includes(selected)) {
      setSelected(results[0]);
    }
  }, [results]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6 font-sans">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-indigo-700">
          SEARCH ENGINE
        </h1>

        {/* SEARCH BAR */}
        <div className="bg-white shadow-md rounded-xl p-5 mb-8 border border-gray-200 relative">

          <label className="text-sm font-medium text-gray-600">Search</label>

          <input
            className="mt-2 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
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
                if (activeIndex >= 0) {
                  const selectedItem = dropdownSuggestions[activeIndex];
                  setSearchText(selectedItem["ITEM NAME"]);
                  setQuery(selectedItem["ITEM NAME"]);
                  setShowDropdown(false);
                } else {
                  setQuery(searchText);
                }
              }
            }}
          />

          {/* DROPDOWN */}
          {showDropdown && dropdownSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 bg-white shadow-lg border border-gray-200 rounded-lg mt-1 max-h-80 overflow-auto z-20">
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
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Search
          </button>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        {/* RESULTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT PANEL */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 h-[65vh] overflow-auto">
            <h2 className="text-lg font-semibold text-indigo-600 mb-3">
              {!query ? "Please search above" : `Results (${results.length})`}
            </h2>

            <ul className="space-y-2">
              {results.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => setSelected(item)}
                    className={`block w-full text-left p-4 rounded-lg shadow-sm transition border ${
                      selected === item
                        ? "bg-indigo-50 border-indigo-400"
                        : "bg-white border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <div className="font-semibold text-gray-800">
                      {item["ITEM NAME"]}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Shop Policy: {item["SHOP POLICY"]}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT PANEL */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-6 h-[65vh] overflow-auto">

            {!query ? (
              <p className="text-gray-500 text-center mt-24">
                Search to see details
              </p>
            ) : !selected ? (
              <p className="text-gray-500 text-center mt-24">
                No item selected
              </p>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-indigo-700">
                  {selected["ITEM NAME"]}
                </h2>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-medium text-gray-700">Shop Policy</h3>
                  <p className="text-gray-600 mt-1">
                    {selected["SHOP POLICY"]}
                  </p>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-medium text-gray-700">IPOD Policy</h3>
                  <p className="text-gray-600 mt-1">
                    {selected["IPOD POLICY"] || "—"}
                  </p>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-medium text-gray-700">Remarks</h3>
                  <p className="text-gray-600 mt-1">
                    {selected["REMARKS"] || "—"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center text-sm text-gray-500 mt-8 mb-4">
          Created by PRATHAM
        </footer>

      </div>
    </div>
  );
}