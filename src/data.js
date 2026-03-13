export const profile = {
  name: "Darshan Bhamare",
  role: "Cloud Operations | DevOps | Infrastructure | SRE | Platform Engineer",
  headline:
    "Cloud engineer with hands-on experience managing scalable AWS/Azure infrastructure, Linux and Windows operations, and automation-first reliability improvements.",
  location: "United Kingdom | India | Remote | Relocation",
  visaStatus: "Right to Work in the UK via Graduate Route Visa valid till March 2028.",
  email: "darsh.bhamare.uk@gmail.com",
  linkedin: "https://linkedin.com/in/darshan-bhamare-cloud",
  resumeLabel: "/Resume.pdf",
  avatar: "/git.webp",
  avatarWebp: "/git.webp",
  avatarAvif: "/git.avif",
  phone: "+447818987884"
};

export const siteOrigin = "https://darshanbhamarecloud.vercel.app";

const normalizePath = (path = "/") => {
  if (!path) return "/";
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("/") ? path : `/${path}`;
};

export const buildAbsoluteUrl = (path = "/") => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteOrigin}${normalizePath(path)}`;
};

export const buildProjectSlug = (value = "") =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const buildProjectPath = (projectOrSlug) => {
  const slug =
    typeof projectOrSlug === "string" ? projectOrSlug : projectOrSlug?.slug;
  return `/projects/${slug}/`;
};

export const orbitIcons = [
  {
    name: "AWS",
    src: "/icons/devicon/amazonwebservices/amazonwebservices-original-wordmark.svg"
  },
  {
    name: "Linux",
    src: "/icons/devicon/linux/linux-original.svg"
  },
  {
    name: "Kubernetes",
    src: "/icons/devicon/kubernetes/kubernetes-plain.svg"
  },
  {
    name: "Terraform",
    src: "/icons/devicon/terraform/terraform-original.svg"
  }
];

export const coreStack = [
  {
    name: "AWS",
    src: "/icons/devicon/amazonwebservices/amazonwebservices-original-wordmark.svg"
  },
  {
    name: "Azure",
    src: "/icons/devicon/azure/azure-original.svg"
  },
  {
    name: "Kubernetes",
    src: "/icons/devicon/kubernetes/kubernetes-plain.svg"
  },
  {
    name: "Terraform",
    src: "/icons/devicon/terraform/terraform-original.svg"
  },
  {
    name: "Docker",
    src: "/icons/devicon/docker/docker-original.svg"
  },
  {
    name: "Jenkins",
    src: "/icons/devicon/jenkins/jenkins-original.svg"
  },
  {
    name: "Linux",
    src: "/icons/devicon/linux/linux-original.svg"
  },
  {
    name: "Ansible",
    src: "/icons/devicon/ansible/ansible-original.svg"
  },
  {
    name: "Helm",
    src: "/icons/devicon/helm/helm-original.svg"
  },
  {
    name: "Prometheus",
    src: "/icons/devicon/prometheus/prometheus-original.svg"
  },
  {
    name: "Grafana",
    src: "/icons/devicon/grafana/grafana-original.svg"
  },
  {
    name: "MongoDB",
    src: "/icons/devicon/mongodb/mongodb-original.svg"
  },
  {
    name: "GitHub Actions",
    src: "/icons/devicon/github/github-original.svg"
  },
  {
    name: "CloudWatch",
    src: "/icons/devicon/amazonwebservices/amazonwebservices-original-wordmark.svg"
  },
  {
    name: "Azure Monitor",
    src: "/icons/devicon/azure/azure-original.svg"
  },
  {
    name: "AWS MSK",
    src: "/icons/devicon/amazonwebservices/amazonwebservices-original-wordmark.svg"
  },
  {
    name: "ElasticSearch",
    src: "/icons/devicon/elasticsearch/elasticsearch-original.svg"
  },
  {
    name: "Git",
    src: "/icons/devicon/git/git-original.svg"
  }
];

export const featuredSkillsMarquee = [
  "AWS",
  "Azure",
  "Kubernetes",
  "Terraform",
  "Docker",
  "Jenkins",
  "Linux",
  "Ansible",
  "Helm",
  "Prometheus",
  "Grafana",
  "GitHub Actions"
]
  .map((name) => coreStack.find((item) => item.name === name))
  .filter(Boolean);

export const skillGroups = [
  {
    title: "Cloud Platforms",
    preview: ["AWS", "Azure", "IBM Cloud", "EKS"],
    items: [
      "AWS (EKS, MSK, EC2, S3, RDS, IAM)",
      "Azure (AKS, Functions, App Services, Storage, Databases, Security, Monitoring)",
      "IBM Cloud (Containers, Databases, DevOps, Networking, Security, Storage, Observability)"
    ]
  },
  {
    title: "Containers & Orchestration",
    preview: ["Docker", "Kubernetes", "AWS EKS", "Helm"],
    items: ["Docker", "Kubernetes", "AWS EKS", "Azure AKS", "IBM IKS", "Helm"]
  },
  {
    title: "CI/CD & Automation",
    preview: ["Jenkins", "GitHub Actions", "Terraform", "Ansible"],
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
    preview: ["AWS CloudWatch", "Grafana", "Prometheus", "Datadog"],
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
    preview: ["IAM", "AWS WAF", "Security Groups", "VPC"],
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
    preview: ["Linux", "Windows Server", "MongoDB", "PostgreSQL"],
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
    preview: ["Python", "Shell Scripting", "YAML"],
    items: ["Python", "Shell Scripting", "YAML"]
  },
  {
    title: "Collaboration & Tools",
    preview: ["Jira", "Confluence", "ServiceNow", "Git"],
    items: ["Jira", "Confluence", "ServiceNow", "FreshService", "Git"]
  },
  {
    title: "Developer Tools",
    preview: ["Git", "Docker", "VS Code", "IntelliJ"],
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
    preview: ["Java", "Python", "React", "Node.js"],
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
    preview: ["Leadership", "Problem Solving", "Team Mentoring", "Strategic Planning"],
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
    label: "Cloud and DevOps experience",
    value: "4+ years"
  },
  {
    label: "Manual work reduced with automation",
    value: "70%"
  },
  {
    label: "Faster incident detection",
    value: "35%"
  },
  {
    label: "Release cycle improved",
    value: "2 weeks to 3 days"
  }
];

export const experience = [
  {
    company:
      "Conga (Apttus Corporation) | Aress Software & Education Technologies (P) Ltd | Nashik, India",
    title: "Senior Cloud Engineer Contractor",
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
    duration: "Sep 2020 - May 2023",
    points: [
      "Deployed and managed scalable, fault-tolerant cloud infrastructure using AWS EC2, VPC, S3, RDS, IAM and Azure VMs.",
      "Configured AWS CloudWatch alerts, dashboards, and proactive monitoring for CPU, memory, disk space and system health; reduced incident detection time by 35%.",
      "Automated backup operations on Linux and Windows servers and resolved backup failures.",
      "Performed system audits, performance tuning, and disaster recovery drills, improving uptime.",
      "Created automation scripts for provisioning, patching, and monitoring workloads, reducing manual effort by 70%."
    ]
  }
];

const projectRecords = [
  {
    name: "Multi-Cloud Microservices CI/CD Pipeline",
    category: "Cloud & DevOps",
    summary:
      "Designed and optimized a multi-cloud CI/CD delivery model for microservices-based SaaS workloads, enabling faster and more reliable enterprise releases.",
    stack: [
      "Jenkins",
      "GitHub",
      "Helm",
      "Kubernetes",
      "AWS EKS",
      "Azure AKS",
      "IBM IKS",
      "CI/CD"
    ],
    highlights: [
      "Engineered multi-branch Jenkins pipelines with automated quality gates, compressing release cycles from 2 weeks to 3 days.",
      "Deployed and operated production multi-tenant microservices across AWS EKS, Azure AKS, and IBM IKS using Helm-based release management.",
      "Administered repository and branching governance to streamline Agile delivery and improve cross-team handoffs.",
      "Implemented repeatable deployment and rollback patterns to strengthen release predictability and platform stability."
    ]
  },
  {
    name: "Infrastructure as Code (IaC) Automation & Self-Healing Network",
    category: "Cloud & DevOps",
    summary:
      "Led an Infrastructure as Code transformation that automated provisioning and deployments while embedding high availability and self-healing capabilities into the platform architecture.",
    stack: [
      "Terraform",
      "Ansible",
      "Kubernetes",
      "Helm",
      "Elastic Load Balancing",
      "Auto Scaling",
      "HPA",
      "IaC"
    ],
    highlights: [
      "Automated infrastructure provisioning and deployment workflows with Terraform and Ansible, eliminating 60% of manual effort.",
      "Enforced strict environment parity across development, staging, and production using reusable IaC modules and controlled change workflows.",
      "Architected high-availability Kubernetes workloads using self-healing primitives, Elastic Load Balancing, and Auto Scaling.",
      "Implemented Horizontal Pod Autoscaling (HPA), delivering measurable gains in platform reliability and scalability during demand spikes."
    ]
  },
  {
    name: "Centralized Observability and Incident Reduction Platform",
    category: "Cloud & DevOps",
    summary:
      "Built a centralized observability and automation framework that improved operational visibility, accelerated incident response, and reinforced SLA performance.",
    stack: [
      "AWS CloudWatch",
      "Python",
      "Bash",
      "Monitoring",
      "Disaster Recovery",
      "Runbooks",
      "SLA",
      "MTTR"
    ],
    highlights: [
      "Configured CloudWatch alarms, dashboards, and proactive alerts for CPU, memory, and disk health, reducing mean incident detection time by 35%.",
      "Developed Python and Bash automation for provisioning, patching, and monitoring workflows, cutting manual workload by 70%.",
      "Led disaster recovery drills and system audits to improve operational readiness and overall uptime posture.",
      "Authored comprehensive runbooks that improved SLA adherence and reduced Mean Time To Recovery (MTTR)."
    ]
  },
  {
    name: "Debate Sessions in Higher Education",
    category: "Full Stack",
    summary:
      "Built an online MERN-stack debate platform with role-based access for students and instructors, JWT authentication, unique IDs, and AI-driven debate analytics. I completed this project as part of my MSc Cloud Computing degree to gain hands-on development experience and was awarded a distinction.",
    stack: ["MongoDB", "Express.js", "React", "Node.js", "JWT", "AI"]
  }
];

export const projects = projectRecords.map((project) => ({
  ...project,
  slug: project.slug || buildProjectSlug(project.name)
}));

export const education = [
  {
    degree: "MSc Cloud Computing",
    school: "University of Leicester | Leicester, UK",
    duration: "Sep 2024 - Jan 2026"
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
  "Hospitality Head during the Equinox event conducted by Computer Department, KKWIEER, Nashik."
];

export const architectureFlow = [
  {
    stage: "Source",
    title: "GitHub",
    detail: "Feature branches, PR reviews, policy checks"
  },
  {
    stage: "CI",
    title: "Jenkins / GitHub Actions",
    detail: "Build, unit tests, security scans"
  },
  {
    stage: "Artifact",
    title: "Docker Registry",
    detail: "Versioned images and immutable artifacts"
  },
  {
    stage: "IaC",
    title: "Terraform + Helm",
    detail: "Provision infra and manage releases"
  },
  {
    stage: "Runtime",
    title: "EKS / AKS / IKS",
    detail: "Microservices, autoscaling, self-healing"
  },
  {
    stage: "Observability",
    title: "CloudWatch + Grafana",
    detail: "Logs, metrics, alerts, SRE dashboards"
  }
];

export const galleryImages = [
  {
    src: "/gallery/bike-goa.webp",
    alt: "Riding in Goa",
    title: "Goa Rides",
    description: "Exploring the coastal roads on two wheels.",
    width: 1080,
    height: 1920
  },
  {
    src: "/gallery/go-kart.webp",
    alt: "Go-kart track",
    title: "Track Day",
    description: "Weekend go-karting session.",
    width: 1909,
    height: 1080
  },
  {
    src: "/gallery/sunset.webp",
    alt: "Sunset skyline",
    title: "City Sunset",
    description: "Stopping to catch the view over the skyline.",
    width: 4000,
    height: 2252
  },
  {
    src: "/gallery/rider.webp",
    alt: "Rider on motorcycle",
    title: "Highway Miles",
    description: "Nothing beats an open road at the end of the day.",
    width: 2502,
    height: 4032
  },
  {
    src: "/gallery/team-last-day.webp",
    alt: "Cloud Engineering Team",
    title: "The Cloud Crew",
    description: "Farewell shot with the engineering team on my last day.",
    width: 4000,
    height: 2252
  },
  {
    src: "/gallery/employee-award.webp",
    alt: "Receiving Employee of the Month award",
    title: "Employee of the Month",
    description:
      "Receiving the award from my manager, Sufiyan Khan (Principal Cloud Architect).",
    width: 3610,
    height: 2888
  },
  {
    type: "collage",
    title: "Cloud Byte Cafe",
    description:
      "Inaugurating the new company cafe alongside the Director and Head of Technology. Named it 'Cloud Byte' because, well, the Cloud is the future!",
    images: [
      {
        src: "/gallery/cafe-ribbon.webp",
        alt: "Cutting ribbon",
        width: 4000,
        height: 3000
      },
      {
        src: "/gallery/cafe-signage.webp",
        alt: "Cafe signage",
        width: 4000,
        height: 3000
      },
      {
        src: "/gallery/cafe-mgmt-1.webp",
        alt: "Management group 1",
        width: 4000,
        height: 3000
      },
      {
        src: "/gallery/cafe-mgmt-2.webp",
        alt: "Management group 2",
        width: 4000,
        height: 3000
      }
    ]
  }
];
