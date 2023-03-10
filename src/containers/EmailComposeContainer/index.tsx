import { sendEmail, deleteEmail } from '@api/email';
import EmailCompose2, {
  EmailComposeFields,
} from '@components/templates/EmailCompose2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import utc from 'dayjs/plugin/utc';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch, useAppSelector } from '@redux/configureStore';
import { addMinimizeEmail } from '@redux/Email/reducer';
import { getEditorStateFormHtmlString } from '@utils/functions';
import AlertDialog, { useAlertDialog } from '@components/molecules/AlertDialog';
dayjs.extend(utc);
import { MinimizeEmailColor } from '@components/organisms/MinimizeEmail/interface';
import { useNavigate } from 'react-router-dom';
import useAutoStoreEmail from '../../hooks/Email/useAutoStoreEmail';
import { UserInfo } from '@components/organisms/Email/Interface';
import { InputContactBlock } from '@components/molecules/AutoCompleteReceive';
dayjs.extend(utc);

export const backUpData: InputContactBlock[] = [
  {
    contact_name: 'Phòng IT',
    employeesList: [
      new UserInfo('', 'giang', 'giang@mail.mail'),
      new UserInfo('', 'huan', 'huan@mail.mail'),
      new UserInfo('', 'quan', 'quan@mail.mail'),
    ],
  },
  {
    contact_name: 'Phòng FE',
    employeesList: [
      new UserInfo('', 'giang', 'giang@mail.mail'),
      new UserInfo('', 'huan', 'huan@mail.mail'),
      new UserInfo('', 'quan', 'quan@mail.mail'),
    ],
  },
  {
    contact_name: 'Phòng BE',
    employeesList: [
      new UserInfo('', 'giang', 'giang@mail.mail'),
      new UserInfo('', 'huan', 'huan@mail.mail'),
      new UserInfo('', 'quan', 'quan@mail.mail'),
    ],
  },
  {
    contact_name: 'Contact 1',
    employeesList: [
      new UserInfo('', 'giang', 'giang@mail.mail'),
      new UserInfo('', 'huan', 'huan@mail.mail'),
      new UserInfo('', 'quan', 'quan@mail.mail'),
    ],
  },
];

const currentUserEmail = localStorage.getItem('current_email');

interface EmailComposeContainerProps {}

