import { Box, Button } from '@mui/material';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';

import avatarImg from '@assets/images/avatars/avatar-2.jpg';
import { Email, UserInfo } from './Interface';
import EmailMess from '../EmailMess';
import { deleteEmail } from '@api/email';

import { isEmpty } from 'lodash';
import EmailMessEmpty from '../EmailMessEmpty';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/configureStore';
import {
  addDeletedEmail,
  addSpamEmail,
  addUnreadEmail,
  setDeletedEmails,
  setEmailsList,
} from '@redux/Email/reducer';
import ModalBase from '@components/atoms/ModalBase';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ModalForm {
  title: string;
  content?: ReactNode;
  onSubmit?: () => void;
  onClose?: () => void;
}

const saveEmailList = [
  {
    id: '0',
    title: 'M&A Testa to Metanode',
    sender: new UserInfo(avatarImg, 'Elon Musk', 'elon.musk@tesla.com'),
    sendTo: [
      new UserInfo(avatarImg, 'name', 'mail@gmail.com'),
      new UserInfo('', 'name1', 'mail1@gmail.com'),
      new UserInfo(avatarImg, 'name2', 'mail2@gmail.com'),
    ],
    mailContent: '<p>Test</p><br><br><p>Test line 2</p>',
    attachFiles: [
      {
        name: 'Metanode - White Paper v.1.5.2',
        type: 'pdf',
        url: 'meta.node/9YQC7us',
      },
      {
        name: 'Metanode - SDK Bundle',
        type: 'zip',
        url: 'meta.node/34ED7uc',
      },
    ],
    status: 'pending',
    type: 'receive',
    date: '2018-02-21 12:01:00',
  },
  {
    id: '1',
    title: 'M&A Testa to Metanode',
    sender: new UserInfo(avatarImg, 'Elon Musk', 'elon.musk@tesla.com'),
    sendTo: [
      new UserInfo(avatarImg, 'name', 'mail@gmail.com'),
      new UserInfo('', 'name1', 'mail1@gmail.com'),
      new UserInfo(avatarImg, 'name2', 'mail2@gmail.com'),
    ],
    mailContent: '<p>Test</p><br><br><p>Test line 2</p>',
    attachFiles: [
      {
        name: 'Metanode - White Paper v.1.5.2',
        type: 'pdf',
        url: 'meta.node/9YQC7us',
      },
      {
        name: 'Metanode - SDK Bundle',
        type: 'zip',
        url: 'meta.node/34ED7uc',
      },
    ],
    status: 'sending',
    type: 'send',
    date: '2018-02-21 12:01:00',
  },
  {
    id: '2',
    title: 'M&A Testa to Metanode',
    sender: new UserInfo(avatarImg, 'Elon Musk', 'elon.musk@tesla.com'),
    sendTo: [
      new UserInfo(avatarImg, 'name', 'mail@gmail.com'),
      new UserInfo('', 'name1', 'mail1@gmail.com'),
      new UserInfo(avatarImg, 'name2', 'mail2@gmail.com'),
    ],
    mailContent: '<p>Test</p><br><br><p>Test line 2</p>',
    attachFiles: [
      {
        name: 'Metanode - White Paper v.1.5.2',
        type: 'pdf',
        url: 'meta.node/9YQC7us',
      },
      {
        name: 'Metanode - SDK Bundle',
        type: 'zip',
        url: 'meta.node/34ED7uc',
      },
    ],
    status: 'pending',
    type: 'receive',
    date: '2018-02-21 12:01:00',
  },
  {
    id: '3',
    title: 'M&A Testa to Metanode',
    sender: new UserInfo(avatarImg, 'Elon Musk', 'elon.musk@tesla.com'),
    sendTo: [
      new UserInfo(avatarImg, 'name', 'mail@gmail.com'),
      new UserInfo('', 'name1', 'mail1@gmail.com'),
      new UserInfo(avatarImg, 'name2', 'mail2@gmail.com'),
    ],
    mailContent: '<p>Test</p><br><br><p>Test line 2</p>',
    attachFiles: [
      {
        name: 'Metanode - White Paper v.1.5.2',
        type: 'pdf',
        url: 'meta.node/9YQC7us',
      },
      {
        name: 'Metanode - SDK Bundle',
        type: 'zip',
        url: 'meta.node/34ED7uc',
      },
    ],
    status: 'declined',
    type: 'receive',
    date: '2018-02-21 12:01:00',
  },
];

interface Props {}

