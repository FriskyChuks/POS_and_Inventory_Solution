import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const BrandSearchInput = ({ baseURL, onSelect }) => {
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!term.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        // Using your brand search endpoint
        const res = await axiosInstance.get(`${baseURL}/brands/search/?search=${encodeURIComponent(term)}`);
        setSuggestions(Array.isArray(res.data) ? res.data : []);
        setOpen(true);
      } catch (e) {
        console.error(e);
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [term, baseURL]);

  const handlePick = (b) => {
    onSelect(b);
    setTerm("");
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div className="position-relative">
      <input
        type="text"
        className="form-control form-control-sm"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search brand by name/barcode/item…"
        onFocus={() => suggestions.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)} // allow click
      />
      {open && suggestions.length > 0 && (
        <ul className="list-group position-absolute w-100 shadow-sm" style={{ zIndex: 1050, top: "100%" }}>
          {suggestions.map((s) => (
            <li
              key={s.id}
              className="list-group-item list-group-item-action small"
              onMouseDown={() => handlePick(s)}
              role="button"
            >
              <strong>{s.name}</strong>{" "}
              {s.item?.name ? <span className="text-muted">({s.item.name})</span> : null}
              {s.barcode ? <span className="ms-2 badge bg-light text-dark">#{s.barcode}</span> : null}
              <span className="float-end">
                <span className="badge bg-info text-dark me-1">Cost: ₦{Number(s.cost_price || 0).toLocaleString()}</span>
                <span className="badge bg-success">Sell: ₦{Number(s.selling_price || 0).toLocaleString()}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BrandSearchInput;
