export interface ProjectDetails {
  client: string;
  date: string;
  location: string;
  additionalImages?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  modelUrl: string;
  services: string[];
  details: ProjectDetails;
  modelImages?: string[]; // Add this new property
}

export interface ProjectCategory {
  id: string;
  title: string;
  description: string;
  projects: Project[];
}
