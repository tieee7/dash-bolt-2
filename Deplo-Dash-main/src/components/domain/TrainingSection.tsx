import React from 'react';
import type { TrainingData } from '../../types/trainingData';

interface TrainingSectionProps {
  trainingData: TrainingData[];
  trainingSearchQuery: string;
  setTrainingSearchQuery: (query: string) => void;
  newTrainingData: string;
  setNewTrainingData: (data: string) => void;
  handleAddTrainingData: () => void;
  handleDeleteTrainingData: (id: number | string) => void;
}

export default function TrainingSection({
  trainingData,
  trainingSearchQuery,
  setTrainingSearchQuery,
  newTrainingData,
  setNewTrainingData,
  handleAddTrainingData,
  handleDeleteTrainingData
}: TrainingSectionProps) {
  const filteredTrainingData = trainingData.filter(data => 
    data.content.toLowerCase().includes(trainingSearchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left side - Input Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">
          Add training data to help your bot understand your business better. Include important information about your products, services, policies, and procedures.
        </p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="trainingData" className="block text-sm font-medium text-gray-700 mb-1">
              Training Data
            </label>
            <textarea
              id="trainingData"
              value={newTrainingData}
              onChange={(e) => setNewTrainingData(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder="Enter information that will help the bot understand your business..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAddTrainingData}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add Training Data
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Training Data List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search training data..."
            value={trainingSearchQuery}
            onChange={(e) => setTrainingSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {filteredTrainingData.map((data) => (
            <div key={data.id} className="border rounded-lg p-4 hover:border-orange-200 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600">
                    Context
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTrainingData(data.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{data.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}