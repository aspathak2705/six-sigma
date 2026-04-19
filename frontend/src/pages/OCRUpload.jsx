import React, { useState, useRef } from 'react';
import { uploadReport } from '../api/client';
import ResultsTable from '../components/ResultsTable';

const OCRUpload = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [extracted, setExtracted] = useState(null);
  const [previewText, setPreviewText] = useState("");
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
  };

  const processFile = (file) => {
    if (file.size > 25 * 1024 * 1024) { alert("File is too large. Max 25MB."); return; }
    setFile(file);
    submitFile(file);
  };

  const submitFile = async (fileToUpload) => {
    setLoading(true); setResults(null); setExtracted(null);
    try {
      const response = await uploadReport(fileToUpload);
      setExtracted(response.extractedValues);
      setPreviewText(response.extractedText);
      setResults(response.results);
      sessionStorage.setItem('sigmaResults', JSON.stringify(response.results));
    } catch (err) {
      const msg = err.response?.data?.detail || 'Upload failed.';
      alert(msg);
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-8 md:pt-32 px-4 md:px-6 max-w-screen-xl mx-auto pb-32">
      <section className="mb-12">
        <h2 className="serif-editorial text-4xl md:text-7xl font-light tracking-tight text-primary italic mb-4">The Verdant Aura</h2>
        <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl font-light border-none">
          Transforming clinical data into clear, actionable insights through Sigma's advanced OCR neural processing.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-container rounded-xl blur opacity-10 transition duration-1000"></div>
            <div 
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              onClick={() => !loading && inputRef.current?.click()}
              className={`relative bg-surface-container-low border-2 border-dashed ${dragActive ? 'border-primary' : 'border-outline-variant/30'} rounded-xl p-6 md:p-12 flex flex-col items-center justify-center text-center transition-all hover:bg-surface-container cursor-pointer`}
            >
              <input ref={inputRef} type="file" className="hidden" accept="application/pdf,image/png,image/jpeg,text/plain" onChange={handleChange} />
              <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-primary-fixed text-4xl">cloud_upload</span>
              </div>
              <h3 className="serif-editorial text-2xl font-medium text-primary mb-2">
                {file ? file.name : (loading ? 'Processing...' : 'Upload Lab Report')}
              </h3>
              <p className="text-on-surface-variant mb-6 max-w-xs">{file ? `Size: ${(file.size/1024/1024).toFixed(2)} MB` : 'Drag and drop your medical PDF, JPG, or PNG files here for instant analysis.'}</p>
              {!file && <button className="w-full sm:w-auto bg-primary text-on-primary rounded-full px-8 py-3 font-medium pointer-events-none">Select Files</button>}
              <p className="mt-4 text-xs text-outline font-medium uppercase tracking-widest">Max file size 25MB</p>
            </div>
          </div>

          {(previewText || loading) && (
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">article</span>
                  <h4 className="font-bold text-lg text-primary tracking-tight">Raw OCR Stream</h4>
                </div>
                <span className="text-xs font-bold text-on-secondary-container bg-secondary-container px-3 py-1 rounded-full uppercase tracking-tighter">Live Scan</span>
              </div>
              <div className="bg-surface p-6 rounded-lg text-sm font-mono text-on-surface-variant h-64 overflow-y-auto no-scrollbar border border-outline-variant/5 whitespace-pre-wrap leading-relaxed">
                {loading ? 'Performing neural extraction...' : previewText}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-surface-container rounded-xl p-8 sticky top-32">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary">analytics</span>
              <h4 className="serif-editorial text-2xl font-medium text-primary">Extracted Parameters</h4>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {extracted ? Object.entries(extracted).map(([key, val]) => (
                <div key={key} className="bg-surface-container-lowest p-5 rounded-lg flex items-center justify-between group hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-outline mb-1">{key}</p>
                    <p className="text-2xl font-bold text-primary">{val}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-on-secondary-fixed-variant bg-secondary-fixed px-2 py-1 rounded">DETECTED</span>
                    <span className="material-symbols-outlined text-on-primary-fixed-variant" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                </div>
              )) : (
                <div className="text-on-surface-variant text-center my-10 italic">Awaiting document upload...</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {results && <ResultsTable results={results} />}
    </div>
  );
};

export default OCRUpload;
