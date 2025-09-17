import { useEffect } from "react";

const SalesFilters = ({ filters, setFilters, onFilter, users }) => {
  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReset = () => {
    const today = new Date().toISOString().split('T')[0];
    const defaultFilters = { from: today, to: today, user_id: '', customer: '' };
    setFilters(defaultFilters);
    onFilter(defaultFilters);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onFilter(filters);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [filters]);

  return (
    <div className="card p-3 mb-4">
      <div className="row g-2 align-items-end">
        <div className="col-md-2">
          <label className="form-label small">Date From</label>
          <input
            type="date"
            name="from"
            className="form-control form-control-sm"
            value={filters.from}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label small">Date To</label>
          <input
            type="date"
            name="to"
            className="form-control form-control-sm"
            value={filters.to}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label small">Sales Person</label>
          <select
            className="form-control form-control-sm"
            value={filters.user_id}
            onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
          >
            <option value="">All Cashiers</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstname} {user.lastname}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label small">Customer</label>
          <input
            type="text"
            name="customer"
            placeholder="Customer Name"
            className="form-control form-control-sm"
            value={filters.customer}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-sm btn-outline-danger w-100"
            onClick={handleReset}
          >
            Reset Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesFilters;
