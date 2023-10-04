// react
import React, { Fragment, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
//reacr router
import { useNavigate } from 'react-router-dom';
// libs
import Cookies from 'js-cookie';
/***************************************************************************/
/* Name : CourseMain React Component */
/***************************************************************************/
const CourseMain = React.memo(() => {
  const navigate = useNavigate();
  /******************************************************************/
  /* useEffect */
  /******************************************************************/
  useEffect(() => {
    (async () => {
      const token = Cookies.get('token');

      if (!token) {
        navigate('/');
        return;
      }
    })();
  }, []);

  /******************************************************************/
  /* functions */
  /******************************************************************/
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
});

export default CourseMain;
