// react
import React, { Fragment, useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
// styles
import styles from './index.module.scss';
// components
import { MainContainer } from '../../../components/mainContainer';
import { NavHeader } from '../../../components/navHeader';
import { PathNavigate } from '../../../components/coursesItems/PathNavigate';
import { PDFViewer } from '../../../components/coursesItems/pdfViewer';
// reducer
import {
  documentViewStatesInitialState,
  documentViewStatesReducer,
} from './indexReducer';
// MUI
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
// router
import { useNavigate } from 'react-router-dom';
// react redux
import { useSelector } from 'react-redux';
// libs
import Cookies from 'js-cookie';
// services
import { getRoleService } from '../../../services/userService';
/***************************************************************************/
/* Name : DocumentView React Component */
/***************************************************************************/
const DocumentView = React.memo(() => {
  const navigate = useNavigate();
  const { name, code, type, itemId } = useParams();
  const token = Cookies.get('token');
  const [apiUrl, setApiUrl] = useState(
    useSelector((state) => state.ui.api_url)
  );
  const [pdfUrl, setPdfUrl] = useState(
    `${apiUrl}/api/v1/material/getBook/${code}/${token}/${itemId}}`
  );
  const [role, setRole] = useState('NOT');
  // reducer
  const [documentViewStates, dispatchDocumentViewStates] = useReducer(
    documentViewStatesReducer,
    documentViewStatesInitialState
  );

  /******************************************************************/
  /* useEffect */
  /******************************************************************/
  useEffect(() => {
    (async () => {
      const { role } = await getRoleService();
      setRole(role);
      if (role === 'STUDENT') {
        setPdfUrl(
          `${apiUrl}/api/v1/material/getBook/${code}/${token}/${itemId}`
        );
      }
    })();
  }, []);
  /******************************************************************/
  /* handleCloseSnackbar */
  /******************************************************************/
  const handleCloseSnackbar = () => {
    dispatchDocumentViewStates({ type: 'CLEAR' });
  };

  return (
    <Fragment>
      <NavHeader title={'المقررات الدراسية'} />
      <MainContainer>
        <PathNavigate course={{ name, code }} slugs={[type, itemId]} />
        <div
          className={styles['document-container']}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
        >
          <embed
            src={pdfUrl}
            width='100%'
            height='1000'
            crossOrigin='anonymous'
          />
        </div>
      </MainContainer>
      {/* ********** SUCCESS SNACKBAR ********** */}
      <Snackbar
        open={documentViewStates.success}
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
          !{documentViewStates.successMessage}
        </Alert>
      </Snackbar>
      {/* ********** ERROR SNACKBAR ********** */}
      <Snackbar
        open={documentViewStates.error}
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
          !{documentViewStates.errorMessage}
        </Alert>
      </Snackbar>
    </Fragment>
  );
});

export default DocumentView;
