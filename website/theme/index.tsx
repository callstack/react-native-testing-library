import { useLocation } from '@rspress/core/runtime';
import { Link, Layout as RspressLayout } from '@rspress/core/theme-original';

const LATEST_VERSION = '14.x';

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

  if (pathname.includes('/12.x/') || pathname.includes('/13.x/')) {
    const version = pathname.includes('/12.x/') ? '12.x' : '13.x';
    return <OldVersionBanner version={version} />;
  }

  return null;
};

const Layout = () => <RspressLayout beforeNav={<AnnouncementBanner />} />;

export { Layout };

export * from '@rspress/core/theme-original';
