// react
import React, { Fragment, useEffect, useReducer, useState } from 'react';

// styles
import styles from './index.module.scss';
// components
import { CourseFolder } from '../../../components/coursesItems/courseFolder';
import { InfoBar } from '../../../components/infoBar';
import { NavHeader } from '../../../components/navHeader';
import { MainContainer } from '../../../components/mainContainer';
import { PathNavigate } from '../../../components/coursesItems/PathNavigate';
// reducer
import {
  courseSubListStatesReducer,
  courseSubListStatesInitialState,
} from './indexReducer';
// MUI
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
// router
import { useNavigate, useParams } from 'react-router-dom';
// services
import {
  getRoleService,
  getMatrialServices,
  getMatrialCounts,
} from '../../../services/userService';
/***************************************************************************/
/* Name : CourseSubList React Component */
/***************************************************************************/
const CourseSubList = React.memo(() => {
  const navigate = useNavigate();
  // role
  const [role, setRole] = useState('NOT');
  // params
  const { name, code } = useParams();
  // states
  const [booksNumber, setBooksNumber] = useState('0');
  const [slidesNumber, setSlidesNumber] = useState('0');
  const [sheetsNumber, setSheetsNumber] = useState('0');
  const [othersNumber, setOthersNumber] = useState('0');
  // reducer
  const [courseSubListStates, dispatchCourseSubListStates] = useReducer(
    courseSubListStatesReducer,
    courseSubListStatesInitialState
  );
  /******************************************************************/
  /* useEffect */
  /******************************************************************/
  useEffect(() => {
    (async () => {
      const { role } = await getRoleService();
      setRole(role);
      // get number of files
      await calculateNumberOfFiles(role);
    })();
  }, []);
  /******************************************************************/
  /* calculate number of files */
  /******************************************************************/
  const calculateNumberOfFiles = async (roleA) => {
    // dispatch pending
    dispatchCourseSubListStates({ type: 'PENDING' });
    const response = await getMatrialCounts(code);
    if (response.status === 'success') {
      // to do change the api function anf get the numbers
      setBooksNumber(response.data.Books.noOfFile + '');
      setSlidesNumber(response.data.Slides.noOfFile + '');
      setSheetsNumber(response.data.Sheets.noOfFile + '');
      setOthersNumber(response.data.Others.noOfFile + '');
      // dispatch clear
      dispatchCourseSubListStates({ type: 'CLEAR' });
    } else {
      dispatchCourseSubListStates({
        type: 'ERROR',
        errorMessage: response.message,
      });
    }
  };
  /******************************************************************/
  /* handleCloseSnackbar */
  /******************************************************************/
  const handleCloseSnackbar = () => {
    dispatchCourseSubListStates({ type: 'CLEAR' });
  };
  /******************************************************************/
  /* navigate sublist */
  /******************************************************************/
  const navigateSubList = (type, coded) => {
    navigate(`/course/${name}/${code}/${type}`);
  };
  return (
    <Fragment>
      <NavHeader title={'المقررات الدراسية'} />
      <MainContainer>
        <InfoBar />
        <PathNavigate course={{ name, code }} slugs={[]} />
        <div className={styles['courses-container']}>
          <CourseFolder
            onClick={navigateSubList}
            info={{
              courseCode: '',
              courseName: 'Books',
              noOfFiles: booksNumber,
            }}
          />
          <CourseFolder
            onClick={navigateSubList}
            info={{
              courseCode: '',
              courseName: 'Slides',
              noOfFiles: slidesNumber,
            }}
          />
          <CourseFolder
            onClick={navigateSubList}
            info={{
              courseCode: '',
              courseName: 'Sheets',
              noOfFiles: sheetsNumber,
            }}
          />
          <CourseFolder
            onClick={navigateSubList}
            info={{
              courseCode: '',
              courseName: 'Others',
              noOfFiles: othersNumber,
            }}
          />
        </div>
      </MainContainer>
      {/* ********** SUCCESS SNACKBAR ********** */}
      <Snackbar
        open={courseSubListStates.success}
        onClose={handleCloseSnackbar}
        autoHideDuration={2000}
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
          !{courseSubListStates.successMessage}
        </Alert>
      </Snackbar>
      {/* ********** ERROR SNACKBAR ********** */}
      <Snackbar
        open={courseSubListStates.error}
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
          !{courseSubListStates.errorMessage}
        </Alert>
      </Snackbar>
    </Fragment>
  );
});

export default CourseSubList;
