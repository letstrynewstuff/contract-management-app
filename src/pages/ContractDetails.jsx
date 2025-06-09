import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Download } from "lucide-react";
import Contract from "../assets/img/contract.png";
import Doc1 from "../assets/img/Group 2547.svg";
import Doc2 from "../assets/img/Group 2547.svg";
import Doc3 from "../assets/img/Group 2547.svg";
import Doc4 from "../assets/img/Group 2547.svg";
import Prep1 from "../assets/img/jd.svg";
import Prep2 from "../assets/img/jd.svg";

const ContractDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await fetch(`http://localhost:3000/contracts/${id}`);
        if (!response.ok) throw new Error("Contract not found");
        const data = await response.json();
        setContract(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error || !contract) {
    return (
      <div className="p-6 text-center text-gray-600 text-lg">
        Contract not found.
      </div>
    );
  }

  // Helper to handle image download
  const handleDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status styles
  const statusStyles = {
    "Pending Approval": "bg-yellow-100 text-yellow-800 border-yellow-300",
    Approved: "bg-green-100 text-green-700 border-green-300",
    Declined: "bg-red-100 text-red-700 border-red-300",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 md:p-8 relative">
      {/* Cancel (X) icon at top right */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 right-6 p-2 rounded-full bg-white shadow-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition duration-200"
        aria-label="Close contract details"
      >
        <X size={24} />
      </button>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Status */}
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${
              statusStyles[contract.status]
            }`}
          >
            {contract.status}
          </div>

          {/* Contract Title */}
          <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">
            {contract.contractName}
          </h1>

          {/* Customer */}
          <p className="text-gray-600 text-sm mb-6">
            <span className="font-medium">Customer:</span> {contract.customer}
          </p>

          {/* Contract Image */}
          <div className="mb-6">
            <img
              src={Contract}
              alt="Contract"
              className="w-full h-auto rounded-lg shadow-sm border border-gray-200 transform hover:scale-105 transition duration-300"
            />
          </div>

          <hr className="border-gray-200 mb-6" />

          {/* Contract Type and Sub-Contract Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">
                Contract Type
              </label>
              <input
                type="text"
                value={contract.contractType}
                readOnly
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">
                Sub-Contract Type
              </label>
              <input
                type="text"
                value={contract.subContractType}
                readOnly
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          {/* Date */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700">Date</p>
            <p className="text-base text-gray-900">{contract.date}</p>
          </div>

          {/* Validity Period */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-700">
              Validity Period
            </p>
            <p className="text-base text-gray-900">
              {contract.validityPeriod} days
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/contracts/${id}/edit`)}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md w-full md:w-auto"
            >
              Edit Contract
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition duration-200 shadow-md w-full md:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Supporting Documents */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Supporting Documents
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 mb-8">
            {[
              { src: Doc1, alt: "Document 1", filename: "doc1.png" },
              { src: Doc2, alt: "Document 2", filename: "doc2.png" },
              { src: Doc3, alt: "Document 3", filename: "doc3.png" },
              { src: Doc4, alt: "Document 4", filename: "doc4.png" },
            ].map(({ src, alt, filename }) => (
              <div
                key={filename}
                className="relative group cursor-pointer"
                onClick={() => handleDownload(src, filename)}
              >
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-auto rounded-lg border border-gray-200 transform group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 rounded-lg">
                  <Download className="text-white w-6 h-6" />
                </div>
              </div>
            ))}
          </div>

          {/* Prepared By */}
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Prepared by
          </h3>
          <div className="flex gap-3 mb-6">
            {[
              { src: Prep1, alt: "Prepared by 1", filename: "prep1.png" },
              { src: Prep2, alt: "Prepared by 2", filename: "prep2.png" },
            ].map(({ src, alt, filename }) => (
              <div
                key={filename}
                className="relative group cursor-pointer"
                onClick={() => handleDownload(src, filename)}
              >
                <img
                  src={src}
                  alt={alt}
                  className="w-12 h-12 rounded-full border-2 border-gray-200 transform group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 rounded-full">
                  <Download className="text-white w-5 h-5" />
                </div>
              </div>
            ))}
          </div>

          {/* Shared With */}
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Shared with
          </h3>
          <div className="flex gap-3 mb-6">
            {[
              { src: Prep1, alt: "Shared with 1", filename: "prep1.png" },
              { src: Prep2, alt: "Shared with 2", filename: "prep2.png" },
            ].map(({ src, alt, filename }) => (
              <div
                key={filename}
                className="relative group cursor-pointer"
                onClick={() => handleDownload(src, filename)}
              >
                <img
                  src={src}
                  alt={alt}
                  className="w-12 h-12 rounded-full border-2 border-gray-200 transform group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 rounded-full">
                  <Download className="text-white w-5 h-5" />
                </div>
              </div>
            ))}
          </div>

          {/* Signatories */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              To be signed by
            </h3>
            <div className="space-y-4">
              {[
                {
                  name: "James Onatoba",
                  email: "james.onatoba@magametrics.com.ng",
                },
                {
                  name: "Ciroma Mohammed",
                  email: "ciroma.mohammed@magametrics.com.ng",
                },
              ].map(({ name, email }, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{name}</p>
                    <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg mt-1">
                      {email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
