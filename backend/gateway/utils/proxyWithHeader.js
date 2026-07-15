import proxy from "express-http-proxy";

export const proxyWithHeader = (ServiceUrl) => {
  return proxy(ServiceUrl, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if(srcReq.user) {
        proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
      }
      return proxyReqOpts 
    }
  })
}  