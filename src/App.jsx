import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  achievements,
  buildProjectPath,
  education,
  experience,
  featuredSkillsMarquee,
  galleryImages,
  highlights,
  orbitIcons,
  profile,
  projects,
  skillGroups
} from "./data";
import {
  getClarityConsentStatus,
  identifyVisitor,
  setClarityConsentStatus,
  setClarityTag,
  trackClarityEvent,
  upgradeClaritySession
} from "./clarity";
import { syncGoogleAnalyticsConsent } from "./analyticsConsent";

const navItems = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "architecture", label: "Architecture" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" }
];

const toClarityToken = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const emphasisRegex =
  /(AWS|Azure|Kubernetes|Terraform|Ansible|Jenkins|GitHub(?: Actions)?|CloudWatch|EKS|AKS|MSK|MongoDB|ElasticSearch|Docker|Helm|IBM IKS|CI\/CD|IAM|WAF|NACLs?|Security Groups?|Load Balancing|Auto Scaling|Linux|Windows|Nagios|Prometheus|Grafana|Datadog|Loki|\d+%|2 weeks|3 days)/gi;

const isEmphasisToken =
  /^(AWS|Azure|Kubernetes|Terraform|Ansible|Jenkins|GitHub(?: Actions)?|CloudWatch|EKS|AKS|MSK|MongoDB|ElasticSearch|Docker|Helm|IBM IKS|CI\/CD|IAM|WAF|NACLs?|Security Groups?|Load Balancing|Auto Scaling|Linux|Windows|Nagios|Prometheus|Grafana|Datadog|Loki|\d+%|2 weeks|3 days)$/i;

const techIconLibrary = [
  {
    id: "aws",
    keys: [
      "aws",
      "eks",
      "ec2",
      "msk",
      "rds",
      "s3",
      "cloudwatch",
      "aws cloudwatch",
      "auto scaling",
      "load balancing",
      "elastic load balancing",
      "cloudformation",
      "aws msk"
    ],
    src: "/icons/devicon/amazonwebservices/amazonwebservices-original-wordmark.svg",
    alt: "AWS"
  },
  {
    id: "azure",
    keys: ["azure", "aks", "azure monitor", "functions", "app services"],
    src: "/icons/devicon/azure/azure-original.svg",
    alt: "Azure"
  },
  {
    id: "kubernetes",
    keys: ["kubernetes", "eks", "aks", "iks"],
    src: "/icons/devicon/kubernetes/kubernetes-plain.svg",
    alt: "Kubernetes"
  },
  {
    id: "terraform",
    keys: ["terraform"],
    src: "/icons/devicon/terraform/terraform-original.svg",
    alt: "Terraform"
  },
  {
    id: "docker",
    keys: ["docker"],
    src: "/icons/devicon/docker/docker-original.svg",
    alt: "Docker"
  },
  {
    id: "jenkins",
    keys: ["jenkins", "ci/cd", "ci/cd pipelines"],
    src: "/icons/devicon/jenkins/jenkins-original.svg",
    alt: "Jenkins"
  },
  {
    id: "linux",
    keys: ["linux"],
    src: "/icons/devicon/linux/linux-original.svg",
    alt: "Linux"
  },
  {
    id: "windows",
    keys: ["windows", "active directory", "group policy"],
    src: "/icons/devicon/windows8/windows8-original.svg",
    alt: "Windows"
  },
  {
    id: "ansible",
    keys: ["ansible"],
    src: "/icons/devicon/ansible/ansible-original.svg",
    alt: "Ansible"
  },
  {
    id: "helm",
    keys: ["helm"],
    src: "/icons/devicon/helm/helm-original.svg",
    alt: "Helm"
  },
  {
    id: "prometheus",
    keys: ["prometheus"],
    src: "/icons/devicon/prometheus/prometheus-original.svg",
    alt: "Prometheus"
  },
  {
    id: "grafana",
    keys: ["grafana"],
    src: "/icons/devicon/grafana/grafana-original.svg",
    alt: "Grafana"
  },
  {
    id: "mongodb",
    keys: ["mongodb"],
    src: "/icons/devicon/mongodb/mongodb-original.svg",
    alt: "MongoDB"
  },
  {
    id: "postgresql",
    keys: ["postgresql", "sql"],
    src: "/icons/devicon/postgresql/postgresql-original.svg",
    alt: "PostgreSQL"
  },
  {
    id: "elasticsearch",
    keys: ["elasticsearch", "elk", "logstash", "kibana"],
    src: "/icons/devicon/elasticsearch/elasticsearch-original.svg",
    alt: "ElasticSearch"
  },
  {
    id: "python",
    keys: ["python"],
    src: "/icons/devicon/python/python-original.svg",
    alt: "Python"
  },
  {
    id: "java",
    keys: ["java", "junit", "core and advanced java"],
    src: "/icons/devicon/java/java-original.svg",
    alt: "Java"
  },
  {
    id: "cplusplus",
    keys: ["c/c++", "c++"],
    src: "/icons/devicon/cplusplus/cplusplus-original.svg",
    alt: "C++"
  },
  {
    id: "c",
    keys: ["programming in c", " c "],
    src: "/icons/devicon/c/c-original.svg",
    alt: "C"
  },
  {
    id: "react",
    keys: ["react"],
    src: "/icons/devicon/react/react-original.svg",
    alt: "React"
  },
  {
    id: "nodejs",
    keys: ["node.js", "nodejs", "express"],
    src: "/icons/devicon/nodejs/nodejs-original.svg",
    alt: "Node.js"
  },
  {
    id: "git",
    keys: ["git"],
    src: "/icons/devicon/git/git-original.svg",
    alt: "Git"
  },
  {
    id: "github",
    keys: ["github", "github actions"],
    src: "/icons/devicon/github/github-original.svg",
    alt: "GitHub"
  },
  {
    id: "javascript",
    keys: ["javascript"],
    src: "/icons/devicon/javascript/javascript-original.svg",
    alt: "JavaScript"
  },
  {
    id: "html5",
    keys: ["html"],
    src: "/icons/devicon/html5/html5-original.svg",
    alt: "HTML"
  },
  {
    id: "css3",
    keys: ["css"],
    src: "/icons/devicon/css3/css3-original.svg",
    alt: "CSS"
  },
  {
    id: "flask",
    keys: ["flask"],
    src: "/icons/devicon/flask/flask-original.svg",
    alt: "Flask"
  },
  {
    id: "bash",
    keys: ["shell scripting", "bash"],
    src: "/icons/devicon/bash/bash-original.svg",
    alt: "Shell"
  },
  {
    id: "yaml",
    keys: ["yaml"],
    src: "/icons/devicon/yaml/yaml-original.svg",
    alt: "YAML"
  },
  {
    id: "vscode",
    keys: ["vs code"],
    src: "/icons/devicon/vscode/vscode-original.svg",
    alt: "VS Code"
  },
  {
    id: "jetbrains",
    keys: ["pycharm", "intellij"],
    src: "/icons/devicon/jetbrains/jetbrains-original.svg",
    alt: "JetBrains"
  },
  {
    id: "eclipse",
    keys: ["eclipse"],
    src: "/icons/devicon/eclipse/eclipse-original.svg",
    alt: "Eclipse"
  },
  {
    id: "wordpress",
    keys: ["wordpress"],
    src: "/icons/devicon/wordpress/wordpress-plain.svg",
    alt: "WordPress"
  },
  {
    id: "gcp",
    keys: ["google cloud platform", "gcp"],
    src: "/icons/devicon/googlecloud/googlecloud-original.svg",
    alt: "Google Cloud"
  },
  {
    id: "jira",
    keys: ["jira"],
    src: "/icons/devicon/jira/jira-original.svg",
    alt: "Jira"
  },
  {
    id: "confluence",
    keys: ["confluence"],
    src: "/icons/devicon/confluence/confluence-original.svg",
    alt: "Confluence"
  },
  {
    id: "servicenow",
    keys: ["servicenow"],
    src: "/icons/servicenow.svg",
    alt: "ServiceNow"
  },
  {
    id: "freshservice",
    keys: ["freshservice"],
    src: "/icons/freshservice.svg",
    alt: "Freshservice"
  },
  {
    id: "ibm",
    keys: ["ibm cloud"],
    src: "/icons/external/simple-ibm.svg",
    alt: "IBM"
  },
  {
    id: "datadog",
    keys: ["datadog"],
    src: "/icons/external/simple-datadog.svg",
    alt: "Datadog"
  },
  {
    id: "loki",
    keys: ["loki"],
    src: "/icons/external/simple-grafana.svg",
    alt: "Loki"
  },
  {
    id: "nagios",
    keys: ["nagios"],
    src: "/icons/nagios.svg",
    alt: "Nagios"
  }
];

