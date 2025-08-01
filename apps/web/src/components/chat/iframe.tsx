import { cn } from '~/lib/utils';

export function Iframe({
  src,
  ref,
  className,
  onLoad,
  onError,
}: {
  src: string;
  ref?: React.Ref<HTMLIFrameElement>;
  className: string;
  onLoad?: () => void;
  onError?: () => void;
}) {
  const classNames = cn('w-full h-full border-none', className);

  return (
    <iframe
      onLoad={onLoad}
      onError={onError}
      ref={ref}
      src={src}
      sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-popups-to-escape-sandbox allow-popups allow-downloads allow-storage-access-by-user-activation"
      className={classNames}
    />
  );
}
