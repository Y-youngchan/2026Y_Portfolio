"use client";

type ProjectActionsProps = {
  title: string;
  githubUrl: string;
  projectUrl: string | null;
};

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export function ProjectActions({
  title,
  githubUrl,
  projectUrl,
}: ProjectActionsProps) {
  const showPreparingMessage = () => {
    window.alert("프로젝트 페이지를 준비 중입니다.");
  };

  return (
    <div className="project-actions">
      <a
        href={githubUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`${title} - GitHub에서 프로젝트 보기`}
      >
        GitHub에서 프로젝트 보기 <Arrow />
      </a>
      {projectUrl ? (
        <a
          href={projectUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${title} - 프로젝트 확인하기`}
        >
          프로젝트 확인하기 <Arrow />
        </a>
      ) : (
        <button
          type="button"
          data-project-status="preparing"
          aria-label={`${title} - 프로젝트 확인하기, 준비 중`}
          onClick={showPreparingMessage}
        >
          프로젝트 확인하기 <Arrow />
        </button>
      )}
    </div>
  );
}
