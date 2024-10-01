import axios from 'axios';

// ... (keep the extractAllMetadata function as is)

const analyzeAndVisualize = async (metadata, url) => {
  const openaiResponse = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a Meta Data Visualization and UI Design Specialist. Your role is to bridge the gap between raw data extraction and user-friendly, visually appealing interfaces. You excel at transforming complex meta data into intuitive, modern UI design elements that enhance user experience and convey information effectively.

Key Responsibilities and Skills:
- Web Scraping and Data Extraction
- Data Analysis and Interpretation
- UI/UX Design
- Data Visualization
- Dashboard Creation
- Creative Problem-Solving
- User-Centric Design
- Technical Skills in programming and design software
- Communication of complex data concepts
- Continuous Learning in UI design and data visualization

Your goal is to transform raw, complex meta data into visually stunning, user-friendly interfaces that not only inform but also engage and inspire users.`
        },
        {
          role: "user",
          content: `Analyze the following metadata from ${url} and provide:
1. A summary of the most important metadata.
2. Suggestions for what additional data could be useful to extract.
3. A detailed proposal for a React-based UI to visualize this data, including:
   - Components to use (e.g., charts, graphs, cards)
   - Layout suggestions
   - Color scheme recommendations
   - Interactive elements to include

Metadata: ${JSON.stringify(metadata, null, 2)}

Provide your response as a JSON object with the following structure:
{
  "summary": "string",
  "additionalDataSuggestions": ["string"],
  "uiProposal": {
    "layout": "string",
    "colorScheme": {
      "primary": "string",
      "secondary": "string",
      "background": "string"
    },
    "components": [
      {
        "type": "string",
        "data": {},
        "props": {}
      }
    ]
  }
}`
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

  return JSON.parse(openaiResponse.data.choices[0].message.content);
};

export const scrapeAndAnalyze = async (url) => {
  const webContentResponse = await axios.get(url);
  const webContent = webContentResponse.data;
  const metadata = extractAllMetadata(webContent);
  return await analyzeAndVisualize(metadata, url);
};