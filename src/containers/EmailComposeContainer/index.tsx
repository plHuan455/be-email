import { sendEmail } from "@api/email";
import EmailCompose2, { EmailComposeFields } from "@components/templates/EmailCompose2";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import utc from 'dayjs/plugin/utc';
import draftToHtml from 'draftjs-to-html';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import dayjs, { Dayjs } from "dayjs";
import { useAppDispatch, useAppSelector } from "@redux/configureStore";
import { addMinimizeAndSetShowMinimizeEmail, addMinimizeEmail, setShowMinimizeEmail } from "@redux/Email/reducer";
import { addHttp, getEditorStateFormHtmlString } from "@utils/functions";
import { UserInfo } from "@components/organisms/Email/Interface";
import useDebounce from "@hooks/useDebouce";
import { MinimizeEmailColor } from "@components/organisms/MinimizeEmail/interface";
import { useNavigate } from "react-router-dom";
import { FileInfoTypes } from "@components/molecules/AttachFiles2";
import { uploadFile } from "@api/uploadFile";
dayjs.extend(utc)

const currentUserEmail = localStorage.getItem('current_email');

interface EmailComposeContainerProps {
  
}

const EmailComposeContainer: React.FC<EmailComposeContainerProps> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const minimizeEmailList = useAppSelector(state => state.email.minimizeMailList);
  const showMinimizeEmailId = useAppSelector(state => state.email.showMinimizeEmailId);

  const [attachFiles, setAttachFiles] = useState<(File|undefined)[]>([]);


  const method = useForm<EmailComposeFields>({
    defaultValues: {
      to: [],
      cc: [],
      bcc: [],
      subject: '',
      content: '',
      attachFiles: {fileUrls: [], files: []},
      sendAt: null,
    }
  });

  const [calendarValue, setCalendarValue] = useState<Dayjs | null>(
    dayjs(Date.now()),
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs | null | undefined>();

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isShowCCForm, setIsShowCCForm] = useState<boolean>(false);

  const [isShowCalendarModal, setIsShowCalendarModal] = useState<boolean>(false);

  const [tabBarColor, setTabBarColor] = useState<string>();

  const {mutate: submitEmailComposeMutate, isLoading: isEmailComposeSubmitting} = useMutation({
    mutationKey: ['email-compose-submit'],
    mutationFn: sendEmail,
    onSuccess: () => {
      toast.success('Email have been send');
      method.reset();
      navigate(-1);
    }
  })

  // const {mutate: uploadFileMutate} = useMutation({
  //   mutationKey: ['email-compose-upload-file'],
  //   mutationFn: ({file, index} : {file: File; index: number}) =>  uploadFile(file),
  //   onSuccess: (res, values) => {
  //     const newAttachFiles = [...attachFiles];
  //     newAttachFiles[values.index] = {isUploaded: true, file: {...newAttachFiles[values.index].file, url: res.data}}
  //     setAttachFiles(newAttachFiles)
  //   }
  // })

  useEffect(()=>{
    if(!showMinimizeEmailId) return;
    const foundMinimizeEmail = minimizeEmailList.find(value => value.id === showMinimizeEmailId);
    if(foundMinimizeEmail) {
      method.setValue('to', foundMinimizeEmail.to ?? []);
      method.setValue('cc', foundMinimizeEmail.cc ?? []);
      method.setValue('bcc', foundMinimizeEmail.bcc ?? []);
      method.setValue('subject', foundMinimizeEmail.subject ?? '');
      method.setValue('content', foundMinimizeEmail.content ? getEditorStateFormHtmlString(foundMinimizeEmail.content ?? '') : '');
      method.setValue('sendAt', foundMinimizeEmail.sendAt ?? '');
      setTabBarColor(foundMinimizeEmail?.color);
    }
  }, [showMinimizeEmailId, minimizeEmailList, method])

  useEffect(() => {
    if(showMinimizeEmailId === undefined) {
      method.reset();
      setTabBarColor(undefined);
    }
  }, [showMinimizeEmailId, method])

  const handleMinimizeClick = (id?: string) => {
    const values = method.getValues();
    method.reset();
    dispatch(addMinimizeEmail({ 
      ...values,
      id: id ?? showMinimizeEmailId,
      content: values.content ? draftToHtml(convertToRaw(values.content.getCurrentContent())) : '',
      color: tabBarColor ? tabBarColor : MinimizeEmailColor.getColor(),
      attachFiles: values.attachFiles,
      fileUrls: values.attachFiles.fileUrls,
    }))
    setIsFullScreen(false);
    setTabBarColor(undefined);
  }
  
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
  }, [])

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
    //   send_at: selectedDate ? dayjs.utc(selectedDate).toISOString() ?? 0 : 0,
    // });
    submitEmailComposeMutate({
      email: {
        subject: values.subject,
        to: values.to.map(value => value.mail),
        html_string: values.content === '' ? '' : draftToHtml(convertToRaw(values.content.getCurrentContent())),
        content: 'TODO REPLACE CONTENT',
        bcc: values.bcc.map(value => value.mail),
        cc: values.cc.map(value => value.mail),
        files: (values.attachFiles.fileUrls.filter(value => value !== undefined) as string[]).map(value => ({path: value})),
        from: currentUserEmail ? currentUserEmail : '',
      },
      send_at: selectedDate ? dayjs.utc(selectedDate).toISOString() ?? '0' : '0',
    })
  }
  
  return (
    <EmailCompose2
      method={method}
      attachFiles={attachFiles}
      isFullScreen={isFullScreen}
      isShowCCForm={isShowCCForm}
      isShowCalendarModal={isShowCalendarModal}
      selectedData={selectedDate}
      tabBarColor={tabBarColor}
      calendarValue={calendarValue}
      onMaximizeClick={() => setIsFullScreen(preState => !preState)}
      onMinimizeClick={handleMinimizeClick}
      onCCButtonClick={() => setIsShowCCForm(preState => !preState)}
      onCloseCalendarModal={() => setIsShowCalendarModal(false)}
      onChangeCalendarValue={(value) => setCalendarValue(value)}
      onSubmit={handleSubmit}
      onSendTimeClick={() => {
        setIsShowCalendarModal(true);
        setCalendarValue(dayjs(Date.now()))
      }}
      onUnsetTimeClick={() => setSelectedDate(undefined)}
      onSetTimeClick={() => {
        setSelectedDate(calendarValue?.clone())
      }}
    />
  )
}

export default EmailComposeContainer;