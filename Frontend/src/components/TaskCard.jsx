export default function TaskCard({ task, onStatusChange }) {
  return (
    <div className="border rounded-lg p-4 shadow">
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
      <p className="text-sm">Assigned to: {task.assignee?.name}</p>
      <select
        value={task.status}
        onChange={(e) => onStatusChange(task._id, e.target.value)}
        className="mt-2 border rounded px-2 py-1"
      >
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
  );
}
