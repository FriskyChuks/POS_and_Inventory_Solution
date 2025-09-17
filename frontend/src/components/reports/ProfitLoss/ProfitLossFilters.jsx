import React from "react";

const ProfitLossFilters = ({ filters, setFilters }) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date_shortcut") {
      // Picking a shortcut clears manual dates
      setFilters((prev) => ({
        ...prev,
        date_shortcut: value,
        start_date: value ? "" : prev.start_date,
        end_date: value ? "" : prev.end_date,
      }));
      return;
    }

    if (name === "start_date" || name === "end_date") {
      // Typing manual dates clears shortcut
      setFilters((prev) => ({
        ...prev,
        [name]: value,
        date_shortcut: "",
      }));
      return;
    }

    // Other fields (e.g., group_by)
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({
      date_shortcut: "",
      start_date: today,
      end_date: today,
      group_by: "day",
    });
  };

  return (
    <div className="card mb-3 p-3">
      <div className="row g-3">
        {/* Date Shortcut */}
        <div className="col-md-3">
          <label className="form-label">Date Shortcut</label>
          <select
            name="date_shortcut"
            value={filters.date_shortcut}
            onChange={handleChange}
            className="form-control form-select"
          >
            <option value="">-- None --</option>
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="this_quarter">This Quarter</option>
          </select>
          <small className="text-muted">Picking a shortcut clears manual dates.</small>
        </div>

        {/* Manual Dates */}
        <div className="col-md-2">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">End Date</label>
          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleChange}
            className="form-control"
          />
          <small className="text-muted">Typing dates clears the shortcut.</small>
        </div>

        {/* Group By */}
        <div className="col-md-2">
          <label className="form-label">Group By</label>
          <select
            name="group_by"
            value={filters.group_by}
            onChange={handleChange}
            className="form-control form-select"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="col-md-2 d-flex align-items-end">
          <button type="button" onClick={handleReset} className="btn btn-primary w-100">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossFilters;
