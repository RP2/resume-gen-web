import React, { useState } from "react";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Project } from "../../types/resume";

interface ProjectsFormProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ data, onChange }) => {
  const [newTechInputs, setNewTechInputs] = useState<{ [key: string]: string }>(
    {},
  );

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      startDate: "",
      endDate: "",
      url: "",
      visible: true,
    };
    onChange([...data, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    onChange(
      data.map((project) =>
        project.id === id ? { ...project, [field]: value } : project,
      ),
    );
  };

  const removeProject = (id: string) => {
    onChange(data.filter((project) => project.id !== id));
  };

  const toggleProjectVisibility = (id: string) => {
    onChange(
      data.map((project) =>
        project.id === id
          ? { ...project, visible: !(project.visible ?? true) }
          : project,
      ),
    );
  };

  const addTechnology = (projectId: string) => {
    const techText = newTechInputs[projectId]?.trim();
    if (techText) {
      const project = data.find((p) => p.id === projectId);
      if (project) {
        updateProject(projectId, "technologies", [
          ...project.technologies,
          techText,
        ]);
        setNewTechInputs((prev) => ({ ...prev, [projectId]: "" }));
      }
    }
  };

  const removeTechnology = (projectId: string, techIndex: number) => {
    const project = data.find((p) => p.id === projectId);
    if (project) {
      const newTechs = project.technologies.filter((_, i) => i !== techIndex);
      updateProject(projectId, "technologies", newTechs);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6" data-section="projects">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold sm:text-lg">Projects</h3>
        <Button onClick={addProject} size="sm" data-action="add-project">
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {data.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          No projects added yet. Click "Add Project" to showcase your work.
        </p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {data.map((project) => (
            <Card key={project.id} data-content="project">
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base">
                    Project Details
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleProjectVisibility(project.id)}
                      title={
                        project.visible !== false
                          ? "Hide from resume"
                          : "Show in resume"
                      }
                    >
                      {project.visible !== false ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeProject(project.id)}
                      title="Delete permanently"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Project Name *</Label>
                    <Input
                      value={project.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateProject(project.id, "name", e.target.value)
                      }
                      placeholder="My Awesome Project"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={project.startDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateProject(project.id, "startDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={project.endDate || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateProject(project.id, "endDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Live Demo URL</Label>
                    <Input
                      value={project.url || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateProject(project.id, "url", e.target.value)
                      }
                      placeholder="https://myproject.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    value={project.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateProject(project.id, "description", e.target.value)
                    }
                    placeholder="Brief description of the project, what it does, and your role..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Technologies Used</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTechInputs[project.id] || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewTechInputs((prev) => ({
                          ...prev,
                          [project.id]: e.target.value,
                        }))
                      }
                      placeholder="Add a technology..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTechnology(project.id);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => addTechnology(project.id)}
                      size="sm"
                      data-action="add-technology"
                    >
                      Add
                    </Button>
                  </div>

                  {project.technologies.length > 0 && (
                    <div
                      className="mt-3 flex flex-wrap gap-2"
                      data-content="technology-list"
                    >
                      {project.technologies.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-sm"
                        >
                          {tech}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-4 w-4 p-0"
                            onClick={() => removeTechnology(project.id, index)}
                          >
                            x
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsForm;
