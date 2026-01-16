import { useLocation } from '@rspress/core/runtime';

export default function PreReleaseBanner() {
  const { pathname } = useLocation();

  // Only show banner for v14 pages
  if (!pathname.includes('/14.x/')) {
    return null;
  }

  return (
    <div className="pre-release-banner">
      <span>
        You are viewing documentation for <strong>v14 alpha</strong>. This version is under active
        development and APIs may change.
      </span>
    </div>
  );
}
