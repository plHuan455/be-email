import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useMemo } from 'react';
import CustomButton from '../CustomButton';
import { SVGIconProps } from '../Icon';
import avt from '../../../assets/images/avatars/avatar-2.jpg';
import { RenderButtonIcon } from '@components/molecules/EmailActions';

const iconsList: {
  [key: string]: SVGIconProps['icon'];
} = {
  '/manager': 'managerAcccount',
  '/profile': 'accountCircle',
  '/setting': 'settings',
  '/change-password': 'password',
  '/log-out': 'logout',
};

interface Props {
  settings: any[];
  className?: string;
  label?: string;
  popupPlacement?:
    | 'right-start'
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-end'
    | 'left-start'
    | 'right-end'
    | 'top-end'
    | 'top-start'
    | undefined;
  popupStyles?: object;
}

const AvatarWithPopup: React.FC<Props> = ({
  popupPlacement = 'top',
  settings,
  className,
  popupStyles = {},
}) => {
  const currentUserName = localStorage.getItem('current_user_name')?.toString();
  const currentUserAvt = useMemo(() => {
    return localStorage.getItem('current_user_avt')?.toString();
  }, [localStorage.getItem('current_user_avt')?.toString()]);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box className={className} sx={{ flexGrow: 0 }}>
      <Tooltip placement={popupPlacement} title={currentUserName} arrow>
        <IconButton
          onClick={handleOpenUserMenu}
          sx={{ p: 0, border: '4px solid #554CFF' }}>
          <Avatar
            alt={currentUserName}
            src={`http://${currentUserAvt}`}
            sx={{ width: '45px', height: '45px' }}
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{
          mt: '45px',
          ...popupStyles,
        }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}>
        {settings.map((setting, index) => {
          return (
            <MenuItem
              className="w-full"
              key={index}
              onClick={() => {
                handleCloseUserMenu();
              }}>
              {/* <Typography textAlign="center">{setting}</Typography> */}
              <CustomButton
                classNameLabel="text-left pr-4 text-[14px] text-[medium]"
                label={setting.label}
                onClick={setting.handleClick}
                bgButtonColor="transparent"
                color="#212529"
                isAfterIcon={true}
                afterIcon={
                  <RenderButtonIcon
                    item={setting.path ? iconsList[setting.path] : 'approved'}
                    color="#212529"
                  />
                }
              />
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default AvatarWithPopup;