const makeInlineIcon = (svg) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const inlineFallbackIcons = {
  cloud: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#163244"/><path d="M20 42h24a8 8 0 0 0 1-16 13 13 0 0 0-25-1 9 9 0 0 0 0 17Z" fill="#8fe8d0"/></svg>`
  ),
  database: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1e2a43"/><ellipse cx="32" cy="18" rx="16" ry="7" fill="#98c6ff"/><path d="M16 18v23c0 4 7 7 16 7s16-3 16-7V18" fill="#79a9ec"/></svg>`
  ),
  security: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#243248"/><path d="M32 10 17 16v13c0 11 7 19 15 25 8-6 15-14 15-25V16L32 10Z" fill="#95e9cd"/></svg>`
  ),
  lock: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#243248"/><rect x="18" y="28" width="28" height="22" rx="6" fill="#9de9d1"/><path d="M24 28v-4a8 8 0 0 1 16 0v4" stroke="#d8f5ea" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`
  ),
  key: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#223248"/><circle cx="25" cy="30" r="10" fill="#8fdcf8"/><path d="M34 30h14l-2 3 2 3h-5l-2 3h-7z" fill="#d9f0ff"/></svg>`
  ),
  network: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1f3145"/><circle cx="20" cy="20" r="6" fill="#99c9ff"/><circle cx="44" cy="22" r="6" fill="#8fe8d0"/><circle cx="32" cy="44" r="6" fill="#c8dcff"/><path d="M25 22h13M23 24l7 15M41 24l-7 15" stroke="#dff1ff" stroke-width="3" stroke-linecap="round"/></svg>`
  ),
  firewall: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2a2f45"/><rect x="14" y="18" width="36" height="30" rx="4" fill="#9bb6ff"/><path d="M14 28h36M14 38h36M26 18v30M38 18v30" stroke="#e6eeff" stroke-width="3"/></svg>`
  ),
  globe: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#203246"/><circle cx="32" cy="32" r="17" fill="#8fdcf8"/><path d="M15 32h34M32 15a26 26 0 0 1 0 34M32 15a26 26 0 0 0 0 34" stroke="#e3f7ff" stroke-width="2.8" fill="none"/></svg>`
  ),
  transfer: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#223248"/><path d="M14 26h25l-4-4M50 38H25l4 4" stroke="#95e9cd" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  ),
  cdn: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1f2f45"/><path d="M13 22h38M13 32h30M13 42h38" stroke="#9fd9ff" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="32" r="6" fill="#8ce7c8"/></svg>`
  ),
  loadBalancer: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#213247"/><circle cx="18" cy="20" r="5" fill="#8fdcf8"/><circle cx="18" cy="44" r="5" fill="#8fdcf8"/><circle cx="46" cy="32" r="6" fill="#95e9cd"/><path d="M23 20h16M23 44h16M40 20l6 12-6 12" stroke="#dff2ff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  ),
  server: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#223247"/><rect x="14" y="16" width="36" height="14" rx="4" fill="#95c7ff"/><rect x="14" y="34" width="36" height="14" rx="4" fill="#8ce7c8"/><circle cx="22" cy="23" r="2" fill="#f6fbff"/><circle cx="22" cy="41" r="2" fill="#f6fbff"/></svg>`
  ),
  cache: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#233046"/><ellipse cx="32" cy="20" rx="14" ry="6" fill="#9de9d1"/><path d="M18 20v20c0 3 6 6 14 6s14-3 14-6V20" fill="#8bbdff"/></svg>`
  ),
  bucket: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#203145"/><path d="M18 20h28l-3 26H21z" fill="#9dc7ff"/><path d="M16 20h32" stroke="#e4f2ff" stroke-width="4" stroke-linecap="round"/></svg>`
  ),
  cluster: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#233046"/><circle cx="32" cy="16" r="5" fill="#9fd9ff"/><circle cx="18" cy="40" r="5" fill="#8ce7c8"/><circle cx="46" cy="40" r="5" fill="#8ce7c8"/><path d="M32 21v10M27 35l-7 3M37 35l7 3" stroke="#dff3ff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`
  ),
  app: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#233145"/><rect x="16" y="16" width="32" height="32" rx="8" fill="#90dff0"/><circle cx="26" cy="26" r="2" fill="#0e2f44"/><circle cx="38" cy="26" r="2" fill="#0e2f44"/><rect x="24" y="34" width="16" height="4" rx="2" fill="#0e2f44"/></svg>`
  ),
  pipeline: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1f3245"/><rect x="10" y="18" width="12" height="28" rx="3" fill="#9bc7ff"/><rect x="26" y="24" width="12" height="22" rx="3" fill="#8ce7c8"/><rect x="42" y="14" width="12" height="32" rx="3" fill="#9bc7ff"/></svg>`
  ),
  tooling: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2b3142"/><path d="M15 45h34M16 20h31M26 20v25M41 20v25" stroke="#c4d2ea" stroke-width="4" stroke-linecap="round"/></svg>`
  ),
  collaboration: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2a3241"/><circle cx="24" cy="26" r="8" fill="#9fd9ff"/><circle cx="41" cy="24" r="7" fill="#8ce7c8"/><path d="M12 48c2-7 7-11 12-11s10 4 12 11M30 48c2-6 6-9 11-9s9 3 11 9" stroke="#d8e9ff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`
  ),
  checklist: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#233146"/><rect x="16" y="14" width="32" height="36" rx="4" fill="#9ebcff"/><path d="M24 24h16M24 32h16M24 40h12M19 24l2 2 3-4M19 32l2 2 3-4" stroke="#e8f0ff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  ),
  target: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2a3241"/><circle cx="32" cy="32" r="16" fill="#96e8cf"/><circle cx="32" cy="32" r="10" fill="#3d6f83"/><circle cx="32" cy="32" r="4" fill="#f5fbff"/></svg>`
  ),
  generic: makeInlineIcon(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#293446"/><circle cx="32" cy="32" r="13" fill="#7cd9c2"/></svg>`
  )
};

