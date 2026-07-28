import { MagneticLink } from "./components/magnetic-link";
import { PointerGlow } from "./components/pointer-glow";
import { ProjectCard } from "./components/project-card";
import { ScrollReveal } from "./components/scroll-reveal";
import { SiteNavigation } from "./components/site-navigation";
import { projects, skillGroups, strengths } from "./data/portfolio-data";

export const dynamic = "force-static";

const githubUrl = "https://github.com/Y-youngchan";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <>
      <SiteNavigation />
      <ScrollReveal />
      <PointerGlow />

      <main className="site-content" id="top">
        <section className="hero section-shell hero-sequence" aria-labelledby="hero-title">
          <div className="hero-kicker">YU YOUNGCHAN · DIGITAL PORTFOLIO</div>
          <h1 className="hero-korean" id="hero-title">
            <span className="hero-line-mask"><span className="hero-line-inner">무에서 유를 창조하는</span></span>
            <span className="hero-line-mask"><em className="hero-line-inner">성취감을 알아버렸습니다.</em></span>
          </h1>
          <div className="hero-bottom">
            <p>도전하고 경험하며 성취하는 지원자 <strong>유영찬</strong>입니다.</p>
            <div className="hero-actions">
              <MagneticLink className="button button-primary" href="#projects">
                SCROLL TO EXPLORE ↓
              </MagneticLink>
            </div>
          </div>
          <div className="hero-orbit" aria-hidden="true">
            <span>WEB</span><span>FRONT-END</span><span>UI/UX</span><span>PLANNING</span>
          </div>
        </section>

        <section className="role-marquee" aria-label="희망 직무">
          <div className="role-marquee-track">
            <div className="role-marquee-set">
              <span>WEB DEVELOPMENT</span><i>✦</i><span>FRONT-END</span><i>✦</i>
              <span>UI/UX DESIGN</span><i>✦</i><span>WEB SERVICE PLANNING</span><i>✦</i>
            </div>
            <div className="role-marquee-set" aria-hidden="true">
              <span>WEB DEVELOPMENT</span><i>✦</i><span>FRONT-END</span><i>✦</i>
              <span>UI/UX DESIGN</span><i>✦</i><span>WEB SERVICE PLANNING</span><i>✦</i>
            </div>
            <div className="role-marquee-set" aria-hidden="true">
              <span>WEB DEVELOPMENT</span><i>✦</i><span>FRONT-END</span><i>✦</i>
              <span>UI/UX DESIGN</span><i>✦</i><span>WEB SERVICE PLANNING</span><i>✦</i>
            </div>
            <div className="role-marquee-set" aria-hidden="true">
              <span>WEB DEVELOPMENT</span><i>✦</i><span>FRONT-END</span><i>✦</i>
              <span>UI/UX DESIGN</span><i>✦</i><span>WEB SERVICE PLANNING</span><i>✦</i>
            </div>
          </div>
        </section>

        <section className="section-shell section-grid" id="about" aria-labelledby="about-title">
          <div className="section-heading reveal" data-reveal="up">
            <span className="eyebrow">01 · ABOUT</span><h2 id="about-title">왜 개발자인가?</h2>
          </div>
          <div className="about-copy reveal reveal-delay-1" data-reveal="up">
            <p className="lead">AI가 모든 분야에 관여하는 미래에<br />제 자신을 걸어보기로 했습니다.</p>
            <p>익숙한 길을 벗어나 새로운 기술을 배우고, 아이디어가 실제 서비스가 되는 과정을 경험하며 개발자로의 가능성을 확신했습니다.</p>
          </div>
          <div className="strength-list">
            {strengths.map((strength, index) => (
              <article
                key={strength.number}
                className={`strength-card reveal reveal-delay-${index}`}
                data-reveal="up"
              >
                <span>{strength.number}</span>
                <div><small>{strength.source}</small><h3>{strength.title}</h3><p>{strength.description}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="skills-section" id="skills" aria-labelledby="skills-title">
          <div className="section-shell">
            <div className="section-heading horizontal reveal" data-reveal="up">
              <span className="eyebrow">02 · SKILLS</span><h2 id="skills-title">불가능이 사라진 사회에서 서비스를 만듭니다.</h2>
            </div>
            <div className="skills-grid">
              {skillGroups.map((group, index) => (
                <article
                  className={`skill-group reveal reveal-delay-${index % 3}`}
                  data-reveal="up"
                  key={group.title}
                >
                  <span>0{index + 1}</span><h3>{group.title}</h3>
                  <ul>{group.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell projects-section" id="projects" aria-labelledby="projects-title">
          <div className="section-heading horizontal reveal" data-reveal="up">
            <span className="eyebrow">03 · SELECTED WORK</span><h2 id="projects-title">프로젝트로 증명한 성장의 기록</h2>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <ProjectCard
                project={project}
                key={project.number}
                revealDelay={index % 2}
              />
            ))}
          </div>
        </section>

        <section className="work-style" id="work-style" aria-labelledby="work-style-title">
          <div className="section-shell work-style-inner">
            <span className="eyebrow light">04 · HOW I WORK</span>
            <blockquote
              className="reveal"
              data-reveal="up"
              id="work-style-title"
            >
              “무지는 죄가 아니다.<br /><em className="work-style-highlight">알려 하지 않는 것이 죄다.</em>”
            </blockquote>
            <p>모를 수 있습니다. 해결이 어려울 수도 있습니다.<br />혼자 멈추지 않고 동료와 같이 알아가며 끝까지 해결하겠습니다.</p>
          </div>
        </section>

        <section className="section-shell vision-section" id="vision" aria-labelledby="vision-title">
          <div className="section-heading reveal" data-reveal="up">
            <span className="eyebrow">05 · VISION</span><h2 id="vision-title">다른 배경이 만드는 새로운 관점</h2>
          </div>
          <p className="vision-copy reveal reveal-delay-1" data-reveal="up">
            비전공이라는 배경은 저의 약점이 아니라, <strong className="vision-highlight">다양한 관점으로 문제를 바라보고 새로운 기술을 빠르게 익힐 수 있는 힘</strong>이라고 믿습니다.
            사용자에게 필요한 경험을 고민하고, 아이디어를 실제 웹서비스로 구현하며 함께 성장하는 개발자가 되겠습니다.
          </p>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="section-shell contact-inner">
            <span className="eyebrow light">06 · CONTACT</span>
            <h2 id="contact-title">함께 만들 다음 서비스를<br />기다리고 있습니다.</h2>
            <div className="contact-links">
              <a href="mailto:sunhama2000@naver.com"><small>EMAIL</small>sunhama2000@naver.com <Arrow /></a>
              <a href={githubUrl} target="_blank" rel="noreferrer"><small>GITHUB</small>github.com/Y-youngchan <Arrow /></a>
            </div>
            <footer><span>© 2026 YU YOUNGCHAN</span><a href="#top">BACK TO TOP ↑</a></footer>
          </div>
        </section>
      </main>
    </>
  );
}
