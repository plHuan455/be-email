import { UserName } from '@components/molecules/InformationDetailBlock';
import { Avatar, Box, Typography } from '@mui/material';
import avt from '../../../assets/images/avatars/avatar-1.jpg';
import React from 'react';
import { EmailList } from '@components/molecules/ModalEmailList';
import './index.scss';

type Props = {
  emailData: EmailList;
};

const EmailItem = ({ emailData }: Props) => {
  return (
    <Box
      className="email__item"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: '.3s ease-in-out',
        padding: '0 5px',
        borderRadius: '8px',
      }}>
      <Box
        sx={{
          width: '90%',
          padding: '10px 0',
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Avatar
            src={avt}
            alt="sender avt"
            sx={{ width: '35px', height: '35px' }}
          />
          <Box sx={{ width: '80%' }}>
            <Typography
              component={'p'}
              sx={{
                width: '100%',
                fontSize: '10px',
                color: '#999DA0',
                paddingLeft: '10px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}>
              {emailData.userName} | {emailData.userEmail}
            </Typography>
            <Typography
              component={'p'}
              sx={{
                width: '100%',
                fontSize: '10px',
                color: '#999DA0',
                paddingLeft: '10px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}>
              {emailData.userName} | {emailData.userEmail}
            </Typography>
          </Box>
        </Box>
      </Box>
      {emailData.totalEmail && emailData.totalEmail > 0 ? (
        <Typography
          component={'p'}
          sx={{
            backgroundColor: '#DADCDD',
            height: '18px',
            fontSize: '10px',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 5px',
            color: '#495057',
          }}>
          {emailData.totalEmail > 9 ? '9+' : emailData.totalEmail}
        </Typography>
      ) : (
        ''
      )}
    </Box>
  );
};

export default EmailItem;
