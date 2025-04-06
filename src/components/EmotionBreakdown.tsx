
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { emotionData } from "@/utils/mockData";

const EmotionBreakdown: React.FC = () => {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={emotionData}
          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="emotion" 
            type="category" 
            width={80}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, 'Percentage']}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Bar 
            dataKey="value" 
            name="Percentage"
            radius={[0, 4, 4, 0]}
          >
            {emotionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionBreakdown;
