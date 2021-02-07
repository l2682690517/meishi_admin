import Axios from 'axios'

export const getOssHost = () => {
  return Axios.get(`/admin/aliyun/oss/token`).then(res => {
    return res.data.token.host
  })
}

export const getOssToken = () => {
  return Axios.get(`/admin/aliyun/oss/token`).then(res => {
    const resToken = res.data
    return {
      path: `${resToken.token.dir}${resToken.key}`,
      policy: resToken.token.policy,
      accessid: resToken.token.accessid,
      signature: resToken.token.signature
    }
  })
}
