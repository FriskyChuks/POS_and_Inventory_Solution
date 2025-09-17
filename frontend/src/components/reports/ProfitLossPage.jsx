import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import ProfitLossFilters from "./ProfitLoss/ProfitLossFilters";
import ProfitLossSummary from "./ProfitLoss/ProfitLossSummary";
import ProfitLossDetails from "./ProfitLoss/ProfitLossDetails";

const ProfitLossPage = ({ baseURL, formatNaira }) => {
  const [filters, setFilters] = useState({
    date_shortcut: "today",  // ✅ default to today
    start_date: "",
    end_date: "",
    group_by: "day",
  });

  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (appliedFilters) => {
    setLoading(true);
    try {
      // Fetch summary
      const summaryRes = await axiosInstance.get(
        `${baseURL}/reports/profit-loss/summary/`,
        { params: appliedFilters }
      );
      setSummary(summaryRes.data);

      // Fetch details
      const detailsRes = await axiosInstance.get(
        `${baseURL}/reports/profit-loss/detail/`,
        { params: appliedFilters }
      );
      setDetails(detailsRes.data);
    } catch (error) {
      console.error("Error fetching Profit/Loss data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run once on page load to fetch today's report
  useEffect(() => {
    fetchData(filters);
  }, []);

  // ✅ Run whenever filters change
  useEffect(() => {
    if (filters) {
      fetchData(filters);
    }
  }, [filters]);

  return (
    <div className="">
      <h3 className="mb-3">Profit & Loss Report</h3>

      {/* Filters */}
      <ProfitLossFilters filters={filters} setFilters={setFilters} />

      {/* Summary */}
      <ProfitLossSummary summary={summary} formatNaira={formatNaira} loading={loading} />

      {/* Details Table */}
      <ProfitLossDetails details={details} formatNaira={formatNaira} loading={loading} />
    </div>
  );
};

export default ProfitLossPage;
