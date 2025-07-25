import { cn } from '@appdotbuild/design';
import { Button } from '@appdotbuild/design';
import { useListContext, useTranslate } from 'ra-core';
import matches from 'lodash/matches';
import pickBy from 'lodash/pickBy';
import { CircleX } from 'lucide-react';

export const ToggleFilterButton = ({
  label,
  size = 'sm',
  value,
  className,
}: {
  label: string;
  value: any;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined;
}) => {
  const { filterValues, setFilters } = useListContext();
  const translate = useTranslate();
  const isSelected = getIsSelected(value, filterValues);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFilters(toggleFilter(value, filterValues));
  };

  return (
    <Button
      variant={isSelected ? 'secondary' : 'outline'}
      onClick={handleClick}
      className={cn(
        'cursor-pointer',
        'flex flex-row items-center gap-2',
        'hover:bg-accent hover:text-accent-foreground',
        'transition-colors',
        className,
      )}
      size={size}
    >
      {translate(label, { _: label })}
      {isSelected && <CircleX className="h-3 w-3 opacity-70" />}
    </Button>
  );
};

const toggleFilter = (value: any, filters: any) => {
  const isSelected = matches(
    pickBy(value, (val) => typeof val !== 'undefined'),
  )(filters);

  if (isSelected) {
    const keysToRemove = Object.keys(value);
    return Object.keys(filters).reduce(
      (acc, key) =>
        keysToRemove.includes(key) ? acc : { ...acc, [key]: filters[key] },
      {},
    );
  }

  return { ...filters, ...value };
};

const getIsSelected = (value: any, filters: any) =>
  matches(pickBy(value, (val) => typeof val !== 'undefined'))(filters);
