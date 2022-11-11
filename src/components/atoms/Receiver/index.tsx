import { RenderButtonIcon } from '@components/email/EmailActions';
import { Box } from '@mui/material';
import React from 'react';
import SingleAvatar from '../SingleAvatar';

interface ReceiverData {
  avatar: string | undefined;
  mail: string;
  abbreviations: string;
}

interface ReceiverProps {
  data: ReceiverData;
  onDelete: React.MouseEventHandler | undefined;
}

const Receiver: React.FC<ReceiverProps> = ({ data, onDelete }) => {
  const { avatar, mail, abbreviations } = data;

  return (
    <Box className="flex">
      {/* Main Content */}
      <Box className="flex bg-[#F6F5FE] relative pl-7 p-2 py-1 rounded-md">
        <SingleAvatar
          src={avatar}
          abbreviations={abbreviations}
          className="w-6 h-6 absolute inset-y-2/4 left-0 -translate-y-1/2"
        />
        <p className="text-[14px]">{mail}</p>
        <RenderButtonIcon
          item={'close'}
          onClick={onDelete}
          className="hover:cursor-pointer"
        />
      </Box>
    </Box>
  );
};

export default Receiver;