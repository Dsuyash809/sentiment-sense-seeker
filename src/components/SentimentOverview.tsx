
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { sentimentOverviewData } from "@/utils/mockData";

const SentimentOverview: React.FC = () => {
  const data = [
    { name: "Positive", value: sentimentOverviewData.positive, color: "#10b981" },
    { name: "Negative", value: sentimentOverviewData.negative, color: "#ef4444" },
    { name: "Neutral", value: sentimentOverviewData.neutral, color: "#6b7280" }
  ];

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Percentage']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentOverview;
