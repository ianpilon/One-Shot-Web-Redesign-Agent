import React, { useState } from 'react';
import axios from 'axios';
import AnalysisVisualization from './AnalysisVisualization';
import './VisualInformationAnalyst.css';

const VisualInformationAnalyst = () => {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeWebpage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!process.env.REACT_APP_OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not set. Please check your environment variables.');
      }

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        throw new Error('Please enter a valid URL starting with http:// or https://');
      }

      // Fetch webpage content
      const webpageResponse = await axios.get(url);
      const webpageContent = webpageResponse.data;

      // Extract basic structure
      const parser = new DOMParser();
      const doc = parser.parseFromString(webpageContent, 'text/html');
      const structure = {
        title: doc.title,
        headings: Array.from(doc.querySelectorAll('h1, h2, h3')).map(h => h.textContent),
        paragraphs: Array.from(doc.querySelectorAll('p')).length,
        links: Array.from(doc.querySelectorAll('a')).length,
        images: Array.from(doc.querySelectorAll('img')).length,
      };

      // Analyze using OpenAI
      const openaiResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a Visual Information Analyst and Creative UI Designer. Analyze the given webpage structure and provide suggestions for reimagining it as a modern, dynamic visualization or UI design. Focus on improving clarity, engagement, and impact.`
            },
            {
              role: "user",
              content: `Analyze this webpage structure and provide suggestions for reimagining it:
              ${JSON.stringify(structure, null, 2)}
              
              Provide your analysis and suggestions in the following JSON format:
              {
                "currentLayoutAnalysis": "...",
                "contentStructureInsights": "...",
                "reimaginedDesignConcept": "...",
                "keyUIUXImprovements": "...",
                "dataVisualizationOpportunities": "...",
                "interactiveElementSuggestions": "...",
                "colorSchemeAndTypographyRecommendations": "...",
                "dataRepresentationGuidelines": "...",
                "historicalDataIncorporation": "..."
              }

              In your analysis, please consider and address the following points:
              1. Suggest ways to clearly represent percentages in charts and graphs.
              2. Recommend appropriate legends for each chart to avoid ambiguity, especially for charts showing negative statements.
              3. Advise on how to incorporate and display timestamps for data freshness.
              4. Suggest methods to integrate historical data or past motions into the dashboard.`
            }
          ],
          max_tokens: 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
          }
        }
      );

      let aiAnalysis;
      try {
        aiAnalysis = JSON.parse(openaiResponse.data.choices[0].message.content);
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        throw new Error('Failed to parse AI analysis. The response might not be in the expected format.');
      }

      setAnalysis({ structure, aiAnalysis });
    } catch (error) {
      console.error('Error:', error);
      setError(`Error occurred: ${error.message}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="visual-information-analyst">
      <h1>Visual Information Analyst and Creative UI Designer</h1>
      <div className="input-container">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter webpage URL to analyze"
          className="url-input"
        />
        <button 
          onClick={analyzeWebpage} 
          disabled={isLoading}
          className="analyze-button"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Webpage'}
        </button>
      </div>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {analysis && !error && (
        <AnalysisVisualization analysis={analysis} />
      )}
    </div>
  );
};

export default VisualInformationAnalyst;