import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import BrandSearchInput from "./BrandSearchInput";

const toNum = (v) => (v == null || v === "" ? 0 : Number(v));

const PriceSettingsPage = ({ baseURL, formatNaira }) => {
  const [brand, setBrand] = useState(null);
  const [autoCost, setAutoCost] = useState(true);
  const [highestCost, setHighestCost] = useState(null);
  const [updateCostAlso, setUpdateCostAlso] = useState(true);

  const [markupType, setMarkupType] = useState("percent"); // 'percent' | 'flat'
  const [markupValue, setMarkupValue] = useState(10); // default 10%

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const token = localStorage.getItem("access_token");

  // fetch highest supplier cost for selected brand
  useEffect(() => {
    const fetchHighest = async () => {
      setHighestCost(null);
      if (!brand?.id) return;
      try {
        // Try supplies endpoint; if unavailable, fallback silently
        const res = await axiosInstance.get(
          `${baseURL}/supplies/?brand=${brand.id}&ordering=-cost_price&limit=1`
        );
        const top = Array.isArray(res.data) ? res.data[0] : null;
        setHighestCost(top?.cost_price != null ? Number(top.cost_price) : null);
      } catch {
        setHighestCost(null);
      }
    };
    fetchHighest();
  }, [brand, baseURL]);

  const effectiveCost = useMemo(() => {
    if (!brand) return 0;
    if (autoCost && highestCost != null) return Number(highestCost);
    return Number(brand.cost_price || 0);
  }, [brand, autoCost, highestCost]);

  const previewPrice = useMemo(() => {
    const c = toNum(effectiveCost);
    const v = toNum(markupValue);
    if (markupType === "percent") return +(c * (1 + v / 100)).toFixed(2);
    return +(c + v).toFixed(2);
  }, [effectiveCost, markupType, markupValue]);

  const marginPct = useMemo(() => {
    const c = toNum(effectiveCost);
    if (!c) return 0;
    return +(((previewPrice - c) / previewPrice) * 100).toFixed(2);
  }, [previewPrice, effectiveCost]);

  const handleApply = async () => {
    if (!brand?.id) return;
    setSaving(true);
    setMsg(null);
    try {
      const payload = { selling_price: previewPrice };
      if (autoCost && highestCost != null && updateCostAlso) {
        payload.cost_price = highestCost;
      }
      await axiosInstance.patch(`${baseURL}/brand-update/${brand.id}/`, payload, {
        headers: { Authorization: `FRISKYTECH ${token}`,},
      });
      setMsg({ type: "success", text: "Prices updated successfully." });

      // refresh brand snapshot
      const fresh = await axiosInstance.get(`${baseURL}/brand-update/${brand.id}/`);
      setBrand(fresh.data);
    } catch (e) {
      console.error(e);
      setMsg({ type: "danger", text: "Failed to update price." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Price Settings</h4>

      {msg && <div className={`alert alert-${msg.type} py-2 small`}>{msg.text}</div>}

      <div className="card p-3 mb-3">
        <label className="form-label small">Search & Select Brand</label>
        <BrandSearchInput baseURL={baseURL} onSelect={setBrand} />

        {brand && (
          <div className="mt-3">
            <div className="row g-2">
              <div className="col-md-6">
                <div className="border rounded p-2 small">
                  <div className="fw-semibold mb-1">
                    {brand.name} {brand.item?.name ? <span className="text-muted">({brand.item.name})</span> : null}
                  </div>
                  <div className="d-flex flex-wrap gap-3">
                    <span className="badge bg-light text-dark">Current Cost: {formatNaira(toNum(brand.cost_price))}</span>
                    <span className="badge bg-secondary">Current Selling: {formatNaira(toNum(brand.selling_price))}</span>
                    <span className="badge bg-info text-dark">Stock: {toNum(brand.stock_level)}</span>
                    {brand.barcode ? <span className="badge bg-light text-dark">#{brand.barcode}</span> : null}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-2 small">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="autoCost"
                      checked={autoCost}
                      onChange={(e) => setAutoCost(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="autoCost">
                      Auto-pick highest supplier cost (recommended)
                    </label>
                  </div>
                  <div className="mt-2">
                    <span className="me-3">
                      Highest Supplier Cost:{" "}
                      <strong>
                        {highestCost != null ? formatNaira(highestCost) : "N/A"}
                      </strong>
                    </span>
                    <span>
                      Effective Cost in Use: <strong>{formatNaira(effectiveCost)}</strong>
                    </span>
                  </div>
                  {autoCost && highestCost != null && (
                    <div className="form-check mt-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="updateCostAlso"
                        checked={updateCostAlso}
                        onChange={(e) => setUpdateCostAlso(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="updateCostAlso">
                        Update brand cost_price to {formatNaira(highestCost)}
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {brand && (
        <div className="card p-3">
          <div className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label small">Markup Type</label>
              <select
                className="form-control form-select-sm"
                value={markupType}
                onChange={(e) => setMarkupType(e.target.value)}
              >
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat (₦)</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small">
                {markupType === "percent" ? "Percent (%)" : "Flat Amount (₦)"}
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control form-control-sm"
                value={markupValue}
                onChange={(e) => setMarkupValue(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small">Preview Selling Price</label>
              <div className="form-control form-control-sm bg-light">
                {formatNaira(previewPrice)}
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label small">Expected Margin %</label>
              <div className="form-control form-control-sm bg-light">
                {marginPct.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="mt-3 d-flex justify-content-end">
            <button
              className="btn btn-sm btn-success"
              onClick={handleApply}
              disabled={saving}
            >
              {saving ? "Applying…" : "Apply Update"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceSettingsPage;
