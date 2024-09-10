import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">{question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && <p className="mt-2 text-gray-600">{answer}</p>}
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "What is bail?",
      answer: "Bail is a set amount of money that acts as insurance between the court and the person in jail. It allows a person to be released from jail with the promise to appear in court when required."
    },
    {
      question: "How is bail amount determined?",
      answer: "Bail amounts are typically set by local courts. Factors considered include the severity of the crime, prior convictions, the defendant's ties to the community, and flight risk."
    },
    {
      question: "What if I can't afford bail?",
      answer: "If you can't afford bail, you may request a bail reduction, seek help from a bail bondsman, or remain in custody until your court date."
    },
    {
      question: "What is a bail bond?",
      answer: "A bail bond is a surety bond provided by a bail bondsman to secure a defendant's release from jail. The bondsman typically charges a fee of 10-15% of the total bail amount."
    },
    {
      question: "Can bail be denied?",
      answer: "Yes, bail can be denied in certain circumstances, such as when the defendant is considered a flight risk or a danger to the community."
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQ;
