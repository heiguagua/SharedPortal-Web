import crypto from 'crypto';
export default {
  token: {
    set(name, token) {
      if (token)
        sessionStorage.setItem(name, token);
    },
    get(name) {
      const token = sessionStorage.getItem(name)
      return token ? token : undefined;
    },
    empty(name) {
      sessionStorage.removeItem(name);
    }
  },
  md5Encrypt(encryptString) {
    return crypto.createHash("md5").update(encryptString, "utf8").digest('hex');
  }
}
