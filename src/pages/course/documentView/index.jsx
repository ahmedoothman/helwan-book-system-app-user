// react
import React, { Fragment, useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
// styles
import styles from './index.module.scss';
// components
import { MainContainer } from '../../../components/mainContainer';
import { NavHeader } from '../../../components/navHeader';
import { PathNavigate } from '../../../components/coursesItems/PathNavigate';
import 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.entry';
//experiment
import ImageGallery from 'react-image-gallery';
import './image-gallery.scss';
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
    `${apiUrl}/api/v1/material/getBook/${code}/${token}/${itemId}`
  );
  const [role, setRole] = useState('NOT');
  // documentImagesState
  const [documentImagesState, setDocumentImagesState] = useState([]);

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

      const pdfUrlTemp = `${apiUrl}/api/v1/material/getBook/${code}/${token}/${itemId}`;
      setPdfUrl(`${apiUrl}/api/v1/material/getBook/${code}/${token}/${itemId}`);
      // fetch pdf
      fetchPdf(pdfUrlTemp);
    })();
  }, []);
  /******************************************************************/
  /* fetchPdf */
  /******************************************************************/
  const fetchPdf = async (url) => {
    const pdfUrl = `${apiUrl}/api/v1/material/getBook/${code}/${token}/${itemId}`;

    try {
      const response = await fetch(pdfUrl);
      const pdfBlob = await response.blob();
      const pdfBlobUrl = URL.createObjectURL(pdfBlob);
      await convertPdfToImages(pdfBlobUrl);
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };
  /******************************************************************/
  /* convert pdf to images */
  /******************************************************************/
  const convertPdfToImages = async (pdfUrl) => {
    try {
      const images = [];

      // Load the PDF using pdfjs-dist library
      const pdf = await window.pdfjsLib.getDocument(pdfUrl).promise;
      const numPages = pdf.numPages;

      for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 2 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        // Convert canvas to image
        const image = new Image();
        image.src = canvas.toDataURL('image/jpeg');

        images.push({ pageNum: pageNumber, image });
      }

      // Sort the images based on page number
      images.sort((a, b) => a.pageNum - b.pageNum);

      // Update state with the sorted images
      setDocumentImagesState((prevState) => [
        ...images.map(({ image }) => ({
          original: image.src,
          thumbnail: image.src,
        })),
        ...prevState,
      ]);
    } catch (error) {
      console.error('Error loading or rendering PDF:', error);
    }
  };

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
          id='document-container'
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
          {/* <ImageGallery
            items={documentImagesState}
            showIndex={true}
            infinite={false}
            showFullscreenButton={false}
          /> */}
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
