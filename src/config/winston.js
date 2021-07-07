import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import mt from "moment-timezone";

const { combine, timestamp, printf } = winston.format;

const date = mt().tz("Asia/Seoul"); // 한국 시간으로 설정
const koreaTime = winston.format((info) => {
  // NOTE: 한국 시간으로 하기 위해.. 설정을 안 할 시 에는 UTC 0이 default다.
  info.timestamp = date.format();
  return info;
});
const logDir = "logs"; // logs 디렉토리 하위에 로그 파일 저장

const logFormat = printf((info) => {
  // log form
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    koreaTime(), // 한국 시간으로 설정
    logFormat
  ),
  transports: [
    // info 레벨 로그를 저장할 파일 설정  // 노멀 로그
    new winstonDaily({
      level: "info",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.log`, // file 이름 날짜로 저장
      maxFiles: 30, // 30일치 로그 파일 저장
      zippedArchive: true,
    }),
    // warn 레벨 로그를 저장할 파일 설정  // 위험한 로그
    new winstonDaily({
      level: "warn",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/warn",
      filename: `%DATE%.warn.log`, // file 이름 날짜로 저장
      maxFiles: 30, // 30일치 로그 파일 저장
      zippedArchive: true,
    }),
    // error 레벨 로그를 저장할 파일 설정  //  에러 로그
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error", // error.log 파일은 /logs/error 하위에 저장
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

logger.stream = {
  // morgan wiston 설정
  write: (message) => {
    logger.info(message);
  },
};

// Production 환경이 아닌 경우(dev 등) 배포 환경에서는 최대한 자원을 안잡아 먹는 로그를 출력해야함
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // 색깔 넣어서 출력
        winston.format.simple() // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
      ),
    })
  );
}

module.exports = logger;
