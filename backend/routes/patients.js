const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Get all patients
router.route('/').get((req, res) => {
    Patient.find()
        .then(patients => res.json(patients))
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

// Add new patient
router.route('/add').post((req, res) => {
    const { name, age, gender } = req.body;

    if (!name || !age || !gender) {
        return res.status(400).json({ success: false, message: 'Name, age, and gender are required' });
    }

    const newPatient = new Patient({ name, age, gender });

    newPatient.save()
        .then(savedPatient => res.json({ success: true, data: savedPatient }))
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

// Update patient data (use PUT instead of POST)
router.route('/update/:id').put((req, res) => {  // Change POST to PUT
    Patient.findById(req.params.id)
        .then(patient => {
            if (!patient) {
                return res.status(404).json({ success: false, message: 'Patient not found' });
            }

            patient.name = req.body.name || patient.name;
            patient.age = req.body.age || patient.age;
            patient.gender = req.body.gender || patient.gender;

            patient.save()
                .then(() => res.json({ success: true, message: 'Patient updated!' }))
                .catch(err => res.status(500).json({ success: false, message: err.message }));
        })
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

// Delete patient by ID
router.route('/delete/:id').delete((req, res) => {
    Patient.findByIdAndDelete(req.params.id)
        .then(patient => {
            if (!patient) {
                return res.status(404).json({ success: false, message: 'Patient not found' });
            }
            res.json({ success: true, message: 'Patient deleted!' });
        })
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

module.exports = router;

