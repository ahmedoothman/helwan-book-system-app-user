import styles from './App.module.scss';
// react
import React, { Suspense, useEffect, useState } from 'react';
// router
import { Routes, Route } from 'react-router-dom';
// components
import { Header } from './components/header/index';
import { Message } from './components/message/index';
import { Footer } from './components/footer/index';

// login pages (lazy import)
const StudentLoginPage = React.lazy(() =>
  import('./pages/loginPages/studentLoginPage/index')
);
const DoctorLoginPage = React.lazy(() =>
  import('./pages/loginPages/doctorLoginPage/index')
);
// course pages
const CourseMain = React.lazy(() => import('./pages/course/index'));
const CourseList = React.lazy(() => import('./pages/course/courseList/index'));
const CourseSubList = React.lazy(() =>
  import('./pages/course/courseSubList/index')
);
const CourseContent = React.lazy(() =>
  import('./pages/course/courseContent/index')
);
const DocumentView = React.lazy(() =>
  import('./pages/course/documentView/index')
);
// settings pages
// cookies
function App() {
  // get role from redux
  useEffect(() => {}, []);
  return (
    <div className={styles['main-container']}>
      <Header title={'منصة الكتاب الالكتروني'} />
      <Suspense fallback={<Message text='جاري التحميل' type={'load'} />}>
        <Routes>
          {/* **************************************** */}
          {/* Login Routes */}
          {/* **************************************** */}
          <Route path='/' element={<StudentLoginPage />} />
          <Route path='/doctor/login' element={<DoctorLoginPage />} />
          {/* **************************************** */}
          {/* Course Routes */}
          {/* **************************************** */}
          <Route path='/course/*' element={<CourseMain />}>
            <Route path='courses' element={<CourseList />} />
            <Route path=':name/:code' element={<CourseSubList />} />
            <Route path=':name/:code/:type' element={<CourseContent />} />
            <Route
              path=':name/:code/:type/:itemId'
              element={<DocumentView />}
            />
          </Route>
          {/* **************************************** */}
          {/* settings Routes */}
          {/* **************************************** */}
          {/* **************************************** */}
          {/* notFound */}
          {/* **************************************** */}
          <Route
            path='*'
            element={
              <Message text='لم يتم العثور على هذه الصفحة' type={'error'} />
            }
          />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;
