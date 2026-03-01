'use client';

import { useState, useEffect } from 'react';
import { 
  ComposedChart,
  BarChart, 
  Line,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from 'recharts';

export default function EnergyHistogram() {
  const [histogramData, setHistogramData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fitStats, setFitStats] = useState({ mpv: 0, sigma: 0, chi2: 0 });

  useEffect(() => {
    fetch('/beam.csv') // Ensure this matches your actual filename
      .then((response) => {
        if (!response.ok) throw new Error("Could not find the CSV file.");
        return response.text();
      })
      .then((csvText) => {
        const rows = csvText.split(/\r?\n/);
        const rawValues: number[] = [];
        
        for (let i = 1; i < rows.length; i++) {
          const cleanRow = rows[i].trim();
          if (!cleanRow) continue; 
          const val = parseFloat(cleanRow);
          if (!isNaN(val)) rawValues.push(val);
        }

        if (rawValues.length === 0) {
          setLoading(false);
          return;
        }

        // 1. FIXED BINNING (0.0 to 1.0 GeV Cutoff)
        const numBins = 160; 
        const min = 0.0;
        const max = 0.5; 
        const binWidth = (max - min) / numBins; 

        const bins = Array.from({ length: numBins }, (_, i) => ({
          rangeLabel: `${(min + i * binWidth).toFixed(3)} - ${(min + (i + 1) * binWidth).toFixed(3)} GeV`,
          binCenter: min + (i + 0.5) * binWidth, 
          count: 0,
          fit: 0,
          residual: 0
        }));

        const filteredValues: number[] = [];
        rawValues.forEach((val) => {
          if (val >= min && val <= max) {
            filteredValues.push(val);
            let binIndex = Math.floor((val - min) / binWidth);
            if (binIndex >= numBins) binIndex = numBins - 1; 
            bins[binIndex].count++;
          }
        });

        // 2. HIGH-ACCURACY PARAMETER ESTIMATION (FWHM Method)
        let maxCount = 0;
        let mpvIndex = 0;
        
        // Find the precise peak
        bins.forEach((b, i) => {
          if (b.count > maxCount) {
            maxCount = b.count;
            mpvIndex = i;
          }
        });
        const mpv = bins[mpvIndex].binCenter;

        // Calculate Full Width at Half Maximum (FWHM) to find true Sigma
        let leftHalfIndex = mpvIndex;
        while (leftHalfIndex > 0 && bins[leftHalfIndex].count > maxCount / 2) {
          leftHalfIndex--;
        }
        
        let rightHalfIndex = mpvIndex;
        while (rightHalfIndex < bins.length - 1 && bins[rightHalfIndex].count > maxCount / 2) {
          rightHalfIndex++;
        }

        const fwhm = bins[rightHalfIndex].binCenter - bins[leftHalfIndex].binCenter;
        
        // In a Moyal distribution, FWHM ≈ 3.58 * Sigma
        // Fallback to a tiny number if the peak is too sharp to measure FWHM
        const sigma = fwhm > 0 ? fwhm / 3.58 : 0.02; 

        // 3. GENERATE FIT & RESIDUALS
        let chi2 = 0;
        const amplitude = maxCount / 0.6065306597; 

        bins.forEach(b => {
          const z = (b.binCenter - mpv) / sigma;
          const fitValue = amplitude * Math.exp(-0.5 * (z + Math.exp(-z)));
          
          b.fit = parseFloat(fitValue.toFixed(2));
          b.residual = parseFloat((b.count - fitValue).toFixed(2));
          
          if (fitValue > 0) {
              chi2 += Math.pow(b.count - fitValue, 2) / fitValue;
          }
          
          b.binCenter = parseFloat(b.binCenter.toFixed(3)) as any;
        });

        setFitStats({ mpv, sigma, chi2 });
        setHistogramData(bins);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full h-[700px] bg-[#030712] p-6 rounded-2xl border border-slate-800 shadow-2xl my-8 font-mono flex flex-col">
      
      {/* HEADER & FIT STATISTICS */}
      <div className="mb-4 flex justify-between items-start border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-cyan-400 font-bold tracking-widest uppercase text-sm drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] mb-1">
            dE/dx Energy Loss Spectrum
          </h3>
          <p className="text-slate-500 text-[10px] tracking-wider uppercase">Prototype Time Projection Chamber</p>
        </div>
        
        {!loading && (
          <div className="flex gap-4 text-right">
            <div className="flex flex-col">
              <span className="text-slate-500 text-[9px] uppercase tracking-widest">Most Probable Value (the peak)</span>
              <span className="text-emerald-400 text-xs">{fitStats.mpv.toFixed(3)} GeV</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 text-[9px] uppercase tracking-widest">Sigma σ (the width of the peak)</span>
              <span className="text-emerald-400 text-xs">{fitStats.sigma.toFixed(3)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex-grow flex flex-col gap-2">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm animate-pulse">
            Processing kinematics & fitting data...
          </div>
        ) : (
          <>
            {/* MAIN PLOT */}
            <ResponsiveContainer width="100%" height="65%">
              <ComposedChart data={histogramData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" vertical={false} />
                
                <XAxis dataKey="binCenter" tick={false} axisLine={{ stroke: '#334155' }} />
                
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  axisLine={false} 
                  tickLine={false} 
                  label={{ value: 'Entries per Bin', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11, offset: -5 }}
                />
                
                <Tooltip 
                  cursor={{ fill: 'rgba(30, 41, 59, 0.5)' }}
                  contentStyle={{ backgroundColor: 'rgba(3, 7, 18, 0.95)', border: '1px solid rgba(6, 182, 212, 0.3)', color: '#f8fafc', fontSize: '11px' }}
                />

                <Bar dataKey="count" name="Raw Data" fill="#3b82f6" fillOpacity={0.6} radius={[2, 2, 0, 0]} />
                
                <Line 
                  type="monotone" 
                  dataKey="fit" 
                  name="Landau (Moyal) Fit" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 4, fill: '#10b981', stroke: '#022c22' }}
                />
              </ComposedChart>
            </ResponsiveContainer>

            {/* RESIDUALS TITLE */}
            <div className="w-full text-center mt-2 mb-1">
              <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Fit Residuals (Data - Fit)</span>
            </div>

            {/* RESIDUALS PLOT */}
            <ResponsiveContainer width="100%" height="30%">
              <BarChart data={histogramData} margin={{ top: 0, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" vertical={false} />
                
                <ReferenceLine y={0} stroke="#64748b" strokeWidth={1} />
                
                <XAxis 
                  dataKey="binCenter" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={true}
                  tickMargin={8}
                  axisLine={{ stroke: '#334155' }}
                  label={{ value: 'Energy Loss (GeV)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11 }}
                />
                
                <YAxis 
                  stroke="#64748b" 
                  fontSize={9} 
                  axisLine={false} 
                  tickLine={false} 
                  tickCount={3} 
                  label={{ value: 'Fit error', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 9, offset: -5 }}
                />
                
                <Tooltip 
                  cursor={{ fill: 'rgba(30, 41, 59, 0.5)' }}
                  contentStyle={{ backgroundColor: 'rgba(3, 7, 18, 0.95)', border: '1px solid #ef4444', color: '#f8fafc', fontSize: '11px' }}
                />

                <Bar dataKey="residual" name="Residual">
                  {histogramData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.residual < 0 ? '#ef4444' : '#06b6d4'} 
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      {/* DISCLAIMER */}
      <div className="mt-4 pt-4 border-t border-slate-800/50 text-center">
        <p className="text-[9px] text-slate-600 uppercase tracking-widest">
          * This is an approximate fit and not the one used in the final report - for illustrative purposes only.
        </p>
      </div>
    </div>
  );
}