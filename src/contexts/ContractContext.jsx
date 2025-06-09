import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/contracts");
        setContracts(response.data);
      } catch (err) {
        setError("Failed to fetch contracts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  const addContract = async (newContract) => {
    try {
      const response = await axios.post("http://localhost:3000/contracts", {
        ...newContract,
        status: "Pending Approval",
        date: newContract.date || new Date().toLocaleDateString("en-US"),
      });
      setContracts((prev) => [...prev, response.data]);
    } catch (err) {
      setError("Failed to add contract");
      console.error(err);
    }
  };

  const updateContractStatus = async (id, status) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/contracts/${id}`,
        { status }
      );
      setContracts((prev) =>
        prev.map((contract) => (contract.id === id ? response.data : contract))
      );
    } catch (err) {
      setError("Failed to update contract status");
      console.error(err);
    }
  };

  const deleteContract = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/contracts/${id}`);
      setContracts((prev) => prev.filter((contract) => contract.id !== id));
    } catch (err) {
      setError("Failed to delete contract");
      console.error(err);
    }
  };

  return (
    <ContractContext.Provider
      value={{
        contracts,
        loading,
        error,
        addContract,
        updateContractStatus,
        deleteContract,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContext;
