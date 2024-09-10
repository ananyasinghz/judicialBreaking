import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const BailEligibilityAssessment = () => {
  const [formData, setFormData] = useState({
    offense: '',
    priorRecord: '',
    age: '',
    employmentStatus: '',
    communityTies: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Placeholder for AI model invocation
    // In a real implementation, this would be an API call to your backend
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Dummy prediction logic (replace with actual AI model results)
      const dummyPrediction = Math.random() > 0.5;
      const dummyConditions = dummyPrediction
        ? ['Financial surety', 'Weekly check-ins']
        : [];

      setPrediction({
        eligible: dummyPrediction,
        conditions: dummyConditions,
      });
    } catch (error) {
      console.error('Error in bail eligibility assessment:', error);
      // Handle error state here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Bail Eligibility Assessment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="offense" className="block mb-1 font-medium">
            Type of Offense
          </label>
          <input
            type="text"
            id="offense"
            name="offense"
            value={formData.offense}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="priorRecord" className="block mb-1 font-medium">
            Prior Criminal Record
          </label>
          <select
            id="priorRecord"
            name="priorRecord"
            value={formData.priorRecord}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select...</option>
            <option value="none">None</option>
            <option value="minor">Minor offenses</option>
            <option value="major">Major offenses</option>
          </select>
        </div>
        <div>
          <label htmlFor="age" className="block mb-1 font-medium">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            required
            min="18"
            max="100"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="employmentStatus" className="block mb-1 font-medium">
            Employment Status
          </label>
          <select
            id="employmentStatus"
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select...</option>
            <option value="employed">Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="student">Student</option>
          </select>
        </div>
        <div>
          <label htmlFor="communityTies" className="block mb-1 font-medium">
            Community Ties
          </label>
          <textarea
            id="communityTies"
            name="communityTies"
            value={formData.communityTies}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            rows="3"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Assessing...' : 'Assess Eligibility'}
        </button>
      </form>

      {prediction !== null && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Assessment Result:</h3>
          <div className="flex items-center mb-2">
            {prediction.eligible ? (
              <CheckCircle className="text-green-500 mr-2" />
            ) : (
              <AlertCircle className="text-red-500 mr-2" />
            )}
            <span className={prediction.eligible ? 'text-green-700' : 'text-red-700'}>
              {prediction.eligible ? 'Eligible for Bail' : 'Not Eligible for Bail'}
            </span>
          </div>
          {prediction.eligible && prediction.conditions.length > 0 && (
            <div>
              <p className="font-medium">Suggested Conditions:</p>
              <ul className="list-disc list-inside">
                {prediction.conditions.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BailEligibilityAssessment;
