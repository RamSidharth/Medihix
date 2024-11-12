// Utility functions
const Utils = {
    showAlert: function (message, type = "info") {
        const alertBox = document.createElement('div');
        alertBox.className = `alert alert-${type}`;
        alertBox.textContent = message;
        document.body.appendChild(alertBox);
        setTimeout(() => alertBox.remove(), 3000);
    },
    isValidEmail: function (email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    calculateBMI: function (weight, height) {
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(2);
    },
    storeData: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    getData: function (key) {
        return JSON.parse(localStorage.getItem(key));
    },
    clearData: function (key) {
        localStorage.removeItem(key);
    }
};

// BMI Calculation
const BMICalculator = {
    init: function () {
        const bmiForm = document.getElementById('bmiForm');
        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseFloat(document.getElementById('height').value);
            if (isNaN(weight) || isNaN(height)) {
                Utils.showAlert("Please enter valid numbers for weight and height.", "warning");
                return;
            }
            const bmi = Utils.calculateBMI(weight, height);
            Utils.storeData('bmi', { weight, height, bmi });
            Utils.showAlert(`Your BMI is ${bmi}.`, "success");
            document.getElementById('bmiResult').textContent = `Your BMI is ${bmi}.`;
        });
    }
};

// Appointment Booking
const Appointments = {
    init: function () {
        const appointmentForm = document.getElementById('appointmentForm');
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const date = document.getElementById('date').value;
            const doctor = document.getElementById('doctor').value;
            if (name === "" || date === "" || doctor === "") {
                Utils.showAlert("All fields are required.", "warning");
                return;
            }
            const appointment = { name, date, doctor };
            let appointments = Utils.getData('appointments') || [];
            appointments.push(appointment);
            Utils.storeData('appointments', appointments);
            Utils.showAlert("Appointment booked successfully.", "success");
            this.renderAppointments();
        });
    },
    renderAppointments: function () {
        const appointments = Utils.getData('appointments') || [];
        const appointmentsList = document.getElementById('appointmentsList');
        appointmentsList.innerHTML = "";
        appointments.forEach((appointment, index) => {
            const li = document.createElement('li');
            li.textContent = `${appointment.name} has an appointment with Dr. ${appointment.doctor} on ${appointment.date}`;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = "Cancel";
            deleteBtn.addEventListener('click', () => {
                appointments.splice(index, 1);
                Utils.storeData('appointments', appointments);
                this.renderAppointments();
            });
            li.appendChild(deleteBtn);
            appointmentsList.appendChild(li);
        });
    }
};

// Progress Tracking
const ProgressTracking = {
    init: function () {
        const progressForm = document.getElementById('progressForm');
        progressForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const goal = document.getElementById('goal').value;
            const progress = document.getElementById('progress').value;
            if (goal === "" || isNaN(progress)) {
                Utils.showAlert("Please enter a valid goal and progress.", "warning");
                return;
            }
            const progressData = { goal, progress: parseInt(progress) };
            let progressList = Utils.getData('progress') || [];
            progressList.push(progressData);
            Utils.storeData('progress', progressList);
            Utils.showAlert("Progress tracked successfully.", "success");
            this.renderProgress();
        });
    },
    renderProgress: function () {
        const progressList = Utils.getData('progress') || [];
        const progressContainer = document.getElementById('progressList');
        progressContainer.innerHTML = "";
        progressList.forEach((entry, index) => {
            const li = document.createElement('li');
            li.textContent = `Goal: ${entry.goal} - Progress: ${entry.progress}%`;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = "Remove";
            deleteBtn.addEventListener('click', () => {
                progressList.splice(index, 1);
                Utils.storeData('progress', progressList);
                this.renderProgress();
            });
            li.appendChild(deleteBtn);
            progressContainer.appendChild(li);
        });
    }
};

// Prescription Management
const PrescriptionManagement = {
    init: function () {
        const prescriptionForm = document.getElementById('prescriptionForm');
        prescriptionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const medication = document.getElementById('medication').value;
            const dosage = document.getElementById('dosage').value;
            if (medication === "" || dosage === "") {
                Utils.showAlert("Please enter valid medication and dosage.", "warning");
                return;
            }
            const prescription = { medication, dosage };
            let prescriptions = Utils.getData('prescriptions') || [];
            prescriptions.push(prescription);
            Utils.storeData('prescriptions', prescriptions);
            Utils.showAlert("Prescription added successfully.", "success");
            this.renderPrescriptions();
        });
    },
    renderPrescriptions: function () {
        const prescriptions = Utils.getData('prescriptions') || [];
        const prescriptionsList = document.getElementById('prescriptionsList');
        prescriptionsList.innerHTML = "";
        prescriptions.forEach((prescription, index) => {
            const li = document.createElement('li');
            li.textContent = `Medication: ${prescription.medication}, Dosage: ${prescription.dosage}`;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = "Remove";
            deleteBtn.addEventListener('click', () => {
                prescriptions.splice(index, 1);
                Utils.storeData('prescriptions', prescriptions);
                this.renderPrescriptions();
            });
            li.appendChild(deleteBtn);
            prescriptionsList.appendChild(li);
        });
    }
};

// AJAX Call Example (Fetching Data from an API)
const DataFetcher = {
    fetchData: function () {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(data => {
                const dataContainer = document.getElementById('dataContainer');
                dataContainer.innerHTML = "";
                data.slice(0, 5).forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'data-item';
                    div.textContent = `${item.title}`;
                    dataContainer.appendChild(div);
                });
                Utils.showAlert("Data fetched successfully.", "success");
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                Utils.showAlert("Error fetching data.", "danger");
            });
    }
};

// Login Functionality
const Login = {
    init: function () {
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            if (!Utils.isValidEmail(email) || password === "") {
                Utils.showAlert("Please enter a valid email and password.", "warning");
                return;
            }
            Utils.showAlert("Login successful.", "success");
            window.location.href = "/dashboard";  // Redirect after login
        });
    }
};

// Initialize all modules on document load
document.addEventListener('DOMContentLoaded', () => {
    BMICalculator.init();
    Appointments.init();
    Appointments.renderAppointments();
    ProgressTracking.init();
    ProgressTracking.renderProgress();
    PrescriptionManagement.init();
    PrescriptionManagement.renderPrescriptions();
    DataFetcher.fetchData();
    Login.init();
});
