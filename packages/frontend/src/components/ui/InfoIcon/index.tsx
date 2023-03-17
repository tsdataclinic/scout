import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as IconType from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../Tooltip';

type Props = {
  className?: string;
  tooltip?: string;
};

// TODO: this component is not accessible. What do we do for screen readers?
export default function InfoIcon({ tooltip, className }: Props): JSX.Element {
  const iconClassName = classNames('text-slate-400', className);

  // we need to wrap this in a `span` because `FontAwesomeIcon` doesn't
  // support forward refs, so it breaks when passed to `Tooltip`
  const icon = (
    <span>
      <FontAwesomeIcon className={iconClassName} icon={IconType.faCircleInfo} />
    </span>
  );

  return tooltip ? <Tooltip content={tooltip}>{icon}</Tooltip> : icon;
}
