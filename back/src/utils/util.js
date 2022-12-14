import path from "path";

// bcrypt
const SALT_ROUND = 10;

/**
 * image파일 이름을 원하는 path경로의 서버 URL로 변환
 * @param {string} directory 폴더 이름
 * @param {string} image 이미지 파일 이름
 * @returns serverUrl + serverPort + path + image
 */
const makeImageUrl = (directory, image) => {
  const serverUrl = process.env.SERVER_URL ?? "localhost";
  const serverPort = process.env.SERVER_PORT ?? 5000;
  const imageUrl = path.join(serverUrl + ":" + serverPort, directory, image);

  return imageUrl;
};

/**
 * 요청한 userId와 로그인 한 userId 비교
 * @param {*} userId param에서 받아온 userId
 * @param {*} currentUserId jwt에서 받아온 userId
 * @returns true or throw new Error("권한이 없습니다.")
 */
const compareUserId = (userId, currentUserId) => {
  if (userId != currentUserId) {
    throw new Error("권한이 없습니다.");
  }

  return true;
};

/**
 * status 세팅
 * @param {Date} startDate 모집 시작 날짜
 * @param {Date} endDate 모집 마감 날짜
 * @returns status
 */
const setStatus = (startDate, endDate) => {
  const currentDate = new Date();
  let changedStartDate = 0;
  let changedEndDate = 0;
  let result;
  currentDate.setHours(currentDate.getHours() + 9);

  if (startDate.getHours() == 0) {
    startDate.setHours(startDate.getHours() + 9);
    changedStartDate = 1;
  }

  if (endDate.getHours() == 0) {
    endDate.setHours(endDate.getHours() + 9);
    changedEndDate = 1;
  }
  endDate.setDate(endDate.getDate() + 1);

  if (currentDate >= startDate && currentDate < endDate) {
    result = "모집 중";
  } else if (currentDate < startDate) {
    result = "모집 예정";
  } else if (currentDate >= endDate) {
    result = "모집 마감";
  }

  if (changedStartDate) {
    startDate.setHours(startDate.getHours() - 9);
  }

  if (changedEndDate) {
    endDate.setHours(endDate.getHours() - 9);
  }
  endDate.setDate(endDate.getDate() - 1);

  return result;
};

const checkXSS = (text) => {
  text = text.replace(/\</g, "&lt;");
  text = text.replace(/\>/g, "&gt;");

  return text;
};

export { SALT_ROUND, makeImageUrl, compareUserId, setStatus, checkXSS };
