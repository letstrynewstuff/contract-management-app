import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContractContext from "../contexts/ContractContext";
import TotalIcon from "../assets/img/total.svg";

const itemsPerPage = 6;

const Dashboard = () => {
  const { contracts, loading, error } = useContext(ContractContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownId, setDropdownId] = useState(null);
  const [animate, setAnimate] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading)
    return <div className="p-4 text-center text-gray-700">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = contracts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(contracts.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const toggleDropdown = (id) => setDropdownId(dropdownId === id ? null : id);
  const viewDetails = (id) => {
    navigate(`/contracts/${id}`);
    setDropdownId(null);
  };

  const cardData = [
    {
      title: "Total Contracts",
      value: contracts.length.toString(),
      icon: TotalIcon,
      color: "bg-red-500",
    },
    {
      title: "Pending Contracts",
      value: contracts
        .filter((c) => c.status === "Pending Approval")
        .length.toString(),
      icon: TotalIcon,
      color: "bg-yellow-500",
    },
    {
      title: "Approved Contracts",
      value: contracts.filter((c) => c.status === "Approved").length.toString(),
      icon: TotalIcon,
      color: "bg-green-500",
    },
    {
      title: "Declined Contracts",
      value: contracts.filter((c) => c.status === "Declined").length.toString(),
      icon: TotalIcon,
      color: "bg-red-700",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gray-100 font-roboto p-2 sm:p-4 md:p-6 transition-transform duration-500 ${
        animate ? "translate-x-[-100%]" : "translate-x-0"
      }`}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
          .font-roboto { font-family: 'Roboto', sans-serif; }
          @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        `}
      </style>
      <div
        className={`bg-white rounded-lg p-4 sm:p-6 shadow-md ${
          dropdownId ? "backdrop-blur-sm" : ""
        }`}
      >
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
          My Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          {cardData.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl shadow-md hover:shadow-lg transition duration-200 ${item.color} text-white`}
            >
              <div className="flex items-center">
                <img
                  src={item.icon}
                  alt="icon"
                  className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4"
                />
                <div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {item.value}
                  </div>
                  <div className="text-xs sm:text-sm">{item.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Contracts Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-800">
              Recent Contracts
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-lg px-3 py-2 w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Filter</option>
                <option value="1">Pending</option>
                <option value="2">Approved</option>
                <option value="3">Declined</option>
              </select>
              <button
                onClick={() => navigate("/contracts/create")}
                className="bg-green-600 text-white w-100
                 rounded-lg hover:bg-green-700 transition text-xs sm:text-sm"
              >
                Create New Contract
              </button>
            </div>
          </div>

          {/* Contracts Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full text-xs sm:text-sm">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-2 sm:p-3 text-left">No.</th>
                  <th className="p-2 sm:p-3 text-left">Contract Name</th>
                  <th className="p-2 sm:p-3 text-left hidden sm:table-cell">
                    Contract Type
                  </th>
                  <th className="p-2 sm:p-3 text-left hidden md:table-cell">
                    Sub-Contract Type
                  </th>
                  <th className="p-2 sm:p-3 text-left hidden lg:table-cell">
                    Validity Period
                  </th>
                  <th className="p-2 sm:p-3 text-left hidden xl:table-cell">
                    Date
                  </th>
                  <th className="p-2 sm:p-3 text-left hidden xl:table-cell">
                    Customer
                  </th>
                  <th className="p-2 sm:p-3 text-left hidden md:table-cell">
                    Status
                  </th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200`}
                  >
                    <td className="p-2 sm:p-3">{row.id}</td>
                    <td className="p-2 sm:p-3">
                      <div>{row.contractName}</div>
                      <div className="text-xs text-gray-600 sm:hidden">
                        <div>Type: {row.contractType}</div>
                        <div>Sub-Type: {row.subContractType}</div>
                        <div>Validity: {row.validityPeriod}</div>
                        <div>Date: {row.date}</div>
                        <div>Customer: {row.customer}</div>
                        <div>Status: {row.status}</div>
                      </div>
                    </td>
                    <td className="p-2 sm:p-3 hidden sm:table-cell">
                      {row.contractType}
                    </td>
                    <td className="p-2 sm:p-3 hidden md:table-cell">
                      {row.subContractType}
                    </td>
                    <td className="p-2 sm:p-3 hidden lg:table-cell">
                      {row.validityPeriod}
                    </td>
                    <td className="p-2 sm:p-3 hidden xl:table-cell">
                      {row.date}
                    </td>
                    <td className="p-2 sm:p-3 hidden xl:table-cell">
                      {row.customer}
                    </td>
                    <td className="p-2 sm:p-3 hidden md:table-cell">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          row.status === "Pending Approval"
                            ? "bg-yellow-100 text-yellow-800"
                            : row.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 relative">
                      <button
                        className="text-gray-500 hover:text-gray-700 text-base sm:text-lg"
                        onClick={() => toggleDropdown(row.id)}
                      >
                        ⋮
                      </button>
                      {dropdownId === row.id && (
                        <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded-lg z-10 w-32 sm:w-40">
                          <button
                            onClick={() => viewDetails(row.id)}
                            className="block w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-gray-100 rounded-lg"
                          >
                            View Details
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 sm:mt-6 flex justify-end items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
