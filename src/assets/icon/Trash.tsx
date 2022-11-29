import { SVGProps } from '@components/atoms/Icon';

const Reload: React.FC<SVGProps> = ({ width, height, color }) => {
  return (
    <svg
      fill={color || 'black'}
      width={width || 26}
      height={height || 26}
      viewBox="0 0 26 26"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.9583 4.68H19.7917V2.08C19.7917 0.93275 18.8574 0 17.7083 0H7.29167C6.14258 0 5.20833 0.93275 5.20833 2.08V4.68H1.04167C0.465495 4.68 0 5.14475 0 5.72V6.76C0 6.903 0.117187 7.02 0.260417 7.02H2.22656L3.0306 24.0175C3.08268 25.1257 4.00065 26 5.11068 26H19.8893C21.0026 26 21.9173 25.129 21.9694 24.0175L22.7734 7.02H24.7396C24.8828 7.02 25 6.903 25 6.76V5.72C25 5.14475 24.5345 4.68 23.9583 4.68ZM17.4479 4.68H7.55208V2.34H17.4479V4.68Z"
        fill={color || 'black'}
      />
    </svg>
  );
};

export default Reload;
