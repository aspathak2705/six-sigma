import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { sigmaColor } from '../api/utils';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const colors = sigmaColor(data.performanceLevel);
    
    return (
      <div className="bg-surface/90 backdrop-blur-md border border-outline-variant/30 rounded-xl p-4 shadow-xl max-w-xs">
        <div className="flex justify-between items-start mb-3">
          <p className="font-bold text-primary uppercase text-sm mr-4">{data.param}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
            {data.performanceLevel?.toUpperCase() || data.performance}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
          <div>
            <p className="text-xs text-on-surface-variant mb-0.5">Sigma</p>
            <p className={`font-bold text-lg ${colors.text}`}>{Number(data.sigma).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant mb-0.5">Bias</p>
            <p className="text-on-surface text-sm">{Number(data.bias).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant mb-0.5">CV</p>
            <p className="text-on-surface text-sm">{Number(data.cv || data.ref?.cv).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant mb-0.5">TEa</p>
            <p className="text-on-surface text-sm">{Number(data.tea || data.ref?.tea).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const SigmaChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-[400px]">
      <h3 className="text-2xl serif-editorial text-primary mb-6 italic">Performance Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: -20, bottom: 20 }}
        >
          <XAxis 
            dataKey="param" 
            tick={{ fill: '#3f4945', fontSize: 12, fontFamily: 'Manrope', fontWeight: 600 }}
            axisLine={{ stroke: '#bfc9c4' }}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tick={{ fill: '#3f4945', fontSize: 12, fontFamily: 'Manrope' }}
            axisLine={false}
            tickLine={false}
            dx={-10}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(0, 52, 43, 0.05)' }}
          />
          
          <ReferenceLine y={6} stroke="#00D68F" strokeDasharray="3 3" opacity={0.5} label={{ value: '6σ', fill: '#00D68F', position: 'right', fontSize: 10, fontFamily: 'Manrope', fontWeight: 600 }} />
          <ReferenceLine y={5} stroke="#00E5FF" strokeDasharray="3 3" opacity={0.5} label={{ value: '5σ', fill: '#00E5FF', position: 'right', fontSize: 10, fontFamily: 'Manrope', fontWeight: 600 }} />
          <ReferenceLine y={4} stroke="#A78BFA" strokeDasharray="3 3" opacity={0.5} label={{ value: '4σ', fill: '#A78BFA', position: 'right', fontSize: 10, fontFamily: 'Manrope', fontWeight: 600 }} />
          <ReferenceLine y={3} stroke="#FFB347" strokeDasharray="3 3" opacity={0.5} label={{ value: '3σ', fill: '#FFB347', position: 'right', fontSize: 10, fontFamily: 'Manrope', fontWeight: 600 }} />
          
          <Bar dataKey="sigma" radius={[9999, 9999, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={sigmaColor(entry.performanceLevel).hex} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SigmaChart;
