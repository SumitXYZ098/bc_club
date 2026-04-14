"use client";

import CustomButton from '@/src/components/button/CustomButton'
import React, { useRef, useState } from 'react'
import { Endpoints } from '../../api/endpoints'

const ApiButton = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (loading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ FILE TYPE VALIDATION
    if (!file.name.endsWith(".json") && !file.name.endsWith(".geojson")) {
      alert("Please upload a valid GeoJSON file");
      return;
    }

    try {
      setLoading(true);

      
      try {
        const text = await file.text();
        const json = JSON.parse(text);

        if (!json.features) {
          alert("Invalid GeoJSON format (missing features)");
          setLoading(false);
          return;
        }
      } catch {
        alert("Invalid JSON file");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file); 

      const res = await fetch(Endpoints.importPropertyList, {
        method: "POST",
        body: formData,
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        alert(data?.error?.message || "Upload failed");
      } else {
        alert(`Success: ${data?.success || 0}, Skipped: ${data?.skipped || 0}`);
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);

      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className='max-w-screen-2xl mx-auto flex items-center justify-center px-25 py-20'>
      
      
      <div onClick={handleClick} style={{ pointerEvents: loading ? 'none' : 'auto' }}>
        <CustomButton 
          label={loading ? 'Importing...' : 'Import Property List'} 
          buttonType='primary' 
        />
      </div>

      
      <input
        type="file"
        accept=".json,.geojson,application/geo+json"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

    </div>
  )
}

export default ApiButton;