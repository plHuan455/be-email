import { SVGIconProps } from '@components/atoms/Icon';

const Edit: React.FC<SVGIconProps> = ({ width, height, color }) => {
  return (
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: `${width || 24}px`,
        height: `${height || 24}px`,
        fill: `${color || '#5541D7'}`,
      }}>
      <rect
        fill={`${color || '#5541D7'}`}
        height={`${width || 24}px`}
        width={`${height || 24}px`}
      />
      <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H88V56H216V200Z" />
    </svg>
  );
};

export default Edit;