const skillHeaderPreviewIcons = {
  "Cloud Platforms": [
    {
      name: "AWS",
      src: "/icons/devicon/amazonwebservices/amazonwebservices-original-wordmark.svg",
      alt: "AWS"
    },
    {
      name: "Azure",
      src: "/icons/devicon/azure/azure-original.svg",
      alt: "Azure"
    },
    {
      name: "IBM Cloud",
      src: "/icons/external/simple-ibm.svg",
      alt: "IBM Cloud"
    }
  ],
  "Containers & Orchestration": [
    {
      name: "Docker",
      src: "/icons/devicon/docker/docker-original.svg",
      alt: "Docker"
    },
    {
      name: "Kubernetes",
      src: "/icons/devicon/kubernetes/kubernetes-plain.svg",
      alt: "Kubernetes"
    },
    {
      name: "Helm",
      src: "/icons/devicon/helm/helm-original.svg",
      alt: "Helm"
    }
  ],
  "CI/CD & Automation": [
    {
      name: "Jenkins",
      src: "/icons/devicon/jenkins/jenkins-original.svg",
      alt: "Jenkins"
    },
    {
      name: "GitHub Actions",
      src: "/icons/devicon/github/github-original.svg",
      alt: "GitHub Actions"
    },
    {
      name: "Terraform",
      src: "/icons/devicon/terraform/terraform-original.svg",
      alt: "Terraform"
    },
    {
      name: "Ansible",
      src: "/icons/devicon/ansible/ansible-original.svg",
      alt: "Ansible"
    }
  ],
  "Monitoring & Reliability": [
    {
      name: "Grafana",
      src: "/icons/devicon/grafana/grafana-original.svg",
      alt: "Grafana"
    },
    {
      name: "Prometheus",
      src: "/icons/devicon/prometheus/prometheus-original.svg",
      alt: "Prometheus"
    },
    {
      name: "Datadog",
      src: "/icons/external/simple-datadog.svg",
      alt: "Datadog"
    }
  ],
  "Security & Networking": [
    {
      name: "Shield",
      src: inlineFallbackIcons.security,
      alt: "Security"
    },
    {
      name: "AWS",
      src: "/icons/devicon/amazonwebservices/amazonwebservices-original-wordmark.svg",
      alt: "AWS"
    },
    {
      name: "Network",
      src: inlineFallbackIcons.network,
      alt: "Network"
    }
  ],
  "Platforms & Databases": [
    {
      name: "Linux",
      src: "/icons/devicon/linux/linux-original.svg",
      alt: "Linux"
    },
    {
      name: "Windows",
      src: "/icons/devicon/windows8/windows8-original.svg",
      alt: "Windows"
    },
    {
      name: "MongoDB",
      src: "/icons/devicon/mongodb/mongodb-original.svg",
      alt: "MongoDB"
    },
    {
      name: "PostgreSQL",
      src: "/icons/devicon/postgresql/postgresql-original.svg",
      alt: "PostgreSQL"
    }
  ],
  "Scripting & IaC": [
    {
      name: "Python",
      src: "/icons/devicon/python/python-original.svg",
      alt: "Python"
    },
    {
      name: "Shell",
      src: "/icons/devicon/bash/bash-original.svg",
      alt: "Shell"
    },
    {
      name: "YAML",
      src: "/icons/devicon/yaml/yaml-original.svg",
      alt: "YAML"
    }
  ],
  "Collaboration & Tools": [
    {
      name: "Jira",
      src: "/icons/devicon/jira/jira-original.svg",
      alt: "Jira"
    },
    {
      name: "Confluence",
      src: "/icons/devicon/confluence/confluence-original.svg",
      alt: "Confluence"
    },
    {
      name: "Git",
      src: "/icons/devicon/git/git-original.svg",
      alt: "Git"
    }
  ],
  "Developer Tools": [
    {
      name: "Git",
      src: "/icons/devicon/git/git-original.svg",
      alt: "Git"
    },
    {
      name: "Docker",
      src: "/icons/devicon/docker/docker-original.svg",
      alt: "Docker"
    },
    {
      name: "VS Code",
      src: "/icons/devicon/vscode/vscode-original.svg",
      alt: "VS Code"
    },
    {
      name: "IntelliJ",
      src: "/icons/devicon/jetbrains/jetbrains-original.svg",
      alt: "IntelliJ"
    }
  ],
  "Languages & Frameworks": [
    {
      name: "Java",
      src: "/icons/devicon/java/java-original.svg",
      alt: "Java"
    },
    {
      name: "Python",
      src: "/icons/devicon/python/python-original.svg",
      alt: "Python"
    },
    {
      name: "React",
      src: "/icons/devicon/react/react-original.svg",
      alt: "React"
    },
    {
      name: "Node.js",
      src: "/icons/devicon/nodejs/nodejs-original.svg",
      alt: "Node.js"
    }
  ],
  "Leadership & Collaboration": [
    {
      name: "Jira",
      src: "/icons/devicon/jira/jira-original.svg",
      alt: "Jira"
    },
    {
      name: "Team",
      src: inlineFallbackIcons.collaboration,
      alt: "Team"
    },
    {
      name: "Goal",
      src: inlineFallbackIcons.target,
      alt: "Goal"
    }
  ]
};

const toSkillDisplayLabel = (label = "") => label.replace(/\s*\([^)]*\)/g, "").trim();

const exactSkillIconMap = {
  iam: { src: inlineFallbackIcons.key, alt: "IAM" },
  "iam roles/policies": { src: inlineFallbackIcons.key, alt: "IAM Roles/Policies" },
  "security groups": { src: inlineFallbackIcons.security, alt: "Security Groups" },
  nacls: { src: inlineFallbackIcons.network, alt: "NACLs" },
  acls: { src: inlineFallbackIcons.network, alt: "ACLs" },
  firewalls: { src: inlineFallbackIcons.firewall, alt: "Firewalls" },
  "ssl/tls": { src: inlineFallbackIcons.lock, alt: "SSL/TLS" },
  vpc: { src: inlineFallbackIcons.network, alt: "VPC" },
  encryption: { src: inlineFallbackIcons.lock, alt: "Encryption" },
  compliance: { src: inlineFallbackIcons.checklist, alt: "Compliance" },
  dns: { src: inlineFallbackIcons.globe, alt: "DNS" },
  ftp: { src: inlineFallbackIcons.transfer, alt: "FTP" },
  "group policy": { src: inlineFallbackIcons.checklist, alt: "Group Policy" },
  "active directory": { src: inlineFallbackIcons.network, alt: "Active Directory" },
  "windows server": {
    src: "/icons/devicon/windows8/windows8-original.svg",
    alt: "Windows Server"
  },
  "aws waf": {
    src: "/icons/devicon/amazonwebservices/amazonwebservices-original-wordmark.svg",
    alt: "AWS WAF"
  },
  "elk stack": {
    src: "/icons/devicon/elasticsearch/elasticsearch-original.svg",
    alt: "ELK Stack"
  }
};

const fallbackIconForLabel = (label = "") => {
  const value = label.toLowerCase();

  if (
    /(iam|security groups?|nacls?|acls?|firewalls?|ssl\/tls|encryption|compliance|waf)/.test(
      value
    )
  ) {
    return { src: inlineFallbackIcons.security, alt: "Security" };
  }

  if (/(group policy|active directory|windows server)/.test(value)) {
    return {
      src: "/icons/devicon/windows8/windows8-original.svg",
      alt: "Windows"
    };
  }

  if (
    /(aws|azure|cloud|eks|aks|iks|kubernetes|vpc|ec2|s3|rds|msk|cloudwatch|monitor|observability|autoscaling|load balancing|runtime)/.test(
      value
    )
  ) {
    return { src: inlineFallbackIcons.cloud, alt: "Cloud" };
  }

  if (
    /(mongo|postgres|sql|database|db|elasticsearch|elk|logstash|kibana|registry|artifact)/.test(
      value
    )
  ) {
    return { src: inlineFallbackIcons.database, alt: "Database" };
  }

  if (
    /(iam|security|waf|nacl|acl|firewall|ssl|tls|encryption|compliance|dns|ftp)/.test(
      value
    )
  ) {
    return { src: inlineFallbackIcons.security, alt: "Security" };
  }

  if (
    /(leadership|decision|problem|strategic|mentoring|adaptability|documentation|collaboration|team)/.test(
      value
    )
  ) {
    return { src: inlineFallbackIcons.collaboration, alt: "Collaboration" };
  }

  if (
    /(python|java|javascript|react|node|flask|yaml|shell|script|devops|ci\/cd|terraform|ansible|helm|jenkins|github|git|vscode|pycharm|intellij|eclipse|material-ui|wordpress|api)/.test(
      value
    )
  ) {
    return { src: inlineFallbackIcons.tooling, alt: "Tooling" };
  }

  return { src: inlineFallbackIcons.generic, alt: "Skill" };
};

const findTechIcon = (label = "") => {
  const normalized = label.toLowerCase();
  const exactIcon = exactSkillIconMap[normalized];
  if (exactIcon) return exactIcon;
  const found = techIconLibrary.find((entry) =>
    entry.keys.some((keyword) => normalized.includes(keyword))
  );
  return found || fallbackIconForLabel(label);
};

const handleIconLoadError = (event, label) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = fallbackIconForLabel(label).src;
};

const getSkillHeaderPreviewIcons = (groupTitle) => skillHeaderPreviewIcons[groupTitle] || [];

