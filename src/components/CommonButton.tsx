import classNmaes from 'classnames';
import { FC, HTMLAttributeAnchorTarget } from 'react';
import { ButtonProps } from 'react-bootstrap';

interface CommonButtonProps
  extends Pick<
    ButtonProps,
    'className' | 'children' | 'disabled' | 'href' | 'onClick'
  > {
  border?: boolean;
  target?: HTMLAttributeAnchorTarget;
}

export const CommonButton: FC<CommonButtonProps> = ({
  href,
  border,
  target,
  className,
  children,
  ...props
}) => {
  className = classNmaes('rounded-pill p-2 fs-5 fw-semibold', className, {
    'border-button': border,
    'border-0 text-black bg-gradient-blue': !border,
  });

  return href ? (
    <a
      className={`text-decoration-none ${className}`}
      href={href}
      target={target}
    >
      {children}
    </a>
  ) : (
    <button className={className} {...props}>
      {children}
    </button>
  );
};
