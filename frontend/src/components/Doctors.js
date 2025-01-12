import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorCard from './DoctorCard';
import './Doctors.css';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '' });
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get('https://hospital-management-app-wna4.onrender.com/doctors')
            .then(response => {
                setDoctors(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching doctors:', error);
                setError('Error fetching doctors. Please try again later.');
                setLoading(false);
            });
    }, []);

    const handleAddDoctor = (e) => {
        e.preventDefault();
        if (!newDoctor.name || !newDoctor.specialty) {
            alert('Both Name and Specialty are required!');
            return;
        }
        axios
            .post('https://hospital-management-app-wna4.onrender.com/doctors/add', newDoctor)
            .then(response => {
                setDoctors([...doctors, response.data]);
                setNewDoctor({ name: '', specialty: '' });
            })
            .catch(error => {
                setError('Error adding doctor. Please try again.');
                console.error('Error adding doctor:', error);
            });
    };

    const handleUpdateDoctor = (id, e) => {
        e.preventDefault();
        axios
            .post(`https://hospital-management-app-wna4.onrender.com/doctors/update/${id}`, selectedDoctor)
            .then(response => {
                const updatedDoctor = { ...selectedDoctor, _id: id };
                setDoctors(
                    doctors.map(doctor =>
                        doctor._id === id ? updatedDoctor : doctor
                    )
                );
                setSelectedDoctor(null);
                setIsEditMode(false);
            })
            .catch(error => {
                setError('Error updating doctor. Please try again.');
                console.error('Error updating doctor:', error);
            });
    };

    const handleDeleteDoctor = (id) => {
        axios
            .delete(`https://hospital-management-app-wna4.onrender.com/doctors/delete/${id}`)
            .then(response => {
                setDoctors(doctors.filter(doctor => doctor._id !== id));
            })
            .catch(error => {
                setError('Error deleting doctor. Please try again.');
                console.error('Error deleting doctor:', error);
            });
    };

    const handleEditDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setIsEditMode(true);
    };

    return (
        <div className="main-doc-container">
            <div className="form-sections">
                <h4>{isEditMode ? 'Edit Doctor' : 'Add New Doctor'}</h4>
                <form onSubmit={isEditMode ? (e) => handleUpdateDoctor(selectedDoctor._id, e) : handleAddDoctor}>
                    <label>Name: </label>
                    <input
                        type="text"
                        value={isEditMode ? selectedDoctor.name : newDoctor.name}
                        onChange={(e) =>
                            isEditMode
                                ? setSelectedDoctor({ ...selectedDoctor, name: e.target.value })
                                : setNewDoctor({ ...newDoctor, name: e.target.value })
                        }
                    />
                    <br />
                    <label>Specialty: </label>
                    <input
                        type="text"
                        value={isEditMode ? selectedDoctor.specialty : newDoctor.specialty}
                        onChange={(e) =>
                            isEditMode
                                ? setSelectedDoctor({ ...selectedDoctor, specialty: e.target.value })
                                : setNewDoctor({ ...newDoctor, specialty: e.target.value })
                        }
                    />
                    <br />
                    <button type="submit">{isEditMode ? 'Update Doctor' : 'Add Doctor'}</button>
                </form>
            </div>
            <div className="doctors-section">
                <h3>Doctors ({doctors.length})</h3>
                {loading ? (
                    <p>Loading doctors...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : doctors.length === 0 ? (
                    <p>No doctors available.</p>
                ) : (
                    <div className="doctor-list">
                        {doctors.map(doctor => (
                            <DoctorCard
                                key={doctor._id}
                                doctor={doctor}
                                onEdit={handleEditDoctor}
                                onDelete={handleDeleteDoctor}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Doctors;
