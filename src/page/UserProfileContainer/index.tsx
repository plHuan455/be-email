import { getUserInfo, updateAuthProfile } from '@api/auth';
import UserProfile from '@layouts/UserProfile';
import UserProfileUpdate, {
  UpdateUserProfileField,
} from '@layouts/UserProfileUpdate';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import Loading from '@components/atoms/Loading';
import { useNavigate } from 'react-router-dom';
import { AuthResponse, AuthUpdate } from '@api/auth/interface';
import { useForm } from 'react-hook-form';
import { data } from 'autoprefixer';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateUserProfileSchema } from '@utils/schemas';
import { uploadFile } from '@api/uploadFile';
import { toast } from 'react-toastify';
import { AddEmployeeField } from '@components/organisms/TableManagerEmployeeContainer/AddEmployeeModal';

const staticData: {
  avatar: string;
  user_name: string;
  email: string;
  phone_number: string;
  position: string;
  role: string;
  department: string;
} = {
  avatar:
    'https://res.cloudinary.com/love-story/image/upload/v1669254679/gokpemngorggfalap2fn.jpg',
  user_name: 'Giang',
  email: 'giangz0009@bemail.space',
  phone_number: '0365096648',
  position: 'C',
  role: 'Admin',
  department: 'It',
};

const currentId = localStorage.getItem('current_id')
  ? localStorage.getItem('current_id')
  : '';

const UserProfileContainer = () => {
  // Use State
  const [isViewStatus, setIsViewStatus] = useState<boolean>(true);

  // useForm

  const method = useForm<AuthUpdate>({
    defaultValues: {
      avatar: '',
      department: '',
      email: '',
      phone_number: '',
      position: '',
      role: '',
      user_name: '',
    },
    resolver: yupResolver(updateUserProfileSchema),
  });

  //   useNavigate

  const navigate = useNavigate();

  const { mutate: updateUserProfile, isSuccess: isUpdateUserProfileSuccess } =
    useMutation({
      mutationKey: ['update-user-profile', currentId],
      mutationFn: async (query: AuthUpdate) => {
        return await updateAuthProfile(currentId, query);
      },
      onSuccess: (res) => {
        toast.success('Update Profile Success!');
        localStorage.setItem(
          'current_user_avt',
          res.data.avatar ? JSON.stringify(res.data.avatar) : '',
        );
        onBackUserProfile();
      },
      onError: () => {
        toast.error('Update failed!');
      },
    });

  const { mutate: uploadAvatar } = useMutation({
    mutationKey: ['table-manager-upload-file'],
    mutationFn: (data: AuthUpdate) => {
      return uploadFile(data.avatar);
    },
    onSuccess: (res, params: AuthUpdate) => {
      updateUserProfile({ ...params, avatar: res.data ?? '' });
    },
    onError: () => {
      toast.error("Can't upload file");
    },
  });

  //   useQuery
  const queryData = useQuery({
    queryKey: ['get-user-profile', isUpdateUserProfileSuccess],
    queryFn: getUserInfo,
    onSuccess(res) {
      method.setValue('avatar', res.data.avatar);
      method.setValue('department', res.data.department);
      method.setValue('email', res.data.email);
      method.setValue('phone_number', res.data.phone_number);
      method.setValue('position', res.data.position);
      method.setValue('role', res.data.role);
      method.setValue('user_name', res.data.user_name);
    },
  });

  const { data: dataGetUserProfile, isLoading: isLoadingUserProfile } = queryData;

  // Handler FUNC

  const onBackUserProfile = useCallback(() => {
    setIsViewStatus(true);
  }, []);

  const handleChangeStatus = (e) => {
    setIsViewStatus((prevState) => !prevState);
  };

  const onChangePassword = (e) => {
    navigate('/change-password');
  };

  const handleSubmitUpdateForm = (values: AuthUpdate) => {
    if (typeof values.avatar !== 'string') uploadAvatar(values);
    else {
      updateUserProfile(values);
    }
  };

  if (isLoadingUserProfile) return <Loading isLoading={true} />;

  return (
    <Box
      sx={{
        height: '100vh',
        padding: '80px 28px 28px 28px',
        backgroundColor: '#EDEDF3',
        borderTopLeftRadius: '65px',
        overflow: 'scroll',
      }}>
      <Box className="flex flex-col rounded-xl bg-white h-full p-16 shadow-md">
        <Box className="flex-1">
          {dataGetUserProfile &&
            (isViewStatus ? (
              <UserProfile userInfoData={dataGetUserProfile.data} />
            ) : (
              <UserProfileUpdate
                onSubmit={handleSubmitUpdateForm}
                method={method}
                userInfoData={dataGetUserProfile.data}
                onBackToView={onBackUserProfile}
              />
            ))}
        </Box>
        {isViewStatus && (
          <Box className="flex justify-center py-6 gap-2">
            <Button onClick={handleChangeStatus} className="bg-[#4E24C5]">
              Update
            </Button>
            <Button onClick={onChangePassword}>Change Password</Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserProfileContainer;