const architectureServiceIconMap = {
  "Route 53": {
    src: "/icons/external/aws-route53.svg",
    alt: "Route 53"
  },
  CloudFront: {
    src: "/icons/external/aws-cloudfront.svg",
    alt: "CloudFront"
  },
  "AWS WAF": {
    src: "/icons/external/aws-waf.svg",
    alt: "AWS WAF"
  },
  "Internet-facing ALB": {
    src: "/icons/external/aws-elb.svg",
    alt: "Application Load Balancer"
  },
  "NAT Gateway A": {
    src: "/icons/external/aws-vpc.svg",
    alt: "NAT Gateway"
  },
  "NAT Gateway B": {
    src: "/icons/external/aws-vpc.svg",
    alt: "NAT Gateway"
  },
  "Bastion Host": {
    src: "/icons/external/aws-ec2.svg",
    alt: "Bastion Host"
  },
  "EKS Managed Control Plane": {
    src: "/icons/external/aws-eks.svg",
    alt: "EKS Managed Control Plane"
  },
  "EKS Self-Managed Nodes A (EC2 ASG)": {
    src: "/icons/external/aws-ec2.svg",
    alt: "EKS Self-Managed Nodes"
  },
  "EKS Self-Managed Nodes B (EC2 ASG)": {
    src: "/icons/external/aws-ec2.svg",
    alt: "EKS Self-Managed Nodes"
  },
  "Auth Service": {
    src: "/icons/devicon/kubernetes/kubernetes-plain.svg",
    alt: "Auth Service"
  },
  "Catalog Service": {
    src: "/icons/devicon/kubernetes/kubernetes-plain.svg",
    alt: "Catalog Service"
  },
  "Cart Service": {
    src: "/icons/devicon/kubernetes/kubernetes-plain.svg",
    alt: "Cart Service"
  },
  "Payment Service": {
    src: "/icons/devicon/kubernetes/kubernetes-plain.svg",
    alt: "Payment Service"
  },
  "RDS Primary": {
    src: "/icons/external/aws-rds.svg",
    alt: "RDS Primary"
  },
  "RDS Standby": {
    src: "/icons/external/aws-rds.svg",
    alt: "RDS Standby"
  },
  "ElastiCache Redis": {
    src: "/icons/external/aws-elasticache.svg",
    alt: "ElastiCache Redis"
  },
  "Amazon S3": {
    src: "/icons/external/aws-s3.svg",
    alt: "Amazon S3"
  },
  "IAM Roles": {
    src: "/icons/external/aws-iam.svg",
    alt: "IAM Roles"
  },
  GitHub: {
    src: "/icons/devicon/github/github-original.svg",
    alt: "GitHub"
  },
  Jenkins: {
    src: "/icons/devicon/jenkins/jenkins-original.svg",
    alt: "Jenkins"
  },
  "Amazon ECR": {
    src: "/icons/external/aws-ecr.svg",
    alt: "Amazon ECR"
  },
  Terraform: {
    src: "/icons/devicon/terraform/terraform-original.svg",
    alt: "Terraform"
  },
  Helm: {
    src: "/icons/devicon/helm/helm-original.svg",
    alt: "Helm"
  },
  "Helm + Terraform": {
    src: "/icons/devicon/terraform/terraform-original.svg",
    alt: "Helm and Terraform"
  },
  "Amazon EKS": {
    src: "/icons/external/aws-eks.svg",
    alt: "Amazon EKS"
  },
  "Prometheus & Grafana": {
    src: "/icons/devicon/grafana/grafana-original.svg",
    alt: "Prometheus and Grafana"
  },
  "ELK Stack": {
    src: "/icons/devicon/elasticsearch/elasticsearch-original.svg",
    alt: "ELK Stack"
  },
  "AWS CloudWatch": {
    src: "/icons/external/aws-cloudwatch.svg",
    alt: "AWS CloudWatch"
  },
  Datadog: {
    src: "/icons/external/simple-datadog.svg",
    alt: "Datadog"
  },
  PagerDuty: {
    src: "/icons/external/simple-pagerduty.svg",
    alt: "PagerDuty"
  }
};

const architectureTrafficFlow = [
  { name: "Route 53", note: "Global DNS routing" },
  { name: "CloudFront", note: "Edge CDN caching" },
  { name: "AWS WAF", note: "L7 threat filtering" },
  { name: "Internet-facing ALB", note: "Ingress load balancing" }
];

const architectureAzZones = [
  {
    az: "Availability Zone A",
    publicSubnet: ["Internet-facing ALB", "NAT Gateway A", "Bastion Host"],
    privateSubnet: [
      "EKS Self-Managed Nodes A (EC2 ASG)",
      "Auth Service",
      "Catalog Service"
    ],
    dataSubnet: ["RDS Primary"]
  },
  {
    az: "Availability Zone B",
    publicSubnet: ["Internet-facing ALB", "NAT Gateway B"],
    privateSubnet: [
      "EKS Self-Managed Nodes B (EC2 ASG)",
      "Cart Service",
      "Payment Service"
    ],
    dataSubnet: ["RDS Standby"]
  }
];

const architectureSharedDataLayer = [
  "ElastiCache Redis",
  "Amazon S3",
  "IAM Roles"
];

const architectureCicdFlow = [
  "GitHub",
  "Jenkins",
  "Amazon ECR",
  "Terraform",
  "Helm",
  "Amazon EKS"
];

const architectureObservability = [
  {
    title: "Prometheus & Grafana",
    detail: "Metrics, SLO dashboards, autoscaling signals"
  },
  {
    title: "ELK Stack",
    detail: "Centralized Elasticsearch, Logstash, and Kibana log analytics"
  },
  {
    title: "AWS CloudWatch",
    detail: "Native log ingestion, alarms, and infrastructure telemetry"
  },
  {
    title: "Datadog",
    detail: "APM traces, latency budgets, incident triage"
  },
  {
    title: "PagerDuty",
    detail: "On-call routing, escalation policies, and incident response"
  }
];

const getArchitectureIcon = (label = "") =>
  architectureServiceIconMap[label] || findTechIcon(label) || fallbackIconForLabel(label);

const galleryPlaceholderSrc = "/gallery/placeholder-photo.svg";
const defaultGalleryImageWidth = 1600;
const defaultGalleryImageHeight = 1200;
const profileImageWidth = 900;
const profileImageHeight = 1364;
const inlineTechIconSize = 16;
const skillPreviewIconSize = 20;
const orbitIconSize = 36;
const marqueeSkills = [...featuredSkillsMarquee, ...featuredSkillsMarquee];
const contactFormInitialState = {
  name: "",
  email: "",
  company: "",
  message: ""
};

const buildContactMailtoHref = ({ name, email, company, message }) => {
  const subjectParts = ["Portfolio enquiry"];
  if (company.trim()) subjectParts.push(company.trim());

  const body = [
    `Name: ${name.trim()}`,
    `Email: ${email.trim()}`,
    company.trim() ? `Company: ${company.trim()}` : null,
    "",
    message.trim()
  ]
    .filter(Boolean)
    .join("\n");

  return `mailto:${profile.email}?subject=${encodeURIComponent(
    subjectParts.join(" | ")
  )}&body=${encodeURIComponent(body)}`;
};

const buildGalleryThumbPath = (src = "") => {
  if (typeof src !== "string") return src;
  return src.startsWith("/gallery/")
    ? src.replace("/gallery/", "/gallery/thumbs/")
    : src;
};

const handleGalleryImageError = (event, fallbackSrc = galleryPlaceholderSrc) => {
  const target = event.currentTarget;
  const hasRetried = target.dataset.retryFallback === "1";

  if (!hasRetried && fallbackSrc && target.getAttribute("src") !== fallbackSrc) {
    target.dataset.retryFallback = "1";
    target.src = fallbackSrc;
    return;
  }

  target.onerror = null;
  target.src = galleryPlaceholderSrc;
};

const GalleryOverlay = ({ title, description }) => (
  <figcaption className="gallery-overlay">
    <h3>{title}</h3>
    <p>{description}</p>
  </figcaption>
);

const openPhotoOnKeyboard = (event, onOpenPhoto, photo) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  onOpenPhoto(photo);
};

const getOptimizedImageSources = (src = "") => {
  if (typeof src !== "string") return { fallback: src, avif: null, webp: null };
  const match = src.match(/^(.*)\.(jpe?g|png|webp)$/i);
  if (!match) return { fallback: src, avif: null, webp: null };
  const basePath = match[1];
  const extension = match[2].toLowerCase();
  return {
    fallback: src,
    avif: `${basePath}.avif`,
    webp: extension === "webp" ? null : `${basePath}.webp`
  };
};

