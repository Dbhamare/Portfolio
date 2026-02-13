export const profile = {
  name: "Darshan Bhamare",
  role: "Cloud Operations | DevOps | SRE | Platform Engineer",
  headline:
    "Cloud engineer with hands-on experience managing scalable AWS/Azure infrastructure, Linux and Windows operations, and automation-first reliability improvements.",
  location: "United Kingdom (open to relocate) | Remote Roles",
  visaStatus: "Graduate Route (Post-Study Work Visa) | Valid until March 2028",
  email: "darsh.bhamare.uk@gmail.com",
  linkedin: "https://linkedin.com/in/darshan-bhamare-cloud",
  github: "https://github.com/Dbhamare",
  resumeLabel: "/Darshan CV Latest Updated.pdf",
  avatar: "/profile.jpg",
  phone: "+447818987884"
};

export const skillGroups = [
  {
    title: "Cloud Platforms",
    items: [
      "AWS (EKS, MSK, EC2, S3, RDS, IAM)",
      "Azure (AKS, Functions, App Services, Storage, Databases, Security, Monitoring)",
      "IBM Cloud (Containers, Databases, DevOps, Networking, Security, Storage, Observability)"
    ]
  },
  {
    title: "Containers & Orchestration",
    items: ["Docker", "Kubernetes", "AWS EKS", "Azure AKS", "IBM IKS", "Helm"]
  },
  {
    title: "CI/CD & Automation",
    items: [
      "Jenkins",
      "GitHub",
      "GitHub Actions",
      "Terraform",
      "Helm",
      "Ansible",
      "CloudFormation",
      "CI/CD Pipelines"
    ]
  },
  {
    title: "Monitoring & Reliability",
    items: [
      "AWS CloudWatch",
      "Azure Monitor",
      "Nagios",
      "Grafana",
      "Prometheus",
      "Datadog",
      "Loki",
      "ELK Stack (Elasticsearch, Logstash, Kibana)",
      "Elastic Load Balancing",
      "Auto Scaling",
      "Kubernetes self-healing"
    ]
  },
  {
    title: "Security & Networking",
    items: [
      "IAM",
      "IAM Roles/Policies",
      "AWS WAF",
      "Security Groups",
      "NACLs",
      "ACLs",
      "Firewalls",
      "SSL/TLS",
      "VPC",
      "Encryption",
      "Compliance (ISO, SOC 2, GDPR)",
      "DNS",
      "FTP"
    ]
  },
  {
    title: "Platforms & Databases",
    items: [
      "Linux",
      "Windows Server",
      "Active Directory",
      "Group Policy",
      "WHM/cPanel",
      "Plesk",
      "AWS MSK",
      "ElasticSearch",
      "MongoDB",
      "PostgreSQL",
      "SQL Databases",
      "RDS",
      "S3"
    ]
  },
  {
    title: "Scripting & IaC",
    items: ["Python", "Shell Scripting", "YAML"]
  },
  {
    title: "Collaboration & Tools",
    items: ["Jira", "Confluence", "ServiceNow", "FreshService", "Git"]
  },
  {
    title: "Developer Tools",
    items: [
      "Git",
      "Docker",
      "Google Cloud Platform",
      "VS Code",
      "PyCharm",
      "IntelliJ",
      "Eclipse"
    ]
  },
  {
    title: "Languages & Frameworks",
    items: [
      "Java",
      "Python",
      "C/C++",
      "SQL",
      "JavaScript",
      "HTML/CSS",
      "React",
      "Node.js",
      "Flask",
      "JUnit",
      "WordPress",
      "Material-UI",
      "REST APIs"
    ]
  },
  {
    title: "Leadership & Collaboration",
    items: [
      "Problem Solving",
      "Decision Making",
      "Leadership",
      "Strategic Planning",
      "Documentation",
      "Adaptability",
      "Team Mentoring",
      "DevOps Best Practices"
    ]
  }
];

export const highlights = [
  {
    label: "Years of Experience",
    value: "4+"
  },
  {
    label: "Cloud Operations Roles",
    value: "3"
  },
  {
    label: "Certifications",
    value: "2"
  }
];

