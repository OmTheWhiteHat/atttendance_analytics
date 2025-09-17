'use client'
import { useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { apiClient } from '../utils/api';

export default function FaceFingerprintAuth() {
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    };
    loadModels();
  }, []);

  const handleFaceLogin = async () => {
    // Capture face, get descriptor, send to backend
    alert('Face login simulated');
  };

  const handleFingerprintLogin = async () => {
    // Integrate WebAuthn / Fingerprint API
    alert('Fingerprint login simulated');
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <button onClick={handleFaceLogin} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
        Login with Face
      </button>
      <button onClick={handleFingerprintLogin} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
        Login with Fingerprint
      </button>
    </div>
  );
}
