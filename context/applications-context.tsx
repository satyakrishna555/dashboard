"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { Job } from '@/lib/data'; // Assuming Job type is here

interface ApplicationsContextType {
  appliedJobs: Job[];
  addJob: (job: Job) => void;
  isJobApplied: (jobId: string | undefined) => boolean;
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

interface ApplicationsProviderProps {
  children: ReactNode;
}

const LOCAL_STORAGE_KEY = 'appliedJobs';

export const ApplicationsProvider: React.FC<ApplicationsProviderProps> = ({ children }) => {
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);

  // Load jobs from localStorage on initial mount
  useEffect(() => {
    const storedJobs = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedJobs) {
      try {
        const parsedJobs = JSON.parse(storedJobs);
        // Basic validation to ensure it's an array
        if (Array.isArray(parsedJobs)) {
           setAppliedJobs(parsedJobs);
        } else {
          console.error("Stored applied jobs is not an array:", parsedJobs);
          localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear invalid data
        }
      } catch (error) {
        console.error("Failed to parse stored applied jobs:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
      }
    }
  }, []);

  // Save jobs to localStorage whenever appliedJobs changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  const addJob = (job: Job) => {
    // Prevent adding duplicates based on Detail_URL or a unique identifier
    if (!appliedJobs.some(applied => applied.Detail_URL === job.Detail_URL)) {
      setAppliedJobs(prevJobs => [...prevJobs, job]);
    }
  };

  const isJobApplied = (jobId: string | undefined): boolean => {
    if (!jobId) return false;
    return appliedJobs.some(applied => applied.Detail_URL === jobId);
  };

  return (
    <ApplicationsContext.Provider value={{ appliedJobs, addJob, isJobApplied }}>
      {children}
    </ApplicationsContext.Provider>
  );
};

export const useApplications = (): ApplicationsContextType => {
  const context = useContext(ApplicationsContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationsProvider');
  }
  return context;
};
