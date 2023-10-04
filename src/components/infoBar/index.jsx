// react
import React, { Fragment, useEffect } from 'react';
// styles
import styles from './index.module.scss';
// js cookies
import Cookies from 'js-cookie';
// imgs
import Person from '../../assets/icons/male_user.svg';
import LogOut from '../../assets/icons/Logout-R.svg';
import Key from '../../assets/icons/key.svg';
import { useNavigate } from 'react-router-dom';
// services
import { getRoleService, getMeService } from '../../services/userService';
/***************************************************************************/
/* Name : InfoBar React Component */
/***************************************************************************/
const InfoBar = React.memo(() => {
  const navigate = useNavigate();
  const [role, setRole] = React.useState('NOT');
  const [info, setInfo] = React.useState({});
  /******************************************************************/
  /* useEffect */
  /******************************************************************/
  useEffect(() => {
    (async () => {
      // get Role
      const { role } = await getRoleService();
      setRole(role);
      // get info
      const { info } = await getMeService();
      setInfo(info);
    })();
  }, []);

  /******************************************************************/
  /* logOutHandler */
  /******************************************************************/
  const logOutHandler = () => {
    // remove session
    Cookies.remove('token');
    Cookies.remove('csrftoken');
    Cookies.remove('studentID');
    Cookies.remove('nationalID');

    // redirect to login page
    if (role === 'STUDENT') {
      navigate('/');
    } else {
      navigate('/doctor/login');
    }
  };
  /******************************************************************/
  /* changePasswordHandler */
  /******************************************************************/
  const changePasswordHandler = () => {
    // redirect to change password page
    navigate('/settings/changePassword');
  };
  return (
    <Fragment>
      <div>
        <div className={styles['info-bar-container']}>
          <div className={styles['info-bar-container__part']}>
            <div className={styles['info-bar-container__img']}>
              <img src={Person} alt='person' />
            </div>
            <div>{`اهلا , ${info.name}`}</div>
          </div>
          <div className={styles['info-bar-container__part']}>
            <div className={styles['info-item']}>
              <span>الكلية: </span>
              {info.faculty}
            </div>
            <div className={styles['info-item']}>
              {' '}
              <span>القسم: </span> {'حاسبات'}
            </div>
            {role !== 'NOT' && role === 'STUDENT' && (
              <div className={styles['info-item']}>
                {' '}
                <span>الفرقة: </span> {info.level}
              </div>
            )}
          </div>
          <div className={styles['info-bar-container__part']}>
            <div
              className={styles['info-item-special']}
              onClick={logOutHandler}
            >
              <div className={styles['info-img']}>
                <img src={LogOut} />
              </div>
              <p>تسجيل الخروج</p>
            </div>
            {role !== 'NOT' && role == 'DOCTOR' && (
              <div
                className={styles['info-item-special']}
                onClick={changePasswordHandler}
              >
                <div className={styles['info-img']}>
                  <img src={Key} />
                </div>
                <p>تغيير كلمة السر</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
});

export { InfoBar };
