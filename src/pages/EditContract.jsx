// src/pages/EditContract.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApproveIcon from "../assets/img/approve.svg";
import ThumbsUp from "../assets/img/thumbsup.svg";
import ThumbsDown from "../assets/img/thumbsdown.svg";
import UndoIcon from "../assets/img/undo.svg";
import AuthContext from "../contexts/AuthContext";

const EditContract = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useContext(AuthContext);

  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [agreements, setAgreements] = useState({
    contractA: null,
    contractB: null,
    contractC: null,
  });
  const [declineComments, setDeclineComments] = useState({
    contractA: "",
    contractB: "",
    contractC: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

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
  if (error || !contract || userRole !== "Supervisor") {
    return (
      <div className="p-6 text-center text-gray-600 text-lg">
        {userRole !== "Supervisor"
          ? "Access denied. Only Supervisors can edit contracts."
          : "Contract not found."}
      </div>
    );
  }

  const handleApproveAndSend = () => {
    setShowApprovalPopup(true);
  };

  const handleAgreementChange = (contractKey, value) => {
    setAgreements((prev) => ({ ...prev, [contractKey]: value }));
    if (value === false) {
      setDeclineComments((prev) => ({ ...prev, [contractKey]: "" }));
    }
  };

  const handleUndo = (contractKey) => {
    setAgreements((prev) => ({ ...prev, [contractKey]: null }));
    setDeclineComments((prev) => ({ ...prev, [contractKey]: "" }));
  };

  const handleCommentChange = (contractKey, value) => {
    setDeclineComments((prev) => ({ ...prev, [contractKey]: value }));
  };

  const handlePopupConfirm = () => {
    const allDecided = Object.values(agreements).every(
      (value) => value !== null
    );
    if (!allDecided) {
      alert("Please select thumbs up or down for all contracts.");
      return;
    }
    setShowApprovalPopup(false);
    setShowOtpPopup(true);
  };

  const handlePopupCancel = () => {
    setShowApprovalPopup(false);
    setShowOtpPopup(false);
    setShowSuccessPopup(false);
    setAgreements({ contractA: null, contractB: null, contractC: null });
    setDeclineComments({ contractA: "", contractB: "", contractC: "" });
    setOtp(["", "", "", "", "", ""]);
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleOtpConfirm = async () => {
    if (otp.join("").length === 6) {
      const newStatus = Object.values(agreements).every(
        (value) => value === true
      )
        ? "Approved"
        : "Declined";
      try {
        const response = await fetch(`http://localhost:3000/contracts/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) throw new Error("Failed to update contract status");
        const updatedContract = await response.json();
        setContract(updatedContract);
        setShowOtpPopup(false);
        setShowSuccessPopup(true);
      } catch (err) {
        setError(err.message);
      }
    } else {
      alert("Please enter a valid 6-digit code.");
    }
  };

  const handleSuccessConfirm = () => {
    handlePopupCancel();
    navigate("/supervisordashboard");
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 font-sans p-6 flex">
      <div className="w-3/4 bg-white p-6 rounded-lg shadow-md mr-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          {contract.contractName}
        </h1>
        <p className="text-gray-600 mb-6">
          {contract.description || "No description available."}
        </p>

        <div className="bg-blue-50 p-8 rounded-lg mb-8 relative">
          <div className="absolute top-2 left-2 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <div className="ml-20">
            <p className="text-sm text-gray-700">THE CUSTOMER AGREEMENT</p>
            <p className="text-xs text-gray-500">AGREEMENT</p>
          </div>
        </div>
        <div className="flex justify-center mb-70">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate(`/contracts/${contract.id}`)}
              className="bg-red-100 text-red-500 px-4 py-2 rounded-lg hover:bg-red-200 transition"
            >
              View Contract
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Contract Type
            </label>
            <input
              type="text"
              value={contract.contractType}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Sub-Contract Type
            </label>
            <input
              type="text"
              value={contract.subContractType}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">Due Date</label>
          <div className="flex items-center p-2 border border-gray-300 rounded-lg w-1/3">
            <span className="text-green-500 mr-2">📅</span>
            <input
              type="text"
              value={contract.date}
              readOnly
              className="w-full text-sm bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleApproveAndSend}
            className="bg-red-100 text-red-500 px-4 py-2 rounded-lg hover:bg-red-200 transition"
          >
            Disapprove
          </button>
          <button
            onClick={handleApproveAndSend}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Approve and Send Document
          </button>
        </div>
      </div>

      <div className="w-1/4 bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Supporting Documents
        </h2>
        <div className="space-y-4">
          {contract.supportingDocuments &&
          contract.supportingDocuments.length > 0 ? (
            contract.supportingDocuments.map((doc, index) => (
              <div key={index} className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded mr-2 flex items-center justify-center">
                  <span className="text-gray-500">📄</span>
                </div>
                <span className="text-sm text-gray-600">
                  {doc.name || `Document ${index + 1}`}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">
              No supporting documents available.
            </p>
          )}
        </div>

        <h2 className="text-lg font-semibold text-gray-700 mt-6 mb-4">
          Prepared by
        </h2>
        <div className="space-y-2">
          {contract.preparedBy && contract.preparedBy.length > 0 ? (
            contract.preparedBy.map((person, index) => (
              <div key={index} className="text-sm text-gray-600">
                {person.name || `Person ${index + 1}`}
                <p className="text-xs text-gray-400">{person.email || "N/A"}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">
              No prepared by information available.
            </p>
          )}
        </div>

        <h2 className="text-lg font-semibold text-gray-700 mt-6 mb-4">
          Shared With
        </h2>
        <div className="flex space-x-2">
          {contract.sharedWith && contract.sharedWith.length > 0 ? (
            contract.sharedWith.map((person, index) => (
              <div
                key={index}
                className={`w-8 h-8 ${
                  person.color || "bg-gray-200"
                } rounded-full flex items-center justify-center text-sm text-gray-700`}
              >
                {person.initials || person.name?.charAt(0) || "S"}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">
              No shared with information available.
            </p>
          )}
        </div>

        <h2 className="text-lg font-semibold text-gray-700 mt-6 mb-4">
          To be signed by:
        </h2>
        <div className="space-y-2">
          {contract.preparedBy && contract.preparedBy.length > 0 ? (
            contract.preparedBy.map((person, index) => (
              <div key={index} className="text-sm text-gray-600">
                {person.name || `Person ${index + 1}`}
                <p className="text-xs text-gray-400">{person.email || "N/A"}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">No signatories available.</p>
          )}
        </div>
      </div>

      {/* Approval Popup */}
      {showApprovalPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handlePopupCancel}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <img src={ApproveIcon} alt="Approve Icon" className="w-12 h-12" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Kindly confirm you agree to the terms of the contract documents?
            </h2>
            <div className="text-left mb-6 space-y-4">
              {["contractA", "contractB", "contractC"].map((contractKey) => (
                <div
                  key={contractKey}
                  className="flex justify-between items-center"
                >
                  <p className="text-sm text-gray-600">
                    I agree to the terms of{" "}
                    {contractKey.replace("contract", "Contract ")}
                  </p>
                  <div className="flex space-x-4">
                    {agreements[contractKey] === null ? (
                      <>
                        <img
                          src={ThumbsUp}
                          alt="Thumbs Up"
                          className="w-8 h-9 cursor-pointer"
                          onClick={() =>
                            handleAgreementChange(contractKey, true)
                          }
                        />
                        <img
                          src={ThumbsDown}
                          alt="Thumbs Down"
                          className="w-8 h-9 cursor-pointer"
                          onClick={() =>
                            handleAgreementChange(contractKey, false)
                          }
                        />
                      </>
                    ) : agreements[contractKey] ? (
                      <>
                        <img
                          src={ThumbsUp}
                          alt="Thumbs Up"
                          className="w-6 h-6"
                        />
                        <img
                          src={UndoIcon}
                          alt="Undo"
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => handleUndo(contractKey)}
                        />
                      </>
                    ) : (
                      <>
                        <img
                          src={UndoIcon}
                          alt="Undo"
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => handleUndo(contractKey)}
                        />
                        <img
                          src={ThumbsDown}
                          alt="Thumbs Down"
                          className="w-6 h-6"
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
              {Object.entries(agreements).map(
                ([contractKey, value]) =>
                  value === false && (
                    <textarea
                      key={contractKey}
                      value={declineComments[contractKey]}
                      onChange={(e) =>
                        handleCommentChange(contractKey, e.target.value)
                      }
                      placeholder="Kindly specify below a reason for declining the terms of the contract document."
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mt-2"
                      rows="3"
                    />
                  )
              )}
            </div>
            <div className="flex justify-around">
              <button
                onClick={handlePopupCancel}
                className="bg-red-100 text-red-500 px-4 py-2 w-30 rounded-lg hover:bg-red-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePopupConfirm}
                className="bg-green-500 text-white px-4 py-2 w-30 rounded-lg hover:bg-green-600 transition"
                disabled={Object.values(agreements).some(
                  (value) => value === null
                )}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Popup */}
      {showOtpPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handlePopupCancel}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <span className="text-4xl text-gray-600">📱</span>
            </div>
            <h2 className="text-lg font-semibold mb-2">Verify your account</h2>
            <p className="text-sm text-gray-600 mb-4">
              A verification code has been sent to your email and phone number.
              Kindly input below.
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-10 h-10 border border-gray-300 rounded text-center text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ))}
            </div>
            <p className="text-sm text-blue-600 mb-4 cursor-pointer">
              Didn't get code? Resend OTP
            </p>
            <div className="flex justify-around">
              <button
                onClick={handlePopupCancel}
                className="bg-red-100 text-red-500 px-4 py-2 rounded-lg hover:bg-red-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleOtpConfirm}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handlePopupCancel}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <img src={ApproveIcon} alt="Decline Icon" className="w-16 h-16" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Thank you!</h2>
            <p className="text-sm text-gray-600 mb-4">
              The agreed contract has been sent to the parties involved.
            </p>
            <div className="flex justify-around">
              <button
                onClick={handlePopupCancel}
                className="bg-red-100 text-red-500 px-4 py-2 rounded-lg hover:bg-red-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSuccessConfirm}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditContract;
