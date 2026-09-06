import { generateId } from '../utils/storage';

export const ACCESS_CODES = {
  doctor: 'DOC123',
  receptionist: 'REC123',
  nurse: 'NRS123',
  admin: 'ADM123',
};

export const AMBULANCE_TYPES = [
  { id: 'basic', name: 'Basic Life Support', description: 'For non-emergency transfers and minor injuries', icon: '🚑', estimatedTime: '15-20 min', price: '₹500' },
  { id: 'als', name: 'Advanced Life Support', description: 'For serious conditions requiring medical equipment', icon: '🚨', estimatedTime: '10-15 min', price: '₹1,500' },
  { id: 'icu', name: 'ICU on Wheels', description: 'Critical care with ventilator and life support', icon: '🏥', estimatedTime: '8-12 min', price: '₹3,500' },
  { id: 'air', name: 'Air Ambulance', description: 'For extreme emergencies and long-distance transfers', icon: '🚁', estimatedTime: '30-45 min', price: '₹50,000+' },
];

export const TRIAGE_CATEGORIES = [
  { id: 1, name: 'Resuscitation', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700', borderColor: 'border-red-300', icon: '🔴', timeFrame: 'Immediate', description: 'Life-threatening conditions requiring immediate intervention', symptoms: ['Cardiac arrest', 'Severe respiratory distress', 'Unresponsive', 'Major trauma'] },
  { id: 2, name: 'Emergency', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-700', borderColor: 'border-orange-300', icon: '🟠', timeFrame: '< 15 min', description: 'Serious conditions requiring urgent attention', symptoms: ['Severe pain', 'Heavy bleeding', 'Breathing difficulty', 'Altered consciousness'] },
  { id: 3, name: 'Urgent', color: 'amber', bgColor: 'bg-amber-100', textColor: 'text-amber-700', borderColor: 'border-amber-300', icon: '🟡', timeFrame: '< 30 min', description: 'Conditions requiring prompt medical attention', symptoms: ['High fever', 'Moderate pain', 'Vomiting', 'Dehydration', 'Fractures'] },
  { id: 4, name: 'Semi-Urgent', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-300', icon: '🔵', timeFrame: '< 60 min', description: 'Conditions that can wait but should be seen same day', symptoms: ['Mild fever', 'Ear pain', 'Minor cuts', 'Sprains', 'Rash'] },
  { id: 5, name: 'Non-Urgent', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700', borderColor: 'border-green-300', icon: '🟢', timeFrame: '120+ min', description: 'Minor conditions that can be managed with advice', symptoms: ['Common cold', 'Minor aches', 'Prescription refill', 'Chronic condition review'] },
];

export const TRIAGE_QUESTIONS = [
  { id: 'consciousness', question: 'Is the patient conscious and alert?', options: ['Yes, fully alert', 'Partially responsive', 'Unresponsive'], weights: [0, 2, 4] },
  { id: 'breathing', question: 'How is the patient breathing?', options: ['Normal', 'Slightly difficult', 'Very difficult / Gasping', 'Not breathing'], weights: [0, 1, 3, 4] },
  { id: 'pain', question: 'What is the pain level? (0-10)', type: 'scale', ranges: [{ min: 0, max: 2, weight: 0 }, { min: 3, max: 5, weight: 1 }, { min: 6, max: 8, weight: 2 }, { min: 9, max: 10, weight: 3 }] },
  { id: 'bleeding', question: 'Is there any bleeding?', options: ['No bleeding', 'Minor bleeding', 'Heavy / Uncontrolled bleeding'], weights: [0, 1, 3] },
  { id: 'temperature', question: 'Does the patient have fever?', options: ['No fever', 'Mild (99-100.4°F)', 'High (100.4-103°F)', 'Very high (103°F+)'], weights: [0, 1, 2, 3] },
  { id: 'mobility', question: 'Can the patient walk/move normally?', options: ['Yes', 'With difficulty', 'Cannot move / Walk'], weights: [0, 1, 2] },
];

export const SAMPLE_DOCTORS = [
  { id: 'doc1', name: 'Dr. Rajesh Sharma', specialty: 'General Physician', available: true },
  { id: 'doc2', name: 'Dr. Priya Patel', specialty: 'Cardiologist', available: true },
  { id: 'doc3', name: 'Dr. Amit Kumar', specialty: 'Orthopedic', available: true },
  { id: 'doc4', name: 'Dr. Sneha Reddy', specialty: 'Pediatrician', available: false },
  { id: 'doc5', name: 'Dr. Vikram Singh', specialty: 'Neurologist', available: true },
];

export const REPORT_TYPES = ['Blood Report', 'X-Ray', 'MRI Scan', 'CT Scan', 'ECG', 'Ultrasound', 'Urine Test', 'Liver Function Test', 'Kidney Function Test', 'Thyroid Profile', 'Diabetes Panel', 'Lipid Profile', 'Chest X-Ray', 'Bone Density', 'Pathology Report', 'Other'];

export const COMMON_SYMPTOMS = ['Fever', 'Headache', 'Cough', 'Cold', 'Body Pain', 'Stomach Pain', 'Chest Pain', 'Breathing Difficulty', 'Nausea', 'Vomiting', 'Diarrhea', 'Skin Rash', 'Dizziness', 'Fatigue', 'Joint Pain', 'Back Pain', 'Eye Pain', 'Ear Pain', 'Sore Throat', 'Insomnia'];

export const initializeMockData = () => {
  if (!localStorage.getItem('rakshak_initialized')) {
    const samplePatients = [
      {
        id: 'pat1', name: 'Rahul Verma', phone: '9876543210', email: 'rahul@email.com',
        age: 32, gender: 'Male', bloodGroup: 'O+', address: '123 MG Road, Delhi',
        emergencyContact: '9876543211', password: 'patient123',
        registeredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        reports: [
          { id: 'r1', type: 'Blood Report', title: 'Complete Blood Count', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), doctor: 'Dr. Rajesh Sharma', notes: 'Hemoglobin slightly low. Vitamin D deficiency.', imageData: null },
          { id: 'r2', type: 'X-Ray', title: 'Chest X-Ray', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), doctor: 'Dr. Rajesh Sharma', notes: 'No abnormalities detected.', imageData: null },
          { id: 'r3', type: 'MRI Scan', title: 'MRI Brain', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), doctor: 'Dr. Vikram Singh', notes: 'Normal MRI. No lesions.', imageData: null },
        ],
        appointments: [
          { id: 'apt1', patientId: 'pat1', doctorId: 'doc1', doctorName: 'Dr. Rajesh Sharma', specialty: 'General Physician', date: new Date().toISOString(), time: '10:00 AM', status: 'scheduled', reason: 'Follow-up for vitamin deficiency', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
        ],
      },
      {
        id: 'pat2', name: 'Anita Gupta', phone: '9876543220', email: 'anita@email.com',
        age: 45, gender: 'Female', bloodGroup: 'A+', address: '456 Nehru Nagar, Mumbai',
        emergencyContact: '9876543221', password: 'patient123',
        registeredAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        reports: [{ id: 'r4', type: 'ECG', title: 'Resting ECG', date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), doctor: 'Dr. Priya Patel', notes: 'Normal sinus rhythm.', imageData: null }],
        appointments: [],
      },
    ];

    const sampleQueue = [
      { id: 'q1', patientId: 'pat1', patientName: 'Rahul Verma', doctorId: 'doc1', doctorName: 'Dr. Rajesh Sharma', position: 1, status: 'waiting', triageLevel: 4, checkInTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), symptoms: ['Fever', 'Cough'] },
      { id: 'q2', patientId: 'pat2', patientName: 'Anita Gupta', doctorId: 'doc2', doctorName: 'Dr. Priya Patel', position: 2, status: 'waiting', triageLevel: 3, checkInTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(), symptoms: ['Chest Pain'] },
    ];

    const sampleAmbulanceCalls = [
      { id: 'ac1', patientName: 'Emergency Caller', patientPhone: '9876543299', type: 'als', typeName: 'Advanced Life Support', location: '456 Ring Road, Delhi', status: 'dispatched', calledAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), estimatedArrival: '12 min' },
    ];

    const sampleStaff = [
      { id: 'staff1', name: 'Dr. Rajesh Sharma', role: 'doctor', specialty: 'General Physician', code: 'DOC123' },
      { id: 'staff2', name: 'Dr. Priya Patel', role: 'doctor', specialty: 'Cardiologist', code: 'DOC123' },
      { id: 'staff3', name: 'Reception', role: 'receptionist', code: 'REC123' },
      { id: 'staff4', name: 'Nurse Meena', role: 'nurse', code: 'NRS123' },
    ];

    localStorage.setItem('rakshak_patients', JSON.stringify(samplePatients));
    localStorage.setItem('rakshak_queue', JSON.stringify(sampleQueue));
    localStorage.setItem('rakshak_ambulance_calls', JSON.stringify(sampleAmbulanceCalls));
    localStorage.setItem('rakshak_staff', JSON.stringify(sampleStaff));
    localStorage.setItem('rakshak_initialized', 'true');
  }
};