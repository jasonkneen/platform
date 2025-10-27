import { Link } from '@tanstack/react-router';
import { GithubButton } from '~/components/shared/github-button';
import { AGENT_GITHUB_REPO_URL } from '~/lib/constants';
import { useIsSmallScreen } from '@appdotbuild/design';
import { AppLink } from '~/components/shared/app-link/app-link';

export function Header() {
  const isMobile = useIsSmallScreen();

  return (
    <header className="absolute left-0 right-0 z-50 h-[52px] top-2">
      <nav
        className="mx-auto flex h-full w-full max-w-[1216px] items-center justify-between px-5 md:px-8"
        aria-label="Global"
      >
        <Link to="/" replace>
          <img
            src="https://www.app.build/_next/static/media/ca7edce715379528b2fbeb326c96cf7b.svg"
            width="112"
            height="21"
            alt="app.build logo"
            style={{ viewTransitionName: 'logo' }}
            className="cursor-pointer transition-transform duration-200 hover:scale-105"
          />
        </Link>

        <div className="flex items-center gap-3">
          <GithubButton
            label={isMobile ? '' : 'Star on GitHub'}
            variant="outline"
            repoUrl={AGENT_GITHUB_REPO_URL}
          />
          <AppLink to="/blog">Blog</AppLink>
        </div>
      </nav>
    </header>
  );
}
