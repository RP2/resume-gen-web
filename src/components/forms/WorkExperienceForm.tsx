import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { WorkExperience } from "../../types/resume";

interface WorkExperienceFormProps {
  data: WorkExperience[];
  onChange: (data: WorkExperience[]) => void;
}

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({
  data,
  onChange,
}) => {
  const [highlights, setHighlights] = useState<{ [key: string]: string }>({});
  // use expId as key, value is index of editing highlight (like skills)
  const [editingHighlight, setEditingHighlight] = useState<{
    [expId: string]: number | null;
  }>({});
  const [editingHighlightValue, setEditingHighlightValue] = useState<{
    [expId: string]: string;
  }>({});

  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrentRole: false,
      description: "",
      highlights: [],
      visible: true,
    };
    onChange([...data, newExperience]);
  };

  const updateExperience = (
    id: string,
    field: keyof WorkExperience,
    value: any,
  ) => {
    onChange(
      data.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    );
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
  };

  const toggleExperienceVisibility = (id: string) => {
    onChange(
      data.map((exp) =>
        exp.id === id ? { ...exp, visible: !(exp.visible ?? true) } : exp,
      ),
    );
  };

  const addHighlight = (expId: string) => {
    const highlightText = highlights[expId]?.trim();
    if (highlightText) {
      const experience = data.find((exp) => exp.id === expId);
      if (experience) {
        updateExperience(expId, "highlights", [
          ...experience.highlights,
          highlightText,
        ]);
        setHighlights((prev) => ({ ...prev, [expId]: "" }));
      }
    }
  };

  const removeHighlight = (expId: string, index: number) => {
    const experience = data.find((exp) => exp.id === expId);
    if (experience) {
      const newHighlights = experience.highlights.filter((_, i) => i !== index);
      updateExperience(expId, "highlights", newHighlights);
    }
  };

  // sortable highlight item component
  function SortableHighlight({
    id,
    highlight,
    index,
    expId,
  }: {
    id: string;
    highlight: string;
    index: number;
    expId: string;
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

    const isEditing = editingHighlight[expId] === index;
    const editingValue = isEditing
      ? (editingHighlightValue[expId] ?? highlight)
      : highlight;

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-muted flex items-center gap-1 rounded border border-transparent px-2 py-1 text-sm transition-colors${isDragging ? "border-primary/60 bg-accent/60" : ""}`}
        data-content="achievement"
        data-index={index}
        {...attributes}
      >
        {/* drag handle */}
        <button
          {...listeners}
          className={`text-muted-foreground group-hover:text-primary group-focus-within:text-primary cursor-grab px-1 focus:outline-none ${isDragging ? "cursor-grabbing" : ""}`}
          tabIndex={-1}
          aria-label="Drag to reorder"
          type="button"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        {/* editable highlight */}
        {isEditing ? (
          <Textarea
            className="flex-1 resize-none text-sm"
            defaultValue={editingHighlightValue[expId] ?? highlight}
            autoFocus
            rows={Math.max(
              2,
              (editingHighlightValue[expId] ?? highlight).split("\n").length,
            )}
            onBlur={(e) => {
              updateHighlightInline(expId, index, e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                updateHighlightInline(
                  expId,
                  index,
                  (e.target as HTMLTextAreaElement).value,
                );
              } else if (e.key === "Escape") {
                setEditingHighlight((prev) => ({ ...prev, [expId]: null }));
                setEditingHighlightValue((prev) => ({ ...prev, [expId]: "" }));
              }
            }}
            aria-label="Edit highlight"
            placeholder="Edit achievement..."
          />
        ) : (
          <span
            className="hover:text-primary hover:border-primary/60 hover:bg-accent/60 focus-visible:text-primary focus-visible:border-primary/80 focus-visible:bg-accent/60 flex-1 cursor-pointer rounded border border-transparent px-1 text-sm transition-colors outline-none focus-visible:underline"
            data-content
            tabIndex={0}
            onClick={() => {
              setEditingHighlight((prev) => ({ ...prev, [expId]: index }));
              setEditingHighlightValue((prev) => ({
                ...prev,
                [expId]: highlight,
              }));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setEditingHighlight((prev) => ({ ...prev, [expId]: index }));
                setEditingHighlightValue((prev) => ({
                  ...prev,
                  [expId]: highlight,
                }));
              }
            }}
            role="button"
            aria-label="Edit highlight"
          >
            {highlight}
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeHighlight(expId, index)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  // update highlight inline
  function updateHighlightInline(expId: string, index: number, value: string) {
    const experience = data.find((exp) => exp.id === expId);
    if (experience) {
      const newHighlights = [...experience.highlights];
      newHighlights[index] = value.trim();
      updateExperience(expId, "highlights", newHighlights);
      setEditingHighlight((prev) => ({ ...prev, [expId]: null }));
      setEditingHighlightValue((prev) => ({ ...prev, [expId]: "" }));
    }
  }

  // handle drag end for highlights
  function handleHighlightDragEnd(expId: string, event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const experience = data.find((exp) => exp.id === expId);
    if (experience) {
      const oldIndex = experience.highlights.findIndex(
        (_, i) => `highlight-${expId}-${i}` === active.id,
      );
      const newIndex = experience.highlights.findIndex(
        (_, i) => `highlight-${expId}-${i}` === over.id,
      );
      if (oldIndex !== -1 && newIndex !== -1) {
        const newHighlights = arrayMove(
          experience.highlights,
          oldIndex,
          newIndex,
        );
        updateExperience(expId, "highlights", newHighlights);
      }
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6" data-section="workExperience">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold sm:text-lg">Work Experience</h3>
        <Button onClick={addExperience} size="sm" data-action="add-experience">
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {data.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          No work experience added yet. Click "Add Experience" to get started.
        </p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {data.map((experience) => (
            <Card key={experience.id}>
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base">
                    Experience Details
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExperienceVisibility(experience.id)}
                      title={
                        experience.visible !== false
                          ? "Hide from resume"
                          : "Show in resume"
                      }
                    >
                      {experience.visible !== false ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeExperience(experience.id)}
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
                    <Label>Company *</Label>
                    <Input
                      value={experience.company}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateExperience(
                          experience.id,
                          "company",
                          e.target.value,
                        )
                      }
                      placeholder="Google"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Position *</Label>
                    <Input
                      value={experience.position}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateExperience(
                          experience.id,
                          "position",
                          e.target.value,
                        )
                      }
                      placeholder="Software Engineer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={experience.location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateExperience(
                          experience.id,
                          "location",
                          e.target.value,
                        )
                      }
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Input
                      type="month"
                      value={experience.startDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateExperience(
                          experience.id,
                          "startDate",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={experience.endDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateExperience(
                          experience.id,
                          "endDate",
                          e.target.value,
                        )
                      }
                      disabled={experience.isCurrentRole}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`current-${experience.id}`}
                      checked={experience.isCurrentRole}
                      onCheckedChange={(checked: boolean) =>
                        updateExperience(
                          experience.id,
                          "isCurrentRole",
                          checked,
                        )
                      }
                    />
                    <Label htmlFor={`current-${experience.id}`}>
                      I currently work here
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Key Achievements & Highlights</Label>
                  <div className="flex gap-2">
                    <Input
                      value={highlights[experience.id] || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setHighlights((prev) => ({
                          ...prev,
                          [experience.id]: e.target.value,
                        }))
                      }
                      placeholder="Add a key achievement or highlight..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addHighlight(experience.id);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => addHighlight(experience.id)}
                      size="sm"
                      data-action="add-achievement"
                    >
                      Add
                    </Button>
                  </div>

                  {experience.highlights.length > 0 && (
                    <DndContext
                      sensors={useSensors(
                        useSensor(PointerSensor, {
                          activationConstraint: { distance: 5 },
                        }),
                      )}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) =>
                        handleHighlightDragEnd(experience.id, event)
                      }
                    >
                      <SortableContext
                        items={experience.highlights.map(
                          (_, i) => `highlight-${experience.id}-${i}`,
                        )}
                        strategy={verticalListSortingStrategy}
                      >
                        <div
                          className="mt-3 space-y-2"
                          data-section="workExperience"
                          data-content="highlights"
                        >
                          {experience.highlights.map((highlight, index) => (
                            <SortableHighlight
                              key={`highlight-${experience.id}-${index}`}
                              id={`highlight-${experience.id}-${index}`}
                              highlight={highlight}
                              index={index}
                              expId={experience.id}
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

export default WorkExperienceForm;
