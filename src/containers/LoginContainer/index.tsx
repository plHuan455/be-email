import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Avatar,
  Button,
  ButtonBase,
  Container,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import { useTranslation } from '@@packages/localization';
import logoImg from '@assets/images/logo.png';
import onboardingImg from '@assets/images/Illustrations/Onboarding/2.png';
import avatarImg from '@assets/images/avatars/avatar-1.jpg';
import { fetchToken, onMessageListener } from '../../messaging_init_in_sw';

const schema = yup
  .object({
    // email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

function LoginContainer() {
  const [isTokenFound, setTokenFound] = useState(false);
  const [getFcmToken, setFcmToken] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLogined = localStorage.getItem('current_email') ? true : false;
  const currentEmail = localStorage.getItem('current_email')
    ? localStorage.getItem('current_email')
    : '';
  const currentUserName = localStorage.getItem('current_user_name')
    ? localStorage.getItem('current_user_name')
    : '';
  const currentUserAvt = localStorage.getItem('current_user_avt')
    ? localStorage.getItem('current_user_avt')
    : '';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: currentEmail,
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const auth = useAuth();

  const submitLogin = async ({ email, password }) => {
    try {
      const res = await login({ email, password });
      // Change 'asdasd to res.data
      auth.signin({}, res.data, async () => {
        if (res.message === 'Login successful') {
          const currentUser = await getUserWithEmail();
          localStorage.setItem('current_user_name', currentUser.data.user_name);
          localStorage.setItem('current_user_avt', currentUser.data.avatar);
          // set current_email to 'email
          localStorage.setItem('current_email', email);
          localStorage.setItem('current_id', `${currentUser.data.user_id}`);
          localStorage.setItem('current_role', currentUser.data.role);
          toast.success('Đăng nhập thành công!');

          // Notification.requestPermission().then((permission) => {
          //   if (permission === 'granted') {
          //     console.log('line 28 Notification permission granted.');
          //     fetchToken(setTokenFound, setFcmToken);
          //   }
          //   if (permission === 'default') {
          //     console.log('line 28 Notification permission default.');
          //   }
          //   if (permission === 'denied') {
          //     console.log('line 28 Notification permission denied.');
          //   }
          // });

          navigate('/');
        }
      });
    } catch (error: any) {
      toast.error(t('Tài khoản chưa tồn tại hoặc sai thông tin đăng nhập'));
    }
  };

  const onSubmit = (data) => {
    submitLogin({ email: data.email, password: data.password });
  };

  const handleReLoginWithEmail = () => {
    localStorage.removeItem('current_email');
    navigate(0);
  };

  // useEffect(() => {
  //   const handleReLoginWithEmail = () => {
  //     if (localStorage.getItem('current_email')) {
  //       return;
  //     } else {
  //       localStorage.removeItem('current_email');
  //     }
  //   };

  //   handleReLoginWithEmail();
  // }, [isLogined]);

  if (auth.token) return <Navigate to={'/'} replace={true} />;

  return (
    <Root>
      <WrapContainer>
        <WrapLogo>
          <Box alignSelf={'left'}>
            <ImageComponent.Image height={33} width={88} src={logoImg} alt="logo" />
          </Box>
          <Box
            alignSelf={'right'}
            sx={{
              transform: 'translateX(50%)',
              padding: '0.64px 5.54px 6.8px 6.64px',
              opacity: '0.85',
            }}>
            <ImageComponent.Image
              height={272}
              width={268}
              src={onboardingImg}
              alt="logo"
            />
          </Box>
        </WrapLogo>
        <WrapContent className="bg-app-2">
          <Box>
            {isLogined ? (
              <WrapTitle>
                <h3>Login</h3>
                <p>Enter your password to unlock the screen!</p>
              </WrapTitle>
            ) : (
              <WrapTitle>
                <h3>Login</h3>
                <p>Enter your email and password to login!</p>
              </WrapTitle>
            )}

            {isLogined && currentUserName && currentUserAvt && (
              <WrapAvatar>
                <Box
                  alignSelf={'center'}
                  sx={{
                    border: '4px solid #F8F8F8',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginBottom: '15px',
                  }}>
                  <Avatar
                    sx={{ width: '75px', height: '75px' }}
                    src={currentUserAvt}
                    alt="avatar"
                  />
                </Box>
                <h3 className="text-center">{currentUserName}</h3>
              </WrapAvatar>
            )}
          </Box>
          <Content className="grid grid-rows-2 gap-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-rows-2 gap-4">
              {!isLogined && (
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <WrapInput>
                      <label>Email</label>
                      <TextField
                        {...field}
                        type={'email'}
                        placeholder={t('Enter Email')}
                        error={!!errors.email?.message}
                        helperText={errors.email?.message}
                      />
                    </WrapInput>
                  )}
                />
              )}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <WrapInput>
                    <label>Password</label>
                    <TextField
                      {...field}
                      type={'password'}
                      placeholder={t('Enter Password')}
                      error={!!errors.password?.message}
                      helperText={errors.password?.message}
                    />
                  </WrapInput>
                )}
              />

              <WrapActions>
                <Button size="large" type="submit">
                  {t('Login')}
                </Button>
              </WrapActions>
              {isLogined && currentUserName && currentUserAvt && (
                <WrapTextLink>
                  {/* Not you? return <Link to="/#/login">Login</Link> */}
                  Not you? return{' '}
                  <ButtonBase
                    sx={{
                      verticalAlign: 'initial',
                      color: '#827CFF',
                      fontWeight: 'bold',
                    }}
                    onClick={handleReLoginWithEmail}>
                    Login
                  </ButtonBase>
                </WrapTextLink>
              )}
            </form>
          </Content>
          <p>2022 Metanode, Inc.</p>
        </WrapContent>
      </WrapContainer>
    </Root>
  );
}

