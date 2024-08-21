import slugify from "slugify";
import randomString from "randomstring";

const getSlug = (firstName: string) =>
  slugify(`${firstName} ${randomString.generate(6)}`);
export default getSlug;
