import React from 'react';

const formField = ({id, formdata, change}) => {

  const showError = () => {
    let errorMessage = (
      <div className="error_label">
        {formdata.validationMessage}
      </div>
    );

    return errorMessage;
  }

  const renderTemplate = () => {
    let formTemplate = null;

    switch(formdata.element) {
      case('input'):
        formTemplate = (
          <div>
            {formdata.config.title &&
              <div className="label_inputs">{ formdata.config.title }</div>
            }
            <input
              {...formdata.config}
              value={formdata.value}
              onChange={(e) => change({e, id})}
            />
            {!formdata.valid ? showError() : null}
          </div>
        )
      break;
      case('select'):
        formTemplate = (
          <div>
            {formdata.config.title &&
              <div className="label_inputs">{ formdata.config.title }</div>
            }
            <select
              value={formdata.value}
              onChange={(e) => change({e, id})}
            >
              <option value="">Select one</option>
              {formdata.config.options.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.value}
                </option>
              ))}
            </select>
            {!formdata.valid ? showError() : null}
          </div>
        )
      break;
      default:
        formTemplate = null;
    }

    return formTemplate;
  }

  return (
    <div>
      {renderTemplate()}
    </div>
  )
}

export default formField;