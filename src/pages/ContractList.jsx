import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import { FileText, Search, MessageSquare } from "lucide-react";
import jdImage from "../assets/img/ca.svg";
import bmImage from "../assets/img/bm.svg";

const contractData = [
  {
    id: 1,
    contractName: "Provision of Technical Assistance by UNESCO under",
    contractType: "Murabaha",
    subContractType: "Company- Post Disbursement",
    validityPeriod: 67,
    date: "9/29/2023",
    customer: "World Bank",
    status: "Pending Approval",
  },
  {
    id: 2,
    contractName: "Provision of Technical Assistance by UNESCO under",
    contractType: "Murabaha",
    subContractType: "Company- Post Disbursement",
    validityPeriod: 26,
    date: "8/21/2021",
    customer: "World Bank",
    status: "Pending Approval",
  },
  {
    id: 3,
    contractName: "Contract on Banking Product Service to a ...",
    contractType: "Murabaha",
    subContractType: "Loan",
    validityPeriod: 43,
    date: "8/19/2023",
    customer: "Cartu Bank",
    status: "Pending Approval",
  },
  {
    id: 4,
    contractName: "Contract on Banking Product Service to a",
    contractType: "Ijarah",
    subContractType: "Loan",
    validityPeriod: 44,
    date: "6/20/2023",
    customer: "World Bank",
    status: "Pending Approval",
  },
  {
    id: 5,
    contractName: "Provision of Technical Assistance by UNESCO under",
    contractType: "Ijarah",
    subContractType: "Loan",
    validityPeriod: 92,
    date: "8/27/2023",
    customer: "World Bank",
    status: "Declined",
  },
  {
    id: 6,
    contractName: "Provision of Technical Assistance by UNESCO under",
    contractType: "Ijarah",
    subContractType: "Loan",
    validityPeriod: 20,
    date: "8/7/2021",
    customer: "World Bank",
    status: "Approved",
  },
  {
    id: 7,
    contractName: "Contract on Banking Product Service to a ...",
    contractType: "Ijarah",
    subContractType: "Company- Post Disbursement",
    validityPeriod: 20,
    date: "12/16/2020",
    customer: "Cartu Bank",
    status: "Declined",
  },
  {
    id: 8,
    contractName: "Provision of Technical Assistance by UNESCO under",
    contractType: "Murabaha",
    subContractType: "Company- Post Disbursement",
    validityPeriod: 26,
    date: "11/29/2022",
    customer: "Cartu Bank",
    status: "Pending Approval",
  },
  {
    id: 9,
    contractName: "Contract on Banking Product Service to a",
    contractType: "Murabaha",
    subContractType: "Company- Post Disbursement",
    validityPeriod: 91,
    date: "4/27/2021",
    customer: "World Bank",
    status: "Declined",
  },
  {
    id: 10,
    contractName: "Provision of Technical Assistance by UNESCO under",
    contractType: "Ijarah",
    subContractType: "Company- Post Disbursement",
    validityPeriod: 73,
    date: "4/1/2024",
    customer: "World Bank",
    status: "Declined",
  },
];

const statusStyles = {
  "Pending Approval": "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-700",
  Declined: "bg-red-500 text-white",
};

const ContractCard = ({ contract }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition duration-200 w-full flex justify-between items-start">
    {/* Left Section: Contract Details */}
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            {contract.contractName}
          </h3>
          <p className="text-xs text-gray-400 mb-1">
            Contracts can be described as self-imposed court enforceable legal
            obligation that are not contrary to public policy or law...
          </p>
        </div>
        {/* Status at the right-end */}
        <span
          className={`inline-block px-2 py-1 text-xs font-medium rounded ${
            statusStyles[contract.status]
          }`}
        >
          {contract.status}
        </span>
      </div>

      {/* Bottom Section */}
      <div className="mt-4">
        {/* Date and Contract Type */}
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">
            {contract.date}
          </span>
          <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">
            {contract.contractType}
          </span>
        </div>

        {/* Document and Message Icons (between middle and right-end) */}
        <div className="flex justify-end space-x-4 mb-2">
          <div className="flex items-center space-x-1">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">3</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">1</span>
          </div>
        </div>

        {/* Shared with Section (middle-bottom) */}
        <div className="flex items-center space-x-2">
          <p className="text-xs text-gray-500">Shared with</p>
          <img src={jdImage} alt="JD" className="w-6 h-6 rounded-full" />
          <img src={bmImage} alt="BM" className="w-6 h-6 rounded-full" />
          <p className="text-xs text-gray-500">{contract.customer}</p>
        </div>
      </div>
    </div>
  </div>
);

const ContractList = () => {
  const navigate = useNavigate(); // Added for navigation
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Added for pagination
  const contractsPerPage = 4; // Number of contracts to display per page

  const tabs = ["All", "Require Action", "Signed", "Pending", "Declined"];

  const filterContracts = () => {
    let filtered = contractData;
    if (selectedTab !== "All") {
      filtered = contractData.filter((c) => {
        if (selectedTab === "Pending") return c.status.includes("Pending");
        if (selectedTab === "Signed") return c.status === "Approved";
        if (selectedTab === "Require Action")
          return c.status === "Pending Approval";
        return c.status === selectedTab;
      });
    }
    return filtered.filter((c) =>
      c.contractName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Pagination logic
  const filteredContracts = filterContracts();
  const totalContracts = filteredContracts.length;
  const totalPages = Math.ceil(totalContracts / contractsPerPage);
  const startIndex = (currentPage - 1) * contractsPerPage;
  const endIndex = startIndex + contractsPerPage;
  const currentContracts = filteredContracts.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-20% md:max-w-sm bg-white border-r border-gray-200 p-6 space-y-6">
        <button
          onClick={() => navigate("/contracts/create")} // Navigate to create contract page
          className="w-full bg-green-600 text-white py-2 text-sm font-semibold rounded hover:bg-green-700 transition"
        >
          + New Contract
        </button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search contracts..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Contract Type List */}
        <ol className="space-y-2 text-sm text-gray-700">
          {contractData.map((contract) => (
            <li
              key={contract.id}
              className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="truncate">{contract.contractType}</span>
            </li>
          ))}
        </ol>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">
          My Contracts
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`text-sm px-4 py-1.5 rounded-full border transition ${
                selectedTab === tab
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => {
                setSelectedTab(tab);
                setCurrentPage(1); // Reset to first page when tab changes
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contract Cards */}
        <div className="grid grid-cols-1 gap-4">
          {currentContracts.length > 0 ? (
            currentContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))
          ) : (
            <p className="text-gray-600 text-center">
              No contracts found for this filter.
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalContracts > contractsPerPage && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContractList;