const GalleryImageCard = ({ image, onOpenPhoto }) => {
  const fullSources = getOptimizedImageSources(image.src);
  const thumbSources = getOptimizedImageSources(buildGalleryThumbPath(image.src));

  return (
    <figure className="gallery-card gallery-card--single">
      <picture>
        {(thumbSources.avif || fullSources.avif) && (
          <source srcSet={thumbSources.avif || fullSources.avif} type="image/avif" />
        )}
        {(thumbSources.webp || fullSources.webp) && (
          <source srcSet={thumbSources.webp || fullSources.webp} type="image/webp" />
        )}
        <img
          className="gallery-card-content"
          src={thumbSources.fallback || fullSources.fallback}
          alt={image.alt}
          width={image.width || defaultGalleryImageWidth}
          height={image.height || defaultGalleryImageHeight}
          loading="lazy"
          fetchpriority="low"
          decoding="async"
          onError={(event) => handleGalleryImageError(event, fullSources.fallback)}
          role="button"
          tabIndex={0}
          aria-label={`Open ${image.title}`}
          onClick={() => onOpenPhoto(image)}
          onKeyDown={(event) => openPhotoOnKeyboard(event, onOpenPhoto, image)}
        />
      </picture>
      <GalleryOverlay title={image.title} description={image.description} />
    </figure>
  );
};

const GalleryCollageCard = ({ item, onOpenPhoto }) => (
  <figure className="gallery-card gallery-card--collage">
    <div className="gallery-card-content gallery-collage-grid">
      {item.images.map((photo, index) => {
        const fullSources = getOptimizedImageSources(photo.src);
        const thumbSources = getOptimizedImageSources(buildGalleryThumbPath(photo.src));

        return (
          <button
            key={`${photo.src}-${index}`}
            type="button"
            className="gallery-collage-cell"
            aria-label={`Open ${item.title} photo ${index + 1}`}
            onClick={() => onOpenPhoto(photo)}
          >
            <picture>
              {(thumbSources.avif || fullSources.avif) && (
                <source srcSet={thumbSources.avif || fullSources.avif} type="image/avif" />
              )}
              {(thumbSources.webp || fullSources.webp) && (
                <source srcSet={thumbSources.webp || fullSources.webp} type="image/webp" />
              )}
              <img
                src={thumbSources.fallback || fullSources.fallback}
                alt={photo.alt}
                width={photo.width || defaultGalleryImageWidth}
                height={photo.height || defaultGalleryImageHeight}
                loading="lazy"
                fetchpriority="low"
                decoding="async"
                onError={(event) => handleGalleryImageError(event, fullSources.fallback)}
              />
            </picture>
          </button>
        );
      })}
    </div>
    <GalleryOverlay title={item.title} description={item.description} />
  </figure>
);

const defaultTheme = "light";

