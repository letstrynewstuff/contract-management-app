import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContractContext from "../contexts/ContractContext";
import TotalIcon from "../assets/img/total.svg";
import Rec from "../assets/img/Rectangle 937.png";
import DeclineIcon from "../assets/img/declinesignal.svg";
import { FaThumbsUp, FaMobileAlt, FaCheckCircle } from "react-icons/fa";
import ThumbsUp from "../assets/img/thumbsup.svg"; 
import ThumbsDown from  "../assets/img/thumbsdown.svg"

const itemsPerPage = 6;

const SupervisorDashboard = () => {
  const { contracts, loading, error, updateContractStatus } =
    useContext(ContractContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownId, setDropdownId] = useState(null);
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDeclinePopup, setShowDeclinePopup] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [declineComment, setDeclineComment] = useState("");
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
    navigate(`/contracts/${id}/edit`);
    setDropdownId(null);
  };
  const handleApprove = (id) => {
    setSelectedContractId(id);
    setShowApprovalPopup(true);
    setDropdownId(null);
  };
  const handleDecline = (id) => {
    setSelectedContractId(id);
    setShowDeclinePopup(true);
    setDropdownId(null);
  };
  const handlePopupConfirm = () => {
    setShowApprovalPopup(false);
    setShowVerificationPopup(true);
  };
  const handlePopupCancel = () => {
    setShowApprovalPopup(false);
    setShowVerificationPopup(false);
    setShowSuccessPopup(false);
    setShowDeclinePopup(false);
    setSelectedContractId(null);
    setOtp(["", "", "", "", "", ""]);
    setDeclineComment("");
  };
  const handleVerificationConfirm = async () => {
    if (otp.join("").length === 6) {
      await updateContractStatus(selectedContractId, "Approved");
      setShowVerificationPopup(false);
      setShowSuccessPopup(true);
    } else {
      alert("Please enter a valid 6-digit code.");
    }
  };
  const handleDeclineConfirm = async () => {
    if (declineComment.trim() === "") {
      alert("Please enter a comment for the decline.");
      return;
    }
    await updateContractStatus(selectedContractId, "Declined");
    handlePopupCancel();
  };
  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    if (value && index < 5)
      document.getElementById(`otp-input-${index + 1}`).focus();
  };
  const handleResendOtp = () => console.log("Resend OTP requested");
  const handleSuccessConfirm = () => handlePopupCancel();

  const selectedContract = contracts.find(
    (contract) => contract.id === selectedContractId
  );
  const currentDateTime = "01:32 PM WAT, Monday, June 09, 2025";

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
 “‘
        `}
      </style>
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Supervisor Dashboard
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
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
                className="bg-green-600 text-white w-100 rounded-lg hover:bg-green-700 transition text-xs sm:text-sm"
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
                  <th className="p-3 sm:p-3 text-left">Action</th>
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
                    <td className="p-2 sm:p-3 relative">
                      <button
                        onClick={() => toggleDropdown(row.id)}
                        className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 text-xs sm:text-sm"
                      >
                        Action
                      </button>
                      {dropdownId === row.id && (
                        <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded-lg z-10 w-40">
                          <button
                            onClick={() => handleApprove(row.id)}
                            className="flex items-center w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-gray-100 rounded-t-lg"
                          >
                            <img
                              src={ThumbsUp}
                              alt="Thumbs Up"
                              className="w-8 h-9 cursor-pointer"
                            />
                            Approve
                          </button>
                          <button
                            onClick={() => handleDecline(row.id)}
                            className="flex items-center w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-gray-100"
                          >
                            <img
                              src={ThumbsDown}
                              alt="Thumbs Up"
                              className="w-8 h-9 cursor-pointer"
                            />
                            Decline
                          </button>
                          <button
                            onClick={() => viewDetails(row.id)}
                            className="flex items-center w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-gray-100 rounded-b-lg"
                          >
                            <span className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center mr-2 text-gray-600">
                              📝
                            </span>
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

      {/* Approval Popup */}
      {showApprovalPopup && selectedContract && (
        <div
          className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handlePopupCancel}
        >
          <div
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <FaThumbsUp className="text-3xl sm:text-4xl text-green-500" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-center mb-2">
              Approve Contract?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 text-center mb-4">
              Do you agree to accept this contract document?
            </p>
            <div className="space-y-2 mb-4 sm:mb-6">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-medium text-gray-700">
                  Contract Name:
                </span>
                <span className="text-gray-600">
                  {selectedContract.contractName}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-medium text-gray-700">Customer:</span>
                <span className="text-gray-600">
                  {selectedContract.customer}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-medium text-gray-700">
                  Contract Type:
                </span>
                <span className="text-gray-600">
                  {selectedContract.contractType}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-medium text-gray-700">
                  Sub-Contract Type:
                </span>
                <span className="text-gray-600">
                  {selectedContract.subContractType}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-medium text-gray-700">
                  Validity Period:
                </span>
                <span className="text-gray-600">
                  {selectedContract.validityPeriod} days
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-medium text-gray-700">Date:</span>
                <span className="text-gray-600">{selectedContract.date}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-medium text-gray-700">
                  Approval Date:
                </span>
                <span className="text-gray-600">{currentDateTime}</span>
              </div>
            </div>
            <div className="flex justify-around">
              <button
                onClick={handlePopupCancel}
                className="bg-red-100 text-red-500 px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-red-200 transition text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handlePopupConfirm}
                className="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-green-600 transition text-xs sm:text-sm"
              >
                Yes, I agree!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Popup */}
      {showVerificationPopup && (
        <div
          className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handlePopupCancel}
        >
          <div
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <FaMobileAlt className="text-3xl sm:text-4xl text-gray-600" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold mb-2">
              Verify your account
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              A verification code has been sent to your email and phone number.
              Kindly input below.
            </p>
            <div className="flex justify-center gap-1 sm:gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded text-center text-sm sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ))}
            </div>
            <p
              className="text-xs sm:text-sm text-blue-600 mb-4 cursor-pointer"
              onClick={handleResendOtp}
            >
              Didn't get code? Resend OTP
            </p>
            <div className="flex justify-around">
              <button
                onClick={handlePopupCancel}
                className="bg-red-100 text-red-500 px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-red-200 transition text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleVerificationConfirm}
                className="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-green-600 transition text-xs sm:text-sm"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div
          className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handlePopupCancel}
        >
          <div
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="text-3xl sm:text-4xl text-green-500" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold mb-2">
              Thank you!
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              The agreed contract has been sent to the parties involved.
            </p>
            <div className="flex justify-around">
              <button
                onClick={handlePopupCancel}
                className="bg-red-100 text-red-500 px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-red-200 transition text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSuccessConfirm}
                className="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-green-600 transition text-xs sm:text-sm"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Popup */}
      {showDeclinePopup && selectedContract && (
        <div
          className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handlePopupCancel}
        >
          <div
            className="bg-[url('../assets/img/Rectangle 937.png')] bg-cover bg-center p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md text-center"
            style={{ backgroundImage: `url(${Rec})` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <img
                src={DeclineIcon}
                alt="Decline Icon"
                className="w-12 h-12 sm:w-16 sm:h-16"
              />
            </div>
            <h2 className="text-base sm:text-lg font-semibold mb-2">
              Decline Contract?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Do you want to disapprove this contract document?
            </p>
            <div className="mb-4">
              <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                Enter Comment
              </label>
              <textarea
                value={declineComment}
                onChange={(e) => setDeclineComment(e.target.value)}
                placeholder="I am disapproving because..."
                className="w-full p-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
              />
            </div>
            <div className="flex justify-around">
              <button
                onClick={handlePopupCancel}
                className="bg-red-100 text-red-500 px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-red-200 transition text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclineConfirm}
                className="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-green-600 transition text-xs sm:text-sm"
                disabled={declineComment.trim() === ""}
              >
                Yes, Send!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorDashboard;


