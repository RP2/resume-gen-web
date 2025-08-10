import React, { useState } from "react";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
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
                  <Label>Description</Label>
                  <Textarea
                    value={experience.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateExperience(
                        experience.id,
                        "description",
                        e.target.value,
                      )
                    }
                    placeholder="Brief description of your role and responsibilities..."
                    rows={3}
                  />
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
                    <div
                      className="mt-3 space-y-2"
                      data-section="workExperience"
                      data-content="highlights"
                    >
                      {experience.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="bg-muted flex items-center gap-2 rounded p-2"
                          data-content="achievement"
                          data-index={index}
                        >
                          <span className="flex-1 text-sm" data-content>
                            {highlight}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeHighlight(experience.id, index)
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
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

export default WorkExperienceForm;
