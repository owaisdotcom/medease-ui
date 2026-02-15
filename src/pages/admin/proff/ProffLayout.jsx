import { Outlet } from 'react-router-dom';

export default function ProffLayout() {
  return (
    <div className="space-y-6">
      <Outlet />
    </div>
  );
}
