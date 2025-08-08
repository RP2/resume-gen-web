import type { ResumeData } from "../types/resume";

export const sampleResumeData: ResumeData = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    summary:
      "Experienced Software Engineer with 5+ years of expertise in full-stack development, cloud architecture, and team leadership. Passionate about building scalable applications and mentoring junior developers.",
  },
  workExperience: [
    {
      id: "1",
      company: "Tech Corp",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2022-01",
      endDate: "",
      isCurrentRole: true,
      description:
        "Lead development of microservices architecture serving 10M+ users daily.",
      highlights: [
        "Reduced API response time by 40% through optimization and caching strategies",
        "Led a team of 4 engineers to deliver 3 major features ahead of schedule",
        "Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes",
      ],
      visible: true,
    },
    {
      id: "2",
      company: "StartupXYZ",
      position: "Full Stack Developer",
      location: "San Francisco, CA",
      startDate: "2020-06",
      endDate: "2021-12",
      isCurrentRole: false,
      description:
        "Developed and maintained web applications using React, Node.js, and PostgreSQL.",
      highlights: [
        "Built responsive web application from scratch with 95% test coverage",
        "Integrated third-party APIs reducing manual data entry by 80%",
        "Collaborated with design team to improve user experience and increase engagement by 25%",
      ],
      visible: true,
    },
  ],
  education: [
    {
      id: "1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2016-08",
      endDate: "2020-05",
      gpa: "3.8/4.0",
      honors: "Magna Cum Laude, Dean's List (6 semesters)",
      visible: true,
    },
  ],
  skills: [
    {
      id: "1",
      category: "Programming Languages",
      skills: ["JavaScript", "TypeScript", "Python", "Java", "Go"],
      visible: true,
    },
    {
      id: "2",
      category: "Frontend Technologies",
      skills: ["React", "Vue.js", "HTML5", "CSS3", "Tailwind CSS"],
      visible: true,
    },
    {
      id: "3",
      category: "Backend & Cloud",
      skills: [
        "Node.js",
        "Express.js",
        "PostgreSQL",
        "MongoDB",
        "AWS",
        "Docker",
      ],
      visible: true,
    },
    {
      id: "4",
      category: "Tools & Methodologies",
      skills: ["Git", "Jest", "Webpack", "Agile/Scrum", "REST APIs", "GraphQL"],
      visible: true,
    },
  ],
  projects: [
    {
      id: "1",
      name: "E-Commerce Platform",
      description:
        "Full-stack e-commerce platform with real-time inventory management, payment processing, and admin dashboard. Built with React, Node.js, and PostgreSQL.",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe API", "Redux"],
      startDate: "2023-01",
      endDate: "2023-06",
      url: "https://ecommerce-demo.johndoe.dev",
      visible: true,
    },
    {
      id: "2",
      name: "Weather Forecast App",
      description:
        "Mobile-responsive weather application with location-based forecasts, interactive maps, and offline capability. Features clean UI and real-time updates.",
      technologies: ["Vue.js", "PWA", "OpenWeather API", "Geolocation API"],
      startDate: "2022-08",
      endDate: "2022-10",
      url: "https://weather.johndoe.dev",
      visible: true,
    },
  ],
};
