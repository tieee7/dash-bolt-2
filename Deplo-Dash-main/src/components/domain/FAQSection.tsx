import React from 'react';
import type { FAQ } from '../../types/faq';

interface FAQSectionProps {
  qaList: FAQ[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  newQuestion: string;
  setNewQuestion: (question: string) => void;
  newAnswer: string;
  setNewAnswer: (answer: string) => void;
  handleAddQA: () => void;
  handleDeleteQA: (id: string) => void;
}

export default function FAQSection({
  qaList,
  searchQuery,
  setSearchQuery,
  newQuestion,
  setNewQuestion,
  newAnswer,
  setNewAnswer,
  handleAddQA,
  handleDeleteQA
}: FAQSectionProps) {
  const filteredQA = qaList.filter(qa => 
    qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qa.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left side - Input Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-6">
          Set up FAQs for your chatbot to answer common questions
        </p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <input
              type="text"
              id="question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter a question"
            />
          </div>

          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
              Answer
            </label>
            <textarea
              id="answer"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder="Enter the answer"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAddQA}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add FAQ
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Q&A List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search questions and answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {filteredQA.map((qa) => (
            <div key={qa.id} className="border rounded-lg p-4 hover:border-orange-200 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{qa.question}</h4>
                <button
                  onClick={() => handleDeleteQA(qa.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600">{qa.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}