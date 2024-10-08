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
// redux
import { useDispatch } from 'react-redux';
import { uiActions } from '../../../store/ui-slice';
// libs
import Cookies from 'js-cookie';
// services
import { studentLoginService } from '../../../services/userService';

/***************************************************************************/
/* Name : LoginStudentPage React Component */
/***************************************************************************/
const LoginStudentPage = React.memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // refs
  const studentIdRef = useRef(null);
  const nationalIDRef = useRef(null);
  // reducer
  const [loginPageStates, dispatchLoginPageStates] = useReducer(
    loginPageStatesReducer,
    loginPageStatesInitialState
  );
  /******************************************************************/
  /* validate input */
  /******************************************************************/
  const validateInput = (studentId, nationalID) => {
    // validate
    if (studentId.trim() === '') {
      studentIdRef.current.activeError();
      // dispatch states
      dispatchLoginPageStates({
        type: 'ERROR',
        errorMessage: 'يجب ادخال الرقم التعريفي',
      });
      return false;
    } else {
      studentIdRef.current.clearError();
    }

    if (nationalID.trim() === '') {
      nationalIDRef.current.activeError();
      // dispatch states
      dispatchLoginPageStates({
        type: 'ERROR',
        errorMessage: 'يجب ادخال  الرقم القومي',
      });
      return false;
    } else {
      nationalIDRef.current.clearError();
    }
    return true;
  };
  /******************************************************************/
  /* login Handler */
  /******************************************************************/
  const getStudentDataHandler = async (e) => {
    // prevent default
    e.preventDefault();
    // get values
    const studentId = studentIdRef.current.getInputValue();
    const nationalID = nationalIDRef.current.getInputValue();
    // validate
    const isValid = validateInput(studentId, nationalID);
    if (!isValid) {
      return;
    }
    // dispatch states
    dispatchLoginPageStates({ type: 'PENDING' });
    // calling login request
    const response = await studentLoginService(studentId, nationalID);
    if (response.status === 'success') {
      // dispatch states
      dispatchLoginPageStates({ type: 'SUCCESS' });
      navigate('/course/courses');
    } else {
      // dispatch states
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
      if (!!token) {
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
        <form className={styles['login-box']} onSubmit={getStudentDataHandler}>
          <Input title={'الرقم التعريفي '} type='TEXT' ref={studentIdRef} />
          <Input title={'كلمة السر'} type='PASSWORD' ref={nationalIDRef} />
          <br />
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

export default LoginStudentPage;
