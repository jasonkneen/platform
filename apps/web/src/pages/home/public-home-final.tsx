import { createLazyRoute, Link } from '@tanstack/react-router';
import bgPattern1 from '~/components/assets/svgs/bg-pattern-1.svg';
import bgPattern2 from '~/components/assets/svgs/bg-pattern-2.svg';
import bgPattern3 from '~/components/assets/svgs/bg-pattern-3.svg';
import bgPattern4 from '~/components/assets/svgs/bg-pattern-4.svg';
import {
  DecorationPlus,
  DecorationSquare,
} from '~/components/shared/decorations';
import { GithubIcon } from '~/components/shared/icons/github-icon';
import { HeroTitle } from '~/components/shared/title';
import { siDiscord } from 'simple-icons';
import {
  AGENT_GITHUB_REPO_URL,
  BLOG_POST_1_URL,
  BLOG_POST_2_URL,
  CONTACT_URL,
  PAPER_URL,
  PLATFORM_GITHUB_REPO_URL,
} from '~/lib/constants';

export const PublicHomeFinalRoute = createLazyRoute('/')({
  component: PublicHomeFinal,
});

export function PublicHomeFinal() {
  return (
    <section
      data-testid="public-home"
      className="hero relative grow overflow-y-auto overflow-x-hidden"
    >
      <div className="relative mx-auto flex w-full max-w-[1216px] flex-col px-5 pb-28 pt-[125px] md:px-8 md:pb-40 md:pt-[138px] lg:pb-44 lg:pt-[152px] xl:max-w-[1280px] xl:px-8 xl:pb-48 xl:pt-[156px]">
        <div className="relative md:mx-auto md:max-w-[514px] md:px-0 lg:max-w-[640px]">
          <HeroTitle className="md:max-w-[448px] lg:max-w-[578px]">
            Thanks for participating <br className="block md:hidden xl:block" />
            in this version of <br className="block md:hidden xl:block" />
            app.build
          </HeroTitle>
          <div className="relative mt-10 pb-5 md:mt-12 md:pb-6 lg:mt-14 lg:pb-7 xl:mt-16 xl:pb-8">
            <p className="text-hero-paragraph mt-20 px-5 font-mono text-foreground md:mt-32 md:px-8 lg:mt-[135px] lg:px-8 lg:text-left xl:mt-20">
              We've learned a lot, resulting in these blog posts:{' '}
              <Link to={BLOG_POST_1_URL} target="_blank" className="underline">
                Why we built app.build
              </Link>
              ,{' '}
              <Link to={BLOG_POST_2_URL} target="_blank" className="underline">
                Design decisions behind app.build
              </Link>
              , and{' '}
              <Link to={PAPER_URL} target="_blank" className="underline">
                our tech report on arXiv
              </Link>
              .
            </p>

            <p className="text-hero-paragraph mt-6 px-5 font-mono text-foreground md:px-8 lg:px-8 lg:text-left">
              Stay tuned for the next version, coming soon.
            </p>

            <p className="text-hero-paragraph mt-6 px-5 font-mono text-foreground md:px-8 lg:px-8 lg:text-left">
              The source code is available in our repositories:
            </p>

            <div className="mt-2 flex flex-col items-center gap-x-6 gap-y-2.5 px-5 md:mt-2 md:flex-row md:px-8 lg:mt-2 lg:px-8">
              <Link
                to={AGENT_GITHUB_REPO_URL}
                target="_blank"
                className="relative inline-flex items-center justify-center gap-1 whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-[rgba(113,113,122,0.16)] hover:bg-[rgba(113,113,122,0.32)] active:bg-[rgba(113,113,122,0.40)] h-10 px-4 lg:px-3.5 text-[14px] lg:text-[16px] w-full gap-x-1.5 md:w-auto z-20 hover:text-black/80 leading-snug"
              >
                <GithubIcon className="size-3.5 lg:size-4" aria-hidden />
                Agent Code
              </Link>
              <Link
                to={PLATFORM_GITHUB_REPO_URL}
                target="_blank"
                className="relative inline-flex items-center justify-center gap-1 whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-[rgba(113,113,122,0.16)] hover:bg-[rgba(113,113,122,0.32)] active:bg-[rgba(113,113,122,0.40)] h-10 px-4 lg:px-3.5 text-[14px] lg:text-[16px] w-full gap-x-1.5 md:w-auto z-20 hover:text-black/80 leading-snug"
              >
                <GithubIcon className="size-3.5 lg:size-4" aria-hidden />
                Platform Code
              </Link>
            </div>

            <span
              className="absolute -left-24 top-0 h-full w-px border-l border-dashed border-black/20 md:-left-16 lg:-left-24"
              aria-hidden
            />
            <span
              className="absolute -right-24 top-0 h-full w-px border-r border-dashed border-black/20 md:-right-16 lg:-right-24"
              aria-hidden
            />
            <span
              className="absolute left-0 top-0 h-full w-px border-l border-dashed border-black/20"
              aria-hidden
            />
            <span
              className="absolute right-0 top-0 h-full w-px border-r border-dashed border-black/20"
              aria-hidden
            />

            <img
              className="absolute -bottom-16 -right-24 object-cover md:bottom-0 md:h-96 lg:-bottom-3.5 lg:h-auto xl:bottom-0"
              src={bgPattern1}
              width={94}
              height={416}
              alt=""
            />
            <img
              className="absolute -left-full top-0 object-cover md:h-16 lg:h-auto"
              src={bgPattern2}
              width={544}
              height={83}
              alt=""
            />
          </div>
        </div>

        <div className="relative w-full">
          <div className="pointer-events-none relative max-w-full select-none py-4 md:mx-auto md:max-w-[640px] md:py-0 lg:max-w-[832px]">
            <span
              className="absolute left-1/2 top-0 -ml-[50vw] h-px w-screen bg-black/15"
              aria-hidden
            />
            <span
              className="absolute bottom-0 left-1/2 -ml-[50vw] h-px w-screen bg-black/15"
              aria-hidden
            />
            <span
              className="absolute -left-60 top-0 h-full w-px border-l border-dashed border-black/20"
              aria-hidden
            />
            <span
              className="absolute -right-32 top-0 h-full w-px border-r border-dashed border-black/20"
              aria-hidden
            />
            <span
              className="absolute -left-[100vw] bottom-44 h-px w-screen border-t border-dashed border-black/20"
              aria-hidden
            />
            <span
              className="absolute -right-[100vw] bottom-56 h-px w-screen border-t border-dashed border-black/20"
              aria-hidden
            />
            <span
              className="absolute -right-[100vw] bottom-80 h-px w-screen border-t border-dashed border-black/20"
              aria-hidden
            />

            <DecorationPlus className="absolute -left-60 bottom-44 z-10" />
            <DecorationPlus className="absolute -right-32 bottom-80 z-10" />
            <DecorationSquare className="absolute -bottom-0.5 -left-60 z-10" />

            <img
              className="absolute -right-[86%] bottom-56 object-cover lg:-right-[66%]"
              src={bgPattern3}
              width={419}
              height={104}
              alt=""
            />
            <img
              className="absolute -left-[544px] bottom-px h-44 object-cover"
              src={bgPattern4}
              width={304}
              height={159}
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-16 w-full max-w-[1216px] px-5 md:px-8 xl:max-w-[1280px] xl:px-8">
        <div className="md:mx-auto md:max-w-[514px] lg:max-w-[640px]">
          <p className="text-hero-paragraph mt-2 font-mono text-foreground">
            Need help retrieving your data or have questions about app.build?
          </p>
          <div className="mt-3">
            <Link
              to={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center gap-1 whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-[rgba(113,113,122,0.16)] hover:bg-[rgba(113,113,122,0.32)] active:bg-[rgba(113,113,122,0.40)] h-10 px-4 lg:px-3.5 text-[14px] lg:text-[16px] w-full gap-x-1.5 md:w-auto z-20 hover:text-black/80 leading-snug"
            >
              <svg
                className="size-3.5 lg:size-4"
                aria-hidden
                viewBox="0 0 24 24"
              >
                <path d={siDiscord.path} fill="currentColor" />
              </svg>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
