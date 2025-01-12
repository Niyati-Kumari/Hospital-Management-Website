const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Get all doctors
router.route('/').get((req, res) => {
    Doctor.find()
        .then(doctors => res.json(doctors))
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

// Add new doctor
router.route('/add').post((req, res) => {
    const { name, specialty } = req.body;

    if (!name || !specialty) {
        return res.status(400).json({ success: false, message: 'Name and specialty are required' });
    }

    const newDoctor = new Doctor({ name, specialty });

    newDoctor.save()
        .then(savedDoctor => res.json({ success: true, data: savedDoctor }))
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

// Update doctor data (use PUT instead of POST)
router.route('/update/:id').put((req, res) => {  // Change POST to PUT
    Doctor.findById(req.params.id)
        .then(doctor => {
            if (!doctor) {
                return res.status(404).json({ success: false, message: 'Doctor not found' });
            }

            doctor.name = req.body.name || doctor.name;
            doctor.specialty = req.body.specialty || doctor.specialty;

            doctor.save()
                .then(() => res.json({ success: true, message: 'Doctor updated!' }))
                .catch(err => res.status(500).json({ success: false, message: err.message }));
        })
        .catch(err => res.status(400).json({ success: false, message: err.message }));
});

// Delete doctor by ID
router.route('/delete/:id').delete((req, res) => {
    Doctor.findByIdAndDelete(req.params.id)
        .then(doctor => {
            if (!doctor) {
                return res.status(404).json({ success: false, message: 'Doctor not found' });
            }
            res.json({ success: true, message: 'Doctor deleted!' });
        })
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

module.exports = router;