const readPreferredTheme = () => {
  if (typeof document !== "undefined") {
    const activeTheme = document.documentElement.getAttribute("data-theme");
    if (activeTheme === "light" || activeTheme === "dark") return activeTheme;
  }

  if (typeof window === "undefined") return defaultTheme;

  try {
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  } catch {
    // Fall back to system preference when storage access is blocked.
  }

  return typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : defaultTheme;
};

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState("All");
  const [skillQuery, setSkillQuery] = useState("");
  const [contactForm, setContactForm] = useState(contactFormInitialState);
  const skillSearchInputRef = useRef(null);
  const deferredSkillQuery = useDeferredValue(skillQuery);
  const [openSkillGroups, setOpenSkillGroups] = useState(() => new Set());
  const [theme, setTheme] = useState(() => readPreferredTheme());
  const [activePhoto, setActivePhoto] = useState(null);
  const [clarityConsent, setClarityConsent] = useState(undefined);
  const [hasResolvedConsent, setHasResolvedConsent] = useState(false);

  const categories = useMemo(
    () => ["All", ...new Set(projects.map((item) => item.category))],
    []
  );

  const filteredProjects = useMemo(() => {
    if (projectFilter === "All") return projects;
    return projects.filter((item) => item.category === projectFilter);
  }, [projectFilter]);

  const filteredSkillGroups = useMemo(() => {
    const query = deferredSkillQuery.trim().toLowerCase();
    if (!query) return skillGroups;

    return skillGroups
      .map((group) => {
        const titleMatch = group.title.toLowerCase().includes(query);
        if (titleMatch) return group;

        const matchedItems = group.items.filter((item) =>
          item.toLowerCase().includes(query)
        );

        if (!matchedItems.length) return null;
        return { ...group, items: matchedItems };
      })
      .filter(Boolean);
  }, [deferredSkillQuery]);

  const isSkillQueryActive = deferredSkillQuery.trim() !== "";

  const skillColumns = useMemo(() => {
    const columns = [[], []];
    const heights = [0, 0];

    filteredSkillGroups.forEach((group) => {
      const isOpen = isSkillQueryActive || openSkillGroups.has(group.title);
      const displayCount = group.items.length;
      const weight = isOpen ? 1.6 + Math.ceil(displayCount / 3) : 1.1;
      const targetCol = heights[0] <= heights[1] ? 0 : 1;

      columns[targetCol].push(group);
      heights[targetCol] += weight;
    });

    return columns;
  }, [filteredSkillGroups, isSkillQueryActive, openSkillGroups]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Ignore storage failures in restricted browsing contexts.
    }
    setClarityTag("theme", theme);
  }, [theme]);

  useEffect(() => {
    setClarityTag("project_filter", projectFilter);
  }, [projectFilter]);

  useEffect(() => {
    setClarityConsent(getClarityConsentStatus());
    setHasResolvedConsent(true);
  }, []);

  useEffect(() => {
    if (!hasResolvedConsent) return;
    syncGoogleAnalyticsConsent(clarityConsent || "denied");
  }, [clarityConsent, hasResolvedConsent]);

  useEffect(() => {
    if (!activePhoto) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setActivePhoto(null);
      trackClarityEvent("gallery_photo_closed_escape");
      setClarityTag("gallery_modal", "closed");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePhoto]);

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const handleNavClick = (targetId) => {
    trackClarityEvent(`nav_${toClarityToken(targetId)}_click`);
    setClarityTag("last_nav_target", targetId);
    identifyVisitor("portfolio-visitor", `${window.location.pathname}#${targetId}`);
    closeMobile();
  };

  const goToTop = () => {
    trackClarityEvent("nav_top_click");
    setClarityTag("last_nav_target", "top");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    trackClarityEvent(`theme_${toClarityToken(nextTheme)}_selected`);
    setClarityTag("theme", nextTheme);
  };

  const toggleMobileMenu = () => {
    const nextOpenState = !mobileOpen;
    setMobileOpen(nextOpenState);
    trackClarityEvent(nextOpenState ? "mobile_menu_opened" : "mobile_menu_closed");
  };

  const handleHeroLinkClick = (linkName) => {
    trackClarityEvent(`hero_${toClarityToken(linkName)}_click`);
    setClarityTag("last_outbound_link", linkName);
    if (linkName === "resume") upgradeClaritySession("resume_interest");
    if (linkName === "hire_me") upgradeClaritySession("contact_intent");
  };

  const handleContactLinkClick = (linkName) => {
    trackClarityEvent(`contact_${toClarityToken(linkName)}_click`);
    setClarityTag("last_contact_channel", linkName);
    upgradeClaritySession("contact_intent");
  };

  const openPhotoPreview = (photoOrSrc, alt, width, height) => {
    const selectedLabel =
      typeof photoOrSrc === "object" && photoOrSrc !== null
        ? photoOrSrc.title || photoOrSrc.alt || "gallery_photo"
        : alt || "photo_preview";

    if (typeof photoOrSrc === "object" && photoOrSrc !== null) {
      setActivePhoto({
        src: photoOrSrc.src,
        alt: photoOrSrc.alt || "Photo preview",
        width: photoOrSrc.width || defaultGalleryImageWidth,
        height: photoOrSrc.height || defaultGalleryImageHeight
      });
    } else {
      setActivePhoto({
        src: photoOrSrc,
        alt: alt || "Photo preview",
        width: width || defaultGalleryImageWidth,
        height: height || defaultGalleryImageHeight
      });
    }

    trackClarityEvent("gallery_photo_opened");
    setClarityTag("last_gallery_photo", selectedLabel);
    setClarityTag("gallery_modal", "open");
    upgradeClaritySession("gallery_engagement");
  };

  const closePhotoPreview = (source) => {
    setActivePhoto(null);
    trackClarityEvent(`gallery_photo_closed_${toClarityToken(source)}`);
    setClarityTag("gallery_modal", "closed");
  };

  const handleSkillSearchChange = (event) => {
    const nextQuery = event.target.value;
    const nextHasValue = nextQuery.trim() !== "";
    const previousHasValue = skillQuery.trim() !== "";

    if (!previousHasValue && nextHasValue) {
      trackClarityEvent("skills_search_started");
      upgradeClaritySession("skills_search_interest");
    }

    setSkillQuery(nextQuery);
    setClarityTag("skills_search_active", nextHasValue ? "yes" : "no");
  };

  const handleSkillSearchClear = () => {
    if (skillQuery.trim() === "") return;
    setSkillQuery("");
    setClarityTag("skills_search_active", "no");
    trackClarityEvent("skills_search_cleared");
    skillSearchInputRef.current?.focus();
  };

  const toggleSkillGroup = (title) => {
    trackClarityEvent("skill_group_toggled");
    setClarityTag("last_skill_group", title);
    setOpenSkillGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const expandAllSkillGroups = () => {
    setOpenSkillGroups(new Set(filteredSkillGroups.map((group) => group.title)));
    trackClarityEvent("skill_groups_expanded_all");
    setClarityTag("skill_groups_state", "expanded");
  };

  const collapseAllSkillGroups = () => {
    setOpenSkillGroups(new Set());
    trackClarityEvent("skill_groups_collapsed_all");
    setClarityTag("skill_groups_state", "collapsed");
  };

  const handleProjectFilterChange = (category) => {
    setProjectFilter(category);
    trackClarityEvent(`project_filter_${toClarityToken(category)}`);
    setClarityTag("project_filter", category);
    if (category !== "All") upgradeClaritySession("project_filter_interest");
  };

  const handleProjectClick = (projectName) => {
    trackClarityEvent("project_link_clicked");
    setClarityTag("last_project_clicked", projectName);
    upgradeClaritySession("project_view_interest");
  };

  const handleConsentChoice = (status) => {
    setClarityConsentStatus(status);
    setClarityConsent(status);
    trackClarityEvent(`cookie_consent_${toClarityToken(status)}_selected`);
  };

  const handleContactFormChange = (event) => {
    const { name, value } = event.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactFormSubmit = (event) => {
    event.preventDefault();

    trackClarityEvent("contact_form_submitted");
    setClarityTag("last_contact_channel", "contact_form");
    upgradeClaritySession("contact_intent");

    window.location.href = buildContactMailtoHref(contactForm);
  };

  const activePhotoSources = activePhoto
    ? getOptimizedImageSources(activePhoto.src)
    : null;

  const renderHighlightedPoint = (text) => {
    const parts = text.split(emphasisRegex);
    return parts.map((part, index) => {
      if (!part) return null;
      if (isEmphasisToken.test(part.trim())) {
        return <span key={`${text}-${index}`} className="exp-highlight">{part}</span>;
      }
      return <span key={`${text}-${index}`}>{part}</span>;
    });
  };

  return (
    <div className="page">
      <header className="site-header">
        <nav className={`nav ${mobileOpen ? "open" : ""}`}>
          <button type="button" className="nav-link nav-btn" onClick={goToTop}>
            Top
          </button>
          {navItems.map((item) => (
            <a
              key={item.id}
              className="nav-link"
              href={`#${item.id}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-controls">
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark and light mode"
            title="Toggle theme"
          >
            <span aria-hidden="true" suppressHydrationWarning>
              {theme === "dark" ? "☀" : "☾"}
            </span>
          </button>
        </div>

        <button
          className="menu-toggle"
          type="button"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <main>
        <section className="hero reveal">
          <div className="hero-grid">
            <div className="hero-copy-pane">
              <div className="hero-top-row">
                <p className="role-line">{profile.role}</p>
                <span className="availability-badge">{profile.location}</span>
              </div>

              <h1>{profile.name}</h1>
              <p className="hero-copy">{profile.headline}</p>
              <p className="meta strong">{profile.visaStatus}</p>

              <div className="hero-actions">
                <a href="#contact" onClick={() => handleHeroLinkClick("hire_me")}>
                  Hire Me
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleHeroLinkClick("linkedin")}
                >
                  LinkedIn
                </a>
                <a
                  href={profile.resumeLabel}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleHeroLinkClick("resume")}
                >
                  Resume
                </a>
              </div>
            </div>

            <div className="hero-photo-wrap">
              <button
                type="button"
                className="avatar-trigger"
                onClick={() =>
                  openPhotoPreview(
                    profile.avatar,
                    `${profile.name} full photo`,
                    profileImageWidth,
                    profileImageHeight
                  )
                }
                aria-label="Open full profile photo"
              >
                <div className="avatar-frame">
                  <picture>
                    {profile.avatarAvif && (
                      <source srcSet={profile.avatarAvif} type="image/avif" />
                    )}
                    {profile.avatarWebp && (
                      <source srcSet={profile.avatarWebp} type="image/webp" />
                    )}
                    <img
                      className="avatar"
                      src={profile.avatar}
                      alt={profile.name}
                      width={profileImageWidth}
                      height={profileImageHeight}
                      loading="eager"
                      decoding="async"
                      fetchpriority="high"
                    />
                  </picture>
                </div>
                <span className="avatar-hint">Click to enlarge</span>
              </button>

              {orbitIcons.map((icon, index) => (
                <span
                  key={icon.name}
                  className={`orbit-chip orbit-${index + 1}`}
                  title={icon.name}
                >
                  <img
                    src={icon.src}
                    alt={icon.name}
                    width={orbitIconSize}
                    height={orbitIconSize}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => handleIconLoadError(event, icon.name)}
                  />
                </span>
              ))}
            </div>
          </div>

          <div className="stats">
            {highlights.map((item) => (
              <article className="stat-card" key={item.label}>
                <p>{item.value}</p>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="marquee-band reveal" aria-label="Featured skills">
          <div className="marquee-band-label">
            <span>Core stack</span>
          </div>
          <div className="marquee-shell">
            <div className="marquee-track">
              {marqueeSkills.map((skill, index) => (
                <span
                  className="marquee-item"
                  key={`${skill.name}-${index}`}
                  aria-hidden={index >= featuredSkillsMarquee.length}
                >
                  <img
                    className="marquee-icon"
                    src={skill.src}
                    alt={index < featuredSkillsMarquee.length ? skill.name : ""}
                    width={22}
                    height={22}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => handleIconLoadError(event, skill.name)}
                  />
                  <span>{skill.name}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="block reveal">
          <h2>About</h2>
          <p>
            I am a Cloud Operations and DevOps Engineer with hands-on
            experience designing, automating, and operating resilient
            AWS/Azure infrastructure. My core strengths include Kubernetes
            platforms, Linux/Windows system administration, CI/CD automation
            with Terraform, Jenkins, Helm, and Ansible, and production
            observability using CloudWatch, Grafana, Prometheus, ELK, and
            Datadog.
          </p>
        </section>

        <section id="skills" className="block reveal">
          <h2>Skills Directory</h2>
          <p className="section-intro">
            Browse categories and expand each section to see the complete tool
            stack.
          </p>

          <div className="skills-toolbar">
            <div className="skill-search-wrap">
              <input
                ref={skillSearchInputRef}
                type="text"
                id="skill-search"
                name="skillSearch"
                className="skill-search"
                value={skillQuery}
                onChange={handleSkillSearchChange}
                placeholder="Search skills..."
                aria-label="Search tools and technologies"
              />
              {skillQuery.trim() !== "" && (
                <button
                  type="button"
                  className="skill-search-clear"
                  aria-label="Clear skills search"
                  onClick={handleSkillSearchClear}
                >
                  x
                </button>
              )}
            </div>
            <div className="skills-actions">
              <button type="button" onClick={expandAllSkillGroups}>
                Expand all
              </button>
              <button type="button" onClick={collapseAllSkillGroups}>
                Collapse all
              </button>
            </div>
          </div>

          <div className="skill-grid">
            {skillColumns.map((column, columnIndex) => (
              <div className="skill-column" key={`skill-column-${columnIndex}`}>
                {column.map((group) => {
                  const isOpen =
                    isSkillQueryActive || openSkillGroups.has(group.title);
                  const previewIcons = getSkillHeaderPreviewIcons(group.title);

                  return (
                    <article
                      className="skill-group"
                      data-skill-group={group.title}
                      key={group.title}
                    >
                      <button
                        type="button"
                        className={`skill-group-toggle ${isOpen ? "open" : ""}`}
                        onClick={() => toggleSkillGroup(group.title)}
                      >
                        <span className="skill-group-title">{group.title}</span>

                        <span className="skill-group-meta">
                          <span
                            className={`skill-preview-icons ${isOpen ? "hidden" : ""}`}
                            aria-hidden={isOpen}
                          >
                            {previewIcons.map((icon) => {
                              return (
                                <span
                                  className="skill-preview-icon"
                                  key={`${group.title}-preview-${icon.name}`}
                                  title={icon.name}
                                >
                                  <img
                                    src={icon.src}
                                    alt={icon.alt}
                                    width={skillPreviewIconSize}
                                    height={skillPreviewIconSize}
                                    loading="lazy"
                                    decoding="async"
                                    onError={(event) =>
                                      handleIconLoadError(event, icon.name)
                                    }
                                  />
                                </span>
                              );
                            })}
                          </span>

                          <span className={`skill-chevron ${isOpen ? "open" : ""}`}>
                            ▾
                          </span>
                        </span>
                      </button>

                      {isOpen && (
                        <div className="skill-items open">
                          {group.items.map((item) => {
                            const displayLabel = toSkillDisplayLabel(item);
                            const icon = findTechIcon(displayLabel);
                            return (
                              <span
                                className="chip with-icon"
                                key={`${group.title}-${item}`}
                                title={item}
                              >
                                <img
                                  className="inline-tech-icon"
                                  src={icon.src}
                                  alt={icon.alt}
                                  width={inlineTechIconSize}
                                  height={inlineTechIconSize}
                                  loading="lazy"
                                  decoding="async"
                                  onError={(event) =>
                                    handleIconLoadError(event, displayLabel)
                                  }
                                />
                                <span>{displayLabel}</span>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        <section id="experience" className="block reveal">
          <h2>Experience</h2>
          <div className="timeline">
            {experience.map((item) => (
              <article className="timeline-card" key={item.company + item.title}>
                <div className="exp-head">
                  <div>
                    <h3>{item.title}</h3>
                    <p className="exp-company">{item.company}</p>
                  </div>
                  <span className="exp-duration">{item.duration}</span>
                </div>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{renderHighlightedPoint(point)}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="architecture" className="block reveal">
          <h2>Infrastructure Architecture</h2>
          <p className="section-intro">
            High-availability AWS reference architecture for secure, scalable,
            and observable microservices in production.
          </p>

          <div className="architecture-intro-card">
            <p>
              A{" "}
              <span className="architecture-keyword">highly available</span>,
              Multi-AZ microservices blueprint showcasing my approach to
              resilient cloud infrastructure. Designed for{" "}
              <span className="architecture-keyword">Zero-Downtime</span>{" "}
              scalability, it integrates an automated Terraform &amp; Jenkins
              CI/CD pipeline with a comprehensive ELK &amp; Datadog observability
              stack, demonstrating a secure and optimized{" "}
              <span className="architecture-keyword">Full-Lifecycle</span>{" "}
              production environment.
            </p>
          </div>

          <div className="architecture-overview">
            <article className="architecture-edge-lane">
              <h3>Global Ingress Flow</h3>
              <div className="architecture-lane-track">
                {architectureTrafficFlow.map((service, index) => {
                  const icon = getArchitectureIcon(service.name);
                  return (
                    <div className="architecture-flow-step" key={service.name}>
                      <div className="architecture-service-card">
                        <img
                          className="inline-tech-icon"
                          src={icon.src}
                          alt={icon.alt}
                          width={inlineTechIconSize}
                          height={inlineTechIconSize}
                          loading="lazy"
                          decoding="async"
                          onError={(event) =>
                            handleIconLoadError(event, service.name)
                          }
                        />
                        <div>
                          <strong>{service.name}</strong>
                          <span>{service.note}</span>
                        </div>
                      </div>
                      {index < architectureTrafficFlow.length - 1 && (
                        <span className="architecture-flow-arrow" aria-hidden="true">
                          ➜
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>

            <div className="architecture-layout">
              <article className="architecture-vpc-shell">
                <div className="architecture-vpc-head">
                  <div>
                    <h3>Primary Region VPC (Multi-AZ)</h3>
                    <p>
                      Public, private application, and dedicated data subnets
                      across two availability zones.
                    </p>
                  </div>
                  <span className="architecture-vpc-badge">
                    High Availability Design
                  </span>
                </div>

                <div className="architecture-control-plane">
                  <span className="architecture-subnet-label">
                    Managed Control Plane
                  </span>
                  <div className="architecture-service-card architecture-service-card--wide">
                    <img
                      className="inline-tech-icon"
                      src={getArchitectureIcon("EKS Managed Control Plane").src}
                      alt={getArchitectureIcon("EKS Managed Control Plane").alt}
                      width={inlineTechIconSize}
                      height={inlineTechIconSize}
                      loading="lazy"
                      decoding="async"
                      onError={(event) =>
                        handleIconLoadError(event, "EKS Managed Control Plane")
                      }
                    />
                    <div>
                      <strong>EKS Managed Control Plane</strong>
                      <span>
                        Kubernetes API, scheduling, and cluster governance for
                        distributed microservices.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="architecture-az-grid">
                  {architectureAzZones.map((zone) => (
                    <article className="architecture-az-card" key={zone.az}>
                      <h4>{zone.az}</h4>

                      <div className="architecture-subnet-grid">
                        <section className="architecture-subnet architecture-subnet-public">
                          <span className="architecture-subnet-label">
                            Public Subnet
                          </span>
                          <div className="architecture-item-list">
                            {zone.publicSubnet.map((service) => {
                              const icon = getArchitectureIcon(service);
                              return (
                                <div className="architecture-item" key={service}>
                                  <img
                                    className="inline-tech-icon"
                                    src={icon.src}
                                    alt={icon.alt}
                                    width={inlineTechIconSize}
                                    height={inlineTechIconSize}
                                    loading="lazy"
                                    decoding="async"
                                    onError={(event) =>
                                      handleIconLoadError(event, service)
                                    }
                                  />
                                  <strong>{service}</strong>
                                </div>
                              );
                            })}
                          </div>
                        </section>

                        <section className="architecture-subnet architecture-subnet-private">
                          <span className="architecture-subnet-label">
                            Private App Subnet
                          </span>
                          <div className="architecture-item-list">
                            {zone.privateSubnet.map((service) => {
                              const icon = getArchitectureIcon(service);
                              return (
                                <div className="architecture-item" key={service}>
                                  <img
                                    className="inline-tech-icon"
                                    src={icon.src}
                                    alt={icon.alt}
                                    width={inlineTechIconSize}
                                    height={inlineTechIconSize}
                                    loading="lazy"
                                    decoding="async"
                                    onError={(event) =>
                                      handleIconLoadError(event, service)
                                    }
                                  />
                                  <strong>{service}</strong>
                                </div>
                              );
                            })}
                          </div>
                        </section>

                        <section className="architecture-subnet architecture-subnet-data">
                          <span className="architecture-subnet-label">
                            Data Subnet
                          </span>
                          <div className="architecture-item-list">
                            {zone.dataSubnet.map((service) => {
                              const icon = getArchitectureIcon(service);
                              return (
                                <div className="architecture-item" key={service}>
                                  <img
                                    className="inline-tech-icon"
                                    src={icon.src}
                                    alt={icon.alt}
                                    width={inlineTechIconSize}
                                    height={inlineTechIconSize}
                                    loading="lazy"
                                    decoding="async"
                                    onError={(event) =>
                                      handleIconLoadError(event, service)
                                    }
                                  />
                                  <strong>{service}</strong>
                                </div>
                              );
                            })}
                          </div>
                        </section>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="architecture-shared-layer">
                  <span className="architecture-subnet-label">
                    Shared Data & Access Layer
                  </span>
                  <div className="architecture-shared-grid">
                    {architectureSharedDataLayer.map((service) => {
                      const icon = getArchitectureIcon(service);
                      return (
                        <div className="architecture-item" key={service}>
                          <img
                            className="inline-tech-icon"
                            src={icon.src}
                            alt={icon.alt}
                            width={inlineTechIconSize}
                            height={inlineTechIconSize}
                            loading="lazy"
                            decoding="async"
                            onError={(event) =>
                              handleIconLoadError(event, service)
                            }
                          />
                          <strong>{service}</strong>
                        </div>
                      );
                    })}
                  </div>
                  <p className="architecture-vpc-note">
                    The internet-facing ALB spans both public subnets and
                    forwards traffic to private EKS workloads. RDS runs in
                    Multi-AZ mode with primary/standby failover. Redis
                    accelerates reads and sessions, S3 stores durable assets,
                    and IAM roles enforce least-privilege access.
                  </p>
                </div>
              </article>

              <aside className="architecture-side-panels">
                <article className="architecture-panel">
                  <h3>Integrated DevOps Pipeline</h3>
                  <p>
                    Automated delivery from source to Kubernetes runtime using
                    policy-driven builds and infrastructure-as-code releases.
                  </p>
                  <div className="architecture-mini-flow">
                    {architectureCicdFlow.map((stage, index) => {
                      const icon = getArchitectureIcon(stage);
                      return (
                        <div className="architecture-mini-step" key={stage}>
                          <div className="architecture-item architecture-pipeline-item">
                            <img
                              className="inline-tech-icon"
                              src={icon.src}
                              alt={icon.alt}
                              width={inlineTechIconSize}
                              height={inlineTechIconSize}
                              loading="lazy"
                              decoding="async"
                              onError={(event) =>
                                handleIconLoadError(event, stage)
                              }
                            />
                            <strong>{stage}</strong>
                          </div>
                          {index < architectureCicdFlow.length - 1 && (
                            <span className="architecture-mini-arrow" aria-hidden="true">
                              ↓
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </article>

                <article className="architecture-panel">
                  <h3>Observability & SRE</h3>
                  <p>
                    Metrics, logs, and tracing are wired end-to-end for
                    proactive incident response and reliability engineering.
                  </p>
                  <div className="architecture-observability-grid">
                    {architectureObservability.map((stack) => {
                      const icon = getArchitectureIcon(stack.title);
                      return (
                        <div className="architecture-observability-item" key={stack.title}>
                          <div className="architecture-observability-title">
                            <img
                              className="inline-tech-icon"
                              src={icon.src}
                              alt={icon.alt}
                              width={inlineTechIconSize}
                              height={inlineTechIconSize}
                              loading="lazy"
                              decoding="async"
                              onError={(event) =>
                                handleIconLoadError(event, stack.title)
                              }
                            />
                            <strong>{stack.title}</strong>
                          </div>
                          <span>{stack.detail}</span>
                        </div>
                      );
                    })}
                  </div>
                </article>
              </aside>
            </div>
          </div>
        </section>

        <section id="projects" className="block reveal">
          <div className="section-head">
            <h2>Projects</h2>
            <div className="filters">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleProjectFilterChange(category)}
                  className={projectFilter === category ? "active" : ""}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="project-grid">
            {filteredProjects.map((item) => (
              <article className="project-card" key={item.name}>
                <h3>{item.name}</h3>
                <p>{item.summary}</p>
                <div className="chip-wrap">
                  {item.stack.map((tool) => {
                    const icon = findTechIcon(tool);
                    return (
                      <span className="chip ghost with-icon" key={tool}>
                        {icon && (
                          <img
                            className="inline-tech-icon"
                            src={icon.src}
                            alt={icon.alt}
                            width={inlineTechIconSize}
                            height={inlineTechIconSize}
                            loading="lazy"
                            decoding="async"
                            onError={(event) => handleIconLoadError(event, tool)}
                          />
                        )}
                        <span>{tool}</span>
                      </span>
                    );
                  })}
                </div>
                {item.highlights?.length > 0 && (
                  <ul className="project-highlights">
                    {item.highlights.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
                <div className="project-card-actions">
                  <a
                    href={buildProjectPath(item)}
                    onClick={() => handleProjectClick(item.name)}
                  >
                    View Case Study
                  </a>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleProjectClick(item.name)}
                    >
                      Live Project
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="education" className="block reveal">
          <h2>Education</h2>
          <div className="timeline">
            {education.map((item) => (
              <article className="timeline-card" key={item.degree}>
                <h3>{item.degree}</h3>
                <p className="meta">
                  {item.school} | {item.duration}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="block reveal">
          <h2>Achievements</h2>
          <ul className="plain-list">
            {achievements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="gallery" className="block reveal gallery-section">
          <h2>Beyond Work</h2>
          <p className="section-intro">
            A quick snapshot of moments outside engineering (Click to view the photos).
          </p>

          <div className="gallery-strip" role="list" aria-label="Beyond Work image gallery">
            {galleryImages.map((image, index) => (
              <div
                className="gallery-strip-item"
                role="listitem"
                key={`${image.type || "image"}-${image.title}-${index}`}
              >
                {image.type === "collage" ? (
                  <GalleryCollageCard item={image} onOpenPhoto={openPhotoPreview} />
                ) : (
                  <GalleryImageCard image={image} onOpenPhoto={openPhotoPreview} />
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="block reveal contact">
          <div className="contact-head">
            <div>
              <h2>Contact</h2>
              <p>
                Open to full-time opportunities, contract projects, and
                technical collaborations.
              </p>
            </div>
            <div className="contact-links">
              <a
                className="contact-link"
                href={`tel:${profile.phone}`}
                onClick={() => handleContactLinkClick("call")}
              >
                Call
              </a>
              <a
                className="contact-link"
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleContactLinkClick("linkedin")}
              >
                LinkedIn
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleContactFormSubmit}>
            <div className="contact-form-grid">
              <label className="contact-field" htmlFor="contact-name">
                <span>Name</span>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={contactForm.name}
                  onChange={handleContactFormChange}
                  autoComplete="name"
                  required
                />
              </label>

              <label className="contact-field" htmlFor="contact-email">
                <span>Email</span>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={contactForm.email}
                  onChange={handleContactFormChange}
                  autoComplete="email"
                  required
                />
              </label>

              <label className="contact-field" htmlFor="contact-company">
                <span>Company</span>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  value={contactForm.company}
                  onChange={handleContactFormChange}
                  autoComplete="organization"
                  placeholder="Optional"
                />
              </label>

              <label className="contact-field contact-field-full" htmlFor="contact-message">
                <span>Message</span>
                <textarea
                  id="contact-message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactFormChange}
                  rows={6}
                  placeholder="Tell me about the role, project, or problem you want help with."
                  required
                />
              </label>
            </div>

            <div className="contact-form-footer">
              <p className="contact-helper">
                Submitting opens your default email app with the message
                prefilled.
              </p>
              <button type="submit" className="contact-submit">
                Send Enquiry
              </button>
            </div>
          </form>
        </section>
      </main>

      {hasResolvedConsent && !clarityConsent && (
        <aside className="cookie-consent" role="dialog" aria-live="polite">
          <p>
            We use Clarity, Vercel Web Analytics, and Google Analytics cookies
            to improve the portfolio experience. You can accept or decline
            analytics tracking.
          </p>
          <div className="cookie-consent-actions">
            <button type="button" onClick={() => handleConsentChoice("granted")}>
              Accept
            </button>
            <button type="button" onClick={() => handleConsentChoice("denied")}>
              Decline
            </button>
          </div>
        </aside>
      )}

      {activePhoto && (
        <div
          className="photo-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
          onClick={() => closePhotoPreview("overlay")}
        >
          <button
            type="button"
            className="photo-close"
            aria-label="Close photo preview"
            onClick={(event) => {
              event.stopPropagation();
              closePhotoPreview("button");
            }}
          >
            ×
          </button>
          <picture>
            {activePhotoSources?.avif && (
              <source srcSet={activePhotoSources.avif} type="image/avif" />
            )}
            {activePhotoSources?.webp && (
              <source srcSet={activePhotoSources.webp} type="image/webp" />
            )}
            <img
              className="photo-preview"
              src={activePhotoSources?.fallback || activePhoto.src}
              alt={activePhoto.alt}
              width={activePhoto.width || defaultGalleryImageWidth}
              height={activePhoto.height || defaultGalleryImageHeight}
              loading="eager"
              decoding="async"
              onError={handleGalleryImageError}
              onClick={(event) => event.stopPropagation()}
            />
          </picture>
        </div>
      )}
    </div>
  );
}

export default App;
