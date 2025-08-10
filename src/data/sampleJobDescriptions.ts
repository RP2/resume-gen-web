// Example job descriptions for testing the AI optimization feature

export const sampleJobDescriptions = {
  softwareEngineer: `Software Engineer - Full Stack
Company: TechCorp Inc.

Job Description:
We are seeking a talented Full Stack Software Engineer to join our growing team. The ideal candidate will have experience with modern web technologies and a passion for building scalable applications.

Key Responsibilities:
• Develop and maintain web applications using React, Node.js, and TypeScript
• Design and implement RESTful APIs and microservices
• Work with cloud platforms (AWS, Azure) for deployment and scaling
• Collaborate with cross-functional teams in an Agile environment
• Write clean, maintainable code with comprehensive tests
• Participate in code reviews and technical discussions

Required Qualifications:
• Bachelor's degree in Computer Science or related field
• 3+ years of experience with JavaScript/TypeScript
• Strong experience with React and modern frontend frameworks
• Experience with Node.js and backend development
• Knowledge of databases (PostgreSQL, MongoDB)
• Familiarity with Git version control
• Experience with CI/CD pipelines

Preferred Qualifications:
• Experience with cloud platforms (AWS preferred)
• Knowledge of containerization (Docker, Kubernetes)
• Experience with GraphQL
• Understanding of microservices architecture
• Experience with testing frameworks (Jest, Cypress)
• Agile/Scrum methodology experience

What We Offer:
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements
• Professional development opportunities
• Modern tech stack and tools`,

  dataScientist: `Data Scientist - Machine Learning
Company: DataCorp Analytics

Job Description:
We're looking for an experienced Data Scientist to join our AI/ML team. You'll work on cutting-edge machine learning projects and help drive data-driven decision making across the organization.

Key Responsibilities:
• Design and implement machine learning models for various business problems
• Analyze large datasets using Python, R, and SQL
• Develop predictive models and recommendation systems
• Work with big data technologies (Spark, Hadoop)
• Create visualizations and reports for stakeholders
• Deploy models to production environments
• Collaborate with engineering teams on ML infrastructure

Required Qualifications:
• Master's degree in Data Science, Statistics, or related field
• 4+ years of experience in data science and machine learning
• Strong programming skills in Python and R
• Experience with ML libraries (scikit-learn, TensorFlow, PyTorch)
• Proficiency in SQL and database management
• Statistical analysis and hypothesis testing experience
• Experience with data visualization tools (Tableau, Power BI)

Preferred Qualifications:
• PhD in quantitative field
• Experience with deep learning and neural networks
• Knowledge of cloud ML platforms (AWS SageMaker, Google AI)
• Experience with MLOps and model deployment
• Big data experience (Spark, Hadoop, Kafka)
• A/B testing and experimentation experience
• Business intelligence and analytics experience

Skills:
• Python, R, SQL
• Machine Learning, Deep Learning
• TensorFlow, PyTorch, scikit-learn
• Statistics, Mathematics
• Data Visualization
• Cloud Computing (AWS, GCP)`,

  productManager: `Senior Product Manager
Company: InnovateTech

Job Description:
We are seeking a Senior Product Manager to lead our consumer products division. You will be responsible for driving product strategy, working closely with engineering and design teams, and ensuring successful product launches.

Key Responsibilities:
• Define product vision, strategy, and roadmap
• Conduct market research and competitive analysis
• Gather and prioritize product requirements
• Work with cross-functional teams to deliver products
• Analyze product metrics and user feedback
• Manage product launches and go-to-market strategies
• Collaborate with sales and marketing teams

Required Qualifications:
• Bachelor's degree in Business, Engineering, or related field
• 5+ years of product management experience
• Strong analytical and problem-solving skills
• Experience with product analytics tools (Mixpanel, Amplitude)
• Excellent communication and leadership skills
• Experience with Agile development methodologies
• Customer-focused mindset

Preferred Qualifications:
• MBA or advanced degree
• Experience in B2C consumer products
• Technical background with ability to work closely with engineers
• Experience with A/B testing and experimentation
• Background in user experience design
• International product experience
• Experience with mobile app products

Core Competencies:
• Strategic thinking
• Data-driven decision making
• Cross-functional collaboration
• User empathy
• Market analysis
• Product launch execution`,
};

export const getSampleJobDescription = (
  type: keyof typeof sampleJobDescriptions,
): string => {
  return sampleJobDescriptions[type] || "";
};
