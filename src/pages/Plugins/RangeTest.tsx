import type React from 'react';

import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiMenu } from 'react-icons/fi';

import { FormFooter } from '@app/components/FormFooter';
import { connection } from '@app/core/connection';
import { useAppSelector } from '@app/hooks/redux';
import { Card } from '@components/generic/Card';
import { Checkbox } from '@components/generic/form/Checkbox';
import { Input } from '@components/generic/form/Input';
import { IconButton } from '@components/generic/IconButton';
import { PrimaryTemplate } from '@components/templates/PrimaryTemplate';
import type { RadioConfig_UserPreferences } from '@meshtastic/meshtasticjs/dist/generated';

export interface RangeTestProps {
  navOpen?: boolean;
  setNavOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RangeTest = ({
  navOpen,
  setNavOpen,
}: RangeTestProps): JSX.Element => {
  const { t } = useTranslation();
  const preferences = useAppSelector((state) => state.meshtastic.preferences);

  const { register, handleSubmit, formState, reset, control } =
    useForm<RadioConfig_UserPreferences>({
      defaultValues: {
        rangeTestPluginEnabled: preferences.rangeTestPluginEnabled,
        rangeTestPluginSave: preferences.rangeTestPluginSave,
        rangeTestPluginSender: preferences.rangeTestPluginSender,
      },
    });

  const onSubmit = handleSubmit((data) => {
    void connection.setPreferences(data);
  });

  const watchRangeTestPluginEnabled = useWatch({
    control,
    name: 'rangeTestPluginEnabled',
    defaultValue: false,
  });

  return (
    <PrimaryTemplate
      title="Range Test"
      tagline="Plugin"
      leftButton={
        <IconButton
          icon={<FiMenu className="w-5 h-5" />}
          onClick={(): void => {
            setNavOpen && setNavOpen(!navOpen);
          }}
        />
      }
      footer={
        <FormFooter
          dirty={formState.isDirty}
          saveAction={onSubmit}
          clearAction={reset}
        />
      }
    >
      <div className="w-full space-y-4">
        <Card title="Range Test" description="Settings">
          <div className="w-full max-w-3xl p-10 md:max-w-xl">
            <form onSubmit={onSubmit}>
              <Checkbox
                label="Range Test Plugin Enabled?"
                {...register('rangeTestPluginEnabled')}
              />
              <Checkbox
                label="Range Test Plugin Save?"
                disabled={!watchRangeTestPluginEnabled}
                {...register('rangeTestPluginSave')}
              />
              <Input
                type="number"
                label="Message Interval"
                disabled={!watchRangeTestPluginEnabled}
                {...register('rangeTestPluginSender', {
                  valueAsNumber: true,
                })}
              />
            </form>
          </div>
        </Card>
      </div>
    </PrimaryTemplate>
  );
};
