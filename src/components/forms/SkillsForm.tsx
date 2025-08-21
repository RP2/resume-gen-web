// SortableCategory wrapper for skill categories (like SortableProject in ProjectsForm)
function SortableCategory({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
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
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative">
      {/* drag handle for category */}
      <button
        {...listeners}
        className="focus-visible:ring-primary absolute top-6 left-5 z-10 h-8 w-8 items-center justify-center rounded focus:outline-none focus-visible:ring-2"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        tabIndex={0}
        aria-label="Drag to reorder category"
        type="button"
      >
        <GripVertical className="text-muted-foreground h-5 w-5" />
      </button>
      <div>{children}</div>
    </div>
  );
}
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
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Skill } from "../../types/resume";

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange }) => {
  const [newSkillInputs, setNewSkillInputs] = useState<{
    [key: string]: string;
  }>({});
  const [editingSkill, setEditingSkill] = useState<{
    [catId: string]: number | null;
  }>({});
  const [editingSkillValue, setEditingSkillValue] = useState<{
    [catId: string]: string;
  }>({});
  // update skill inline
  function updateSkillInline(catId: string, index: number, value: string) {
    const category = data.find((cat) => cat.id === catId);
    if (category) {
      const newSkills = [...category.skills];
      newSkills[index] = value.trim();
      updateSkillCategory(catId, "skills", newSkills);
      setEditingSkill((prev) => ({ ...prev, [catId]: null }));
      setEditingSkillValue((prev) => ({ ...prev, [catId]: "" }));
    }
  }

  // handle drag end for skills
  function handleSkillDragEnd(catId: string, event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const category = data.find((cat) => cat.id === catId);
    if (category) {
      const oldIndex = category.skills.findIndex(
        (_, i) => `skill-${catId}-${i}` === active.id,
      );
      const newIndex = category.skills.findIndex(
        (_, i) => `skill-${catId}-${i}` === over.id,
      );
      if (oldIndex !== -1 && newIndex !== -1) {
        const newSkills = arrayMove(category.skills, oldIndex, newIndex);
        updateSkillCategory(catId, "skills", newSkills);
      }
    }
  }

  // sortable skill item
  function SortableSkill({
    id,
    skill,
    index,
    catId,
  }: {
    id: string;
    skill: string;
    index: number;
    catId: string;
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

    const isEditing = editingSkill[catId] === index;

    return (
      <Badge
        ref={setNodeRef}
        style={style}
        variant="secondary"
        className={`bg-muted flex items-center gap-1 border border-transparent px-2 py-1 text-sm transition-colors${isDragging ? "border-primary/60 bg-accent/60" : ""}`}
        data-content="skill"
        data-index={index}
        {...attributes}
      >
        {/* drag handle */}
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
        {/* editable skill */}
        {isEditing ? (
          <Input
            className="min-w-[4ch] flex-1 border-none bg-transparent px-0 text-sm shadow-none focus:ring-0 focus-visible:ring-0"
            value={editingSkillValue[catId] ?? skill}
            autoFocus
            onChange={(e) =>
              setEditingSkillValue((prev) => ({
                ...prev,
                [catId]: e.target.value,
              }))
            }
            onBlur={() => {
              updateSkillInline(
                catId,
                index,
                editingSkillValue[catId] ?? skill,
              );
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateSkillInline(
                  catId,
                  index,
                  editingSkillValue[catId] ?? skill,
                );
              } else if (e.key === "Escape") {
                setEditingSkill((prev) => ({ ...prev, [catId]: null }));
                setEditingSkillValue((prev) => ({ ...prev, [catId]: "" }));
              }
            }}
            aria-label="Edit skill"
            placeholder="Edit skill..."
          />
        ) : (
          <span
            className="hover:text-primary focus-visible:text-primary flex-1 cursor-pointer rounded border border-transparent px-1 text-sm transition-colors outline-none hover:underline focus-visible:underline"
            tabIndex={0}
            onClick={() => {
              setEditingSkill((prev) => ({ ...prev, [catId]: index }));
              setEditingSkillValue((prev) => ({ ...prev, [catId]: skill }));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setEditingSkill((prev) => ({ ...prev, [catId]: index }));
                setEditingSkillValue((prev) => ({ ...prev, [catId]: skill }));
              }
            }}
            role="button"
            aria-label="Edit skill"
          >
            {skill}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-1 h-5 w-5 p-0"
          onClick={() => removeSkill(catId, index)}
          aria-label="Remove skill"
        >
          <X className="h-4 w-4" />
        </Button>
      </Badge>
    );
  }

  const addSkillCategory = () => {
    const newCategory: Skill = {
      id: Date.now().toString(),
      category: "",
      skills: [],
      visible: true,
    };
    onChange([...data, newCategory]);
  };

  const updateSkillCategory = (id: string, field: keyof Skill, value: any) => {
    onChange(
      data.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill,
      ),
    );
  };

  const removeSkillCategory = (id: string) => {
    onChange(data.filter((skill) => skill.id !== id));
  };

  const toggleSkillCategoryVisibility = (id: string) => {
    onChange(
      data.map((skill) =>
        skill.id === id
          ? { ...skill, visible: !(skill.visible ?? true) }
          : skill,
      ),
    );
  };

  const addSkill = (categoryId: string) => {
    const skillText = newSkillInputs[categoryId]?.trim();
    if (skillText) {
      const category = data.find((skill) => skill.id === categoryId);
      if (category) {
        updateSkillCategory(categoryId, "skills", [
          ...category.skills,
          skillText,
        ]);
        setNewSkillInputs((prev) => ({ ...prev, [categoryId]: "" }));
      }
    }
  };

  const removeSkill = (categoryId: string, skillIndex: number) => {
    const category = data.find((skill) => skill.id === categoryId);
    if (category) {
      const newSkills = category.skills.filter((_, i) => i !== skillIndex);
      updateSkillCategory(categoryId, "skills", newSkills);
    }
  };

  // sensors for category drag-and-drop
  const categorySensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // handle drag end for skill categories
  function handleSkillCategoryDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = data.findIndex((cat) => cat.id === active.id);
    const newIndex = data.findIndex((cat) => cat.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      const newCategories = arrayMove(data, oldIndex, newIndex);
      onChange(newCategories);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6" data-section="skills">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold sm:text-lg">Skills</h3>
        <Button onClick={addSkillCategory} size="sm" data-action="add-category">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {data.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          No skills added yet. Click "Add Category" to organize your skills by
          type.
        </p>
      ) : (
        <DndContext
          sensors={categorySensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSkillCategoryDragEnd}
          measuring={{
            droppable: { strategy: MeasuringStrategy.Always },
          }}
        >
          <SortableContext
            items={data.map((cat) => cat.id)}
            strategy={rectSortingStrategy}
          >
            <div className="space-y-3 sm:space-y-4">
              {data.map((skillCategory) => (
                <SortableCategory key={skillCategory.id} id={skillCategory.id}>
                  <Card
                    data-content="skill-category"
                    data-skill-category-id={skillCategory.id}
                  >
                    <CardHeader className="pb-2 sm:pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="ml-4 text-sm sm:text-base">
                          Skill Category
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              toggleSkillCategoryVisibility(skillCategory.id)
                            }
                            title={
                              skillCategory.visible !== false
                                ? "Hide from resume"
                                : "Show in resume"
                            }
                          >
                            {skillCategory.visible !== false ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              removeSkillCategory(skillCategory.id)
                            }
                            title="Delete permanently"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                      <div className="space-y-2 sm:space-y-3">
                        <Label>Category Name *</Label>
                        <Input
                          value={skillCategory.category}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateSkillCategory(
                              skillCategory.id,
                              "category",
                              e.target.value,
                            )
                          }
                          placeholder="e.g., Programming Languages, Frameworks, Tools"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Skills</Label>
                        <div className="flex gap-2">
                          <Input
                            value={newSkillInputs[skillCategory.id] || ""}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              setNewSkillInputs((prev) => ({
                                ...prev,
                                [skillCategory.id]: e.target.value,
                              }))
                            }
                            placeholder="Add a skill..."
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addSkill(skillCategory.id);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={() => addSkill(skillCategory.id)}
                            size="sm"
                            data-action="add-skill"
                          >
                            Add
                          </Button>
                        </div>

                        {skillCategory.skills.length > 0 && (
                          <DndContext
                            sensors={useSensors(
                              useSensor(PointerSensor, {
                                activationConstraint: { distance: 5 },
                              }),
                            )}
                            collisionDetection={closestCenter}
                            onDragEnd={(event) =>
                              handleSkillDragEnd(skillCategory.id, event)
                            }
                            measuring={{
                              droppable: {
                                strategy: MeasuringStrategy.Always,
                              },
                            }}
                          >
                            <SortableContext
                              items={skillCategory.skills.map(
                                (_, i) => `skill-${skillCategory.id}-${i}`,
                              )}
                              strategy={rectSortingStrategy}
                            >
                              <div
                                className="mt-3 flex flex-wrap gap-2"
                                data-content="skill-list"
                              >
                                {skillCategory.skills.map((skill, index) => (
                                  <SortableSkill
                                    key={`skill-${skillCategory.id}-${index}`}
                                    id={`skill-${skillCategory.id}-${index}`}
                                    skill={skill}
                                    index={index}
                                    catId={skillCategory.id}
                                  />
                                ))}
                              </div>
                            </SortableContext>
                          </DndContext>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </SortableCategory>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default SkillsForm;
