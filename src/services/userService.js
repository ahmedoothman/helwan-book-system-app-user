import axios from 'axios';
import store from '../store';
import Cookies from 'js-cookie';
// form data
let api_url = store.getState().ui.api_url;
/**********************************************/
/* Name: setCookiesServices */
/* Description: setCookiesServices */
/**********************************************/
export const setCookiesServices = (studentID, nationalID, token) => {
  const expiresData = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 days
  if (studentID) {
    Cookies.set('studentID', studentID, {
      path: '/',
      expires: expiresData,
    });
  }
  if (nationalID) {
    Cookies.set('nationalID', nationalID, {
      path: '/',
      expires: expiresData,
    });
  }
  if (token) {
    Cookies.set('token', token, {
      path: '/',
      expires: expiresData,
    });
  }
};
/**********************************************/
/* Name: getStudentDataService Request */
/* Description: getStudentDataService Request */
/**********************************************/
export const studentLoginService = async (studentId, nationalID) => {
  const data = {
    studentID: studentId,
    nationalID,
  };
  try {
    const response = await axios.post(`${api_url}/api/v1/student/login`, data);
    // set cookies
    setCookiesServices(studentId, nationalID, response.data.token);
    return {
      status: 'success',
      user: response.data,
      courses: response.data.data.user.listOfCourses,
    };
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      return {
        status: 'error',
        statusCode: error.code,
        message: 'خطأ في الاتصال بالخادم',
      };
    } else {
      return {
        status: 'error',
        message: error.response.data.message,
      };
    }
  }
};
/**********************************************/
/* Name: doctorLoginService */
/* Description: doctorLoginService */
/**********************************************/
export const doctorLoginService = async (email, password) => {
  const data = {
    email,
    password,
  };
  try {
    const response = await axios.post(`${api_url}/api/v1/doctor/login`, data);
    // set cookies
    setCookiesServices(null, null, response.data.token);
    return {
      status: 'success',
      user: response.data.data.user,
    };
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      return {
        status: 'error',
        statusCode: error.code,
        message: 'خطأ في الاتصال بالخادم',
      };
    } else {
      return {
        status: 'error',
        message: error.response.data.message,
      };
    }
  }
};

