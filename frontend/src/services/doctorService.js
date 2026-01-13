import api from './api';

const getPatients = () => {
  return api.get('/doctor/patients'); // Sesuaikan endpoint backend Anda
};

const inputDiagnosis = (data) => {
  return api.post('/medical-records', data);
};

const updateSchedule = (scheduleData) => {
  return api.put('/doctor/schedule', scheduleData);
};

const doctorService = {
  getPatients,
  inputDiagnosis,
  updateSchedule,
};

export default doctorService;