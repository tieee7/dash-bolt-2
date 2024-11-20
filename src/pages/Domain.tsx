import React, { useState, useEffect } from 'react';
import { Copy, Check, Code2, Globe, Save } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { toast } from 'react-hot-toast';
import { useDomain } from '../context/DomainContext';
import ChatbotPreview from '../components/ChatbotPreview';

export default function Domain() {
  const { currentDomain, updateDomainName } = useDomain();
  const [chatbotName, setChatbotName] = useState('Friendly Assistant');
  const [color, setColor] = useState('#FF6B00');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [copied, setCopied] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState('👋 Hi there! How can I help you today?');
  const [domainName, setDomainName] = useState(currentDomain.name);
  const [isEditing, setIsEditing] = useState(false);
  const [qaList, setQaList] = useState([
    { id: 1, question: "What are your business hours?", answer: "We're open Monday to Friday, 9 AM to 5 PM." },
    { id: 2, question: "How can I contact support?", answer: "You can reach us at support@example.com" }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [trainingData, setTrainingData] = useState([
    { id: 1, content: "The company was founded in 2020 and specializes in AI solutions.", type: "context" },
    { id: 2, content: "Our product pricing starts at $99/month for the basic plan.", type: "context" }
  ]);
  const [newTrainingData, setNewTrainingData] = useState('');
  const [trainingSearchQuery, setTrainingSearchQuery] = useState('');
  const [editingTrainingId, setEditingTrainingId] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  useEffect(() => {
    setDomainName(currentDomain.name);
  }, [currentDomain.name]);

  const integrationCode = `<script src="https://chatbot.corinna.ai/widget/${currentDomain.name}"></script>`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(integrationCode);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const handleDomainSave = () => {
    if (!domainName.trim()) {
      toast.error('Domain name cannot be empty');
      return;
    }
    
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domainName)) {
      toast.error('Please enter a valid domain name');
      return;
    }

    updateDomainName(domainName);
    setIsEditing(false);
    toast.success('Domain name updated successfully');
  };

  const handleSaveAll = () => {
    if (!domainName.trim()) {
      toast.error('Domain name cannot be empty');
      return;
    }
    
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domainName)) {
      toast.error('Please enter a valid domain name');
      return;
    }

    updateDomainName(domainName);
    setIsEditing(false);
    toast.success('All changes saved successfully');
  };

  const handleAddQA = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error('Both question and answer are required');
      return;
    }

    setQaList([
      ...qaList,
      {
        id: Date.now(),
        question: newQuestion.trim(),
        answer: newAnswer.trim()
      }
    ]);
    setNewQuestion('');
    setNewAnswer('');
    toast.success('FAQ added successfully');
  };

  const handleDeleteQA = (id: number) => {
    setQaList(qaList.filter(qa => qa.id !== id));
    toast.success('FAQ deleted successfully');
  };

  const filteredQA = qaList.filter(qa => 
    qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qa.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrainingData = trainingData.filter(data => 
    data.content.toLowerCase().includes(trainingSearchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Domain Settings</h1>
        <p className="text-gray-600">
          Configure and manage settings for your domain
        </p>
      </div>

      <div className="space-y-8">
        {/* Domain Settings Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-gray-600" />
            Domain Settings
          </h2>
          
          <div className="bg-white rounded-lg shadow">
            {/* Domain Name */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold mb-4">Domain Name</h3>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-500 flex-shrink-0" />
                {isEditing ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={domainName}
                      onChange={(e) => setDomainName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter domain name"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleDomainSave}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setDomainName(currentDomain.name);
                          setIsEditing(false);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="font-medium text-gray-700">{domainName}</span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Integration Code */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Integration Code</h3>
                <Code2 className="h-5 w-5 text-gray-500" />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm relative">
                <pre className="overflow-x-auto">{integrationCode}</pre>
                <button
                  onClick={handleCopyCode}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Add this code snippet to your website's HTML just before the closing &lt;/body&gt; tag
              </p>
            </div>
          </div>
        </section>

        {/* Chatbot Settings Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Chatbot Settings</h2>
          
          <div className="space-y-6">
            {/* Chatbot Name */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Chatbot Name</h3>
              <div className="max-w-md">
                <input
                  type="text"
                  value={chatbotName}
                  onChange={(e) => setChatbotName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter chatbot name"
                />
                <p className="mt-2 text-sm text-gray-600">
                  This name will be displayed to your website visitors
                </p>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Welcome Message</h3>
              <div className="max-w-md">
                <textarea
                  value={greetingMessage}
                  onChange={(e) => setGreetingMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  placeholder="Enter the greeting message"
                />
                <p className="mt-2 text-sm text-gray-600">
                  This message will be shown when a visitor first opens the chat. You can use emojis! 😊
                </p>
              </div>
            </div>

            {/* Chatbot Color */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Chatbot Color</h3>
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-10 h-10 rounded-lg border shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-gray-600">{color}</span>
                </div>
                {showColorPicker && (
                  <div className="absolute z-10">
                    <HexColorPicker color={color} onChange={setColor} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Help Desk Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Help Desk</h2>
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
        </section>

        {/* Bot Training Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Bot Training</h2>
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
                    onClick={() => {
                      if (newTrainingData.trim()) {
                        setTrainingData([...trainingData, {
                          id: Date.now(),
                          content: newTrainingData.trim(),
                          type: 'context'
                        }]);
                        setNewTrainingData('');
                        toast.success('Training data added successfully');
                      }
                    }}
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
                          {data.type}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setTrainingData(trainingData.filter(item => item.id !== data.id));
                          toast.success('Training data removed');
                        }}
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
        </section>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSaveAll}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save All Changes
          </button>
        </div>
      </div>

      {/* Chatbot Preview */}
      <ChatbotPreview
        chatbotName={chatbotName}
        greetingMessage={greetingMessage}
        color={color}
        domainName={domainName}
      />
    </div>
  );
}