export const experience = [
  {
    company:
      "Conga (Apttus Corporation) | Aress Software & Education Technologies (P) Ltd | Nashik, India",
    title: "Cloud Operations Engineer Contractor",
    duration: "May 2023 - Aug 2024",
    points: [
      "Administered GitHub repositories, implemented CI/CD pipelines, and supported Agile workflows.",
      "Designed and implemented Azure AKS clusters, Azure Functions, Storage, Databases, Developer Tools, and monitoring solutions for scalable applications.",
      "Applied AWS best practices for security, compliance, performance, and cost optimization.",
      "Configured IAM roles/policies, Security Groups, NACLs, and WAF to strengthen infrastructure security.",
      "Managed AWS MSK, ElasticSearch, and MongoDB clusters with performance tuning and backup strategies.",
      "Automated infrastructure provisioning and deployments using Terraform, Ansible, and Jenkins, reducing manual effort by 60%.",
      "Built and optimized Jenkins pipelines for CI/CD, accelerating release cycles from 2 weeks to 3 days.",
      "Deployed microservices on AWS EKS, Azure AKS, and IBM IKS using Helm, improving scalability and reliability.",
      "Architected high-availability systems with Elastic Load Balancing, Auto Scaling, and Kubernetes self-healing.",
      "Led and mentored 10-12 junior engineers on Jenkins, Helm, Kubernetes (EKS/AKS/IKS), MSK, MongoDB, and scripting."
    ]
  },
  {
    company: "Aress Software & Education Technologies (P) Ltd | Nashik, India",
    title: "Cloud Operations Engineer",
    duration: "Feb 2021 - May 2023",
    points: [
      "Deployed and managed scalable, fault-tolerant cloud infrastructure using AWS EC2, VPC, S3, RDS, IAM and Azure VMs.",
      "Configured AWS CloudWatch alerts, dashboards, and proactive monitoring for CPU, memory, disk space and system health; reduced incident detection time by 35%.",
      "Automated backup operations on Linux and Windows servers and resolved backup failures.",
      "Performed system audits, performance tuning, and disaster recovery drills, improving uptime.",
      "Created automation scripts for provisioning, patching, and monitoring workloads, reducing manual effort by 70%."
    ]
  },
  {
    company: "Aress Software & Education Technologies (P) Ltd | Nashik, India",
    title: "Technical Support Engineer",
    duration: "Sep 2020 - Feb 2021",
    points: [
      "Provided L2 support for hosting clients via WHM/cPanel and Plesk.",
      "Configured DNS, FTP, email services, SSL certificates, and handled website migrations.",
      "Managed Linux and Windows servers, including security, firewalls, vulnerability patching, and monthly upgrades, reducing vulnerabilities by 40%.",
      "Implemented Active Directory services with user/group management, Group Policy, and domain controllers.",
      "Monitored infrastructure and applications using Nagios, AWS CloudWatch, and related tools."
    ]
  }
];

export const projects = [
  {
    name: "Debate Sessions in Higher Education",
    category: "Full Stack",
    summary:
      "Built an online MERN-stack debate platform with role-based access for students and instructors, JWT authentication, unique IDs, and AI-driven debate analytics.",
    stack: ["MongoDB", "Express.js", "React", "Node.js", "JWT", "AI"],
    link: "#"
  }
];

export const certifications = [
  "Programming in C and C++",
  "Programming in Core and Advanced Java"
];

export const education = [
  {
    degree: "MSc Cloud Computing",
    school: "University of Leicester | Leicester, UK",
    duration: "Sep 2024 - Sep 2025"
  },
  {
    degree: "Bachelor of Business Administration (Computer Application)",
    school: "KVN Naik Arts, Commerce & Science College | Nashik, India",
    duration: "Jul 2021 - Jul 2024"
  },
  {
    degree: "Bachelor in Computer Engineering",
    school: "K. K. Wagh Institute of Engineering Education and Research | Nashik, India",
    duration: "Aug 2016 - Dec 2020"
  }
];

export const achievements = [
  "Awarded as Performer of the Month multiple times at Aress Software & Education Technologies (P) Ltd.",
  "Hospitality Head during the Equinox event conducted by Computer Department, KKWIEER, Nashik.",
  "Interests: Bike riding, swimming, computer gaming, martial arts, table tennis, chess, tennis, badminton, and travelling."
];
