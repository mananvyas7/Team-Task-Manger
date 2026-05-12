export default function ProjectCard({ project, onClick }) {
  return (
    <div
      className="border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer"
      onClick={() => onClick(project._id)}
    >
      <h2 className="font-semibold text-xl">{project.name}</h2>
      <p className="text-gray-600">{project.description}</p>
      <p className="text-sm text-gray-500">Members: {project.members.length}</p>
    </div>
  );
}
