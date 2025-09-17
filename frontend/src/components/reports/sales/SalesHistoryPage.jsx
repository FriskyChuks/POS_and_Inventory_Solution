import { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import SalesFilters from './SalesFilters';
import SalesTable from './SalesTable';

const SalesHistoryPage = ({ baseURL, formatNaira }) => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const today = new Date().toISOString().split('T')[0];
  const [users, setUsers] = useState([]);

  const [filters, setFilters] = useState({
    from: today,
    to: today,
    user_id: '',   // ✅ Match backend param name
    customer: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get(`${baseURL}/accounts/all-users/`);
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, [baseURL]);

  const fetchSales = async (filterParams) => {
    const params = new URLSearchParams();
    if (filterParams.from) params.append('start_date', filterParams.from);
    if (filterParams.to) {
      const toDate = new Date(filterParams.to);
      toDate.setDate(toDate.getDate() + 1);
      params.append('end_date', toDate.toISOString().split('T')[0]);
    }
    if (filterParams.customer) params.append('customer', filterParams.customer);
    if (filterParams.user_id) params.append('user_id', filterParams.user_id);

    try {
      const response = await axiosInstance.get(
        `${baseURL}/sales/sales-history/?${params.toString()}`
      );
      setSales(response.data);
      setFilteredSales(response.data);
    } catch (err) {
      console.error("Failed to fetch sales:", err);
    }
  };

  useEffect(() => {
    fetchSales(filters);
  }, [baseURL]);

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
    fetchSales(updatedFilters);
  };

  const handlePrint = (saleId) => {
    window.open(`${baseURL}/sales/invoice/pdf/${saleId}/`, '_blank');
  };

  console.log(filteredSales)

  const filtersAreDefault =
    filters.from === today &&
    filters.to === today &&
    !filters.user_id &&
    !filters.customer;

  return (
    <div>
      <h4 className="mb-3">Sales History</h4>

      <SalesFilters
        filters={filters}
        setFilters={setFilters}
        onFilter={handleFilterChange}
        users={users}
      />

      {filtersAreDefault && (
        <p className="text-muted small">
          Showing today's sales by default. Use the filters to view older records.
        </p>
      )}

      <SalesTable
        sales={filteredSales}
        formatNaira={formatNaira}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default SalesHistoryPage;
