import React, { useRef } from 'react';
import { HexColorPicker } from 'react-colorful';

interface ChatbotSettingsProps {
  chatbotName: string;
  setChatbotName: (name: string) => void;
  greetingMessage: string;
  setGreetingMessage: (message: string) => void;
  color: string;
  setColor: (color: string) => void;
  showColorPicker: boolean;
  setShowColorPicker: (show: boolean) => void;
  headerTextColor: string;
  setHeaderTextColor: (color: string) => void;
  showHeaderColorPicker: boolean;
  setShowHeaderColorPicker: (show: boolean) => void;
  colorPickerRef: React.RefObject<HTMLDivElement>;
  headerColorPickerRef: React.RefObject<HTMLDivElement>;
}

export default function ChatbotSettings({
  chatbotName,
  setChatbotName,
  greetingMessage,
  setGreetingMessage,
  color,
  setColor,
  showColorPicker,
  setShowColorPicker,
  headerTextColor,
  setHeaderTextColor,
  showHeaderColorPicker,
  setShowHeaderColorPicker,
  colorPickerRef,
  headerColorPickerRef
}: ChatbotSettingsProps) {
  return (
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
        <div className="relative" ref={colorPickerRef}>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-10 h-10 rounded-lg border shadow-sm"
              style={{ backgroundColor: color }}
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter color code (e.g., #FF6B00)"
            />
          </div>
          {showColorPicker && (
            <div className="absolute z-10">
              <HexColorPicker color={color} onChange={setColor} />
            </div>
          )}
        </div>
      </div>

      {/* Header Text Color */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Header Text Color</h3>
        <div className="relative" ref={headerColorPickerRef}>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setShowHeaderColorPicker(!showHeaderColorPicker)}
              className="w-10 h-10 rounded-lg border shadow-sm"
              style={{ backgroundColor: headerTextColor }}
            />
            <input
              type="text"
              value={headerTextColor}
              onChange={(e) => setHeaderTextColor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter header text color code (e.g., #000000)"
            />
          </div>
          {showHeaderColorPicker && (
            <div className="absolute z-10">
              <HexColorPicker color={headerTextColor} onChange={setHeaderTextColor} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}