'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY!);

export default function TestPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isEnded, setIsEnded] = useState(false)
  const { specialty } = useParams()
  const router = useRouter()

  useEffect(() => {
    startConversation()
  }, [])

  const startConversation = async () => {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const prompt = `You are a patient seeking medical help for a condition 
                    related to ${specialty}. Start the conversation by welcoming 
                    the doctor in just a simple line and say the basic health problem 
                    related to the ${specialty}. Keep your responses concise and 
                    realistic and stay in patient role and only address the user 
                    as Doctor. Don't include this type of words eg:[Doctor's name], 
                    [Patient's name],[State the health problem], this is ai patient. 
                    Also don't use any placeholder, simply say the basic problem.`
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    setMessages([{ role: 'assistant', content: text }])
  }

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return

    setMessages(prev => [...prev, { role: 'user', content: inputMessage }])
    setInputMessage('')

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const prompt = `Continue the conversation as an AI patient. Respond to the doctor's 
                    message: "${inputMessage}". Keep your response concise and realistic 
                    and tell your symtoms from the selected ${specialty}.`
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    setMessages(prev => [...prev, { role: 'assistant', content: text }])
  }

  const endTest = async () => {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const conversationHistory = messages.map(m => `${m.role}: ${m.content}`).join('\n')
    const prompt = `Based on the following conversation between a doctor and a patient, 
                    provide an overall feedback on only doctor's response. And mark out 
                    where he did mistakes or wrong diagnose. If the user didn't input any 
                    message, then give feedback negative. The feedback should not exceed 
                    more than 100 words:\n\n${conversationHistory}`
    const result = await model.generateContent(prompt)
    const response = await result.response
    const feedback = response.text()
    setMessages(prev => [...prev, { role: 'system', content: feedback }])
    setIsEnded(true)
  }

  return (
    <div className="max-w-3xl mx-auto w-full p-4 flex flex-col h-screen">
      <h1 className="text-3xl font-bold text-primary-800 mb-6">{specialty} test</h1>
      <div className="bg-white rounded-lg shadow-soft p-4 mb-4 flex-grow overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}>
            <div className={`inline-block p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-primary-500 text-white' 
                : message.role === 'assistant' 
                  ? 'bg-secondary-100 text-secondary-800' 
                  : 'bg-green-100 text-green-800'
            } shadow-soft`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>
      {!isEnded ? (
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-black"
              placeholder="Type your message..."
            />
            <button onClick={sendMessage} className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors duration-300">Send</button>
          </div>
          <button onClick={endTest} className="bg-secondary-500 text-white px-6 py-3 rounded-lg hover:bg-secondary-600 transition-colors duration-300 w-full">End Test</button>
        </div>
      ) : (
        <button onClick={() => router.push('/')} className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors duration-300 mt-4">Back to Home</button>
      )}
    </div>
  )
}