import { useLocation } from '@rspress/core/runtime';
import { Link, Layout as RspressLayout } from '@rspress/core/theme-original';

const LATEST_VERSION = '13.x';

const PreReleaseBanner = () => (
  <div className="pre-release-banner">
    <span>
      You are viewing documentation for <strong>v14 alpha</strong>. This version is under active
      development and APIs may change.
    </span>
  </div>
);

const OldVersionBanner = ({ version }: { version: string }) => (
  <div className="old-version-banner">
    <span>
      You're viewing the documentation for <strong>{version}</strong>. Current latest version is{' '}
      <strong>{LATEST_VERSION}</strong>.
    </span>
    <Link href="/react-native-testing-library/docs/start/intro" className="old-version-banner-link">
      View latest version <strong>here</strong>.
    </Link>
  </div>
);

const AnnouncementBanner = () => {
  const { pathname } = useLocation();

  if (pathname.includes('/14.x/')) {
    return <PreReleaseBanner />;
  }

  if (pathname.includes('/12.x/')) {
    return <OldVersionBanner version="12.x" />;
  }

  return null;
};

const Layout = () => <RspressLayout beforeNav={<AnnouncementBanner />} />;

export { Layout };

export * from '@rspress/core/theme-original';