export default LoginContainer;

import styled from 'styled-components';
import ImageComponent from '@components/atoms/LazyImage';
import { Box } from '@mui/system';
import { useAuth } from '@context/AppContext';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { login } from '@api/auth';
import { getUserWithEmail } from '@api/user';

export const Root = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background: #827cff;
`;

export const WrapContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 19px 0 22px 51px;
`;

export const WrapLogo = styled.div`
  position: relative;
  z-index: 1;
  width: 270px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-block: 12px;
`;

export const WrapContent = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 10px 0 0 10px;
  box-shadow: 0px 25px 30px -13px rgb(40 40 40 / 40%);
  & > p {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Cerebri Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 15px;
    text-align: center;
    color: #797d8c;
  }
`;

export const WrapTitle = styled.div`
  text-align: center;
  font-family: 'Cerebri Sans';
  font-style: normal;
  & > h3 {
    color: #495057;
    font-weight: 700;
    font-size: 24px;
    line-height: 30px;
    margin-bottom: 10px;
  }
  & > p {
    font-weight: 400;
    font-size: 16px;
    line-height: 18px;

    color: #797d8c;
  }
`;

export const WrapAvatar = styled.div`
  margin: 40px 0 14px 0;
  display: flex;
  flex-direction: column;
  & > h3 {
    font-family: 'Cerebri Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 18px;

    color: #495057;
  }
`;

export const WrapActions = styled.div`
  display: flex;
  padding-block: 10px;
  align-items: flex-start;
  & > button {
    width: 100%;
  }
`;

export const WrapTextLink = styled.p`
  text-align: center;
  font-family: 'Cerebri Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  text-align: center;
  color: #797d8c;
  & > a {
    color: #827cff;
  }
`;

export const Content = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
`;
export const WrapInput = styled.div`
  width: 100%;
  display: flex;
  margin: 6px 0;
  flex-direction: column;
  & > label {
    font-family: 'Cerebri Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 18px;
    margin-bottom: 7px;
    color: #495057;
  }
  & input {
    font-family: 'Cerebri Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 17px;
    color: #797d8c;
    padding-block: 9.2px;
    border: 1px solid #e6ebf5;
    border-radius: 5px;
  }
`;

export const CheckBox = styled.input`
  width: 15px;
  height: 15px;
  cursor: pointer;
`;

export const Label = styled.p`
  flex: 1;
  margin-left: 5px;
  font-weight: 500;
  font-size: 14px;
`;

export const Title = styled.p`
  width: 100%;
  text-align: center;
  margin-bottom: 4px;
  color: rgb(64, 144, 120);
  cursor: pointer;
`;

export const TextError = styled.p`
  margin: 6px 0;
  color: #bf1650;
  ::before {
    display: inline;
    content: '⚠ ';
  }
`;