const EmailComposeContainer: React.FC<EmailComposeContainerProps> = () => {
  const {
    isOpen: isAlertDialogOpen,
    isLoading: isAlertDialogLoading,
    title: alertDialogTitle,
    description: alertDialogDescription,
    setAlertData,
    setIsLoading: setAlertDialog,
    callback: alertDialogCallback,
    onClose: onAlertDialogClose,
  } = useAlertDialog();

  const workingEmail = useAppSelector((state) => state.email.workingEmail);

  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const minimizeEmailList = useAppSelector((state) => state.email.minimizeMailList);
  const showMinimizeEmailId = useAppSelector(
    (state) => state.email.showMinimizeEmailId,
  );

  const { onFieldsChange } = useAutoStoreEmail(5000);

  const [attachFiles, setAttachFiles] = useState<(File | undefined)[]>([]);

  const method = useForm<EmailComposeFields>({
    defaultValues: {
      to: [],
      cc: [],
      bcc: [],
      subject: '',
      content: '',
      attachFiles: { fileUrls: [], files: [] },
      sendAt: null,
    },
  });

  const [calendarValue, setCalendarValue] = useState<Dayjs | null>(
    dayjs(Date.now()),
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs | null | undefined>();

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isShowCCForm, setIsShowCCForm] = useState<boolean>(false);

  const [isShowCalendarModal, setIsShowCalendarModal] = useState<boolean>(false);

  const [tabBarColor, setTabBarColor] = useState<string>();

  const { mutate: deleteEmailMutate } = useMutation({
    mutationKey: ['email-compose-delete-email'],
    mutationFn: deleteEmail,
  });

  const { mutate: submitEmailComposeMutate, isLoading: isEmailComposeSubmitting } =
    useMutation({
      mutationKey: ['email-compose-submit'],
      mutationFn: sendEmail,
      onSuccess: (res) => {
        toast.success('Email have been sent');
        if (workingEmail.id !== undefined) {
          deleteEmailMutate(workingEmail.id);
        }
        navigate(`/emails/status/PENDING/${res.data.email.from}`);
        queryClient.invalidateQueries({ queryKey: ['get-all-email-status'] });
        method.reset();
      },
    });

  method.watch((values, { name, type }) => {
    onFieldsChange(name, values as EmailComposeFields);
  });

  useEffect(() => {
    if (!showMinimizeEmailId) return;
    const foundMinimizeEmail = minimizeEmailList.find(
      (value) => value.id === showMinimizeEmailId,
    );
    if (foundMinimizeEmail) {
      method.setValue('to', foundMinimizeEmail.to ?? []);
      method.setValue('cc', foundMinimizeEmail.cc ?? []);
      method.setValue('bcc', foundMinimizeEmail.bcc ?? []);
      method.setValue('subject', foundMinimizeEmail.subject ?? '');
      method.setValue(
        'content',
        foundMinimizeEmail.content
          ? getEditorStateFormHtmlString(foundMinimizeEmail.content ?? '')
          : '',
      );
      method.setValue('sendAt', foundMinimizeEmail.sendAt ?? '');
      method.setValue(
        'attachFiles',
        foundMinimizeEmail.attachFiles ?? { files: [], fileUrls: [] },
      );
      setTabBarColor(foundMinimizeEmail?.color);
    }
  }, [showMinimizeEmailId, minimizeEmailList, method]);

  useEffect(() => {
    if (showMinimizeEmailId === undefined) {
      method.reset();
      setTabBarColor(undefined);
    }
  }, [showMinimizeEmailId, method]);

  const handleMinimizeClick = (id?: string) => {
    const values = method.getValues();
    method.reset();
    dispatch(
      addMinimizeEmail({
        ...values,
        id: id ?? showMinimizeEmailId,
        content: values.content
          ? draftToHtml(convertToRaw(values.content.getCurrentContent()))
          : '',
        color: tabBarColor ? tabBarColor : MinimizeEmailColor.getColor(),
        attachFiles: values.attachFiles,
        fileUrls: values.attachFiles.fileUrls,
      }),
    );
    setIsFullScreen(false);
    setTabBarColor(undefined);
  };

  const createCustomFiles = useCallback((files: FileList | File[] | null) => {
    if (!files) return [];
    return Object.keys(files).map((key) => {
      const file = files[key];
      const fileType = file.type;
      file.preview = URL.createObjectURL(file);
      const res = {
        file: {
          name: file.name,
          type: '',
          url: file.preview,
        },
        isUploaded: false,
      };

      if (fileType) {
        const splitFileType = fileType.split('/');
        const [firstSplitFileType, secondSplitFileType, ...restFileType] =
          splitFileType;
        if (firstSplitFileType === 'image') res.file.type = 'image';
        else if (secondSplitFileType === 'pdf') res.file.type = 'pdf';
        else res.file.type = 'file';
      }

      return res;
    });
  }, []);

  const handleSubmit = (values: EmailComposeFields) => {
    // if(isFileUploading) {
    //   toast.error('Please waiting for files uploaded')
    //   return;
    // }
    // console.log({
    //   email: {
    //     subject: values.subject,
    //     to: values.to.map(value => value.mail),
    //     html_string: values.content === '' ? '' : draftToHtml(convertToRaw(values.content.getCurrentContent())),
    //     content: 'TODO REPLACE CONTENT',
    //     bcc: values.bcc.map(value => value.mail),
    //     cc: values.cc.map(value => value.mail),
    //     files: (values.attachFiles.fileUrls.filter(value => value !== undefined) as string[]).map(value => ({path: value})),
    //     from: currentUserEmail ? currentUserEmail : '',
    //   },
    //   send_at: selectedDate ? dayjs.utc(selectedDate).toISOString() ?? dayjs.utc().toISOString() : dayjs.utc(selectedDate).toISOString(),
    // });
    if (
      values.to.length === 0 &&
      values.cc.length === 0 &&
      values.bcc.length === 0
    ) {
      setAlertData("Can't send email", "Can't send email without receiver", () => {
        onAlertDialogClose();
      });
      return;
    }

    submitEmailComposeMutate({
      email: {
        subject: values.subject,
        to: values.to.reduce((curr: string[], next) => {
          const mails = next.employeesList.map((employee) => employee.mail);

          return [...curr, ...mails];
        }, []),
        text_html:
          values.content === ''
            ? ''
            : draftToHtml(convertToRaw(values.content.getCurrentContent())),
        bcc: values.bcc.map((value) => value.mail),
        cc: values.cc.map((value) => value.mail),
        attachs: (
          values.attachFiles.fileUrls.filter(
            (value) => value !== undefined,
          ) as string[]
        ).map((value) => ({ path: value })),
        from: currentUserEmail ? currentUserEmail : '',
      },
      send_at: selectedDate
        ? dayjs.utc(selectedDate).toISOString() ?? dayjs.utc().toISOString()
        : dayjs.utc(selectedDate).toISOString(),
    });
  };

  return (
    <>
      <EmailCompose2
        method={method}
        attachFiles={attachFiles}
        isFullScreen={isFullScreen}
        isShowCCForm={isShowCCForm}
        isShowCalendarModal={isShowCalendarModal}
        selectedDate={selectedDate}
        tabBarColor={tabBarColor}
        calendarValue={calendarValue}
        onMaximizeClick={() => setIsFullScreen((preState) => !preState)}
        onMinimizeClick={handleMinimizeClick}
        onCCButtonClick={() => setIsShowCCForm((preState) => !preState)}
        onCloseCalendarModal={() => setIsShowCalendarModal(false)}
        onChangeCalendarValue={(value) => setCalendarValue(value)}
        onSubmit={handleSubmit}
        onSendTimeClick={() => {
          setIsShowCalendarModal(true);
          setCalendarValue(dayjs(Date.now()));
        }}
        onUnsetTimeClick={() => {
          setSelectedDate(undefined);
          setIsShowCalendarModal(false);
        }}
        onSetTimeClick={() => {
          setSelectedDate(calendarValue?.clone());
          setIsShowCalendarModal(false);
        }}
      />
      <AlertDialog
        isShowDisagreeBtn={false}
        isOpen={isAlertDialogOpen}
        descriptionLabel={alertDialogDescription}
        titleLabel={alertDialogTitle}
        onClose={onAlertDialogClose}
        onAgree={alertDialogCallback}
      />
    </>
  );
};

export default EmailComposeContainer;
