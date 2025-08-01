import type { ReactNode } from 'react';
import { useListContext, Translate } from 'ra-core';
import { Card } from '@appdotbuild/design';
import { Button } from '@appdotbuild/design';
import { BulkDeleteButton } from '@/components/admin/bulk-delete-button';
import { X } from 'lucide-react';

export const BulkActionsToolbar = ({
  children = <BulkDeleteButton />,
}: {
  children?: ReactNode;
}) => {
  const { selectedIds, onUnselectItems } = useListContext();
  if (!selectedIds?.length) {
    return null;
  }
  const handleUnselectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUnselectItems();
  };
  return (
    <Card className="flex flex-col gap-2 md:gap-6 md:flex-row items-stretch sm:items-center p-2 px-4 w-[90%] sm:w-fit mx-auto sticky bottom-10 z-10 bg-zinc-100 dark:bg-zinc-900">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="has-[>svg]:px-0"
          onClick={handleUnselectAll}
        >
          <X />
        </Button>
        <span className="text-sm text-muted-foreground">
          <Translate
            i18nKey="ra.action.bulk_actions"
            options={{ smart_count: selectedIds.length }}
          >
            {selectedIds.length} rows selected
          </Translate>
        </span>
      </div>
      {children}
    </Card>
  );
};
