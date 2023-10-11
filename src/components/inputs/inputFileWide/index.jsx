// react
import React, { Fragment, useEffect, useState } from 'react';
// styles
import styles from './index.module.scss';
// components
import { BtnSmall } from '../../btns/btnSmall';
/***************************************************************************/
/* Name : InputFileWide React Component */
/***************************************************************************/
const InputFileWide = React.memo((props) => {
  // file
  const [file, setFile] = useState(null);
  /******************************************************************/
  /* useEffect */
  /******************************************************************/
  useEffect(() => {
    (async () => {})();
  }, []);

  /******************************************************************/
  /* onSubmitHandler */
  /******************************************************************/
  const onSubmitHandler = (e) => {
    e.preventDefault();
    // check if file is null
    if (!file) {
      return;
    }
    // build new file with encoded name
    const newFile = new File([file], encodeURIComponent(file.name), {
      type: file.type,
    });
    props.onClick(newFile);
  };
  return (
    <Fragment>
      <form className={styles['upload-container']} onSubmit={onSubmitHandler}>
        <input
          type='file'
          name='file'
          id='file'
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <div className={styles['upload-btn']}>
          <label htmlFor='file'>اختر ملف</label>
          <p>
            {file
              ? file.name.length > 20
                ? file.name.slice(0, 20) + '...'
                : file.name
              : 'لم يتم اختيار ملف'}
          </p>
        </div>
        <BtnSmall title={'رفع'} />
      </form>
    </Fragment>
  );
});

export { InputFileWide };
