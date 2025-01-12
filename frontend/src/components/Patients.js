import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Patients.css';
import PatientCard from './PatientCard';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: '' });
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios
            .get('https://hospital-management-app-wna4.onrender.com/patients')
            .then(response => {
                setPatients(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Error fetching patients. Please try again.');
                setLoading(false);
            });
    }, []);

    const handleAddPatient = (e) => {
        e.preventDefault();

        // Validate the form fields
        if (!newPatient.name || !newPatient.age || !newPatient.gender) {
            alert('Please fill in all fields!');
            return;
        }

        setLoading(true);
        axios
            .post('https://hospital-management-app-wna4.onrender.com/patients/add', newPatient)
            .then(response => {
                setPatients([...patients, response.data]);
                setNewPatient({ name: '', age: '', gender: '' });
                setLoading(false);
            })
            .catch(error => {
                setError('Error adding patient. Please try again.');
                setLoading(false);
            });
    };

    const handleUpdatePatient = (id, e) => {
        e.preventDefault();

        setLoading(true);
        axios
            .post(`https://hospital-management-app-wna4.onrender.com/patients/update/${id}`, selectedPatient)
            .then(response => {
                const updatedPatient = { ...selectedPatient, _id: id };
                setPatients(
                    patients.map(patient => (patient._id === id ? updatedPatient : patient))
                );
                setSelectedPatient(null);
                setIsEditMode(false);
                setLoading(false);
            })
            .catch(error => {
                setError('Error updating patient. Please try again.');
                setLoading(false);
            });
    };

    const handleDeletePatient = (id) => {
        setLoading(true);
        axios
            .delete(`https://hospital-management-app-wna4.onrender.com/patients/delete/${id}`)
            .then(response => {
                setPatients(patients.filter(patient => patient._id !== id));
                setLoading(false);
            })
            .catch(error => {
                setError('Error deleting patient. Please try again.');
                setLoading(false);
            });
    };

    const handleEditPatient = (patient) => {
        setSelectedPatient(patient);
        setIsEditMode(true);
    };

    return (
        <div className="patient-main">
            <div className="form-sections">
                <h4>{isEditMode ? 'Edit Patient' : 'Add New Patient'}</h4>
                <form onSubmit={isEditMode ? (e) => handleUpdatePatient(selectedPatient._id, e) : handleAddPatient}>
                    <label>Name: </label>
                    <input
                        type="text"
                        value={isEditMode ? selectedPatient.name : newPatient.name}
                        onChange={(e) => isEditMode ? 
                            setSelectedPatient({ ...selectedPatient, name: e.target.value }) :
                            setNewPatient({ ...newPatient, name: e.target.value })}
                    />
                    <br />
                    <label>Age: </label>
                    <input
                        type="number"
                        value={isEditMode ? selectedPatient.age : newPatient.age}
                        onChange={(e) => isEditMode ? 
                            setSelectedPatient({ ...selectedPatient, age: e.target.value }) :
                            setNewPatient({ ...newPatient, age: e.target.value })}
                    />
                    <br />
                    <label>Gender: </label>
                    <select
                        value={isEditMode ? selectedPatient.gender : newPatient.gender}
                        onChange={(e) => isEditMode ? 
                            setSelectedPatient({ ...selectedPatient, gender: e.target.value }) :
                            setNewPatient({ ...newPatient, gender: e.target.value })}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <br />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Processing...' : isEditMode ? 'Update Patient' : 'Add Patient'}
                    </button>
                </form>
            </div>

            <div className="patients-section">
                <h3 style={{ textAlign: "center" }}>
                    Patients ({patients.length})
                </h3>

                {loading && <p>Loading patients...</p>}
                {error && <p>{error}</p>}

                {patients.length === 0 ? (
                    <p>No patients available.</p>
                ) : (
                    <div className="patient-list">
                        {patients.map(patient => (
                            <PatientCard
                                key={patient._id}
                                patient={patient}
                                onEdit={handleEditPatient}
                                onDelete={handleDeletePatient}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Patients;
