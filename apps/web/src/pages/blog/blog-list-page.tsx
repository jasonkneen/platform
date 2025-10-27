import { createLazyRoute, Link } from '@tanstack/react-router';
import bgPattern1 from '~/components/assets/svgs/bg-pattern-1.svg';
import bgPattern2 from '~/components/assets/svgs/bg-pattern-2.svg';
import { DecorationPlus } from '~/components/shared/decorations';
import { HeroTitle } from '~/components/shared/title';
import { blogPosts } from '~/lib/blog-posts';

export const BlogListRoute = createLazyRoute('/blog')({
  component: BlogListPage,
});

function BlogListPage() {
  return (
    <section className="hero relative grow overflow-y-auto overflow-x-hidden">
      <div className="relative mx-auto flex w-full max-w-[1216px] flex-col px-5 pb-28 pt-[125px] md:px-8 md:pb-40 md:pt-[138px] lg:pb-44 lg:pt-[152px] xl:max-w-[1280px] xl:px-8 xl:pb-48 xl:pt-[156px]">
        <div className="relative md:mx-auto md:max-w-[514px] md:px-0 lg:max-w-[640px]">
          <HeroTitle className="md:max-w-[448px] lg:max-w-[578px]">
            Blog
          </HeroTitle>

          <div className="relative mt-10 pb-5 md:mt-12 md:pb-6 lg:mt-14 lg:pb-7 xl:mt-16 xl:pb-8">
            <div className="mt-12 space-y-12 px-5 md:mt-16 md:space-y-16 md:px-8 lg:px-8">
              {blogPosts.map((post) => (
                <div key={post.url} className="relative">
                  <Link
                    to={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <h3 className="font-mono text-lg font-medium leading-tight text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-foreground/70 md:text-xl lg:text-2xl">
                      {post.title}
                    </h3>
                    <p className="mt-3 font-mono text-sm text-muted-foreground md:text-base">
                      {post.date}
                    </p>
                    <p className="text-hero-paragraph mt-4 font-mono leading-relaxed text-foreground/80">
                      {post.excerpt}
                    </p>
                  </Link>
                </div>
              ))}
            </div>

            {/* Decorative borders */}
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

            {/* Background patterns */}
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

        {/* Bottom decoration section */}
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

            <DecorationPlus className="absolute -left-60 bottom-0 z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