/**********************************************/
/* Name: get Role */
/* Description: get Role */
/**********************************************/
export const getRoleService = async () => {
  const token = Cookies.get('token');
  try {
    const response = await axios.get(`${api_url}/api/v1/auth/getRole`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      status: 'success',
      role: response.data.data.role,
    };
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      return {
        status: 'error',
        statusCode: error.code,
        message: 'خطأ في الاتصال بالخادم',
      };
    } else {
      return {
        status: 'error',
        message: error.response.data.message,
      };
    }
  }
};
/**********************************************/
/* Name: getCoursesDoctorService */
/* Description: getCoursesDoctorService */
/**********************************************/
export const getCoursesDoctorService = async () => {
  // http://127.0.0.1:9000/api/v1/doctor/getCoursesInfo
  const token = Cookies.get('token');
  try {
    const response = await axios.get(
      `${api_url}/api/v1/doctor/getCoursesInfo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      status: 'success',
      courses: response.data.data.listOfCourses,
    };
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      return {
        status: 'error',
        statusCode: error.code,
        message: 'خطأ في الاتصال بالخادم',
      };
    } else {
      return {
        status: 'error',
        message: error.response.data.message,
      };
    }
  }
};
/**********************************************/
/* Name: getMeService */
/* Description: getMeService */
/**********************************************/
export const getMeService = async () => {
  const token = Cookies.get('token');
  try {
    const response = await axios.get(`${api_url}/api/v1/auth/getMe`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      status: 'success',
      info: response.data.data.user,
    };
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      return {
        status: 'error',
        statusCode: error.code,
        message: 'خطأ في الاتصال بالخادم',
      };
    } else {
      return {
        status: 'error',
        message: error.response.data.message,
      };
    }
  }
};

/**********************************************/
/* Name: getMatrialServices */
/* Description: getMatrialServices */
/**********************************************/
export const getMatrialServices = async (courseCode, materialType) => {
  // http://127.0.0.1:9000/api/v1/material/
  const token = Cookies.get('token');
  try {
    const response = await axios.get(
      `${api_url}/api/v1/material/${courseCode}/${materialType}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      status: 'success',
      data: response.data.data.files,
      bookStatus: response.data.data.bookStatus,
    };
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      return {
        status: 'error',
        statusCode: error.code,
        message: 'خطأ في الاتصال بالخادم',
      };
    } else {
      return {
        status: 'error',
        message: error.response.data.message,
      };
    }
  }
};
/**********************************************/
/* Name: uploadMatrialServices */
/* Description: uploadMatrialServices */
/**********************************************/
export const uploadMatrialServices = async (data) => {
  const token = Cookies.get('token');
  try {
    const response = await axios.post(`${api_url}/api/v1/material/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      status: 'success',
    };
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      return {
        status: 'error',
        statusCode: error.code,
        message: 'خطأ في الاتصال بالخادم',
      };
    } else {
      return {
        status: 'error',
        message: error.response.data.message,
      };
    }
  }
};
/**********************************************/
/* Name: deleteMatrialServices */
/* Description: deleteMatrialServices */
/**********************************************/
export const deleteMatrialServices = async (
  courseCode,
  materialType,
  fileName
) => {
  const token = Cookies.get('token');
  try {
    const response = await axios.delete(
      `${api_url}/api/v1/material/deleteMaterial/${courseCode}/${materialType}/${fileName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      status: 'success',
    };
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      return {
        status: 'error',
        statusCode: error.code,
        message: 'خطأ في الاتصال بالخادم',
      };
    } else {
      return {
        status: 'error',
        message: error.response.data.message,
      };
    }
  }
};
/**********************************************/
/* Name: getMatrialCounts */
/* Description: getMatrialCounts */
/**********************************************/
export const getMatrialCounts = async (courseCode) => {
  const token = Cookies.get('token');
  try {
    const response = await axios.get(
      `${api_url}/api/v1/material/${courseCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      status: 'success',
      data: response.data.data,
    };
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      return {
        status: 'error',
        statusCode: error.code,
        message: 'خطأ في الاتصال بالخادم',
      };
    } else {
      return {
        status: 'error',
        message: error.response.data.message,
      };
    }
  }
};
/**********************************************/
/* Name: ChangePasswordService */
/* Description: ChangePasswordService */
/**********************************************/
export const changePasswordService = async (data) => {
  const token = Cookies.get('token');
  try {
    const response = await axios.patch(
      `${api_url}/api/v1/doctor/updateMyPassword`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      status: 'success',
    };
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      return {
        status: 'error',
        statusCode: error.code,
        message: 'خطأ في الاتصال بالخادم',
      };
    } else {
      return {
        status: 'error',
        message: error.response.data.message,
      };
    }
  }
};
/**********************************************/
/* Name: forgetPasswordService */
/* Description: forgetPasswordService */
/**********************************************/
export const forgetPasswordService = async (data) => {
  try {
    const response = await axios.post(
      `${api_url}/api/v1/auth/forgotPassword`,
      data
    );
    return {
      status: 'success',
      code: response.data.code,
    };
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      return {
        status: 'error',
        statusCode: error.code,
        message: 'خطأ في الاتصال بالخادم',
      };
    } else {
      return {
        status: 'error',
        message: error.response.data.message,
      };
    }
  }
};
/**********************************************/
/* Name: resetPasswordService */
/* Description: resetPasswordService */
/**********************************************/
export const resetPasswordService = async (data) => {
  try {
    const response = await axios.patch(
      `${api_url}/api/v1/auth/resetPassword`,
      data
    );
    return {
      status: 'success',
    };
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      return {
        status: 'error',
        statusCode: error.code,
        message: 'خطأ في الاتصال بالخادم',
      };
    } else {
      return {
        status: 'error',
        message: error.response.data.message,
      };
    }
  }
};
/**********************************************/
/* Name: LogOut */
/* Description: LogOut */
/**********************************************/
export const LogOutService = async () => {
  const token = Cookies.get('token');
  try {
    const response = await axios.get(`${api_url}/api/v1/auth/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      status: 'success',
    };
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      return {
        status: 'error',
        statusCode: error.code,
        message: 'خطأ في الاتصال بالخادم',
      };
    } else {
      return {
        status: 'error',
        message: error.response.data.message,
      };
    }
  }
};
