// react
import React, { Fragment, useEffect, useReducer, useRef } from 'react';

// styles
import styles from './index.module.scss';

// components
import { NavHeader } from '../../../components/navHeader/index';
import { Input } from '../../../components/inputs/InputField/index';
import { BtnSmall } from '../../../components/btns/btnSmall/index';
import { MainContainer } from '../../../components/mainContainer';
// reducer
import {
  loginPageStatesInitialState,
  loginPageStatesReducer,
} from './indexReducer';

// MUI
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
// router
import { useNavigate } from 'react-router-dom';
// services
import { doctorLoginService } from '../../../services/userService';
// cookies
import Cookies from 'js-cookie';
/***************************************************************************/
/* Name : LoginPage React Component */
/***************************************************************************/
const LoginPage = React.memo(() => {
  const navigate = useNavigate();
  // refs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  // reducer
  const [loginPageStates, dispatchLoginPageStates] = useReducer(
    loginPageStatesReducer,
    loginPageStatesInitialState
  );
  /******************************************************************/
  /* validate input */
  /******************************************************************/
  const validateInput = (email, password) => {
    // validate
    if (email.trim() === '') {
      emailRef.current.activeError();
      // dispatch states
      dispatchLoginPageStates({
        type: 'ERROR',
        errorMessage: 'يجب ادخال اسم المستخدم',
      });
      return false;
    } else {
      emailRef.current.clearError();
    }

    if (password.trim() === '') {
      passwordRef.current.activeError();
      // dispatch states
      dispatchLoginPageStates({
        type: 'ERROR',
        errorMessage: 'يجب ادخال كلمة السر',
      });
      return false;
    } else {
      passwordRef.current.clearError();
    }
    return true;
  };
  /******************************************************************/
  /* login Handler */
  /******************************************************************/
  const loginHandler = async (e) => {
    // prevent default
    e.preventDefault();
    // validate
    const email = emailRef.current.getInputValue();
    const password = passwordRef.current.getInputValue();
    const isValid = validateInput(email, password);
    if (!isValid) return;
    // dispatch states
    dispatchLoginPageStates({ type: 'PENDING' });
    // login
    const response = await doctorLoginService(email, password);
    if (response.status === 'success') {
      if (response.user.passwordChanged === false) {
        // redirect to change password page
        navigate('/settings/changePassword');
      } else {
        // redirect to home page
        navigate('/course/courses');
      }

      dispatchLoginPageStates({ type: 'CLEAR' });
    } else {
      dispatchLoginPageStates({
        type: 'ERROR',
        errorMessage: response.message,
      });
    }
  };
  /******************************************************************/
  /* useEffect */
  /******************************************************************/
  useEffect(() => {
    (async () => {
      const token = Cookies.get('token');
      // check if user is already logged in
      if (!!token) {
        // redirect to home page
        navigate('/course/courses');
      }
    })();
  }, []);
  // snackbar state
  const handleCloseSnackbar = () => {
    dispatchLoginPageStates({ type: 'CLEAR' });
  };
  return (
    <Fragment>
      {<NavHeader title={'تسجيل الدخول'} mode={'title'} hideBack={true} />}
      {/* login box */}
      <MainContainer>
        <form className={styles['login-box']} onSubmit={loginHandler}>
          <Input title={'الايميل'} type='TEXT' ref={emailRef} />
          <Input title={'كلمة السر'} type='PASSWORD' ref={passwordRef} />
          <p
            onClick={() => {
              navigate('/settings/forgetPassword');
            }}
          >
            هل نسيت كلمة السر؟
          </p>

          {loginPageStates.pending && (
            <BtnSmall
              title={
                <CircularProgress
                  size={20}
                  sx={{
                    color: '#a18a00',
                  }}
                />
              }
            />
          )}
          {!loginPageStates.pending && <BtnSmall title={'دخول'} />}
        </form>
      </MainContainer>
      {/* ********** ERROR SNACKBAR ********** */}
      <Snackbar
        open={loginPageStates.error}
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
          !{loginPageStates.errorMessage}
        </Alert>
      </Snackbar>
    </Fragment>
  );
});

export default LoginPage;
