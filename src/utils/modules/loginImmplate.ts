enum LoginType {
  // 微信腾讯健康
  // WeChatThReg,
  WeChat,
  AliPay,
  H5,
}

abstract class LoginHandler {
  abstract handler(payload?: any): Promise<void>;
}

