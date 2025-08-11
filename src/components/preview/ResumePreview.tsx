import React from "react";
import type { ResumeData } from "../../types/resume";
import { MapPin, Mail, Phone, Globe, Linkedin, Github } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface ResumePreviewProps {
  data: ResumeData;
  originalData?: ResumeData;
  isPreviewMode?: boolean;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  data,
  originalData,
  isPreviewMode = false,
}) => {
  const { personalInfo, workExperience, education, skills, projects } = data;

  // Helper for highlighting text content
  const highlightContent = (
    current: string,
    original?: string,
    section?: string,
  ): React.ReactNode => {
    // If no preview is active, just return the content
    if (!isPreviewMode) return current;

    // If we have original data to compare with
    if (originalData && original !== undefined) {
      const isAdded = current && !original;
      const isModified = current !== original && current && original;

      console.log("Highlight check:", {
        current,
        original,
        isAdded,
        isModified,
        section,
      });

      if (isAdded) {
        return (
          <span className="border-primary bg-primary/20 animate-pulse rounded border-2 px-2 py-1 font-semibold">
            {current}
          </span>
        );
      }

      if (isModified) {
        return (
          <span className="border-secondary bg-secondary/30 animate-pulse rounded border-2 px-2 py-1 font-semibold">
            {current}
          </span>
        );
      }
    }

    return current;
  };

  return (
    <Card
      className={`${isPreviewMode ? "ring-primary ring-opacity-50 ring-2" : ""}`}
    >
      <CardContent className="relative mx-auto max-w-4xl px-6 leading-normal sm:px-8">
        {/* Preview mode indicator */}
        {isPreviewMode && (
          <div className="bg-primary text-primary-foreground absolute top-2 right-2 z-10 animate-pulse rounded-full px-3 py-1 text-xs font-medium">
            🔍 PREVIEW MODE
          </div>
        )}

        {/* Header - ATS-Optimized with semantic structure */}
        <header className="border-border mb-6 border-b pb-6 text-center">
          <h1
            className="text-foreground mb-3 text-3xl leading-tight font-bold"
            role="banner"
          >
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <div
            className="text-muted-foreground contact-info mt-4 flex flex-wrap justify-center gap-4 text-sm leading-6"
            role="complementary"
          >
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="hover:text-primary underline underline-offset-2 transition-colors"
                >
                  {personalInfo.email}
                </a>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a
                  href={`tel:${personalInfo.phone}`}
                  className="hover:text-primary underline underline-offset-2 transition-colors"
                >
                  {personalInfo.phone}
                </a>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 flex-shrink-0" />
                <a
                  href={
                    personalInfo.website.startsWith("http")
                      ? personalInfo.website
                      : `https://${personalInfo.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary underline underline-offset-2 transition-colors"
                >
                  {personalInfo.website}
                </a>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 flex-shrink-0" />
                <a
                  href={
                    personalInfo.linkedin.startsWith("http")
                      ? personalInfo.linkedin
                      : `https://linkedin.com/in/${personalInfo.linkedin}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary underline underline-offset-2 transition-colors"
                >
                  {personalInfo.linkedin.startsWith("http")
                    ? personalInfo.linkedin
                    : `linkedin.com/in/${personalInfo.linkedin}`}
                </a>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4 flex-shrink-0" />
                <a
                  href={
                    personalInfo.github.startsWith("http")
                      ? personalInfo.github
                      : `https://github.com/${personalInfo.github}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary underline underline-offset-2 transition-colors"
                >
                  {personalInfo.github.startsWith("http")
                    ? personalInfo.github
                    : `github.com/${personalInfo.github}`}
                </a>
              </div>
            )}
          </div>
        </header>

        {/* Summary - ATS Keywords Section */}
        {personalInfo.summary && (
          <section
            className="mb-6"
            role="region"
            aria-label="Professional Summary"
          >
            <h2 className="border-border text-foreground mb-3 border-b pb-2 text-xl font-bold">
              Professional Summary
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {highlightContent(
                personalInfo.summary,
                originalData?.personalInfo.summary,
                "personalInfo",
              )}
            </p>
          </section>
        )}

        {/* Work Experience - Critical ATS Section */}
        {workExperience.length > 0 && (
          <section
            className="mb-6"
            role="region"
            aria-label="Professional Experience"
          >
            <h2 className="border-border text-foreground mb-3 border-b pb-2 text-xl font-bold">
              Professional Experience
            </h2>
            <div className="space-y-5">
              {workExperience
                .filter((job) => job.visible !== false)
                .map((job) => (
                  <div
                    key={job.id}
                    className="experience-item"
                    itemScope
                    itemType="https://schema.org/WorkExperience"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <h3
                          className="text-foreground font-semibold break-words"
                          itemProp="jobTitle"
                        >
                          {job.position}
                        </h3>
                        <p
                          className="text-muted-foreground break-words"
                          itemProp="hiringOrganization"
                        >
                          <span itemProp="name">{job.company}</span> •{" "}
                          {job.location}
                        </p>
                      </div>
                      <p
                        className="text-muted-foreground shrink-0 text-sm sm:ml-4"
                        itemProp="datePosted"
                      >
                        {job.startDate} -{" "}
                        {job.isCurrentRole ? "Present" : job.endDate}
                      </p>
                    </div>
                    {job.description && (
                      <p
                        className="text-muted-foreground mt-2 text-sm"
                        itemProp="description"
                      >
                        {highlightContent(
                          job.description,
                          originalData?.workExperience.find(
                            (orig) => orig.id === job.id,
                          )?.description,
                          "workExperience",
                        )}
                      </p>
                    )}
                    {job.highlights.length > 0 && (
                      <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1 text-sm">
                        {job.highlights.map((highlight, index) => {
                          const originalHighlight =
                            originalData?.workExperience.find(
                              (orig) => orig.id === job.id,
                            )?.highlights[index];

                          return (
                            <li key={index}>
                              {highlightContent(
                                highlight,
                                originalHighlight,
                                "workExperience",
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Education - ATS Keyword Section */}
        {education.length > 0 && (
          <section className="mb-6" role="region" aria-label="Education">
            <h2 className="border-border text-foreground mb-3 border-b pb-2 text-xl font-bold">
              Education
            </h2>
            <div className="space-y-5">
              {education
                .filter((edu) => edu.visible !== false)
                .map((edu) => (
                  <div
                    key={edu.id}
                    className="education-item"
                    itemScope
                    itemType="https://schema.org/EducationalCredential"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <h3
                          className="text-foreground font-semibold break-words"
                          itemProp="credentialCategory"
                        >
                          {edu.degree} in {edu.field}
                        </h3>
                        <p
                          className="text-muted-foreground break-words"
                          itemProp="educationalCredentialAwarded"
                        >
                          <span itemProp="sourceOrganization">
                            {edu.institution}
                          </span>{" "}
                          • {edu.location}
                        </p>
                        {edu.gpa && (
                          <p className="text-muted-foreground text-sm">
                            GPA: {edu.gpa}
                          </p>
                        )}
                        {edu.honors && (
                          <p className="text-muted-foreground text-sm">
                            {edu.honors}
                          </p>
                        )}
                      </div>
                      <p className="text-muted-foreground shrink-0 text-sm sm:ml-4">
                        {edu.startDate} - {edu.endDate}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Skills - Critical ATS Keywords Section */}
        {skills.length > 0 && (
          <section
            className="skills-section mb-6"
            role="region"
            aria-label="Technical Skills"
          >
            <h2 className="border-border text-foreground mb-3 border-b pb-2 text-xl font-bold">
              Skills
            </h2>
            <div className="space-y-4">
              {skills
                .filter((skillGroup) => skillGroup.visible !== false)
                .map((skillGroup) => (
                  <div
                    key={skillGroup.id}
                    itemScope
                    itemType="https://schema.org/SkillSet"
                  >
                    <h3
                      className="text-foreground mb-2 font-semibold"
                      itemProp="name"
                    >
                      {skillGroup.category}
                    </h3>
                    <p
                      className="text-muted-foreground skills-list"
                      itemProp="description"
                    >
                      {skillGroup.skills.map((skill, index) => {
                        const originalSkills =
                          originalData?.skills.find(
                            (orig) => orig.id === skillGroup.id,
                          )?.skills || [];
                        const isNewSkill = !originalSkills.includes(skill);
                        const isLast = index === skillGroup.skills.length - 1;

                        return (
                          <React.Fragment key={index}>
                            {isNewSkill && isPreviewMode ? (
                              <span className="border-primary/30 bg-primary/10 animate-pulse rounded border px-1">
                                {skill}
                              </span>
                            ) : (
                              skill
                            )}
                            {!isLast && ", "}
                          </React.Fragment>
                        );
                      })}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Projects - Portfolio Section */}
        {projects.length > 0 && (
          <section className="mb-6" role="region" aria-label="Projects">
            <h2 className="border-border text-foreground mb-3 border-b pb-2 text-xl font-bold">
              Projects
            </h2>
            <div className="space-y-5">
              {projects
                .filter((project) => project.visible !== false)
                .map((project) => (
                  <div
                    key={project.id}
                    className="project-item"
                    itemScope
                    itemType="https://schema.org/CreativeWork"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <h3
                        className="text-foreground min-w-0 flex-1 font-semibold break-words"
                        itemProp="name"
                      >
                        {project.name}
                      </h3>
                      <p
                        className="text-muted-foreground shrink-0 text-sm sm:ml-4"
                        itemProp="datePublished"
                      >
                        {project.startDate} - {project.endDate || "Present"}
                      </p>
                    </div>
                    <p
                      className="text-muted-foreground mt-2 text-sm"
                      itemProp="description"
                    >
                      {project.description}
                    </p>
                    {project.technologies.length > 0 && (
                      <p
                        className="text-muted-foreground technologies-list mt-2 text-sm"
                        itemProp="keywords"
                      >
                        <strong>Technologies:</strong>{" "}
                        {project.technologies.join(", ")}
                      </p>
                    )}
                    {project.url && (
                      <div className="mt-2 text-sm">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary break-all hover:underline"
                        >
                          {project.url}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumePreview;
