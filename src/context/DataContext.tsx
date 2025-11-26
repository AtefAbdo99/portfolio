"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { portfolioData as initialData } from "@/lib/data";

// Deep clone helper
const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

interface DataContextType {
  data: typeof initialData;
  updatePersonal: (personal: typeof initialData.personal) => void;
  updateSocialLinks: (links: typeof initialData.socialLinks) => void;
  updateStats: (stats: typeof initialData.stats) => void;
  updateSkills: (skills: typeof initialData.skills) => void;
  addProject: (project: typeof initialData.aiProjects[0]) => void;
  updateProject: (index: number, project: typeof initialData.aiProjects[0]) => void;
  deleteProject: (index: number) => void;
  addPublication: (pub: typeof initialData.publications[0]) => void;
  updatePublication: (index: number, pub: typeof initialData.publications[0]) => void;
  deletePublication: (index: number) => void;
  addOrganization: (org: typeof initialData.organizations[0]) => void;
  updateOrganization: (index: number, org: typeof initialData.organizations[0]) => void;
  deleteOrganization: (index: number) => void;
  addCourse: (course: typeof initialData.aiCourses[0]) => void;
  updateCourse: (index: number, course: typeof initialData.aiCourses[0]) => void;
  deleteCourse: (index: number) => void;
  addMaterial: (material: typeof initialData.recommendedMaterials[0]) => void;
  updateMaterial: (index: number, material: typeof initialData.recommendedMaterials[0]) => void;
  deleteMaterial: (index: number) => void;
  addContribution: (contribution: typeof initialData.contributions[0]) => void;
  updateContribution: (index: number, contribution: typeof initialData.contributions[0]) => void;
  deleteContribution: (index: number) => void;
  addNewProject: (project: typeof initialData.newProjects[0]) => void;
  updateNewProject: (index: number, project: typeof initialData.newProjects[0]) => void;
  deleteNewProject: (index: number) => void;
  resetToDefault: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(deepClone(initialData));

  // Load saved data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("portfolio_data");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data:", e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("portfolio_data", JSON.stringify(data));
  }, [data]);

  const updatePersonal = (personal: typeof initialData.personal) => {
    setData((prev) => ({ ...prev, personal }));
  };

  const updateSocialLinks = (socialLinks: typeof initialData.socialLinks) => {
    setData((prev) => ({ ...prev, socialLinks }));
  };

  const updateStats = (stats: typeof initialData.stats) => {
    setData((prev) => ({ ...prev, stats }));
  };

  const updateSkills = (skills: typeof initialData.skills) => {
    setData((prev) => ({ ...prev, skills }));
  };

  // AI Projects CRUD
  const addProject = (project: typeof initialData.aiProjects[0]) => {
    setData((prev) => ({ ...prev, aiProjects: [...prev.aiProjects, project] }));
  };

  const updateProject = (index: number, project: typeof initialData.aiProjects[0]) => {
    setData((prev) => ({
      ...prev,
      aiProjects: prev.aiProjects.map((p, i) => (i === index ? project : p)),
    }));
  };

  const deleteProject = (index: number) => {
    setData((prev) => ({
      ...prev,
      aiProjects: prev.aiProjects.filter((_, i) => i !== index),
    }));
  };

  // Publications CRUD
  const addPublication = (pub: typeof initialData.publications[0]) => {
    setData((prev) => ({ ...prev, publications: [...prev.publications, pub] }));
  };

  const updatePublication = (index: number, pub: typeof initialData.publications[0]) => {
    setData((prev) => ({
      ...prev,
      publications: prev.publications.map((p, i) => (i === index ? pub : p)),
    }));
  };

  const deletePublication = (index: number) => {
    setData((prev) => ({
      ...prev,
      publications: prev.publications.filter((_, i) => i !== index),
    }));
  };

  // Organizations CRUD
  const addOrganization = (org: typeof initialData.organizations[0]) => {
    setData((prev) => ({ ...prev, organizations: [...prev.organizations, org] }));
  };

  const updateOrganization = (index: number, org: typeof initialData.organizations[0]) => {
    setData((prev) => ({
      ...prev,
      organizations: prev.organizations.map((o, i) => (i === index ? org : o)),
    }));
  };

  const deleteOrganization = (index: number) => {
    setData((prev) => ({
      ...prev,
      organizations: prev.organizations.filter((_, i) => i !== index),
    }));
  };

  // Courses CRUD
  const addCourse = (course: typeof initialData.aiCourses[0]) => {
    setData((prev) => ({ ...prev, aiCourses: [...prev.aiCourses, course] }));
  };

  const updateCourse = (index: number, course: typeof initialData.aiCourses[0]) => {
    setData((prev) => ({
      ...prev,
      aiCourses: prev.aiCourses.map((c, i) => (i === index ? course : c)),
    }));
  };

  const deleteCourse = (index: number) => {
    setData((prev) => ({
      ...prev,
      aiCourses: prev.aiCourses.filter((_, i) => i !== index),
    }));
  };

  // Materials CRUD
  const addMaterial = (material: typeof initialData.recommendedMaterials[0]) => {
    setData((prev) => ({ ...prev, recommendedMaterials: [...prev.recommendedMaterials, material] }));
  };

  const updateMaterial = (index: number, material: typeof initialData.recommendedMaterials[0]) => {
    setData((prev) => ({
      ...prev,
      recommendedMaterials: prev.recommendedMaterials.map((m, i) => (i === index ? material : m)),
    }));
  };

  const deleteMaterial = (index: number) => {
    setData((prev) => ({
      ...prev,
      recommendedMaterials: prev.recommendedMaterials.filter((_, i) => i !== index),
    }));
  };

  // Contributions CRUD
  const addContribution = (contribution: typeof initialData.contributions[0]) => {
    setData((prev) => ({ ...prev, contributions: [...prev.contributions, contribution] }));
  };

  const updateContribution = (index: number, contribution: typeof initialData.contributions[0]) => {
    setData((prev) => ({
      ...prev,
      contributions: prev.contributions.map((c, i) => (i === index ? contribution : c)),
    }));
  };

  const deleteContribution = (index: number) => {
    setData((prev) => ({
      ...prev,
      contributions: prev.contributions.filter((_, i) => i !== index),
    }));
  };

  // New Projects CRUD
  const addNewProject = (project: typeof initialData.newProjects[0]) => {
    setData((prev) => ({ ...prev, newProjects: [...prev.newProjects, project] }));
  };

  const updateNewProject = (index: number, project: typeof initialData.newProjects[0]) => {
    setData((prev) => ({
      ...prev,
      newProjects: prev.newProjects.map((p, i) => (i === index ? project : p)),
    }));
  };

  const deleteNewProject = (index: number) => {
    setData((prev) => ({
      ...prev,
      newProjects: prev.newProjects.filter((_, i) => i !== index),
    }));
  };

  const resetToDefault = () => {
    setData(deepClone(initialData));
    localStorage.removeItem("portfolio_data");
  };

  return (
    <DataContext.Provider
      value={{
        data,
        updatePersonal,
        updateSocialLinks,
        updateStats,
        updateSkills,
        addProject,
        updateProject,
        deleteProject,
        addPublication,
        updatePublication,
        deletePublication,
        addOrganization,
        updateOrganization,
        deleteOrganization,
        addCourse,
        updateCourse,
        deleteCourse,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addContribution,
        updateContribution,
        deleteContribution,
        addNewProject,
        updateNewProject,
        deleteNewProject,
        resetToDefault,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
