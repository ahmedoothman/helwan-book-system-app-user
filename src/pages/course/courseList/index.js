// react
import React, { Fragment, useEffect, useReducer, useState } from 'react';
// styles
import styles from './index.module.scss';
// components
import { CourseFolder } from '../../../components/coursesItems/courseFolder';
import { InfoBar } from '../../../components/infoBar';
import { NavHeader } from '../../../components/navHeader';
import { MainContainer } from '../../../components/mainContainer';
import { Message } from '../../../components/message';
// libs
import Cookies from 'js-cookie';
// reducer
import {
  coursesListStatesInitialState,
  coursesListStatesReducer,
} from './indexReducer';
// MUI
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// router
import { useNavigate } from 'react-router-dom';
// services
import {
  getRoleService,
  studentLoginService,
  getCoursesDoctorService,
} from '../../../services/userService';

/***************************************************************************/
/* Name : CourseList React Component */
/***************************************************************************/
const CourseList = React.memo(() => {
  const navigate = useNavigate();
  // reducer
  const [courseListStates, dispatchCourseListStates] = useReducer(
    coursesListStatesReducer,
    coursesListStatesInitialState
  );
  const [courses, setCourses] = useState([]);
  const [role, setRole] = useState('NOT');
  /******************************************************************/
  /* useEffect */
  /******************************************************************/
  useEffect(() => {
    (async () => {
      const { role } = await getRoleService();
      setRole(role);
      if (role === 'STUDENT') {
        await getCoursesHandler();
      }
      if (role === 'DOCTOR') {
        await getCoursesDoctorHandler();
      }
      // get courses
    })();
  }, []);
  /******************************************************************/
  /* getCoursesHandler */
  /******************************************************************/
  const getCoursesHandler = async () => {
    const nationalID = Cookies.get('nationalID');
    const studentID = Cookies.get('studentID');
    if (!nationalID && !studentID) {
      navigate('/');
      return;
    }
    const response = await studentLoginService(studentID, nationalID);
    if (response.status === 'success') {
      // get courses
      setCourses(response.courses);
    } else {
      dispatchCourseListStates({
        type: 'ERROR',
        errorMessage: response.message,
      });
    }
  };
  /******************************************************************/
  /* getCoursesDoctorHandler */
  /******************************************************************/
  const getCoursesDoctorHandler = async () => {
    const response = await getCoursesDoctorService();
    dispatchCourseListStates({ type: 'PENDING' });
    if (response.status === 'success') {
      // get courses
      setCourses(response.courses);
      dispatchCourseListStates({ type: 'CLEAR' });
    } else {
      dispatchCourseListStates({
        type: 'ERROR',
        errorMessage: response.message,
      });
    }
  };
  /******************************************************************/
  /* handleCloseSnackbar */
  /******************************************************************/
  const handleCloseSnackbar = () => {
    dispatchCourseListStates({ type: 'CLEAR' });
  };
  /******************************************************************/
  /* navigate sublist */
  /******************************************************************/
  const navigateSubList = (name, code) => {
    navigate(`/course/${name}/${code}`);
  };
  return (
    <Fragment>
      <NavHeader title={'المقررات الدراسية'} />
      <MainContainer>
        <InfoBar />
        <div className={styles['courses-container']}>
          {courses.length > 0 &&
            courses.map((course) => (
              <CourseFolder
                onClick={navigateSubList}
                info={course}
                key={course.courseCode}
              />
            ))}
          {courses.length === 0 && (
            <Message type='info' text='لا يوجد مقررات دراسية' />
          )}
        </div>
      </MainContainer>

      {/* ********** SUCCESS SNACKBAR ********** */}
      <Snackbar
        open={courseListStates.success}
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
          !{courseListStates.successMessage}
        </Alert>
      </Snackbar>
      {/* ********** ERROR SNACKBAR ********** */}
      <Snackbar
        open={courseListStates.error}
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
          !{courseListStates.errorMessage}
        </Alert>
      </Snackbar>
    </Fragment>
  );
});

export default CourseList;
