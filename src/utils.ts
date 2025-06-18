import { format } from "date-fns";
import MD5 from "crypto-js/md5";

export const generateIdempotencyKey = (body: any) => {
  const currentDate = format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");
  return MD5(JSON.stringify(body) + currentDate).toString();
};
