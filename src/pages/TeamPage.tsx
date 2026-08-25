import { useState } from "react";
import { getDocsBySection } from "../lib/loadDocs";
import { MailIcon, CodeIcon, GlobeIcon, SearchIcon } from "../components/Icons";

export function TeamPage() {
  const bySection = getDocsBySection();
  const docMembers = bySection["Team"] || [];

  const [activeCategory, setActiveCategory] = useState("All Roles");
  const [searchTerm, setSearchTerm] = useState("");

  const teamMembers = docMembers.map((doc) => ({
    id: doc.slug,
    name: doc.name || doc.title,
    role: doc.role || "Team Member",
    summary: doc.summary || "Contribuidor de NexusOdonto.",
    avatar: doc.avatar || doc.photo || "",
    bio: doc.content || "",
  }));

  const categories = ["All Roles", "Engineering", "AI/ML", "Frontend", "Backend"];

  const filteredMembers = teamMembers.filter((m) => {
    const matchesCat = activeCategory === "All Roles" || 
      m.role.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="team-page">
      <div className="team-header">
        <span className="team-category-badge">— TEAM DIRECTORY</span>
        <h1 className="team-title">Meet the minds behind NexusOdonto.</h1>
        <p className="team-subtitle">
          A cross-functional team of software engineers and AI specialists dedicated to building the future of dental documentation.
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
            </div>

            <div className="team-card-body">
              <h3 className="team-member-name">{member.name}</h3>
              <p className="team-member-role">{member.role}</p>
              <p className="team-member-bio">{member.summary}</p>

              <div className="team-card-actions">
                <span className="team-action-icon" title="View Profile">
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