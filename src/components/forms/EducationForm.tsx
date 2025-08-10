import React from "react";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Education } from "../../types/resume";

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ data, onChange }) => {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      honors: "",
      visible: true,
    };
    onChange([...data, newEducation]);
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string,
  ) => {
    onChange(
      data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    );
  };

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  const toggleEducationVisibility = (id: string) => {
    onChange(
      data.map((edu) =>
        edu.id === id ? { ...edu, visible: !(edu.visible ?? true) } : edu,
      ),
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6" data-section="education">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold sm:text-lg">Education</h3>
        <Button onClick={addEducation} size="sm" data-action="add-education">
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>

      {data.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          No education added yet. Click "Add Education" to get started.
        </p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {data.map((education) => (
            <Card key={education.id} data-content="education">
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base">
                    Education Details
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleEducationVisibility(education.id)}
                      title={
                        education.visible !== false
                          ? "Hide from resume"
                          : "Show in resume"
                      }
                    >
                      {education.visible !== false ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeEducation(education.id)}
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
                    <Label>Institution *</Label>
                    <Input
                      value={education.institution}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateEducation(
                          education.id,
                          "institution",
                          e.target.value,
                        )
                      }
                      placeholder="University of California, Berkeley"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Degree *</Label>
                    <Input
                      value={education.degree}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateEducation(education.id, "degree", e.target.value)
                      }
                      placeholder="Bachelor of Science"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Field of Study *</Label>
                    <Input
                      value={education.field}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateEducation(education.id, "field", e.target.value)
                      }
                      placeholder="Computer Science"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={education.location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateEducation(
                          education.id,
                          "location",
                          e.target.value,
                        )
                      }
                      placeholder="Berkeley, CA"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Input
                      type="month"
                      value={education.startDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateEducation(
                          education.id,
                          "startDate",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>End Date *</Label>
                    <Input
                      type="month"
                      value={education.endDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateEducation(education.id, "endDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>GPA</Label>
                    <Input
                      value={education.gpa || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateEducation(education.id, "gpa", e.target.value)
                      }
                      placeholder="3.8/4.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Honors/Awards</Label>
                    <Input
                      value={education.honors || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateEducation(education.id, "honors", e.target.value)
                      }
                      placeholder="Magna Cum Laude, Dean's List"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;
