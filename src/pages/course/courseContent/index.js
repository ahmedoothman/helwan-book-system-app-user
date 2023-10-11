// react
import React, { Fragment, useEffect, useReducer, useState } from 'react';

// styles
import styles from './index.module.scss';
// components
import { InfoBar } from '../../../components/infoBar';
import { NavHeader } from '../../../components/navHeader';
import { InputFileWide } from '../../../components/inputs/inputFileWide';
import { FormPopUp } from '../../../components/formPopUp';
import { MainContainer } from '../../../components/mainContainer';
import { PathNavigate } from '../../../components/coursesItems/PathNavigate';
import { Message } from '../../../components/message';
// reducer
import {
  courseContentStatesReducer,
  courseContentStatesInitialState,
} from './indexReducer';
// MUI
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// react redux
import { useSelector } from 'react-redux';
// router
import { useNavigate, useParams } from 'react-router-dom';
// icons
import Eye from '../../../assets/icons/eye.svg';
import Delete from '../../../assets/icons/Delete.svg';
import Download from '../../../assets/icons/download.svg';
// libs
import FormData from 'form-data';
import Cookies from 'js-cookie';
// services
import {
  getRoleService,
  getMatrialServices,
  uploadMatrialServices,
  deleteMatrialServices,
} from '../../../services/userService';
/***************************************************************************/
/* Name : CourseContent React Component */
/***************************************************************************/
const CourseContent = React.memo(() => {
  const navigate = useNavigate();
  // params
  const { name, code, type } = useParams();
  const [role, setRole] = useState('NOT');
  // confirm delete state
  const [confirmDeleteForm, setConfirmDeleteForm] = useState(false);
  // item name
  const [itemName, setItemName] = useState('ملف');
  // apiUrl state
  const [apiUrl, setApiUrl] = useState(
    useSelector((state) => state.ui.api_url)
  );

  // files
  const [files, setFiles] = useState([]);
  // reducer
  const [courseContentStates, dispatchCourseContentStates] = useReducer(
    courseContentStatesReducer,
    courseContentStatesInitialState
  );
  /******************************************************************/
  /* useEffect */
  /******************************************************************/
  useEffect(() => {
    (async () => {
      // get Role
      const { role: roleD } = await getRoleService();
      setRole(roleD);
      // get material
      await getMatrialHandler(roleD);
    })();
  }, []);
  // close confirm delete form
  const handleCloseConfirmForm = () => {
    setConfirmDeleteForm(false);
  };
  /******************************************************************/
  /* handleCloseSnackbar */
  /******************************************************************/
  const handleCloseSnackbar = () => {
    dispatchCourseContentStates({ type: 'CLEAR' });
  };
  /******************************************************************/
  /* getMatrialHandler */
  /******************************************************************/
  const getMatrialHandler = async (roleA) => {
    // dispatch pending
    dispatchCourseContentStates({ type: 'PENDING' });
    const response = await getMatrialServices(code, type);
    if (response.status === 'success') {
      // get courses
      // check roleA
      if (type === 'Books') {
        if (roleA === 'DOCTOR') {
          if (response.bookStatus) {
            setFiles(response.bookStatus);
          } else {
            setFiles([]);
          }
        } else {
          setFiles(response.data);
        }
      } else {
        setFiles(response.data);
      }
      // dispatch clear
      dispatchCourseContentStates({ type: 'CLEAR' });
    } else {
      dispatchCourseContentStates({
        type: 'ERROR',
        errorMessage: response.message,
      });
    }
  };
  /******************************************************************/
  /* view */
  /******************************************************************/
  const viewHandler = (itemId) => {
    // navigate to pdf view page
    navigate(`/course/${name}/${code}/${type}/${itemId}`);
  };
  /******************************************************************/
  /* download */
  /******************************************************************/
  const downloadHandler = (itemId) => {
    const token = Cookies.get('token');
    const downloadUrl = `${apiUrl}/api/v1/material/getMaterial/${code}/${type}/${token}/${itemId}`;
    // the same but download
    window.open(downloadUrl, '_blank');
  };
  /******************************************************************/
  /* delete */
  /******************************************************************/
  const deleteHandler = (itemNameA) => {
    // open confirm delete form
    setConfirmDeleteForm(true);
    // set item name
    setItemName(itemNameA);
  };
  /******************************************************************/
  /* deleteCouserItemHandler */
  /******************************************************************/
  const deleteCouserItemHandler = async () => {
    dispatchCourseContentStates({ type: 'PENDING' });
    const response = await deleteMatrialServices(code, type, itemName);

    if (response.status === 'success') {
      // get material
      await getMatrialHandler(role);
      // dispatch states
      dispatchCourseContentStates({
        type: 'SUCCESS',
        successMessage: 'تم مسح الملف بنجاح',
      });
      // close confirm delete form
      setConfirmDeleteForm(false);
    } else {
      dispatchCourseContentStates({
        type: 'ERROR',
        errorMessage: response.message,
      });
    }
  };
  /******************************************************************/
  /* uploadFileHandler */
  /******************************************************************/
  const uploadFileHandler = async (file) => {
    dispatchCourseContentStates({ type: 'PENDING' });
    if (file === null) {
      dispatchCourseContentStates({
        type: 'ERROR',
        errorMessage: 'يجب اختيار ملف',
      });
      return;
    }
    // create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseCode', code);
    formData.append('materialType', type);
    // api call
    const response = await uploadMatrialServices(formData);
    if (response.status == 'success') {
      dispatchCourseContentStates({
        type: 'SUCCESS',
        successMessage: 'تم تحميل الملف بنجاح',
      });
      // get material
      await getMatrialHandler(role);
    } else {
      dispatchCourseContentStates({
        type: 'ERROR',
        errorMessage: response.message,
      });
    }
  };
  return (
    <Fragment>
      <NavHeader title={'المقررات الدراسية'} />
      <MainContainer>
        <InfoBar />
        <PathNavigate course={{ name, code }} slugs={[type]} />
        {role === 'DOCTOR' && role !== 'NOT' && (
          <InputFileWide onClick={uploadFileHandler} />
        )}
        <div className={styles['list-container']}>
          {files.length !== 0 && !courseContentStates.pending && (
            <table className={styles['table']}>
              <thead>
                <tr>
                  <th>الاسم</th>
                  {role === 'DOCTOR' && role !== 'NOT' && type === 'Books' && (
                    <th>الحالة</th>
                  )}
                  <th>:</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => {
                  return (
                    <tr key={file.materialName}>
                      <td>{file.materialName}</td>
                      {role === 'DOCTOR' &&
                        role !== 'NOT' &&
                        type === 'Books' && (
                          <td>
                            {file.publisherStatus === 'accepted' &&
                              file.adminStatus === 'accepted' && (
                                <p>🟢 تم قبول الكتاب </p>
                              )}
                            {file.publisherStatus === 'pending' &&
                              file.adminStatus === 'pending' && (
                                <p>🟡 جاري مراجعة الكتاب </p>
                              )}
                            {file.publisherStatus === 'rejected' &&
                              file.adminStatus === 'rejected' && (
                                <p>
                                  🔴تم رفض الكتاب من هيئة النشر و مسؤول الكلية
                                </p>
                              )}
                            {file.publisherStatus === 'accepted' &&
                              file.adminStatus !== 'accepted' && (
                                <p>🟢 تم قبول الكتاب من هيئة النشر </p>
                              )}
                            {file.publisherStatus === 'pending' &&
                              file.adminStatus !== 'pending' && (
                                <p>🟡 جاري مراجعة الكتاب من هيئة النشر </p>
                              )}
                            {file.publisherStatus === 'rejected' &&
                              file.adminStatus !== 'rejected' && (
                                <p> 🔴تم رفض الكتاب من هيئة النشر</p>
                              )}
                            {file.publisherStatus !== 'accepted' &&
                              file.adminStatus === 'accepted' && (
                                <p>🟢 تم قبول الكتاب من مسؤول الكلية </p>
                              )}
                            {file.publisherStatus !== 'pending' &&
                              file.adminStatus === 'pending' && (
                                <p>🟡جاري مراجعة الكتاب من مسؤول الكلية </p>
                              )}

                            {file.publisherStatus !== 'rejected' &&
                              file.adminStatus === 'rejected' && (
                                <p>🔴تم رفض الكتاب من مسؤول الكلية</p>
                              )}
                          </td>
                        )}
                      <td>
                        {type === 'Books' && (
                          <img
                            src={Eye}
                            onClick={() => {
                              viewHandler(file.materialName);
                            }}
                          />
                        )}
                        {type !== 'Books' && (
                          <img
                            src={Download}
                            onClick={() => {
                              downloadHandler(file.materialName);
                            }}
                          />
                        )}
                        {role === 'DOCTOR' && role !== 'NOT' && (
                          <img
                            src={Delete}
                            onClick={() => {
                              deleteHandler(file.materialName);
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {files.length === 0 && <Message text={'لا يوجد ملفات'} type='info' />}
          {courseContentStates.pending && (
            <Message text={'يتم تحميل الملفات'} type='load' />
          )}
        </div>
      </MainContainer>{' '}
      {/* ********** open Confirmation Form  confirmDeleteForm ********** */}
      <FormPopUp open={confirmDeleteForm} handleClose={handleCloseConfirmForm}>
        <div className={styles['confirm-input']}>
          <h2>هل تريد مسح {itemName} ؟</h2>
          <div className={styles['btns-group']}>
            <button
              onClick={handleCloseConfirmForm}
              className={`${styles['btn']} ${styles['normal']}`}
            >
              لا
            </button>
            <button
              onClick={deleteCouserItemHandler}
              className={`${styles['btn']} ${styles['danger']}`}
            >
              نعم
            </button>
          </div>
        </div>
      </FormPopUp>
      {/* ********** SUCCESS SNACKBAR ********** */}
      <Snackbar
        open={courseContentStates.success}
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
          !{courseContentStates.successMessage}
        </Alert>
      </Snackbar>
      {/* ********** ERROR SNACKBAR ********** */}
      <Snackbar
        open={courseContentStates.error}
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
          !{courseContentStates.errorMessage}
        </Alert>
      </Snackbar>
    </Fragment>
  );
});

export default CourseContent;
