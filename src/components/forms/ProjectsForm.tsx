import { useState } from "react";
import { Plus, Trash2, Eye, EyeOff, GripVertical, X } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  const [editingTech, setEditingTech] = useState<{
    [projectId: string]: number | null;
  }>({});
  const [editingTechValue, setEditingTechValue] = useState<{
    [projectId: string]: string;
  }>({});

  function updateTechInline(projectId: string, index: number, value: string) {
    const project = data.find((p) => p.id === projectId);
    if (project) {
      const newTechs = [...project.technologies];
      newTechs[index] = value.trim();
      updateProject(projectId, "technologies", newTechs);
      setEditingTech((prev) => ({ ...prev, [projectId]: null }));
      setEditingTechValue((prev) => ({ ...prev, [projectId]: "" }));
    }
  }

  function handleTechDragEnd(projectId: string, event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const project = data.find((p) => p.id === projectId);
    if (project) {
      const oldIndex = project.technologies.findIndex(
        (_, i) => `tech-${projectId}-${i}` === active.id,
      );
      const newIndex = project.technologies.findIndex(
        (_, i) => `tech-${projectId}-${i}` === over.id,
      );
      if (oldIndex !== -1 && newIndex !== -1) {
        const newTechs = arrayMove(project.technologies, oldIndex, newIndex);
        updateProject(projectId, "technologies", newTechs);
      }
    }
  }

  function SortableTech({
    id,
    tech,
    index,
    projectId,
  }: {
    id: string;
    tech: string;
    index: number;
    projectId: string;
  }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const isEditing = editingTech[projectId] === index;

    return (
      <Badge
        ref={setNodeRef}
        style={style}
        variant="secondary"
        className={`bg-muted flex items-center gap-1 rounded border border-transparent px-2 py-1 text-sm transition-colors${isDragging ? "border-primary/60 bg-accent/60" : ""}`}
        data-content="tech"
        data-index={index}
        {...attributes}
      >
        <button
          {...listeners}
          className={`text-muted-foreground cursor-grab px-1 focus:outline-none ${isDragging ? "cursor-grabbing" : ""}`}
          tabIndex={-1}
          aria-label="Drag to reorder"
          type="button"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        {isEditing ? (
          <Input
            className="min-w-[4ch] flex-1 border-none bg-transparent px-0 text-sm shadow-none focus:ring-0 focus-visible:ring-0"
            value={editingTechValue[projectId] ?? tech}
            autoFocus
            onChange={(e) =>
              setEditingTechValue((prev) => ({
                ...prev,
                [projectId]: e.target.value,
              }))
            }
            onBlur={() => {
              updateTechInline(
                projectId,
                index,
                editingTechValue[projectId] ?? tech,
              );
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateTechInline(
                  projectId,
                  index,
                  editingTechValue[projectId] ?? tech,
                );
              } else if (e.key === "Escape") {
                setEditingTech((prev) => ({ ...prev, [projectId]: null }));
                setEditingTechValue((prev) => ({ ...prev, [projectId]: "" }));
              }
            }}
            aria-label="Edit technology"
            placeholder="Edit technology..."
          />
        ) : (
          <span
            className="hover:text-primary focus-visible:text-primary flex-1 cursor-pointer rounded border border-transparent px-1 text-sm transition-colors outline-none hover:underline focus-visible:underline"
            tabIndex={0}
            onClick={() => {
              setEditingTech((prev) => ({ ...prev, [projectId]: index }));
              setEditingTechValue((prev) => ({ ...prev, [projectId]: tech }));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setEditingTech((prev) => ({ ...prev, [projectId]: index }));
                setEditingTechValue((prev) => ({ ...prev, [projectId]: tech }));
              }
            }}
            role="button"
            aria-label="Edit technology"
          >
            {tech}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-1 h-5 w-5 p-0"
          onClick={() => removeTechnology(projectId, index)}
          aria-label="Remove technology"
        >
          <X className="h-4 w-4" />
        </Button>
      </Badge>
    );
  }

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
                    <DndContext
                      sensors={useSensors(
                        useSensor(PointerSensor, {
                          activationConstraint: { distance: 5 },
                        }),
                      )}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) =>
                        handleTechDragEnd(project.id, event)
                      }
                      measuring={{
                        droppable: {
                          strategy: MeasuringStrategy.Always,
                        },
                      }}
                    >
                      <SortableContext
                        items={project.technologies.map(
                          (_, i) => `tech-${project.id}-${i}`,
                        )}
                        strategy={rectSortingStrategy}
                      >
                        <div
                          className="mt-3 flex flex-wrap gap-2"
                          data-content="technology-list"
                        >
                          {project.technologies.map((tech, index) => (
                            <SortableTech
                              key={`tech-${project.id}-${index}`}
                              id={`tech-${project.id}-${index}`}
                              tech={tech}
                              index={index}
                              projectId={project.id}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
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
