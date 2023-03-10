import { SVGProps } from '@components/atoms/Icon';
import CloseIcon from '@mui/icons-material/Close';

const Declined: React.FC<SVGProps> = ({ width, height, color }) => {
  return (
    <CloseIcon
      className="text-[18px]"
      sx={{
        width: width,
        height: height,
        color: color,
      }}
    />
  );
};

export default Declined;
