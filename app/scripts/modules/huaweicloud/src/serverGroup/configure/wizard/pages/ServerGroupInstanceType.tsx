import * as React from 'react';
import { FormikErrors, FormikProps } from 'formik';
import Select, { Option } from 'react-select';
import { IWizardPageComponent } from '@spinnaker/core';

import { IHuaweiCloudServerGroupCommand } from '../../serverGroupConfiguration.service';

export interface IServerGroupInstanceTypeProps {
  formik: FormikProps<IHuaweiCloudServerGroupCommand>;
}

export class ServerGroupInstanceType extends React.Component<IServerGroupInstanceTypeProps>
  implements IWizardPageComponent<IHuaweiCloudServerGroupCommand> {
  public validate(values: IHuaweiCloudServerGroupCommand) {
    const errors: FormikErrors<IHuaweiCloudServerGroupCommand> = {};

    if (!values.instanceType) {
      errors.instanceType = 'Instance Type required.';
    }

    return errors;
  }

  private instanceTypeChanged = (options: Option[]) => {
    const { values } = this.props.formik;
    this.props.formik.setFieldValue('instanceType', options.map(o => o.value as string).join());
    this.props.formik.setFieldValue('instanceTypes', options.map(o => o.value as string));
    values.instanceTypeChanged(values);
  };

  public render() {
    const { values } = this.props.formik;
    const showTypeSelector = !!(values.viewState.disableImageSelection || values.amiName);

    if (showTypeSelector && values) {
      const instanceTypeOptions = (values.backingData.filtered.instanceTypes || []).map(instanceType => {
        const regionInstanceTypes = values.backingData.instanceTypes[values.region] || []
        const instanceTypeInfo = regionInstanceTypes.find(({ name }) => name === instanceType)
        return {
          label: instanceTypeInfo ? `${instanceType}(${instanceTypeInfo.cpu}Core ${instanceTypeInfo.mem}GB)` : instanceType,
          value: instanceType
        }
      })
      return (
        <div className="container-fluid form-horizontal">
          <div className="form-group">
          <div className="col-md-3 sm-label-right">
              <b>Instance Type</b>
            </div>
          <div className="col-md-8">
            <Select
              value={values.instanceTypes}
              required={true}
              clearable={false}
              options={instanceTypeOptions}
              onChange={this.instanceTypeChanged}
              multi={true}
            />
          </div>
          </div>
        </div>
      );
    }

    return <h5 className="text-center">Please select an image.</h5>;
  }
}
