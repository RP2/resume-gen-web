import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
} from "lucide-react";
import PersonalInfoForm from "../forms/PersonalInfoForm";
import WorkExperienceForm from "../forms/WorkExperienceForm";
import EducationForm from "../forms/EducationForm";
import SkillsForm from "../forms/SkillsForm";
import ProjectsForm from "../forms/ProjectsForm";
import type {
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Project,
} from "../../types/resume";

interface FormPanelProps {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  onPersonalInfoChange: (personalInfo: PersonalInfo) => void;
  onWorkExperienceChange: (workExperience: WorkExperience[]) => void;
  onEducationChange: (education: Education[]) => void;
  onSkillsChange: (skills: Skill[]) => void;
  onProjectsChange: (projects: Project[]) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const FormPanel: React.FC<FormPanelProps> = ({
  personalInfo,
  workExperience,
  education,
  skills,
  projects,
  onPersonalInfoChange,
  onWorkExperienceChange,
  onEducationChange,
  onSkillsChange,
  onProjectsChange,
  activeTab = "personal",
  onTabChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
          Resume Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">
              <FileText className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="experience">
              <Briefcase className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="education">
              <GraduationCap className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="skills">
              <Wrench className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="projects">
              <FolderOpen className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <PersonalInfoForm
              data={personalInfo}
              onChange={onPersonalInfoChange}
            />
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <WorkExperienceForm
              data={workExperience}
              onChange={onWorkExperienceChange}
            />
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <EducationForm data={education} onChange={onEducationChange} />
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <SkillsForm data={skills} onChange={onSkillsChange} />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <ProjectsForm data={projects} onChange={onProjectsChange} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FormPanel;
