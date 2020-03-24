import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const TextField = ({
  name,
  placeholder,
  value,
  error,
  info,
  type,
  onChange,
  disabled,
  iconning,
  fieldClassName,
  readOnly
}) => {
  return (
    <div className="form__group">
      <input
        type={type}
        className={classnames("form-control form__input", fieldClassName, {
          "is-invalid": error
        })}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly && "readOnly"}
      />
      <label htmlFor={name} className="form__label">
        {iconning && <i className={iconning}></i>}
        &nbsp;&nbsp;
        {placeholder}
      </label>
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  disabled: PropTypes.string,
  iconning: PropTypes.string,
  fieldClassName: PropTypes.string
};

TextField.defaultProps = {
  type: "text"
};

export default TextField;
