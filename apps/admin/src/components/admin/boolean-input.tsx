import { useCallback } from 'react';
import { Switch } from '@appdotbuild/design';
import { FormDescription, FormItem, FormLabel } from '@appdotbuild/design';
import { FormError } from '@/components/admin/form-error';
import { useInput, FieldTitle } from 'ra-core';

export const BooleanInput = (props: BooleanInputProps) => {
  const {
    className,
    defaultValue = false,
    format,
    label,
    helperText,
    onBlur,
    onChange,
    onFocus,
    readOnly,
    disabled,
    parse,
    resource,
    source,
    validate,
    ...rest
  } = props;
  const { id, field, fieldState, isRequired } = useInput({
    defaultValue,
    format,
    parse,
    resource,
    source,
    onBlur,
    onChange,
    type: 'checkbox',
    validate,
    disabled,
    readOnly,
    ...rest,
  });

  const handleChange = useCallback(
    (checked: boolean) => {
      field.onChange(checked);
      // Ensure field is considered as touched
      field.onBlur();
    },
    [field],
  );

  return (
    <FormItem className={className}>
      <div className="flex items-center space-x-2">
        <Switch
          id={id}
          checked={Boolean(field.value)}
          onFocus={onFocus}
          onCheckedChange={handleChange}
        />
        <FormLabel htmlFor={id}>
          <FieldTitle
            label={label}
            source={source}
            resource={resource}
            isRequired={isRequired}
          />
        </FormLabel>
      </div>
      {helperText && <FormDescription>{helperText}</FormDescription>}
      <FormError fieldState={fieldState} />
    </FormItem>
  );
};

export interface BooleanInputProps {
  className?: string;
  defaultValue?: boolean;
  format?: (value: any) => any;
  helperText?: string;
  label?: string;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onChange?: (value: any) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  readOnly?: boolean;
  disabled?: boolean;
  parse?: (value: any) => any;
  resource?: string;
  source: string;
  validate?: any;
}
