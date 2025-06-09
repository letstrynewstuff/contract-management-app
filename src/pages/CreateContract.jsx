import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronDown,
  FaUser,
} from "react-icons/fa";
import Doc3 from "../assets/img/Group 2547.svg";
import contractImage from "../assets/img/contract.svg";
import plusImg from "../assets/img/Group 238.svg";
import ContractContext from "../contexts/ContractContext";
import AuthContext from "../contexts/AuthContext";

const CreateContract = () => {
  const navigate = useNavigate();
  const { addContract } = useContext(ContractContext);
  const { userRole } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 24;
  const [expandedSection, setExpandedSection] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(
    "Certificate of Incorporation"
  );
  const [representatives, setRepresentatives] = useState([
    { name: "", email: "" },
    { name: "", email: "" },
  ]);
  const [contractData, setContractData] = useState({
    contractName: "",
    contractType: "",
    subContractType: "",
    validityPeriod: "",
    date: "",
    customer: "",
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    alert("Share functionality to be implemented!");
  };

  const handleSaveChanges = () => {
    if (userRole !== "RM") {
      alert("Only Relationship Managers can create contracts!");
      return;
    }
    if (!uploadedFileName || !contractData.contractName) {
      alert("Please fill in the contract title and upload a file!");
      return;
    }
    addContract(contractData);
    alert(`Contract "${contractData.contractName}" submitted to Supervisor!`);
    navigate("/supervisordashboard");
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  const updateRepresentative = (index, field, value) => {
    const newRepresentatives = [...representatives];
    newRepresentatives[index][field] = value;
    setRepresentatives(newRepresentatives);
  };

  const addRepresentative = () => {
    if (representatives.every((rep) => rep.name && rep.email)) {
      setRepresentatives([...representatives, { name: "", email: "" }]);
    } else {
      alert("Please fill in the name and email for all representatives!");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white font-sans p-6">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-700 hover:text-blue-600 transition duration-200"
          aria-label="Go back"
        >
          <FaArrowLeft className="mr-2" />
          <span className="text-lg font-medium">Back</span>
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200 text-sm font-medium"
          >
            Share
          </button>
          <button
            onClick={handleSaveChanges}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 text-sm font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Horizontal Separator */}
      <hr className="border-gray-200 mb-6" />

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side: Preview Section */}
        <div className="flex-1">
          <div className="bg-[#29B463] text-white p-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-lg font-semibold">Preview</h2>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium">Full Text Editing</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEditing}
                  onChange={() => setIsEditing(!isEditing)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-300 transition duration-200"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
          <div className="bg-[#F8F8F8] p-6 rounded-b-lg">
            <img
              src={contractImage}
              alt="Contract Page"
              className="w-full h-auto rounded-lg shadow-sm border border-gray-200"
            />
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="text-gray-500 hover:text-blue-600 disabled:opacity-50 transition duration-200"
                aria-label="Previous page"
              >
                <FaArrowLeft size={20} />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="text-gray-500 hover:text-blue-600 disabled:opacity-50 transition duration-200"
                aria-label="Next page"
              >
                <FaArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Collapsible Sections */}
        <div className="flex-1 border-l border-gray-200 pl-6">
          {[
            {
              title: "Contract Information",
              placeholder: "Contract title, validity, contract type...",
              content: (
                <div className="space-y-4">
                  <div className="md:w-1/2">
                    <label className="text-sm font-medium text-gray-700">
                      Contract Title
                    </label>
                    <input
                      type="text"
                      value={contractData.contractName}
                      onChange={(e) =>
                        setContractData({
                          ...contractData,
                          contractName: e.target.value,
                        })
                      }
                      placeholder="Enter contract title"
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div className="md:w-1/2">
                    <label className="text-sm font-medium text-gray-700">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={contractData.date}
                      onChange={(e) =>
                        setContractData({
                          ...contractData,
                          date: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">
                        Contract Type
                      </label>
                      <select
                        value={contractData.contractType}
                        onChange={(e) =>
                          setContractData({
                            ...contractData,
                            contractType: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 mt-1"
                      >
                        <option value="">Select Type</option>
                        <option value="Murabaha">Murabaha</option>
                        <option value="Ijarah">Ijarah</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">
                        Sub-Contract Type
                      </label>
                      <select
                        value={contractData.subContractType}
                        onChange={(e) =>
                          setContractData({
                            ...contractData,
                            subContractType: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 mt-1"
                      >
                        <option value="">Select Sub-Type</option>
                        <option value="Loan">Loan</option>
                        <option value="Company-Post Disbursement">
                          Company-Post Disbursement
                        </option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Validity Period
                    </label>
                    <input
                      type="number"
                      value={contractData.validityPeriod}
                      onChange={(e) =>
                        setContractData({
                          ...contractData,
                          validityPeriod: e.target.value,
                        })
                      }
                      placeholder="Enter validity period in days"
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Customer
                    </label>
                    <input
                      type="text"
                      value={contractData.customer}
                      onChange={(e) =>
                        setContractData({
                          ...contractData,
                          customer: e.target.value,
                        })
                      }
                      placeholder="Enter customer name"
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Summary
                    </label>
                    <textarea
                      placeholder="Enter summary"
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 mt-1 h-20"
                    />
                  </div>
                </div>
              ),
            },
            {
              title: "Who will sign the Contract?",
              placeholder: "Representative names, emails...",
              content: (
                <div className="space-y-6">
                  <div className="flex flex-row items-start gap-6">
                    {representatives.map((rep, index) => (
                      <div
                        key={index}
                        className="w-1/2 border-r border-gray-200 pr-6 last:border-r-0 last:pr-0"
                      >
                        <div className="flex items-center mb-2">
                          <FaUser className="text-sm text-gray-600 mr-2" />
                          <span className="text-sm font-medium text-gray-800">
                            Signee
                          </span>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Representative Name
                          </label>
                          <textarea
                            value={rep.name}
                            onChange={(e) =>
                              updateRepresentative(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 mt-1 h-8"
                          />
                        </div>
                        <div className="mt-4">
                          <label className="text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <textarea
                            value={rep.email}
                            onChange={(e) =>
                              updateRepresentative(
                                index,
                                "email",
                                e.target.value
                              )
                            }
                            className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 mt-1 h-8"
                          />
                        </div>
                      </div>
                    ))}
                    <div
                      className={`w-32 h-32 bg-white rounded-lg shadow-md flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                        !representatives.every((rep) => rep.name && rep.email)
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-200"
                      }`}
                      onClick={addRepresentative}
                    >
                      <img
                        src={plusImg}
                        alt="Add Representative"
                        className="w-10 h-10 mb-2"
                      />
                      <span className="text-[8px] text-gray-600 text-center px-1">
                        Multiple representatives can sign on behalf of the same
                        party/organization
                      </span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              title: "Upload Supporting Documents",
              placeholder: "Supporting documents to upload...",
              content: (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600">
                    Upload other supporting documents.
                  </p>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex space-x-4">
                      <img
                        src={Doc3}
                        alt="Document 1"
                        className="w-20 h-20 rounded-lg shadow-sm"
                      />
                      <img
                        src={Doc3}
                        alt="Document 2"
                        className="w-20 h-20 rounded-lg shadow-sm"
                      />
                    </div>
                    <span className="text-sm text-gray-700">
                      {uploadedFileName}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Upload File
                    </label>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                </div>
              ),
            },
          ].map((section, index) => (
            <div
              key={index}
              className={`w-full h-16 rounded-lg shadow-md mb-4 overflow-hidden transition-all duration-300 ${
                expandedSection === section.title ? "h-auto" : ""
              }`}
              style={{ minHeight: "64px" }}
            >
              <div
                className="flex justify-between items-center p-4 bg-white cursor-pointer"
                onClick={() => toggleSection(section.title)}
              >
                <h3 className="text-lg font-bold text-gray-800">
                  {section.title}
                </h3>
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    expandedSection === section.title ? "rotate-180" : ""
                  }`}
                />
              </div>
              {!expandedSection === section.title && (
                <div className="p-4 bg-gray-50">
                  <p className="text-gray-400 text-sm italic">
                    {section.placeholder}
                  </p>
                </div>
              )}
              {expandedSection === section.title && (
                <div className="p-4 bg-gray-50">{section.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateContract;
