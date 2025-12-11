
export interface AnalysisRequest {
  text?: string;
  file?: File;
  inputType: 'text' | 'pdf' | 'image';
}

export interface Medication {
  name: string;
  dosage: string;
  timing: string;
  frequency: string;
}

export interface Hospital {
  name: string;
  address: string;
  specialization: string;
  distance?: string;
}

export interface AnalysisResponse {
  summary: string;
  medications: Medication[];
  hospitals: Hospital[];
  keyInsights: string[];
  confidence?: number;
}

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export const analyzeDocument = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  const formData = new FormData();
  
  if (request.text) {
    formData.append('text', request.text);
  }
  
  if (request.file) {
    formData.append('file', request.file);
  }
  
  formData.append('inputType', request.inputType);

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Analysis failed' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};
