"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit, Eye, Plus } from "lucide-react";

const API_URL = "https://ircsl-tracking-production.up.railway.app/api/ircsl";

export default function IrcslDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null); // View හෝ Edit කරන්න ගන්නා record එක
  const [isEditMode, setIsEditMode] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    ircslDescription: "",
    responsiblePerson: "",
    sentDateToResponsiblePerson: "",
    dueDate: "",
    sentDateToIrcsl: "",
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(API_URL);
      setRecords(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add Button Click කරද්දී Form එක හිස් කරන්න
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      ircslDescription: "",
      responsiblePerson: "",
      sentDateToResponsiblePerson: "",
      dueDate: "",
      sentDateToIrcsl: "",
    });
    setIsFormModalOpen(true);
  };

  // Edit Button Click එක
  const openEditModal = (record) => {
    setIsEditMode(true);
    setCurrentRecord(record);
    setFormData({
      ircslDescription: record.ircslDescription,
      responsiblePerson: record.responsiblePerson,
      sentDateToResponsiblePerson: record.sentDateToResponsiblePerson || "",
      dueDate: record.dueDate || "",
      sentDateToIrcsl: record.sentDateToIrcsl || "",
    });
    setIsFormModalOpen(true);
  };

  // View Button Click එක
  const openViewModal = (record) => {
    setCurrentRecord(record);
    setIsViewModalOpen(true);
  };

  // Submit (Save / Update) Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/${currentRecord.id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setIsFormModalOpen(false);
      fetchRecords();
    } catch (err) {
      alert("Error saving record!");
    }
  };

  // Delete Logic (Popup Confirm එකත් එක්ක)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchRecords();
      } catch (err) {
        alert("Error deleting record!");
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold border-b-4 border-blue-600 pb-2">IRCSL Checking Dashboard</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add New Record
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-700">Description</th>
              <th className="p-4 font-semibold text-gray-700">Responsible Person</th>
              <th className="p-4 font-semibold text-gray-700">Sent to Resp. Person</th>
              <th className="p-4 font-semibold text-gray-700">Due Date</th>
              <th className="p-4 font-semibold text-gray-700">Sent to IRCSL</th>
              <th className="p-4 font-semibold text-center text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center p-4">Loading records...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="6" className="text-center p-4 text-gray-500">No records found.</td></tr>
            ) : (
              records.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium">{row.ircslDescription}</td>
                  <td className="p-4">{row.responsiblePerson}</td>
                  <td className="p-4">{row.sentDateToResponsiblePerson || "N/A"}</td>
                  <td className="p-4 text-red-600 font-semibold">{row.dueDate || "N/A"}</td>
                  <td className="p-4">{row.sentDateToIrcsl || "N/A"}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button onClick={() => openViewModal(row)} className="p-2 text-green-600 hover:bg-green-50 rounded" title="View"><Eye size={18} /></button>
                    <button onClick={() => openEditModal(row)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(row.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📝 ADD / EDIT MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">{isEditMode ? "Update Record" : "Add IRCSL Record"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">IRCSL Description</label>
                <textarea name="ircslDescription" value={formData.ircslDescription} onChange={handleInputChange} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Responsible Person</label>
                <input type="text" name="responsiblePerson" value={formData.responsiblePerson} onChange={handleInputChange} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Sent Date to Resp. Person</label>
                <input type="date" name="sentDateToResponsiblePerson" value={formData.sentDateToResponsiblePerson} onChange={handleInputChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Due Date</label>
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Sent Date to IRCSL</label>
                <input type="date" name="sentDateToIrcsl" value={formData.sentDateToIrcsl} onChange={handleInputChange} className="w-full border p-2 rounded" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{isEditMode ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔍 VIEW DETAILS MODAL */}
      {isViewModalOpen && currentRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-green-700">IRCSL Record Details</h2>
            <div className="space-y-3 border-y py-3 text-sm">
              <p><strong>Description:</strong> {currentRecord.ircslDescription}</p>
              <p><strong>Responsible Person:</strong> {currentRecord.responsiblePerson}</p>
              <p><strong>Sent Date to Responsible Person:</strong> {currentRecord.sentDateToResponsiblePerson || "Not Sent Yet"}</p>
              <p><strong>Due Date:</strong> <span className="text-red-600 font-bold">{currentRecord.dueDate}</span></p>
              <p><strong>Sent Date to IRCSL:</strong> {currentRecord.sentDateToIrcsl || "Not Sent Yet"}</p>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}