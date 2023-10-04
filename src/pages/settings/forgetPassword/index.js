// react
import React, { Fragment, useEffect, useReducer, useRef } from 'react';

// styles
import styles from './index.module.scss';
// components
import { NavHeader } from '../../../components/navHeader/index';
import { Input } from '../../../components/inputs/InputField/index';
import { BtnSmall } from '../../../components/btns/btnSmall/index';
import { Message } from '../../../components/message';
import { MainContainer } from '../../../components/mainContainer';
// reducer
import {
  forgetPasswordStatesInitialState,
  forgetPasswordStatesReducer,
} from './indexReducer';
// MUI
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
// router
import { useNavigate } from 'react-router-dom';
// services
import {
  forgetPasswordService,
  resetPasswordService,
} from '../../../services/userService';

/***************************************************************************/
/* Name : ForgetPassword React Component */
/***************************************************************************/
const ForgetPassword = React.memo(() => {
  const navigate = useNavigate();
  // refs
  const emailRef = useRef(null);
  const codeRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);
  // code
  const [code, setCode] = React.useState('');
  const [codeValid, setCodeValid] = React.useState(false);
  const [emailState, setEmailState] = React.useState('');
  // reducer
  const [forgetPasswordStates, dispatchForgetPasswordStates] = useReducer(
    forgetPasswordStatesReducer,
    forgetPasswordStatesInitialState
  );

  /******************************************************************/
  /* useEffect */
  /******************************************************************/
  useEffect(() => {
    (async () => {})();
  }, []);
  /******************************************************************/
  /* validate input */
  /******************************************************************/
  const validateInput = (email) => {
    // validate
    if (email.trim() === '') {
      emailRef.current.activeError();
      // dispatch states
      dispatchForgetPasswordStates({
        type: 'ERROR',
        errorMessage: 'يجب ادخال الايميل',
      });
      return false;
    } else {
      emailRef.current.clearError();
    }
    return true;
  };
  /******************************************************************/
  /* login Handler */
  /******************************************************************/
  const forgetPasswordHandler = async () => {
    // dispatch states
    dispatchForgetPasswordStates({ type: 'PENDING' });
    const email = emailRef.current.getInputValue();
    setEmailState(email);
    // validate input
    const data = {
      email,
    };
    const isValid = validateInput(email);
    if (isValid) {
      const response = await forgetPasswordService(data);
      if (response.status === 'success') {
        // dispatch states
        dispatchForgetPasswordStates({
          type: 'SUCCESS',
          successMessage: 'تم ارسال الرمز الي الايميل',
        });
        // set code
        setCode(response.code);
      } else {
        // dispatch states
        dispatchForgetPasswordStates({
          type: 'ERROR',
          errorMessage: response.message,
        });
      }
      return;
    }
  };
  /******************************************************************/
  /* check code Handler */
  /******************************************************************/
  const checkCodeHandler = async () => {
    if (codeRef.current.getInputValue().trim() === code) {
      setCodeValid(true);
    } else {
      setCodeValid(false);
      // dispatch states
      dispatchForgetPasswordStates({
        type: 'ERROR',
        errorMessage: 'الرمز غير صحيح',
      });
    }
  };
  /******************************************************************/
  /* change password Handler */
  /******************************************************************/
  const changePasswordHandler = async () => {
    const password = passwordRef.current.getInputValue();
    const passwordConfirm = passwordConfirmRef.current.getInputValue();
    // validate input
    if (password.trim() === '') {
      passwordRef.current.activeError();
      // dispatch states
      dispatchForgetPasswordStates({
        type: 'ERROR',
        errorMessage: 'يجب ادخال كلمة السر',
      });
      return;
    } else {
      passwordRef.current.clearError();
    }
    if (passwordConfirm.trim() === '') {
      passwordConfirmRef.current.activeError();
      // dispatch states
      dispatchForgetPasswordStates({
        type: 'ERROR',
        errorMessage: 'يجب ادخال كلمة السر',
      });
      return;
    } else {
      passwordConfirmRef.current.clearError();
    }
    if (password.trim() !== passwordConfirm.trim()) {
      passwordConfirmRef.current.activeError();
      // dispatch states
      dispatchForgetPasswordStates({
        type: 'ERROR',
        errorMessage: 'كلمة السر غير متطابقة',
      });
      return;
    } else {
      passwordConfirmRef.current.clearError();
    }
    // check password length
    if (password.trim().length < 8) {
      passwordRef.current.activeError();
      // dispatch states
      dispatchForgetPasswordStates({
        type: 'ERROR',
        errorMessage: 'كلمة السر يجب ان تكون على الاقل 8 احرف',
      });
      return;
    } else {
      passwordRef.current.clearError();
    }
    // dispatch states
    dispatchForgetPasswordStates({ type: 'PENDING' });
    // data
    const data = {
      code,
      email: emailState,
      password,
      passwordConfirm,
    };
    // send request
    const response = await resetPasswordService(data);
    if (response.status === 'success') {
      // dispatch states
      dispatchForgetPasswordStates({
        type: 'SUCCESS',
        successMessage: 'تم تغيير كلمة السر بنجاح',
      });
      // navigate to dashboard
      setTimeout(() => {
        navigate('/doctor/login');
      }, 1000);
    } else {
      // dispatch states
      dispatchForgetPasswordStates({
        type: 'ERROR',
        errorMessage: response.message,
      });
    }
  };
  // snackbar state
  const handleCloseSnackbar = () => {
    dispatchForgetPasswordStates({ type: 'CLEAR' });
  };
  return (
    <Fragment>
      {<NavHeader title={'اعادة ضبط كلمة السر'} />}
      {/* login box */}
      <MainContainer>
        {code === '' && (
          <div className={styles['login-box']}>
            <Input title={'الايميل'} type='TEXT' ref={emailRef} />
            <br />
            {forgetPasswordStates.pending && (
              <BtnSmall
                title={
                  <CircularProgress
                    size={20}
                    sx={{
                      color: '#a18a00',
                    }}
                  />
                }
                onClick={forgetPasswordHandler}
              />
            )}
            {!forgetPasswordStates.pending && (
              <BtnSmall title={'ارسال'} onClick={forgetPasswordHandler} />
            )}
          </div>
        )}
        {code !== '' && !codeValid && (
          <div className={styles['login-box']}>
            <Input title={'الرمز'} type='TEXT' ref={codeRef} />
            <br />
            {forgetPasswordStates.pending && (
              <BtnSmall
                title={
                  <CircularProgress
                    size={20}
                    sx={{
                      color: '#a18a00',
                    }}
                  />
                }
                onClick={checkCodeHandler}
              />
            )}
            {!forgetPasswordStates.pending && (
              <BtnSmall title={'ارسال'} onClick={checkCodeHandler} />
            )}
          </div>
        )}
        {codeValid && (
          <div className={styles['login-box']}>
            <p>
              <span className={styles['login-box-title']}> ملحوظة:</span>
              كلمة السر يجب ان تكون على الاقل 8 احرف و تحتوي على ارقام وحروف
            </p>
            <Input
              title={' كلمة السر الجديدة'}
              type='PASSWORD'
              ref={passwordRef}
            />
            <Input
              title={'اعد كتابة كلمة السر'}
              type='PASSWORD'
              ref={passwordConfirmRef}
            />
            <br />
            {forgetPasswordStates.pending && (
              <BtnSmall
                title={
                  <CircularProgress
                    size={20}
                    sx={{
                      color: '#a18a00',
                    }}
                  />
                }
                onClick={changePasswordHandler}
              />
            )}
            {!forgetPasswordStates.pending && (
              <BtnSmall
                title={'تغيير كلمة السر'}
                onClick={changePasswordHandler}
              />
            )}
          </div>
        )}
      </MainContainer>
      {/* ********** ERROR SNACKBAR ********** */}
      <Snackbar
        open={forgetPasswordStates.error}
        onClose={handleCloseSnackbar}
        autoHideDuration={20000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert
          severity='error'
          onClose={handleCloseSnackbar}
          dir='ltr'
          sx={{
            width: '100%',
            backgroundColor: '#D32F2F',
            color: '#fff',
            fontSize: '1.4rem',
            '& .MuiAlert-icon': {
              color: '#fff',
            },
          }}
        >
          !{forgetPasswordStates.errorMessage}
        </Alert>
      </Snackbar>
      {/* ********** SUCCESS SNACKBAR ********** */}
      <Snackbar
        open={forgetPasswordStates.success}
        onClose={handleCloseSnackbar}
        autoHideDuration={15000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert
          severity='success'
          onClose={handleCloseSnackbar}
          dir='ltr'
          sx={{
            width: '100%',
            backgroundColor: '#43A047',
            color: '#fff',
            fontSize: '1.4rem',
            '& .MuiAlert-icon': {
              color: '#fff',
            },
          }}
        >
          !{forgetPasswordStates.successMessage}
        </Alert>
      </Snackbar>
    </Fragment>
  );
});

export default ForgetPassword;
