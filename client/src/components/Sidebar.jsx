import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>InternHub</h2>

      <nav className="sidebar-links">
        <Link to="/">Dashboard</Link>
        <Link to="/internships">Internships</Link>
        <Link to="/applications">Applications</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/chat">Chat</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;