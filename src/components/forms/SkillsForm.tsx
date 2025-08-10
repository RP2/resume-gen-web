import React, { useState } from "react";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
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
        <div className="space-y-3 sm:space-y-4">
          {data.map((skillCategory) => (
            <Card
              key={skillCategory.id}
              data-content="skill-category"
              data-skill-category-id={skillCategory.id}
            >
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base">
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
                      onClick={() => removeSkillCategory(skillCategory.id)}
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                    <div
                      className="mt-3 flex flex-wrap gap-2"
                      data-content="skill-list"
                    >
                      {skillCategory.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-sm"
                        >
                          {skill}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-4 w-4 p-0"
                            onClick={() => removeSkill(skillCategory.id, index)}
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

export default SkillsForm;
