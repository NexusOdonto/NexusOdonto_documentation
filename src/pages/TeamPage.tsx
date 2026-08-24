import { useState } from "react";
import { getDocsBySection } from "../lib/loadDocs";
import { MailIcon, CodeIcon, GlobeIcon, SearchIcon } from "../components/Icons";

const INITIAL_TEAM = [
  {
    id: "elena-torres",
    name: "Dra. Elena Torres",
    role: "CLINICAL DIRECTOR",
    category: "Clinical",
    status: "ACTIVO",
    bio: "Supervising clinical workflows and odontological compliance standards.",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80",
    email: "elena.torres@nexusodonto.com",
  },
  {
    id: "marcos-silva",
    name: "Ing. Marcos Silva",
    role: "LEAD ARCHITECT",
    category: "Engineering",
    status: "ACTIVO",
    bio: "Architecting the .NET backend and CQRS microservices architecture.",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
    email: "marcos.silva@nexusodonto.com",
  },
  {
    id: "sofia-chen",
    name: "Lic. Sofía Chen",
    role: "PRODUCT DESIGNER",
    category: "Design",
    status: "ACTIVO",
    bio: "Translating complex dental workflows into intuitive user interfaces.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    email: "sofia.chen@nexusodonto.com",
  },
  {
    id: "lucas-kim",
    name: "Dr. Lucas Kim",
    role: "AI SPECIALIST",
    category: "Engineering",
    status: "ACTIVO",
    bio: "Developing the Agente IA for automated dental triaging and NLP.",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80",
    email: "lucas.kim@nexusodonto.com",
  },
];

export function TeamPage() {
  const bySection = getDocsBySection();
  const docMembers = bySection["Team"] || [];

  const [activeCategory, setActiveCategory] = useState("All Roles");
  const [searchTerm, setSearchTerm] = useState("");

  const combinedMembers = [...INITIAL_TEAM];

  docMembers.forEach((doc) => {
    if (!combinedMembers.some((m) => m.name.toLowerCase() === doc.title.toLowerCase())) {
      combinedMembers.push({
        id: doc.slug,
        name: doc.title,
        role: (doc.role || "MEMBER").toUpperCase(),
        category: "Engineering",
        status: "ACTIVO",
        bio: doc.content.slice(0, 100).replace(/\n/g, " ") || "Contribuidor de NexusOdonto.",
        avatar: doc.photo || "",
        email: `${doc.slug.replace(/\s+/g, ".")}@nexusodonto.com`,
      });
    }
  });

  const categories = ["All Roles", "Clinical", "Engineering", "Design"];

  const filteredMembers = combinedMembers.filter((m) => {
    const matchesCat = activeCategory === "All Roles" || m.category === activeCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.bio.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="team-page">
      <div className="team-header">
        <span className="team-category-badge">— TEAM DIRECTORY</span>
        <h1 className="team-title">Meet the minds behind NexusOdonto.</h1>
        <p className="team-subtitle">
          A cross-functional team of clinical experts and software engineers dedicated to building the future of dental documentation.
        </p>
      </div>

      <div className="team-filters-bar">
        <div className="team-search-box">
          <SearchIcon className="team-search-icon" />
          <input
            type="text"
            placeholder="Search team members by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="team-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`team-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="team-grid">
        {filteredMembers.map((member) => (
          <div key={member.id} className="team-card">
            <div className="team-card-image-wrapper">
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="team-card-img" />
              ) : (
                <div className="team-card-avatar-fallback">
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="team-status-badge">
                <span className="team-status-dot"></span>
                {member.status}
              </span>
            </div>

            <div className="team-card-body">
              <h3 className="team-member-name">{member.name}</h3>
              <p className="team-member-role">{member.role}</p>
              <p className="team-member-bio">{member.bio}</p>

              <div className="team-card-actions">
                <a href={`mailto:${member.email}`} title="Email" className="team-action-icon">
                  <MailIcon />
                </a>
                <span className="team-action-icon" title="Code Contribution">
                  <CodeIcon />
                </span>
                <span className="team-action-icon" title="Profile">
                  <GlobeIcon />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}