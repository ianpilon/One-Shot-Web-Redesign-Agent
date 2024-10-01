import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';

const AnalysisVisualization = ({ analysis }) => {
  const { structure, aiAnalysis } = analysis;

  const structureData = [
    { name: 'Headings', value: structure.headings.length },
    { name: 'Paragraphs', value: structure.paragraphs },
    { name: 'Links', value: structure.links },
    { name: 'Images', value: structure.images },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Mock data for governance visualizations
  const votingTrendData = [
    { name: 'Jan', votes: 400 },
    { name: 'Feb', votes: 300 },
    { name: 'Mar', votes: 500 },
    { name: 'Apr', votes: 280 },
    { name: 'May', votes: 590 },
  ];

  const stakeholderData = [
    { name: 'Developers', value: 400 },
    { name: 'Investors', value: 300 },
    { name: 'Users', value: 300 },
    { name: 'Partners', value: 200 },
  ];

  const confidenceVoteData = [
    { name: 'Confidence', value: 65 },
    { name: 'No Confidence', value: 35 },
  ];

  // Helper function to format percentages
  const formatPercentage = (value, total) => {
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  // Calculate total for percentage calculation
  const confidenceTotal = confidenceVoteData.reduce((sum, item) => sum + item.value, 0);

  // Current date and time
  const currentDateTime = new Date().toLocaleString();

  return (
    <div className="analysis-visualization">
      <div className="chart-container voting-trends">
        <h3>Voting Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={votingTrendData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="votes" name="Vote Count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-container bottom-charts">
        <div className="chart stakeholder-distribution">
          <h3>Stakeholder Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stakeholderData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
              >
                {stakeholderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart confidence-committee">
          <h3>Confidence in Constitutional Committee</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={confidenceVoteData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${formatPercentage(value, confidenceTotal)}`}
              >
                {confidenceVoteData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalysisVisualization;