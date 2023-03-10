import { UserInfo } from '@components/organisms/Email/Interface';
import MinimizeEmail from '@components/organisms/MinimizeEmail';
import { Box } from '@mui/material';
import { rem } from '@utils/functions';
import { motion, usePresence, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { InputContactBlock } from '@components/molecules/AutoCompleteReceive';

export interface MinimizeEmailTypes {
  id?: string;
  to?: InputContactBlock[];
  cc?: UserInfo[];
  bcc?: UserInfo[];
  attachFiles?: { files: (File | undefined)[]; fileUrls: (string | undefined)[] };
  subject?: string;
  content?: string;
  sendAt?: string | null;
  color?: string;
  fileUrls?: (string | undefined)[];
}

interface MinimizeEmailListProps {
  data: MinimizeEmailTypes[];
  onMaximizeClick: (data: MinimizeEmailTypes) => void;
  onCloseClick: (data: MinimizeEmailTypes) => void;
}

const MinimizeEmailList: React.FC<MinimizeEmailListProps> = ({
  data = [],
  onMaximizeClick,
  onCloseClick,
}) => {
  const location = useLocation();
  return (
    <div className="t-minimizeEmailList">
      <AnimatePresence>
        {data.map((value, index) => (
          <motion.div
            key={`minimize-email-list-${value.id}`}
            className="t-minimizeEmailList_itemWrapper"
            style={{ position: 'relative', marginLeft: rem(5), height: rem(46) }}
            initial={{ width: 0, marginLeft: 0 }}
            animate={{ width: rem(260), marginLeft: rem(5) }}
            exit={{ width: 0, marginLeft: 0 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 50,
              mass: 1,
              duration: 5,
            }}>
            <motion.div
              className="t-minimizeEmailList_item"
              initial={
                location.pathname === '/emails/compose'
                  ? {
                      translateY: '-800px',
                      translateX: '-100px',
                      opacity: 0,
                      width: rem(500),
                    }
                  : {}
              }
              animate={{ translateY: 0, translateX: 0, opacity: 1, width: rem(260) }}
              exit={{
                translateY: '-800px',
                translateX: '-100px',
                opacity: 0,
                width: rem(500),
              }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 50,
                mass: 1,
                duration: 5,
              }}
              style={{
                width: rem(260),
                height: rem(46),
                position: 'absolute',
                backgroundColor: value.color ? value.color : '#f2f6fc',
              }}>
              <MinimizeEmail
                key={`minimize-email-list-${index}`}
                title={value.subject || 'New Message'}
                onMaximizeClick={() => onMaximizeClick(value)}
                onCloseClick={() => onCloseClick(value)}
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MinimizeEmailList;
