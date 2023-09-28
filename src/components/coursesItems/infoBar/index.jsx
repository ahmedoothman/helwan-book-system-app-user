// react
import React, { Fragment, useEffect } from 'react';
// styles
import styles from './index.module.scss';
// js cookies
import Cookies from 'js-cookie';
// imgs
import Person from '../../../assets/icons/male_user.svg';
import LogOut from '../../../assets/icons/Logout-R.svg';
import Key from '../../../assets/icons/key.svg';
import { useNavigate } from 'react-router-dom';
/***************************************************************************/
/* Name : InfoBar React Component */
/***************************************************************************/
const InfoBar = React.memo((props) => {
  const navigate = useNavigate();
  /******************************************************************/
  /* useEffect */
  /******************************************************************/
  useEffect(() => {
    (async () => {})();
  }, []);

  /******************************************************************/
  /* logOutHandler */
  /******************************************************************/
  const logOutHandler = () => {
    // remove session
    Cookies.remove('token');
    // redirect to login page
    navigate('/');
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
            <div>{`اهلا , ${props.info.name}`}</div>
          </div>
          <div className={styles['info-bar-container__part']}>
            <div className={styles['info-item']}>
              <span>الكلية: </span>
              {props.info.faculty}
            </div>
            <div className={styles['info-item']}>
              {' '}
              <span>القسم: </span> {props.info.department}
            </div>
            <div className={styles['info-item']}>
              {' '}
              <span>الفرقة: </span> {props.info.level}
            </div>
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
            <div
              className={styles['info-item-special']}
              onClick={changePasswordHandler}
            >
              <div className={styles['info-img']}>
                <img src={Key} />
              </div>
              <p>تغيير كلمة السر</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
});

export { InfoBar };
