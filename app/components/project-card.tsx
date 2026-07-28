"use client";

import { useState } from "react";

import type { Project } from "../data/portfolio-data";
import { ProjectActions } from "./project-actions";

function DetailGroup({
  items,
  label,
}: {
  items: readonly string[];
  label: string;
}) {
  return (
    <section className="project-detail-group">
      <h4>{label}</h4>
      <ul aria-label={label}>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <article className={`project-card project-${project.accent}`}>
      <div
        className="project-card-flip-zone"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <div className={`project-card-inner${isFlipped ? " is-flipped" : ""}`}>
          <div
            className="project-card-face project-card-front"
            aria-hidden={isFlipped}
          >
            <div className="project-top">
              <span className="project-number">{project.number}</span>
              <small>{project.type}</small>
            </div>
            <div className="project-body">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          </div>

          <div
            className="project-card-face project-card-back"
            aria-hidden={!isFlipped}
          >
            <DetailGroup label="CONTRIBUTION" items={project.contribution} />
            {project.techStack && (
              <DetailGroup label="TECH STACK" items={project.techStack} />
            )}
            {project.database && (
              <DetailGroup label="DATABASE" items={project.database} />
            )}
            {project.chatbot && (
              <DetailGroup label="CHATBOT" items={project.chatbot} />
            )}
            {project.apiIntegration && (
              <DetailGroup label="API INTEGRATION" items={project.apiIntegration} />
            )}
            {project.deployment && (
              <DetailGroup label="DEPLOYMENT" items={project.deployment} />
            )}
            {project.models && (
              <DetailGroup label="MODELING" items={project.models} />
            )}
            {project.methods && (
              <DetailGroup label="METHODS" items={project.methods} />
            )}
          </div>
        </div>
      </div>

      <button
        className="project-card-toggle"
        type="button"
        aria-label={`${project.title} - ${isFlipped ? "프로젝트 소개 보기" : "기술 상세 보기"}`}
        aria-pressed={isFlipped}
        onClick={() => setIsFlipped((value) => !value)}
      >
        <span>{isFlipped ? "프로젝트 소개 보기" : "기술 상세 보기"}</span>
        <span aria-hidden="true">↻</span>
      </button>

      <ProjectActions
        title={project.title}
        githubUrl={project.githubUrl}
        projectUrl={project.projectUrl}
      />
    </article>
  );
}
