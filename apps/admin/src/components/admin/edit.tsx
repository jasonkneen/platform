import {
  EditBase,
  Translate,
  useCreatePath,
  useEditContext,
  useGetRecordRepresentation,
  useGetResourceLabel,
  useHasDashboard,
  useResourceContext,
  useResourceDefinition,
} from 'ra-core';
import { ReactNode } from 'react';
import { Link } from 'react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
} from '@/components/admin/breadcrumb';
import { ShowButton } from '@/components/admin/show-button';

export const Edit = ({
  title,
  children,
}: {
  title?: ReactNode | string | false;
  children: ReactNode;
}) => (
  <EditBase>
    <EditView title={title}>{children}</EditView>
  </EditBase>
);

export const EditView = ({
  title,
  children,
}: {
  title?: ReactNode | string | false;
  children: ReactNode;
}) => {
  const context = useEditContext();

  const resource = useResourceContext();
  if (!resource) {
    throw new Error(
      'The EditView component must be used within a ResourceContextProvider',
    );
  }
  const getResourceLabel = useGetResourceLabel();
  const listLabel = getResourceLabel(resource, 2);
  const createPath = useCreatePath();
  const listLink = createPath({
    resource,
    type: 'list',
  });

  const getRecordRepresentation = useGetRecordRepresentation(resource);
  const recordRepresentation = getRecordRepresentation(context.record);

  const { hasShow } = useResourceDefinition({ resource });
  const hasDashboard = useHasDashboard();

  if (context.isLoading || !context.record) {
    return null;
  }

  return (
    <>
      <Breadcrumb>
        {hasDashboard && (
          <BreadcrumbItem>
            <Link to="/">
              <Translate i18nKey="ra.page.dashboard">Home</Translate>
            </Link>
          </BreadcrumbItem>
        )}
        <BreadcrumbItem>
          <Link to={listLink}>{listLabel}</Link>
        </BreadcrumbItem>
        <BreadcrumbPage>{recordRepresentation}</BreadcrumbPage>
      </Breadcrumb>
      <div className="flex justify-between items-start flex-wrap gap-2 my-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {title !== undefined ? title : context.defaultTitle}
        </h2>
        <div className="flex justify-end items-center">
          {hasShow ? <ShowButton /> : null}
        </div>
      </div>
      <div className="my-2">{children}</div>
    </>
  );
};
