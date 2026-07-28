export const navigationItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Vision", href: "#vision" },
  { label: "Contact", href: "#contact" },
] as const;

export const strengths = [
  {
    number: "01",
    title: "인과관계를 파악하는 힘",
    source: "세무회계학 전공",
    description: "숫자와 정보의 흐름을 따라가며 문제의 원인과 결과를 구조적으로 바라봅니다.",
  },
  {
    number: "02",
    title: "사용자의 필요를 읽는 힘",
    source: "홀 매니저 경험",
    description: "고객의 요구를 관찰하고 서비스에 반영하며 더 나은 경험을 만드는 법을 배웠습니다.",
  },
  {
    number: "03",
    title: "함께 해결하는 힘",
    source: "안전관리자 경험",
    description: "업무를 빠르게 파악하고 관계자와 정확히 소통하며 해결책을 조율해 왔습니다.",
  },
] as const;

export const skillGroups = [
  { title: "Front-End", skills: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React"] },
  { title: "Back-End", skills: ["Python", "Flask", "SQLAlchemy", "REST API"] },
  { title: "AI / Data", skills: ["Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "OpenAI API"] },
  { title: "DB & Deploy", skills: ["SQLite", "Supabase/PostgreSQL", "Streamlit", "Docker"] },
  { title: "Collaboration", skills: ["Git", "GitHub", "VS Code", "Figma"] },
] as const;

export type Project = {
  number: string;
  title: string;
  type: string;
  description: string;
  contribution: readonly string[];
  githubUrl: string;
  projectUrl: string | null;
  accent: "blue" | "violet" | "navy" | "sky";
  techStack?: readonly string[];
  chatbot?: readonly string[];
  apiIntegration?: readonly string[];
  models?: readonly string[];
  methods?: readonly string[];
};

export const projects = [
  {
    number: "01",
    title: "Trading",
    type: "팀 프로젝트",
    description: "챗봇부터 프론트엔드, 백엔드, QA까지 서비스 전반을 경험한 주식 정보 웹 프로젝트입니다.",
    contribution: ["프론트엔드", "백엔드", "챗봇", "QA"],
    techStack: ["React", "Vite", "Tailwind CSS", "Python", "Flask", "Supabase"],
    chatbot: ["OpenAI", "LangChain", "LangGraph", "RAG", "Tool Calling"],
    apiIntegration: ["KIS", "Toss", "Coinone", "Binance", "Naver News", "Finnhub", "DART", "Tavily"],
    githubUrl: "https://github.com/Y-youngchan/Trading",
    projectUrl: "https://trading-lake-ten.vercel.app/",
    accent: "blue",
  },
  {
    number: "02",
    title: "영화 예매 사이트",
    type: "팀 프로젝트",
    description: "화면 구현부터 서버 기능과 데이터베이스 연결까지 예매 흐름을 완성한 팀 프로젝트입니다.",
    contribution: ["프론트엔드", "백엔드", "DB 연결"],
    githubUrl: "https://github.com/Y-youngchan/movie_260407",
    projectUrl: null,
    accent: "violet",
  },
  {
    number: "03",
    title: "계절별 감기약 수요 예측",
    type: "팀 프로젝트",
    description: "계절에 따른 감기약 수요를 예측하는 머신러닝·딥러닝 모델을 이끌고 서비스로 구현했습니다.",
    contribution: ["팀장", "기획", "데이터 전처리", "모델 학습 및 비교", "서비스 구현"],
    techStack: ["Python", "Pandas", "NumPy", "Scikit-learn", "XGBoost", "Streamlit"],
    models: ["Random Forest", "XGBoost", "Ridge", "Lasso"],
    methods: ["Grid Search", "Optuna", "Bagging", "Voting", "Boosting", "Stacking", "혼합 앙상블"],
    githubUrl: "https://github.com/Drug2026/Drug_main",
    projectUrl: "https://huggingface.co/spaces/yyc1327/DrugMain",
    accent: "navy",
  },
  {
    number: "04",
    title: "북스토어",
    type: "첫 개인 프로젝트",
    description: "HTML, CSS, JavaScript의 기본기를 바탕으로 직접 설계하고 카카오 검색 OPEN API를 사용하여 완성한 첫 웹 프로젝트입니다.",
    contribution: ["기획", "UI 구현", "API 연동"],
    techStack: ["HTML", "CSS", "JavaScript", "Kakao Search API"],
    githubUrl: "https://github.com/Y-youngchan/bookstore",
    projectUrl: null,
    accent: "sky",
  },
] as const satisfies readonly Project[];
