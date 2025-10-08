'use client'

import { useState, useEffect } from 'react'
import NavBar2 from '@/components/NavBar2'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import { Upload, Link as LinkIcon, FileText, Image, PenTool, MessageSquare, ThumbsUp, AlertCircle } from 'lucide-react'
import axios from 'axios'
import Markdown from 'react-markdown'

type InputType = 'context' | 'topic' | 'link' | 'media' | 'pdf'

interface InputOption {
  type: InputType
  icon: React.ReactNode
  label: string
}

interface Feedback {
  type: 'suggestion' | 'improvement' | 'error'
  message: string
}

export default function SubjectivePage() {
  const [isClient, setIsClient] = useState(false)
  const [activeItem, setActiveItem] = useState('subjective')
  const [inputText, setInputText] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [activeInput, setActiveInput] = useState<InputType>('context')
  const [fileUpload, setFileUpload] = useState<File | null>(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      type: 'suggestion',
      message: 'Consider using more formal language in this academic context.'
    },
    {
      type: 'improvement',
      message: 'Good use of transition words to connect your ideas.'
    },
    {
      type: 'error',
      message: 'There might be a grammatical error in the second paragraph.'
    }
  ])
  const [aiResponse, setAiResponse] = useState('') // State for AI-generated response
  const [aiDescriptiveResponse, setAiDescriptiveResponse] = useState('') // State for AI-generated descriptive response
  const [writingStyle, setWritingStyle] = useState('academic') // State for selected writing style

  const inputOptions: InputOption[] = [
    { type: 'context', icon: <PenTool className="w-4 h-4" />, label: 'Context' },
    { type: 'topic', icon: <FileText className="w-4 h-4" />, label: 'Topic' },
    { type: 'link', icon: <LinkIcon className="w-4 h-4" />, label: 'Link' },
    { type: 'media', icon: <Image className="w-4 h-4" />, label: 'Media' },
    { type: 'pdf', icon: <Upload className="w-4 h-4" />, label: 'PDF' }
  ]

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
    setWordCount(e.target.value.trim().split(/\s+/).filter(Boolean).length)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (activeInput === 'pdf' && file.type !== 'application/pdf') {
        alert('Please upload a PDF file')
        return
      }
      if (activeInput === 'media' && !file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }
      setFileUpload(file)
    }
  }

  // Simulate AI response generation (replace with actual API call)
  const generateAIResponse = () => {
    // Simulate an AI response based on the input text
    const response = `AI Response: Here is a refined version of your text:\n\n${inputText
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')}.`;
    setAiResponse(response);

    // Simulate a descriptive response from your AI
    const descriptiveResponse = `Descriptive Analysis:\n\nYour text demonstrates a strong command of language, but it could benefit from more varied sentence structures and a deeper exploration of the topic. Consider adding more examples or elaborating on key points to enhance clarity and engagement.`;
    setAiDescriptiveResponse(descriptiveResponse);
  };

  const handleAIReview = async () => {
    try {
      if(!inputText) throw new Error("Please provide a query");
      axios.defaults.baseURL = 'http://127.0.0.1:5000'
      const {data} = await axios.post('/query', { query: inputText })
      setAiResponse(data.result)
    } catch (error) {
      console.error('Error requesting AI review:', error)
    }
  };

  const handleEditResponse = () => {
    // Add your edit response logic here
    console.log('Editing response for:', inputText)
  }

  const getFeedbackIcon = (type: Feedback['type']) => {
    switch (type) {
      case 'suggestion':
        return <MessageSquare className="w-5 h-5 text-blue-500" />
      case 'improvement':
        return <ThumbsUp className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getFeedbackColor = (type: Feedback['type']) => {
    switch (type) {
      case 'suggestion':
        return 'bg-blue-50 border-blue-100'
      case 'improvement':
        return 'bg-green-50 border-green-100'
      case 'error':
        return 'bg-red-50 border-red-100'
    }
  }

  const renderInputSection = () => {
    switch (activeInput) {
      case 'link':
        return (
          <div className="mb-4">
            <input
              type="url"
              placeholder="Enter URL here..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        )
      case 'media':
      case 'pdf':
        return (
          <div className="mb-4">
            <label className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-pink-500 transition-colors">
              <input
                type="file"
                accept={activeInput === 'pdf' ? '.pdf' : 'image/*'}
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center space-y-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-gray-600">
                  {fileUpload ? fileUpload.name : `Click to upload ${activeInput.toUpperCase()}`}
                </span>
              </div>
            </label>
          </div>
        )
      default:
        return null
    }
  }

  if (!isClient) {
    return <div className="min-h-screen bg-gray-50">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <NavBar2 />
      <div className="flex flex-1 pt-20">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        
        <div className="ml-64 flex-1 p-8 pb-16">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section with Animated Gradient */}
            <div className="relative mb-12 p-8 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-animate overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 blur-3xl"></div>
              <div className="relative z-10">
                <h1 className="text-4xl font-bold text-white mb-3 flex items-center">
                  <PenTool className="w-8 h-8 mr-3" />
                  Subjective Writing
                </h1>
                <p className="text-lg text-white/90 ml-11">
                  Enhance your writing with AI-powered feedback and suggestions
                </p>
              </div>
            </div>

            {/* Main Writing Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-gray-100/50 transition-all duration-300 hover:shadow-xl">
              <div className="p-8">
                {/* Input Options with Glass Effect */}
                <div className="flex space-x-4 mb-8 p-2 bg-gray-50/50 backdrop-blur-sm rounded-xl">
                  {inputOptions.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => setActiveInput(option.type)}
                      className={`px-6 py-3 rounded-xl text-sm font-medium flex items-center space-x-3 transition-all duration-300
                        ${activeInput === option.type 
                          ? 'text-white bg-pink-500 shadow-lg scale-105 transform' 
                          : 'text-gray-600 hover:bg-white hover:shadow-md hover:scale-105'
                        }`}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </button>
                  ))}

                  {/* Writing Style Dropdown */}
                  <div className="ml-auto">
                    <select
                      value={writingStyle}
                      onChange={(e) => setWritingStyle(e.target.value)}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="academic">Academic</option>
                      <option value="professional">Professional</option>
                      <option value="informal">Informal</option>
                      <option value="descriptive">Descriptive</option>
                      <option value="scientific">Scientific</option>
                    </select>
                  </div>
                </div>

                {/* Dynamic Input Section with Enhanced Styling */}
                <div className="transition-all duration-300">
                  {renderInputSection()}
                </div>

                {/* Text Input Area with Modern Design */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-xl blur transition-all duration-300 group-hover:opacity-100 opacity-0"></div>
                  <textarea
                    className="relative w-full h-44 p-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-700 text-lg leading-relaxed transition-all duration-200 group-hover:shadow-lg"
                    placeholder="Start writing your content here..."
                    value={inputText}
                    onChange={handleTextChange}
                  />
                  
                  {/* Floating Editor Tools */}
                  <div className="absolute bottom-4 right-4 flex items-center space-x-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border shadow-lg">
                    <button className="text-gray-600 hover:text-gray-900 transition-colors" title="Bold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a4 4 0 100-8H6v8zm0 0h8a4 4 0 110 8H6v-8z" />
                      </svg>
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 transition-colors" title="Italic">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </button>
                    <div className="text-sm text-gray-500 ml-2 pl-2 border-l">
                      {wordCount} words
                    </div>
                  </div>
                </div>

                {/* AI Response Box */}
                <div className="mt-8 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-xl blur transition-all duration-300 group-hover:opacity-100 opacity-0"></div>
                  <textarea
                    className="relative w-full h-96 p-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-700 text-lg leading-relaxed transition-all duration-200 group-hover:shadow-lg"
                    placeholder={aiResponse ? "" : "No AI response yet. Click 'AI Review' to generate feedback."}
                    value={aiResponse}
                    readOnly // Make the textarea read-only
                  />
                  {/* <div
                    className="relative w-full p-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-700 text-lg leading-relaxed transition-all duration-200 group-hover:shadow-lg"
                  >
                    <Markdown>{aiResponse}</Markdown>
                  </div> */}
                  <div className="absolute bottom-4 right-4 flex items-center space-x-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border shadow-lg">
                    <span className="text-sm text-gray-500">
                      AI Response
                    </span>
                  </div>
                </div>

                {/* AI Descriptive Response Box */}
                {/* <div className="mt-8 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-xl blur transition-all duration-300 group-hover:opacity-100 opacity-0"></div>
                  <textarea
                    className="relative w-full h-72 p-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-gray-700 text-lg leading-relaxed transition-all duration-200 group-hover:shadow-lg"
                    placeholder={aiDescriptiveResponse ? "" : "No descriptive analysis yet. Click 'AI Review' to generate feedback."}
                    value={aiDescriptiveResponse}
                    readOnly // Make the textarea read-only
                  />
                  <div className="absolute bottom-4 right-4 flex items-center space-x-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border shadow-lg">
                    <span className="text-sm text-gray-500">
                      Descriptive Analysis
                    </span>
                  </div>
                </div> */}

                {/* Bottom Controls with Enhanced Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                  <button className="group px-5 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-300">
                    <span className="transform group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <span>Settings</span>
                  </button>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleAIReview}
                      className="relative group px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25 transform hover:-translate-y-0.5"
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="relative flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <button onClick={handleAIReview}>AI Review</button>
                      </span>
                    </button>
                    <button 
                      onClick={handleEditResponse}
                      className="relative group px-6 py-2.5 border-2 border-pink-500 text-pink-500 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-pink-50 transform hover:-translate-y-0.5"
                    >
                      <span className="relative flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit Response</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Feedback Section with Glass Morphism */}
            {showFeedback && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-gray-100/50 transition-all duration-300 hover:shadow-xl">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                      <MessageSquare className="w-6 h-6 mr-2 text-pink-500" />
                      AI Feedback
                    </h2>
                    <div className="flex items-center space-x-6 text-sm">
                      <span className="flex items-center px-3 py-1.5 bg-blue-50 rounded-full">
                        <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                        Suggestions
                      </span>
                      <span className="flex items-center px-3 py-1.5 bg-green-50 rounded-full">
                        <ThumbsUp className="w-4 h-4 mr-2 text-green-500" />
                        Improvements
                      </span>
                      <span className="flex items-center px-3 py-1.5 bg-red-50 rounded-full">
                        <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                        Errors
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {feedbacks.map((feedback, index) => (
                      <div 
                        key={index}
                        className={`p-5 rounded-xl border-2 ${getFeedbackColor(feedback.type)} flex items-start space-x-4 transition-all duration-200 hover:shadow-md`}
                      >
                        {getFeedbackIcon(feedback.type)}
                        <div className="flex-1">
                          <p className="text-gray-700 text-lg">{feedback.message}</p>
                          {feedback.type === 'error' && (
                            <button className="mt-3 text-sm text-pink-500 hover:text-pink-600 font-medium flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Fix this issue
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end space-x-4">
                    <button 
                      className="px-5 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => setShowFeedback(false)}
                    >
                      Dismiss
                    </button>
                    <button 
                      className="px-5 py-2.5 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Apply All Suggestions
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="ml-64">
        <Footer />
      </div>
    </div>
  );
}