const Email: React.FC<Props> = () => {
  const [showHistory, setShowHistory] = useState<number | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [modal, setModal] = useState<ModalForm>({
    title: 'Modal',
    content: <p>Modal Content</p>,
    onSubmit() {},
    onClose() {
      handleCloseModal();
    },
  });

  const { EmailsList, isLoading } = useSelector((state: RootState) => state.email);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(EmailsList)) setShowHistory(EmailsList[0].id);
  }, [EmailsList]);

  const checkIsReceiveEmail = useCallback(
    (id) => {
      return (
        EmailsList.find((mail) => mail.id === id)?.email.from !==
        localStorage.getItem('current_email')
      );
    },
    [EmailsList],
  );

  const changeEmailStatus = useCallback(
    (status, index) => {
      if (status === 'delete' || status === 'spam' || status === 'unread') {
        if (status === 'delete') {
          setModal((prevState) => ({
            ...prevState,
            title: 'B???n c?? ch???c mu???n x??a Email n??y ch????',
            content: (
              <p>N???u b???m c??, Email n??y s??? b??? x??a kh???i danh s??ch email c???a b???n.</p>
            ),
            onSubmit: async () => {
              const cloneEmailsList = [...EmailsList];

              const emailId = `${cloneEmailsList[index].id}`;

              const res = await deleteEmail(emailId);

              if (res.message === 'success') {
                const deletedEmail = cloneEmailsList.splice(index, 1);

                dispatch(addDeletedEmail(deletedEmail));
                dispatch(setEmailsList(cloneEmailsList));

                handleCloseModal();

                toast.success('X??a th??nh c??ng!');
              } else {
                toast.error('H??? th???ng x???y ra l???i!');
              }
            },
          }));
          setIsOpenModal(true);
        }
        if (status === 'spam') {
          setModal((prevState) => ({
            ...prevState,
            title: 'B???n c?? ch???c b??o c??o ng?????i d??ng n??y v???i h??nh vi l??m phi???n?',
            content: (
              <p>N???u b???m c??, B???n s??? th??m ng?????i d??ng n??y v??o danh s??ch ch???n.</p>
            ),
            onSubmit() {
              const cloneEmailsList = [...EmailsList];

              const spamEmail = cloneEmailsList.splice(index, 1);

              dispatch(addSpamEmail(spamEmail));
              dispatch(setEmailsList(cloneEmailsList));

              handleCloseModal();
            },
          }));
          setIsOpenModal(true);
        }
        if (status === 'unread') {
          setModal((prevState) => ({
            ...prevState,
            title: 'B???n c?? ch???c mu???n b??? qua Email n??y ch????',
            content: (
              <p>N???u b???m c??, Email n??y s??? ???????c th??m v??o danh s??ch xem sau.</p>
            ),
            onSubmit() {
              const cloneEmailsList = [...EmailsList];

              const unreadEmail = cloneEmailsList.splice(index, 1);

              dispatch(addUnreadEmail(unreadEmail));
              dispatch(setEmailsList(cloneEmailsList));

              handleCloseModal();
            },
          }));
          setIsOpenModal(true);
        }
      } else {
        const cloneEmailsList = [...EmailsList];

        const reqData = { ...cloneEmailsList[index], status: status };

        cloneEmailsList.splice(index, 1, reqData);

        console.log('line 154', cloneEmailsList);

        dispatch(setEmailsList(cloneEmailsList));
      }
    },
    [EmailsList],
  );

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const handleShowHistory = useCallback(
    (currEmail, value) => {
      if (showHistory !== currEmail.id) setShowHistory(value);
      else setShowHistory(null);
    },
    [showHistory],
  );

  return (
    <Box className="flex flex-wrap flex-col">
      {isLoading ? (
        <EmailMessEmpty isLoading={isLoading} />
      ) : (
        EmailsList.map((email, index) => (
          <EmailMess
            key={email.id}
            status={email.status}
            type={checkIsReceiveEmail(email.id) ? 'receive' : 'send'}
            userInfo={
              new UserInfo('', email.email.writer_id.toString(), email.email.from)
            }
            emailData={email}
            onShowHistory={handleShowHistory}
            isShowHeader={showHistory === email.id}
            isShowActions={checkIsReceiveEmail(email.id)}
            onChangeStatus={changeEmailStatus}
            index={index}
          />
        ))
      )}
      <ModalBase
        onClose={handleCloseModal}
        onSubmit={modal.onSubmit}
        isOpen={isOpenModal}
        title={modal.title}
        submitLabel="">
        <div className="">
          <div>{modal.content}</div>
          <div className="flex gap-2 my-2">
            <Button className="flex-1 button-create-mui" onClick={modal.onSubmit}>
              OK
            </Button>
            <Button
              className="flex-1 button-create-mui"
              onClick={modal.onClose}
              sx={{
                color: '#7D7E80',
                backgroundColor: '#E0E0EA',
                '&:hover': {
                  backgroundColor: '#E0E0EA',
                },
              }}>
              Cancel
            </Button>
          </div>
        </div>
      </ModalBase>
    </Box>
  );
};

export default Email;
