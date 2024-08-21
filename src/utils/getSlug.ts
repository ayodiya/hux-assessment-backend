import slugify from "slugify";
import randomString from "randomized-string";

const getSlug = (firstName: string) =>
  slugify(`${firstName} ${randomString.generate(6)}`);

export default getSlug;
